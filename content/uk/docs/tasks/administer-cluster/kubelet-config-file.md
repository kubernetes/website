---
title: Встановлення параметрів Kubelet через файл конфігурації
content_type: task
weight: 330
---

## {{% heading "prerequisites" %}} {#before-you-begin}

Деякі кроки на цій сторінці використовують інструмент `jq`. Якщо у вас немає `jq`, ви можете встановити його з джерел програмного забезпечення вашої операційної системи або завантажити з [https://jqlang.github.io/jq/](https://jqlang.github.io/jq/).

Деякі кроки також передбачають встановлення `curl`, який можна встановити з джерел програмного забезпечення вашої операційної системи.

<!-- overview -->

Частину параметрів конфігурації kubelet можна встановити за допомогою файлу конфігурації на диску замість прапорців командного рядка.

Надання параметрів через файл конфігурації є рекомендованим підходом, оскільки це спрощує розгортання вузлів та управління конфігурацією.

<!-- steps -->

## Створіть файл конфігурації {#create-the-config-file}

Підмножина конфігурації kubelet, яку можна налаштувати через файл, визначається структурою [`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/).

Файл конфігурації повинен бути представленням параметрів цієї структури у форматі JSON або YAML. Переконайтеся, що kubelet має права на читання файлу.

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

У цьому прикладі kubelet налаштовано з такими параметрами:

1. `address`: Kubelet обслуговуватиме запити на IP-адресі `192.168.0.8`.
1. `port`: Kubelet обслуговуватиме запити на порту `20250`.
1. `serializeImagePulls`: Завантаження образів виконуватиметься паралельно.
1. `evictionHard`: Kubelet виселятиме Podʼи за однієї з таких умов:
   - Коли доступна памʼять вузла впаде нижче 100MiB.
   - Коли доступний простір основної файлової системи вузла менше 10%.
   - Коли доступний простір файлової системи образів менше 15%.
   - Коли більше ніж 95% inodes основної файлової системи вузла використано.

{{< note >}}
У прикладі, якщо змінити стандартне значення лише одного параметра для `evictionHard`, стандартні значення інших параметрів не будуть успадковані й будуть встановлені в нуль. Щоб задати власні значення, слід вказати всі порогові значення. Або ж ви можете встановити MergeDefaultEvictionSettings у true у файлі конфігурації kubelet; тоді, якщо змінено будь-який параметр, інші параметри успадкують свої стандартні значення замість 0.
{{< /note >}}

`imagefs` — це необовʼязкова файлова система, яку середовища виконання контейнерів використовують для зберігання образів контейнерів та записуваних шарів контейнерів.

## Запуск процесу kubelet, налаштованого через файл конфігурації {#start-a-kubelet-process-configured-via-the-config-file}

{{< note >}}
Якщо ви використовуєте kubeadm для ініціалізації кластера, використовуйте kubelet-config під час створення вашого кластера за допомогою `kubeadm init`. Докладніше див. [налаштування kubelet за допомогою kubeadm](/docs/setup/production-environment/tools/kubeadm/kubelet-integration/).
{{< /note >}}

Запустіть kubelet з прапорцем `--config`, вказавши шлях до файлу конфігурації kubelet. Після цього kubelet завантажить свою конфігурацію з цього файлу.

Зверніть увагу, що прапорці командного рядка, які задають те саме значення, що й файл конфігурації, перевизначатимуть це значення. Це допомагає забезпечити зворотну сумісність з API командного рядка.

Також зверніть увагу, що відносні шляхи файлів у файлі конфігурації kubelet розглядаються відносно розташування файлу конфігурації kubelet, тоді як відносні шляхи в прапорцях командного рядка розглядаються відносно поточної робочої теки kubelet.

Зауважте, що деякі стандартні значення відрізняються для прапорців командного рядка та файлу конфігурації kubelet. Якщо вказано `--config`, а значення не задані в командному рядку, застосовуються стандартні значення для версії `KubeletConfiguration`. У наведеному вище прикладі це версія `kubelet.config.k8s.io/v1beta1`.

## Тека drop-in для файлів конфігурації kubelet {#kubelet-conf-d}

Ви можете вказати теку конфігурації drop-in для kubelet. Стандартно kubelet не шукає файли конфігурації drop-in — ви повинні вказати шлях. Наприклад: `--config-dir=/etc/kubernetes/kubelet.conf.d`

Для Kubernetes від v1.28 до v1.29 ви можете вказати `--config-dir`, лише якщо також встановите змінну середовища `KUBELET_CONFIG_DROPIN_DIR_ALPHA` для процесу kubelet (значення цієї змінної не має значення).

{{< note >}}
Суфікс дійсного файлу конфігурації drop-in для kubelet **має** бути `.conf`. Наприклад: `99-kubelet-address.conf`
{{< /note >}}

Kubelet обробляє файли у своїй теці конфігурації drop-in, сортуючи **повні імена файлів** в алфавітно-цифровому порядку. Наприклад, `00-kubelet.conf` обробляється першим, а потім перевизначається файлом з назвою `01-kubelet.conf`.

Ці файли можуть містити часткові конфігурації, але не повинні бути недійсними та обовʼязково повинні містити метадані типу, зокрема `apiVersion` та `kind`. Валідація виконується лише для остаточної результуючої структури конфігурації, що зберігається всередині kubelet. Це надає гнучкість в управлінні та обʼєднанні конфігурацій kubelet з різних джерел, запобігаючи небажаним конфігураціям. Однак важливо зазначити, що поведінка залежить від типу даних полів конфігурації.

Різні типи даних у структурі конфігурації kubelet обʼєднуються по-різному. Докладніше див. [довідковий документ](/docs/reference/node/kubelet-config-directory-merging/).

### Порядок обʼєднання конфігурації kubelet {#kubelet-configuration-merging-order}

Під час запуску kubelet обʼєднує конфігурацію з:

- Функціональних можливостей, вказаних у командному рядку (найнижчий пріоритет).
- Конфігурації kubelet.
- Файлів конфігурації drop-in, відповідно до порядку сортування.
- Аргументів командного рядка, за винятком функціональних можливостей (найвищий пріоритет).

{{< note >}}
Механізм теки конфігурації drop-in для kubelet схожий на те, як інструмент `kubeadm` дозволяє патчити конфігурацію, але відрізняється від нього. Інструмент `kubeadm` використовує конкретну [стратегію застосування патчів](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/#patches) для своєї конфігурації, тоді як єдина стратегія застосування патчів для файлів конфігурації drop-in kubelet — це `replace`. Kubelet визначає порядок обʼєднання на основі сортування **суфіксів** в алфавітно-цифровому порядку і замінює кожне поле, присутнє у файлі вищого пріоритету.
{{< /note >}}

## Перегляд конфігурації kubelet {#viewing-the-kubelet-configuration}

Оскільки з цією функцією конфігурація тепер може бути розподілена між кількома файлами, той, хто хоче переглянути остаточну застосовану конфігурацію, може виконати такі кроки для перегляду конфігурації kubelet:

1. Запустіть проксі-сервер за допомогою команди [`kubectl proxy`](/docs/reference/kubectl/generated/kubectl_proxy/) у вашому терміналі.

   ```bash
   kubectl proxy
   ```

   Вивід буде подібний до:

   ```none
   Starting to serve on 127.0.0.1:8001
   ```

1. Відкрийте інше вікно термінала і скористайтесь `curl`, щоб отримати конфігурацію kubelet. Замініть `<node-name>` на фактичне імʼя вашого вузла:

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
       "registerNode": true,
       "localStorageCapacityIsolation": true,
       "containerRuntimeEndpoint": "unix:///var/run/crio/crio.sock"
     }
   }
   ```

<!-- discussion -->

## {{% heading "whatsnext" %}} {#what-s-next}

- Дізнайтеся більше про конфігурацію kubelet, переглянувши
  [довідник `KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/).
- Дізнайтеся більше про обʼєднання конфігурації kubelet у [довідці](/docs/reference/node/kubelet-config-directory-merging).
