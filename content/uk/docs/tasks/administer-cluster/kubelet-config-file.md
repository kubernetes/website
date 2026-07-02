---
title: Встановлення параметрів Kubelet через файл конфігурації
content_type: task
weight: 330
---

## {{% heading "prerequisites" %}}

Деякі кроки на цій сторінці використовують інструмент `jq`. Якщо у вас немає `jq`, ви можете встановити його через отримання оновлень програм вашої операційної системи або завантажити з [https://jqlang.github.io/jq/](https://jqlang.github.io/jq/).

Деякі кроки також включають встановлення `curl`, який також можна встановити засобами встановлення програмного забезпечення вашої операційної системи.

<!-- overview -->

Частину параметрів конфігурації kubelet можна встановити за допомогою конфігураційного файлу на диску, як альтернативу командним прапорцям.

Надання параметрів через файл конфігурації є рекомендованим підходом, оскільки це спрощує розгортання вузлів та управління конфігурацією.

<!-- steps -->

## Створіть файл конфігурації {#create-the-config-file}

Підмножина конфігурації kubelet, яку можна налаштувати через файл, визначається структурою [`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/).

Файл конфігурації повинен бути у форматі JSON або YAML, який представляє параметри цієї структури. Переконайтеся, що у kubelet є права для читання файлу.

Ось приклад того, як може виглядати цей файл:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
address: "192.168.0.8"
port: 20250
serializeImagePulls: false
evictionHard:
    memory.available:  "100Mi"
    nodefs.available:  "10%"
    nodefs.inodesFree: "5%"
    imagefs.available: "15%"
    imagefs.inodesFree: "5%"
```

У цьому прикладі kubelet налаштовано з наступними параметрами:

1. `address`: Kubelet буде доступний за IP-адресою `192.168.0.8`.
2. `port`: Kubelet буде слухати порт `20250`.
3. `serializeImagePulls`: Завантаження образів виконуватиметься паралельно.
4. `evictionHard`: Kubelet буде виселяти Podʼи за однією з наступних умов:
   - Коли доступна памʼять вузла впаде нижче 100 МіБ.
   - Коли доступний простір основної файлової системи вузла менше 10%.
   - Коли доступний простір файлової системи образів менше 15%.
   - Коли більше ніж 95% inodes основної файлової системи вузла використано.

{{< note >}}
У прикладі, змінюючи лише один типовий параметр для `evictionHard`, типові значення інших параметрів не будуть успадковані та будуть встановлені в нуль. Щоб надати власні значення, вам слід надати всі порогові значення відповідно. Крім того, ви можете встановити MergeDefaultEvictionSettings в true у файлі конфігурації kubelet, якщо будь-який параметр буде змінено, то інші параметри успадкують стандартне значення замість 0.
{{< /note >}}

`imagefs` — це опціональна файлова система, яку середовища виконання контейнерів використовують для зберігання образів контейнерів та записуваних шарів контейнерів.

## Запуск процесу kubelet, налаштованого через файл конфігурації {#start-a-kubelet-process-configured-via-the-config-file}

{{< note >}}
Якщо ви використовуєте kubeadm для ініціалізації кластера, використовуйте kubelet-config під час створення вашого кластера за допомогою `kubeadm init`. Дивіться [налаштування kubelet за допомогою kubeadm](/docs/setup/production-environment/tools/kubeadm/kubelet-integration/) для деталей.
{{< /note >}}

Запустіть kubelet з параметром `--config`, вказавши шлях до файлу конфігурації kubelet. Після цього kubelet завантажить свою конфігурацію з цього файлу.

Зверніть увагу, що параметри командного рядка, які стосуються того ж значення, що й файл конфігурації, перекриватимуть це значення. Це допомагає забезпечити зворотну сумісність з API командного рядка.

Також зверніть увагу, що відносні шляхи файлів у файлі конфігурації kubelet розглядаються відносно місця розташування файлу конфігурації kubelet, тоді як відносні шляхи в параметрах командного рядка розглядаються відносно поточної робочої теки kubelet.

Зауважте, що деякі типові значення відрізняються між параметрами командного рядка та файлом конфігурації kubelet. Якщо наданий параметр `--config` і значення не вказані через командний рядок, то застосовуються типові значення для версії `KubeletConfiguration`. У згаданому вище прикладі ця версія є `kubelet.config.k8s.io/v1beta1`.

## Тека для файлів конфігурації kubelet {#kubelet-conf-d}

Ви можете вказати теку конфігурації drop-in для kubelet. Стандартно kubelet не шукає файли конфігурації drop-in — ви повинні вказати шлях. Наприклад: `--config-dir=/etc/kubernetes/kubelet.conf.d`

Для Kubernetes v1.28 по v1.29 ви можете вказати лише `--config-dir`, якщо також встановите змінну середовища `KUBELET_CONFIG_DROPIN_DIR_ALPHA` для процесу kubelet (значення цієї змінної не має значення).

{{< note >}}
Суфікс дійсного файлу конфігурації drop-in для kubelet **має** бути `.conf`. Наприклад: `99-kubelet-address.conf`
{{< /note >}}

Kubelet обробляє файли у своїй теці конфігурації drop-in, сортуючи по **повному імені файлу**. Наприклад, `00-kubelet.conf` обробляється першим, а потім перезаписується файлом з назвою `01-kubelet.conf`.

Ці файли можуть містити часткові конфігурації, але не повинні бути не валідними та обовʼязково повинні включати метадані типу, зокрема `apiVersion` та `kind`. Перевірка виконується лише на кінцевій результівній структурі конфігурації, збереженій внутрішньо в kubelet. Це надає гнучкість в управлінні та злитті конфігурацій kubelet з різних джерел, запобігаючи небажаній конфігурації. Однак важливо зазначити, що поведінка варіюється залежно від типу даних поля конфігурації.

Різні типи даних у структурі конфігурації kubelet обʼєднуються по-різному. Дивіться [посилання на довідку](/docs/reference/node/kubelet-config-directory-merging/) для отримання додаткової інформації.

### Порядок обʼєднання конфігурації kubelet {#kubelet-configurations-merging-order}

При запуску kubelet обʼєднує конфігурацію з:

- Feature gate, вказаних через командний рядок (найнижчий пріоритет).
- Конфігурація kubelet.
- Файли конфігурації drop-in, відповідно до порядку сортування.
- Аргументи командного рядка, за винятком feature gate (найвищий пріоритет).

{{< note >}}
Механізм теки конфігурації drop-in для kubelet схожий, але відрізняється від того, як інструмент `kubeadm` дозволяє вам патчити конфігурацію. Інструмент `kubeadm` використовує конкретну [стратегію застосування патчів](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/#patches) для своєї конфігурації, тоді як єдина стратегія накладання патчів для файлів конфігурації drop-in kubelet це `replace`. Kubelet визначає порядок обʼєднання на основі сортування **суфіксів** алфавітно-цифровим чином, і замінює кожне поле, присутнє у файлі вищого пріоритету.
{{< /note >}}

## Перегляд конфігурації kubelet {#viewing-the-kubelet-configuration}

Оскільки конфігурація тепер може бути розподілена у декілька файлів за допомогою цієї функції, якщо хтось хоче переглянути остаточну активовану конфігурацію, то вони можуть скористатися цими кроками для перегляду конфігурації kubelet:

1. Запустіть проксі-сервер за допомогою команди [`kubectl proxy`](/docs/reference/kubectl/generated/kubectl_proxy/) у вашому терміналі.

   ```bash
   kubectl proxy
   ```

   Це дозволить отримати вивід подібний до:

   ```none
   Starting to serve on 127.0.0.1:8001
   ```

2. Відкрийте інше вікно термінала і скористайтесь `curl`, щоб отримати конфігурацію kubelet. Замініть `<node-name>` на фактичне імʼя вашого вузла:

   ```bash
   curl -X GET http://127.0.0.1:8001/api/v1/nodes/<node-name>/proxy/configz | jq .
   ```

   ```json
   {
     "kubeletconfig": {
       "enableServer": true,
       "staticPodPath": "/var/run/kubernetes/static-pods",
       "syncFrequency": "1m0s",
       "fileCheckFrequency": "20s",
       "httpCheckFrequency": "20s",
       "address": "192.168.1.16",
       "port": 10250,
       "readOnlyPort": 10255,
       "tlsCertFile": "/var/lib/kubelet/pki/kubelet.crt",
       "tlsPrivateKeyFile": "/var/lib/kubelet/pki/kubelet.key",
       "rotateCertificates": true,
       "authentication": {
         "x509": {
           "clientCAFile": "/var/run/kubernetes/client-ca.crt"
         },
         "webhook": {
           "enabled": true,
           "cacheTTL": "2m0s"
         },
         "anonymous": {
           "enabled": true
         }
       },
       "authorization": {
         "mode": "AlwaysAllow",
         "webhook": {
           "cacheAuthorizedTTL": "5m0s",
           "cacheUnauthorizedTTL": "30s"
         }
       },
       "registryPullQPS": 5,
       "registryBurst": 10,
       "eventRecordQPS": 50,
       "eventBurst": 100,
       "enableDebuggingHandlers": true,
       "healthzPort": 10248,
       "healthzBindAddress": "127.0.0.1",
       "oomScoreAdj": -999,
       "clusterDomain": "cluster.local",
       "clusterDNS": [
         "10.0.0.10"
       ],
       "streamingConnectionIdleTimeout": "4h0m0s",
       "nodeStatusUpdateFrequency": "10s",
       "nodeStatusReportFrequency": "5m0s",
       "nodeLeaseDurationSeconds": 40,
       "imageMinimumGCAge": "2m0s",
       "imageMaximumGCAge": "0s",
       "imageGCHighThresholdPercent": 85,
       "imageGCLowThresholdPercent": 80,
       "volumeStatsAggPeriod": "1m0s",
       "cgroupsPerQOS": true,
       "cgroupDriver": "systemd",
       "cpuManagerPolicy": "none",
       "cpuManagerReconcilePeriod": "10s",
       "memoryManagerPolicy": "None",
       "topologyManagerPolicy": "none",
       "topologyManagerScope": "container",
       "runtimeRequestTimeout": "2m0s",
       "hairpinMode": "promiscuous-bridge",
       "maxPods": 110,
       "podPidsLimit": -1,
       "resolvConf": "/run/systemd/resolve/resolv.conf",
       "cpuCFSQuota": true,
       "cpuCFSQuotaPeriod": "100ms",
       "nodeStatusMaxImages": 50,
       "maxOpenFiles": 1000000,
       "contentType": "application/vnd.kubernetes.protobuf",
       "kubeAPIQPS": 50,
       "kubeAPIBurst": 100,
       "serializeImagePulls": true,
       "evictionHard": {
         "imagefs.available": "15%",
         "memory.available": "100Mi",
         "nodefs.available": "10%",
         "nodefs.inodesFree": "5%",
         "imagefs.inodesFree": "5%"
       },
       "evictionPressureTransitionPeriod": "1m0s",
       "mergeDefaultEvictionSettings": false,
       "enableControllerAttachDetach": true,
       "makeIPTablesUtilChains": true,
       "iptablesMasqueradeBit": 14,
       "iptablesDropBit": 15,
       "featureGates": {
         "AllAlpha": false
       },
       "failSwapOn": false,
       "memorySwap": {},
       "containerLogMaxSize": "10Mi",
       "containerLogMaxFiles": 5,
       "configMapAndSecretChangeDetectionStrategy": "Watch",
       "enforceNodeAllocatable": [
         "pods"
       ],
       "volumePluginDir": "/usr/libexec/kubernetes/kubelet-plugins/volume/exec/",
       "logging": {
         "format": "text",
         "flushFrequency": "5s",
         "verbosity": 3,
         "options": {
           "json": {
             "infoBufferSize": "0"
           }
         }
       },
       "enableSystemLogHandler": true,
       "enableSystemLogQuery": false,
       "shutdownGracePeriod": "0s",
       "shutdownGracePeriodCriticalPods": "0s",
       "enableProfilingHandler": true,
       "enableDebugFlagsHandler": true,
       "seccompDefault": false,
       "memoryThrottlingFactor": 0.9,
       "registerNode": true,
       "localStorageCapacityIsolation": true,
       "containerRuntimeEndpoint": "unix:///var/run/crio/crio.sock"
     }
   }
   ```

<!-- discussion -->

## {{% heading "whatsnext" %}}

- Дізнайтеся більше про конфігурацію kubelet, переглянувши
  [довідник `KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/).
- Дізнайтеся більше про обʼєднання конфігурації kubelet у [довідці](/docs/reference/node/kubelet-config-directory-merging).
