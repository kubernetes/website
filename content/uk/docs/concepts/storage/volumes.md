---
title: Томи
api_metadata:
- apiVersion: ""
  kind: "Volume"
content_type: concept
weight: 10
---

<!-- overview -->

_Томи_ Kubernetes дають контейнерам у {{< glossary_tooltip text="Podʼі" term_id="pod" >}} змогу отримувати доступ до даних і обмінюватися ними через файлову систему. Існують різні види томів, які можна використовувати для різних цілей, зокрема:

- заповнення файлу конфігурації на основі {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} або {{< glossary_tooltip text="Secret" term_id="secret" >}}
- надання Podʼу тимчасового робочого простору
- спільне використання файлової системи двома різними контейнерами в одному Podʼі
- спільне використання файлової системи двома різними Podʼами (навіть якщо ці Podʼи працюють на різних вузлах)
- надійне зберігання даних, щоб вони залишалися доступними, навіть якщо Pod перезапускається або замінюється
- передавання конфігураційної інформації застосунку, що працює в контейнері, на основі відомостей про Pod, у якому перебуває контейнер (наприклад, повідомлення {{< glossary_tooltip text="sidecar-контейнеру" term_id="sidecar-container" >}}, у якому просторі імен працює Pod)
- надання доступу лише для читання до даних в іншому образі контейнера

Обмін даними може відбуватися між різними локальними процесами всередині контейнера, або між різними контейнерами, або між Podʼами.

## Чому томи важливі {#why-volumes-are-important}

- **Збереження даних:** Файли на диску в контейнері є ефемерними, що створює певні проблеми для нетривіальних застосунків, які працюють у контейнерах. Одна з проблем виникає, коли контейнер аварійно завершує роботу або зупиняється: стан контейнера не зберігається, тому всі файли, створені або змінені протягом життя контейнера, втрачаються. Після аварійного завершення kubelet перезапускає контейнер із чистим станом.

- **Спільне сховище:** Ще одна проблема виникає, коли в `Pod` працює кілька контейнерів, яким потрібно спільно використовувати файли. Налаштувати спільну файлову систему для всіх контейнерів і отримати до неї доступ може бути складно.

Абстракція {{< glossary_tooltip text="тому" term_id="volume" >}} в Kubernetes може допомогти розвʼязати обидві ці проблеми.

Перш ніж дізнатися про томи, PersistentVolumes та PersistentVolumeClaims, вам слід прочитати про {{< glossary_tooltip term_id="Pod" text="Podʼи" >}} і переконатися, що ви розумієте, як Kubernetes використовує Podʼи для запуску контейнерів.

<!-- body -->

## Як томи працюють {#how-volumes-work}

Kubernetes підтримує багато типів томів. {{<glossary_tooltip term_id="pod" text="Pod">}} може використовувати будь-яку кількість типів томів одночасно. Типи [ефемерних томів](/docs/concepts/storage/ephemeral-volumes/) мають життєвий цикл, повʼязаний із конкретним Podʼом, а [постійні томи](/docs/concepts/storage/persistent-volumes/) існують довше за будь-який окремий Pod. Коли Pod припиняє існування, Kubernetes знищує ефемерні томи; однак Kubernetes не знищує постійні томи. Для будь-якого виду тому в певному Podʼі дані зберігаються під час перезапусків контейнерів.

По суті, том — це тека, можливо, з деякими даними, доступна контейнерам у Podʼі. Те, як ця тека зʼявляється, який носій її підтримує і який вона має вміст, визначається конкретним типом тому.

Щоб використати том, вкажіть томи, які потрібно надати Podʼу, у `.spec.volumes` і вкажіть, куди монтувати ці томи в контейнерах, у `.spec.containers[*].volumeMounts`.

Коли Pod запускається, процес у контейнері бачить файлову систему, складену з початкового вмісту {{< glossary_tooltip text="образу контейнера" term_id="image" >}} і томів (якщо їх визначено), змонтованих усередині контейнера. Процес бачить кореневу файлову систему, яка спочатку відповідає вмісту образу контейнера. Будь-які записи в цій ієрархії файлової системи, якщо їх дозволено, впливають на те, що процес бачить під час наступного доступу до файлової системи. Томи монтуються за [вказаними шляхами](#using-subpath) у файловій системі контейнера. Для кожного контейнера, визначеного в Podʼі, потрібно окремо вказати, куди монтувати кожен том, який він використовує.

Томи не можуть монтуватися всередині інших томів (але дивіться [Використання subPath](#using-subpath) про споріднений механізм). Також том не може містити жорстке посилання на щось в іншому томі.

## Типи томів {#volume-types}

Kubernetes підтримує кілька типів томів.

### configMap

[ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) надає спосіб вставляти конфігураційні дані в Podʼи. На дані, збережені в ConfigMap, можна посилатися в томі типу `configMap`, а потім їх використовуватимуть контейнеризовані застосунки, що працюють у Podʼі.

Посилаючись на ConfigMap, ви вказуєте в томі назву ConfigMap. Ви можете налаштувати шлях для конкретного запису в ConfigMap. Наведена нижче конфігурація показує, як змонтувати ConfigMap `log-config` у Pod з назвою `configmap-pod`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: configmap-pod
spec:
  containers:
    - name: test
      image: busybox:1.28
      command: ['sh', '-c', 'echo "The app is running!" && tail -f /dev/null']
      volumeMounts:
        - name: config-vol
          mountPath: /etc/config
  volumes:
    - name: config-vol
      configMap:
        name: log-config
        items:
          - key: log_level
            path: log_level.conf
```

ConfigMap `log-config` монтується як том, і весь вміст, збережений у його записі `log_level`, монтується в Pod за шляхом `/etc/config/log_level.conf`. Зверніть увагу, що цей шлях утворюється з `mountPath` тому та `path` із ключем `log_level`.

{{< note >}}

- Ви повинні [створити ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/#create-a-configmap), перш ніж ви зможете його використовувати.

- ConfigMap завжди монтується як `readOnly`.

- Контейнер, який використовує ConfigMap як монтування тому [`subPath`](#using-subpath), не отримуватиме оновлень, коли ConfigMap змінюється.

- Текстові дані надаються у вигляді файлів у кодуванні UTF-8. Для інших кодувань символів використовуйте `binaryData`.

{{< /note >}}

### downwardAPI {#downwardapi}

Том `downwardAPI` робить дані {{< glossary_tooltip term_id="downward-api" text="downward API" >}} доступними для застосунків. У томі ви можете знайти надані дані у вигляді файлів лише для читання у форматі звичайного тексту.

{{< note >}}
Контейнер, який використовує downward API як монтування тому [`subPath`](#using-subpath), не отримує оновлень, коли значення полів змінюються.
{{< /note >}}

Докладніше дивіться в [Передавання інформації про Pod контейнерам через файли](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/).

### emptyDir {#emptydir}

Для Podʼа, який визначає том `emptyDir`, том створюється, коли Pod призначається вузлу. Як випливає з назви, том `emptyDir` спочатку порожній. Усі контейнери в Podʼі можуть читати й записувати ті самі файли в томі `emptyDir`, хоча цей том може бути змонтований за однаковими або різними шляхами в кожному контейнері. Коли Pod вилучається з вузла з будь-якої причини, дані в `emptyDir` видаляються назавжди.

{{< note >}}
Аварійне завершення контейнера *не* вилучає Pod із вузла. Дані в томі `emptyDir` зберігаються під час аварійних завершень контейнера.
{{< /note >}}

Деякі способи використання `emptyDir`:

- робочий простір, наприклад, для сортування злиттям на диску
- контрольні точки тривалих обчислень для відновлення після збоїв
- зберігання файлів, які отримує контейнер менеджера вмісту, поки контейнер вебсервера обслуговує ці дані

Поле `emptyDir.medium` визначає, де зберігаються томи `emptyDir`. Стандартно томи `emptyDir` зберігаються на носії вузла, наприклад, на диску, SSD або в мережевому сховищі, залежно від вашого середовища. Якщо встановити поле `emptyDir.medium` у `"Memory"`, Kubernetes натомість монтує tmpfs (файлову систему в оперативній памʼяті). Хоча tmpfs дуже швидкий, памʼятайте, що, на відміну від дисків, файли, які ви записуєте, враховуються в обмеженні памʼяті контейнера, який їх записав.

Для стандартного носія можна вказати обмеження розміру, яке обмежує місткість тому `emptyDir`. Простір виділяється з [тимчасового сховища вузла](/docs/concepts/storage/ephemeral-storage/#setting-requests-and-limits-for-local-ephemeral-storage). Якщо воно заповниться з іншого джерела (наприклад, файлами логів або накладеннями образів), місце в `emptyDir` може закінчитися раніше, ніж буде досягнуто цього обмеження. Якщо розмір не вказано, томи в памʼяті отримують розмір, що дорівнює памʼяті вузла, доступній для розподілу.

{{< caution >}}
Перегляньте [тут](/docs/concepts/configuration/manage-resources-containers/#memory-backed-emptydir) моменти, які слід врахувати щодо керування ресурсами під час використання `emptyDir` у памʼяті.
{{< /caution >}}

{{< feature-state feature_gate_name="EmptyDirVolumeMode" >}}

Поле `emptyDir.mode` дозволяє встановити біти дозволів Unix на теці emptyDir, вказавши значення від `0000` до `01777` (у вісімковій системі). Це відповідає тому самому шаблону, що й поле `defaultMode` у томах Secret і ConfigMap. Якщо `mode` не вказано, тека створюється зі стандартними дозволами `0777`.

Встановлення власного режиму корисне, коли ви хочете обмежити доступ лише власником і групою (наприклад, `0750`) або встановити sticky bit на спільній теці, щоб лише власники файлів могли видаляти свої файли (наприклад, `01777`).

{{< note >}}
Якщо `fsGroup` встановлено в контексті безпеки Podʼа, групові дозволи, застосовані `fsGroup`, перевизначають `mode`, вказаний тут. Поле `mode` не впливає на Windows.
{{< /note >}}

#### Приклад конфігурації emptyDir {#emptydir-configuration-example}

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /cache
      name: cache-volume
  volumes:
  - name: cache-volume
    emptyDir:
      sizeLimit: 500Mi
```

#### Приклад конфігурації emptyDir у памʼяті {#emptydir-memory-configuration-example}

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /cache
      name: cache-volume
  volumes:
  - name: cache-volume
    emptyDir:
      sizeLimit: 500Mi
      medium: Memory
```

#### emptyDir і зміна розміру Podʼа на місці {#emptydir-and-in-place-pod-resizing}

{{< feature-state feature_gate_name="InPlacePodVerticalScalingMemoryBackedVolumes" >}}

Коли функціональну можливість `InPlacePodVerticalScalingMemoryBackedVolumes` ввімкнено, ви можете динамічно змінювати `sizeLimit` томів `emptyDir` у памʼяті (`medium: Memory`) без перезапуску Podʼа або його контейнерів.

Докладніше дивіться в [Зміна розміру ресурсів CPU та памʼяті, призначених контейнерам](/docs/tasks/configure-pod-container/resize-container-resources/#resizing-memory-backed-emptydir-volumes).

#### Приклад конфігурації дозволів emptyDir {#emptydir-permissions-configuration-example}

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /cache
      name: cache-volume
  volumes:
  - name: cache-volume
    emptyDir:
      mode: 01777
```

### fc (fibre channel) {#fc}

Тип тому `fc` дозволяє монтувати в Pod наявний блоковий том сховища Fibre Channel. Ви можете вказати одне чи кілька цільових всесвітніх імен (world wide names, WWN) за допомогою параметра `targetWWNs` у конфігурації тому. Якщо вказано кілька WWN, targetWWNs очікує, що ці WWN належать до багатошляхових зʼєднань.

{{< note >}}
Ви повинні заздалегідь налаштувати зонування FC SAN, щоб виділити та маскувати ці LUN (томи) для цільових WWN, щоб хости Kubernetes могли отримати до них доступ.
{{< /note >}}

### gcePersistentDisk (застаріло) {#gcepersistentdisk}

У Kubernetes {{< skew currentVersion >}} усі операції для вбудованого типу `gcePersistentDisk` перенаправляються на драйвер {{< glossary_tooltip text="CSI" term_id="csi" >}} `pd.csi.storage.gke.io`.

Вбудований драйвер сховища `gcePersistentDisk` визнано застарілим у випуску Kubernetes v1.17, а потім повністю вилучено у випуску v1.28.

Проєкт Kubernetes пропонує натомість використовувати сторонній драйвер сховища [Google Compute Engine Persistent Disk CSI](https://github.com/kubernetes-sigs/gcp-compute-persistent-disk-csi-driver).

### gitRepo (вимкнено) {#gitrepo}

{{< warning >}}
Kubernetes {{< skew latestVersion >}} *не* містить драйвера томів `gitRepo`. Останньою версією, яка надавала можливість використовувати цей драйвер, була Kubernetes v1.35, а застарілим він став із мінорного випуску [v1.11](/releases/1.11).

Щоб надати Pod зі змонтованим репозиторієм Git, ви можете змонтувати том [`emptyDir`](#emptydir) в [init-контейнер](/docs/concepts/workloads/pods/init-containers/), який клонує репозиторій за допомогою Git, а потім змонтувати [EmptyDir](#emptydir) у контейнер Podʼа.

---

Ви можете обмежити використання томів `gitRepo` у своєму кластері за допомогою [політик](/docs/concepts/policy/), таких як [ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/). Ви можете використати наведений нижче вираз Common Expression Language (CEL) як частину політики, щоб відхиляти використання томів `gitRepo`:

```cel
!has(object.spec.volumes) || !object.spec.volumes.exists(v, has(v.gitRepo))
```

{{< /warning >}}

### hostPath {#hostpath}

Том `hostPath` монтує файл або теку з файлової системи вузла-хоста у ваш Pod. Більшості Podʼів це не потрібно, але це потужний запасний вихід для деяких застосунків.

{{< warning >}}
Використання типу тому `hostPath` створює багато ризиків для безпеки. Якщо можете уникнути використання тому `hostPath`, зробіть це. Наприклад, натомість визначте й використовуйте [`local` PersistentVolume](#local).

Якщо ви обмежуєте доступ до певних тек на вузлі за допомогою перевірки під час допуску, це обмеження є ефективним лише тоді, коли ви додатково вимагаєте, щоб усі монтування цього тому `hostPath` були **лише для читання**. Якщо ви дозволяєте ненадійному Podʼу монтувати будь-який шлях хоста для читання й запису, контейнери цього Podʼа можуть зловжити цим монтуванням хоста для читання й запису.

---

Будьте обережні, використовуючи томи `hostPath`, незалежно від того, чи монтуються вони лише для читання, чи для читання й запису, оскільки:

- Доступ до файлової системи хоста може розкрити привілейовані системні облікові дані (наприклад, для kubelet) або привілейовані API (наприклад, сокет середовища виконання контейнерів), які можна використати для виходу з контейнера або для атаки на інші частини кластера.
- Podʼи з однаковою конфігурацією (наприклад, створені з PodTemplate) можуть поводитися по-різному на різних вузлах через різні файли на вузлах.
- Використання тому `hostPath` не вважається використанням ефемерного сховища. Ви маєте самостійно стежити за використанням диска, оскільки надмірне використання диска томами `hostPath` призведе до тиску на диск вузла.
{{< /warning >}}

Деякі способи використання `hostPath`:

- запуск контейнера, якому потрібен доступ до системних компонентів рівня вузла (наприклад, контейнера, який передає системні логи до центрального місця, отримуючи доступ до цих логів через монтування `/var/log` лише для читання)
- надання конфігураційного файлу, що зберігається на хост-системі, у режимі лише для читання {{< glossary_tooltip text="статичному Podʼу" term_id="static-pod" >}}; на відміну від звичайних Podʼів, статичні Podʼи не можуть отримувати доступ до ConfigMaps

#### Типи томів `hostPath` {#hostpath-volume-types}

Крім обовʼязкової властивості `path`, ви можете за потреби вказати `type` для тому `hostPath`.

Доступні значення для `type`:

<!-- порожній рядок подано за допомогою U+200C ZERO WIDTH NON-JOINER -->

| Значення | Поведінка |
|:---------|:----------|
| `‌""` | Порожній рядок (стандартно) призначений для зворотної сумісності й означає, що перед монтуванням тому `hostPath` перевірки не виконуватимуться. |
| `DirectoryOrCreate` | Якщо за вказаним шляхом нічого немає, там за потреби буде створено порожню теку з дозволами 0755, з тією самою групою та власником, що й у kubelet. |
| `Directory` | Тека має існувати за вказаним шляхом. |
| `FileOrCreate` | Якщо за вказаним шляхом нічого немає, там за потреби буде створено порожній файл із дозволами 0644, з тією самою групою та власником, що й у kubelet. |
| `File` | Повинен існувати файл за вказаним шляхом. |
| `Socket` | Має існувати UNIX-сокет за вказаним шляхом. |
| `CharDevice` | _(Лише вузли Linux)_ Має існувати символьний пристрій за вказаним шляхом. |
| `BlockDevice` | _(Лише вузли Linux)_ Має існувати блоковий пристрій за вказаним шляхом. |

{{< caution >}}
Режим `FileOrCreate` **не** створює батьківську теку файлу. Якщо батьківської теки змонтованого файлу не існує, Podʼу не вдасться запуститися. Щоб забезпечити роботу цього режиму, можна спробувати монтувати теки та файли окремо, як показано в [прикладі `FileOrCreate`](#hostpath-fileorcreate-example) для `hostPath`.
{{< /caution >}}

Деякі файли або теки, створені на базових хостах, можуть бути доступні лише користувачу root. Тоді вам потрібно або запускати процес як root у [привілейованому контейнері](/docs/tasks/configure-pod-container/security-context/), або змінити дозволи файлів на хості, щоб читати з тому `hostPath` або записувати в нього.

#### Приклад конфігурації `hostPath` {#hostpath-configuration-example}

{{< tabs name="hostpath_examples" >}}
{{< tab name="Вузол Linux" codelang="yaml" >}}
---
# Цей маніфест монтує /data/foo на вузлі як /foo всередині
# єдиного контейнера, який працює в межах Podʼа hostpath-example-linux
#
# Монтування в контейнер тільки для читання
apiVersion: v1
kind: Pod
metadata:
  name: hostpath-example-linux
spec:
  os: { name: linux }
  nodeSelector:
    kubernetes.io/os: linux
  containers:
  - name: example-container
    image: registry.k8s.io/test-webserver
    volumeMounts:
    - mountPath: /foo
      name: example-volume
      readOnly: true
  volumes:
  - name: example-volume
    # монтувати /data/foo, але тільки якщо ця тека вже існує
    hostPath:
      path: /data/foo # розташування теки на вузлі
      type: Directory # це поле є необовʼязковим
{{< /tab >}}
{{< tab name="Вузол Windows" codelang="yaml" >}}
---
# Цей маніфест монтує C:\Data\foo на вузлі як C:\foo всередині
# єдиного контейнера, який працює в межах Podʼа hostpath-example-windows
#
# Монтування в контейнер тільки для читання
apiVersion: v1
kind: Pod
metadata:
  name: hostpath-example-windows
spec:
  os: { name: windows }
  nodeSelector:
    kubernetes.io/os: windows
  containers:
  - name: example-container
    image: microsoft/windowsservercore:1709
    volumeMounts:
    - name: example-volume
      mountPath: "C:\\foo"
      readOnly: true
  volumes:
    # монтувати C:\Data\foo з вузла, але тільки якщо ця тека вже існує
  - name: example-volume
      hostPath:
        path: "C:\\Data\\foo" # розташування теки на вузлі
        type: Directory       # це поле є необовʼязковим
{{< /tab >}}
{{< /tabs >}}

#### Приклад конфігурації `hostPath` для `FileOrCreate` {#hostpath-fileorcreate-example}

У наведеному нижче маніфесті визначено Pod, який монтує `/var/local/aaa` всередині єдиного контейнера Podʼа. Якщо на вузлі ще немає шляху `/var/local/aaa`, kubelet створює його як теку, а потім монтує в Pod.

Якщо `/var/local/aaa` вже існує, але не є текою, Pod завершується збоєм. Крім того, kubelet намагається створити файл `/var/local/aaa/1.txt` усередині цієї теки (з погляду хоста); якщо за цим шляхом уже щось існує і це не звичайний файл, Pod завершується збоєм.

Ось приклад маніфесту:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-webserver
spec:
  os: { name: linux }
  nodeSelector:
    kubernetes.io/os: linux
  containers:
  - name: test-webserver
    image: registry.k8s.io/test-webserver:latest
    volumeMounts:
    - mountPath: /var/local/aaa
      name: mydir
    - mountPath: /var/local/aaa/1.txt
      name: myfile
  volumes:
  - name: mydir
    hostPath:
      # Переконайтеся, що теку файлу створено.
      path: /var/local/aaa
      type: DirectoryOrCreate
  - name: myfile
    hostPath:
      path: /var/local/aaa/1.txt
      type: FileOrCreate
```

### image

{{< feature-state feature_gate_name="ImageVolume" >}}

Джерело тому `image` представляє обʼєкт OCI (образ контейнера або артефакт), який доступний на хост-машині kubelet.

Ось приклад використання джерела тому `image`:

{{% code_sample file="pods/image-volumes.yaml" %}}

Том розвʼязується під час запуску Podʼа залежно від значення `pullPolicy`:

`Always`
: kubelet завжди намагається завантажити посилання. Якщо завантаження не вдається, kubelet переводить Pod у стан `Failed`.

`Never`
: kubelet ніколи не завантажує посилання й використовує лише локальний образ або артефакт. Pod переходить у стан `Failed`, якщо будь-які шари образу ще не присутні локально або якщо маніфест цього образу ще не закешовано.

`IfNotPresent`
: kubelet завантажує посилання, якщо його ще немає на диску. Pod переходить у стан `Failed`, якщо посилання немає й завантаження не вдається.

Том розвʼязується повторно, якщо Pod видаляють і створюють заново, тобто новий віддалений вміст стане доступним після повторного створення Podʼа. Збій розвʼязання або завантаження образу під час запуску Podʼа заблокує запуск контейнерів і може додати значну затримку. Спроби після збоїв повторюватимуться за звичайним механізмом backoff для томів, а про збої буде повідомлено в полях reason і message Podʼа.

Типи обʼєктів, які може монтувати цей том, визначаються реалізацією середовища виконання контейнерів на хост-машині. Вони мають включати щонайменше всі дійсні типи, які підтримує поле образу контейнера. Обʼєкт OCI монтується в одну теку (`spec.containers[*].volumeMounts[*].mountPath`) і лише для читання.

Крім того:

- Монтування [`subPath`](/docs/concepts/storage/volumes/#using-subpath) або [`subPathExpr`](/docs/concepts/storage/volumes/#using-subpath-expanded-environment) для контейнерів (`spec.containers[*].volumeMounts[*].subPath`, `spec.containers[*].volumeMounts[*].subPathExpr`) підтримуються лише починаючи з Kubernetes v1.33.
- Поле `spec.securityContext.fsGroupChangePolicy` не має жодного ефекту для цього типу тому.
- [Контролер допуску `AlwaysPullImages`](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages) також працює для цього джерела тому, як і для образів контейнерів.

Для типу `image` доступні такі поля:

`reference`
: Посилання на артефакт, який слід використовувати. Наприклад, ви можете вказати `registry.k8s.io/conformance:v{{< skew currentPatchVersion >}}`, щоб завантажити файли з образу тестів на відповідність Kubernetes. Працює так само, як `pod.spec.containers[*].image`. Секрети завантаження образів збираються так само, як для образу контейнера: шляхом пошуку облікових даних вузла, секретів завантаження образів ServiceAccount і секретів завантаження образів зі специфікації Podʼа. Це поле є необовʼязковим, щоб керування конфігурацією вищого рівня могло задавати стандартні значення або перевизначати образи контейнерів у контролерах робочих навантажень, таких як Deployments і StatefulSets. [Докладніше про образи контейнерів](/docs/concepts/containers/images).

`pullPolicy`
: Політика завантаження обʼєктів OCI. Можливі значення: `Always`, `Never` або `IfNotPresent`. Стандартно `Always`, якщо вказано теґ `:latest`, інакше `IfNotPresent`.

Докладніше про використання цього джерела тому дивіться в прикладі [_Використання тому image з Podʼом_](/docs/tasks/configure-pod-container/image-volumes).

#### Статус Podʼа та томи `image` {#image-volume-pod-status}

{{< feature-state feature_gate_name="ImageVolumeWithDigest" >}}

Якщо у вашому кластері ввімкнено функціональну можливість [`ImageVolumeWithDigest`](/docs/reference/command-line-tools-reference/feature-gates/#ImageVolumeWithDigest), то щоразу, коли ви вказуєте том `image` для Podʼа, kubelet оновлює статус Podʼа, щоб записати _digest_ образу контейнера, який використовується як джерело тому.

Ось спрощений приклад запущеного Podʼа у вигляді YAML, зокрема з оновленням статусу. Зверніть увагу на нове поле `ImageRef` у `volumeMounts` у статусі контейнера.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
  namespace: default
spec:
  containers:
  - name: shell
    command: ["sleep", "infinity"]
    image: docker.io/library/debian:12
    volumeMounts:
    - name: artifact
      mountPath: /data
  volumes:
  - name: artifact
    image:
      reference: quay.io/crio/artifact:v2
      pullPolicy: IfNotPresent
status:
  containerStatuses:
  - containerID: containerd://examplecontainerid1234567890abcdef
    image: docker.io/library/debian:12
    imageID: docker-pullable://docker.io/library/debian@sha256:3f1d6c17773a45c97bd8f158d665c9709d7b29ed7917ac934086ad96f92e4510
    volumeMounts:
    - name: artifact
      mountPath: /data
      readOnly: true
      imageRef: quay.io/crio/artifact@sha256:abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890
```

### iscsi

Том `iscsi` дозволяє монтувати наявний том iSCSI (SCSI через IP) у ваш Pod. На відміну від `emptyDir`, який стирається, коли Pod вилучається, вміст тому `iscsi` зберігається, а том лише розмонтовується. Це означає, що том iSCSI можна попередньо заповнити даними, і ці дані можна спільно використовувати між Podʼами.

{{< note >}}
Вам потрібно мати власний сервер iSCSI, на якому створено том, перш ніж ви зможете його використовувати.
{{< /note >}}

Особливість iSCSI полягає в тому, що його можуть одночасно монтувати кілька споживачів лише для читання. Це означає, що ви можете попередньо заповнити том своїм набором даних, а потім паралельно надавати його зі стількох Podʼів, скільки потрібно. На жаль, томи iSCSI може монтувати лише один споживач у режимі читання й запису. Одночасний запис не дозволений.

### local

Том `local` представляє змонтований локальний пристрій зберігання, такий як диск, розділ або тека.

Локальні томи можна використовувати лише як статично створені PersistentVolume. Динамічне надання не підтримується.

Порівняно з томами `hostPath`, томи `local` використовуються довговічно й переносно, без ручного планування Podʼів на вузли. Система знає про обмеження вузла для тому, переглядаючи спорідненість вузла в PersistentVolume.

Однак томи `local` залежать від доступності базового вузла й підходять не для всіх застосунків. Якщо вузол стає несправним, том `local` стає недоступним для Podʼа. Pod, який використовує цей том, не може працювати. Застосунки, що використовують томи `local`, мають бути здатні витримувати таку знижену доступність, а також потенційну втрату даних, залежно від характеристик надійності базового диска.

У наведеному нижче прикладі показано PersistentVolume, що використовує том `local` і `nodeAffinity`:

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: example-pv
spec:
  capacity:
    storage: 100Gi
  volumeMode: Filesystem
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Delete
  storageClassName: local-storage
  local:
    path: /mnt/disks/ssd1
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: kubernetes.io/hostname
          operator: In
          values:
          - example-node
```

Під час використання томів `local` потрібно встановити `nodeAffinity` у PersistentVolume. Планувальник Kubernetes використовує `nodeAffinity` PersistentVolume, щоб планувати ці Podʼи на правильний вузол.

`volumeMode` PersistentVolume можна встановити в "Block" (замість стандартного значення "Filesystem"), щоб надати локальний том як необроблений блоковий пристрій.

Під час використання локальних томів рекомендується створити StorageClass із `volumeBindingMode`, встановленим у `WaitForFirstConsumer`. Докладніше дивіться в прикладі [StorageClass](/docs/concepts/storage/storage-classes/#local) для локальних томів. Відкладена привʼязка томів гарантує, що рішення про привʼязку PersistentVolumeClaim також враховуватиме інші обмеження вузла, які може мати Pod, такі як вимоги до ресурсів вузла, селектори вузлів, спорідненість і антиспорідненість Podʼів.

Для кращого керування життєвим циклом локального тому можна окремо запустити зовнішній статичний provisioner. Зверніть увагу, що цей provisioner поки не підтримує динамічне надання. Приклад запуску зовнішнього локального provisioner дивіться в [посібнику користувача local volume provisioner](https://github.com/kubernetes-sigs/sig-storage-local-static-provisioner).

{{< note >}}
Локальний PersistentVolume потребує ручного очищення й видалення користувачем, якщо для керування життєвим циклом тому не використовується зовнішній статичний provisioner.
{{< /note >}}

### nfs

Том `nfs` дозволяє монтувати наявний спільний ресурс NFS (Network File System) у Pod. На відміну від `emptyDir`, який стирається, коли Pod вилучається, вміст тому `nfs` зберігається, а том лише розмонтовується. Це означає, що том NFS можна попередньо заповнити даними, і ці дані можна спільно використовувати між Podʼами. NFS можуть одночасно монтувати кілька записувачів.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /my-nfs-data
      name: test-volume
  volumes:
  - name: test-volume
    nfs:
      server: my-nfs-server.example.com
      path: /my-nfs-volume
      readOnly: true
```

{{< note >}}
Щоб використовувати NFS, потрібно мати власний запущений сервер NFS з експортованим спільним ресурсом.

Також зверніть увагу, що ви не можете вказувати параметри монтування NFS у специфікації Podʼа. Ви можете встановити параметри монтування на боці сервера або використовувати [/etc/nfsmount.conf](https://man7.org/linux/man-pages/man5/nfsmount.conf.5.html). Ви також можете монтувати томи NFS через PersistentVolumes, які дозволяють встановлювати параметри монтування.
{{< /note >}}

### persistentVolumeClaim {#persistentvolumeclaim}

Том `persistentVolumeClaim` використовується для монтування [PersistentVolume](/docs/concepts/storage/persistent-volumes/) у Pod. PersistentVolumeClaims — це спосіб для користувачів «запросити» надійне сховище (наприклад, том iSCSI), не знаючи деталей конкретного хмарного середовища.

Докладніше дивіться в інформації про [PersistentVolumes](/docs/concepts/storage/persistent-volumes/).

### portworxVolume (застаріло) {#portworxvolume}

{{< feature-state for_k8s_version="v1.25" state="deprecated" >}}

`portworxVolume` — це еластичний рівень блокового сховища, який працює в гіперконвергентному режимі з Kubernetes. [Portworx](https://portworx.com/use-case/kubernetes-storage/) визначає відбитки сховища на сервері, розподіляє його за рівнями на основі можливостей і агрегує місткість на кількох серверах. Portworx працює в гостьовій системі віртуальних машин або на вузлах Linux без віртуалізації (bare metal).

`portworxVolume` можна створити динамічно через Kubernetes або попередньо надати й послатися на нього в Podʼі. Ось приклад Podʼа, який посилається на попередньо наданий том Portworx:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-portworx-volume-pod
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /mnt
      name: pxvol
  volumes:
  - name: pxvol
    # Цей том Portworx повинен вже існувати.
    portworxVolume:
      volumeID: "pxvol"
      fsType: "<fs-type>"
```

{{< note >}}
Переконайтеся, що у вас є наявний PortworxVolume з назвою `pxvol`, перш ніж використовувати його в Podʼі.
{{< /note >}}

#### Міграція на Portworx CSI {#portworx-csi-migration}

{{< feature-state feature_gate_name="CSIMigrationPortworx" >}}

У Kubernetes {{% skew currentVersion %}} усі операції для вбудованих томів Portworx стандартно перенаправляються на драйвер Container Storage Interface (CSI) `pxd.portworx.com`. [Portworx CSI Driver](https://docs.portworx.com/portworx-enterprise/operations/operate-kubernetes/storage-operations/csi) має бути встановлений у кластері.

### projected

Проєкційний том зіставляє кілька наявних джерел томів з однією текою. Докладніше дивіться [проєкційні томи](/docs/concepts/storage/projected-volumes/).

### secret

Том `secret` використовується для передавання конфіденційної інформації, такої як паролі, у Podʼи. Ви можете зберігати Secrets в API Kubernetes і монтувати їх як файли для використання Podʼами без прямої привʼязки до Kubernetes. Томи `secret` підтримуються tmpfs (файловою системою в оперативній памʼяті), тому вони ніколи не записуються на енергонезалежне сховище.

{{< note >}}

- Ви повинні створити Secret в API Kubernetes, перш ніж ви зможете його використовувати.

- Secret завжди монтується як `readOnly`.

- Контейнер, який використовує Secret як монтування тому [`subPath`](#using-subpath), не отримуватиме оновлень Secret.

{{< /note >}}

Докладніше дивіться [Налаштування Secrets](/docs/concepts/configuration/secret/).

## Використання subPath {#using-subpath}

Іноді корисно спільно використовувати один том для кількох цілей в одному Podʼі. Властивість `volumeMounts[*].subPath` задає підшлях усередині вказаного тому замість його кореня.

У наведеному нижче прикладі показано, як налаштувати Pod зі стеком LAMP (Linux, Apache, MySQL, PHP) за допомогою одного спільного тому. Цю конфігурацію `subPath` не рекомендується використовувати в промисловому середовищі.

Код і ресурси PHP-застосунку зіставляються з текою `html` тому, а база даних MySQL зберігається в теці `mysql` тому. Наприклад:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-lamp-site
spec:
    containers:
    - name: mysql
      image: mysql
      env:
      - name: MYSQL_ROOT_PASSWORD
        value: "rootpasswd"
      volumeMounts:
      - mountPath: /var/lib/mysql
        name: site-data
        subPath: mysql
    - name: php
      image: php:7.0-apache
      volumeMounts:
      - mountPath: /var/www/html
        name: site-data
        subPath: html
    volumes:
    - name: site-data
      persistentVolumeClaim:
        claimName: my-lamp-site-data
```

### Використання subPath із розширеними змінними середовища {#using-subpath-expanded-environment}

{{< feature-state for_k8s_version="v1.17" state="stable" >}}

Використовуйте поле `subPathExpr`, щоб будувати назви тек `subPath` зі змінних середовища downward API. Властивості `subPath` та `subPathExpr` є взаємовиключними.

У цьому прикладі `Pod` використовує `subPathExpr`, щоб створити теку `pod1` усередині тому `hostPath` `/var/log/pods`. Том `hostPath` отримує назву `Pod` із `downwardAPI`. Тека хоста `/var/log/pods/pod1` монтується в `/logs` у контейнері.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod1
spec:
  containers:
  - name: container1
    env:
    - name: POD_NAME
      valueFrom:
        fieldRef:
          apiVersion: v1
          fieldPath: metadata.name
    image: busybox:1.28
    command: [ "sh", "-c", "while [ true ]; do echo 'Hello'; sleep 10; done | tee -a /logs/hello.txt" ]
    volumeMounts:
    - name: workdir1
      mountPath: /logs
      # Для змінних використовуються круглі дужки (не фігурні).
      subPathExpr: $(POD_NAME)
  restartPolicy: Never
  volumes:
  - name: workdir1
    hostPath:
      path: /var/log/pods
```

## Ресурси {#resources}

Носій (наприклад, диск або SSD) тому `emptyDir` визначається носієм файлової системи, на якій розташована коренева тека kubelet (зазвичай `/var/lib/kubelet`). Немає обмежень на те, скільки місця може використовувати том `emptyDir` або `hostPath`, і немає ізоляції між контейнерами або Podʼами.

Щоб дізнатися про запит місця за допомогою специфікації ресурсів, дивіться [як керувати ресурсами](/docs/concepts/configuration/manage-resources-containers/).

## Зовнішні втулки томів {#out-of-tree-volume-plugins}

До зовнішніх втулків томів належать {{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} (CSI), а також FlexVolume (застарілий). Ці втулки дозволяють постачальникам сховищ створювати власні втулки сховища, не додаючи їхній вихідний код до репозиторію Kubernetes.

Раніше всі втулки томів були «вбудованими». «Вбудовані» втулки збиралися, компонувалися, компілювалися й постачалися разом з основними бінарними файлами Kubernetes. Це означало, що додавання нової системи зберігання до Kubernetes (втулка томів) вимагало внесення коду в основний репозиторій коду Kubernetes.

І CSI, і FlexVolume дозволяють розробляти втулки томів незалежно від кодової бази Kubernetes і розгортати (встановлювати) їх у кластерах Kubernetes як розширення.

Постачальникам сховищ, які хочуть створити зовнішній втулок томів, варто звернутися до [FAQ про втулки томів](https://github.com/kubernetes/community/blob/main/sig-storage/volume-plugin-faq.md).

### csi

[Container Storage Interface](https://github.com/container-storage-interface/spec/blob/master/spec.md) (CSI) визначає стандартний інтерфейс для систем оркестрування контейнерів (таких як Kubernetes), щоб надавати довільні системи зберігання своїм контейнерним робочим навантаженням.

Докладніше читайте в [проєктній пропозиції CSI](https://git.k8s.io/design-proposals-archive/storage/container-storage-interface.md).

{{< note >}}
Підтримку версій специфікації CSI 0.2 та 0.3 визнано застарілою в Kubernetes v1.13, і її буде вилучено в майбутньому випуску.
{{< /note >}}

{{< note >}}
Драйвери CSI можуть бути сумісними не з усіма випусками Kubernetes. Перевірте в документації конкретного драйвера CSI підтримувані кроки розгортання для кожного випуску Kubernetes і матрицю сумісності.
{{< /note >}}

Після розгортання сумісного з CSI драйвера томів у кластері Kubernetes користувачі можуть використовувати тип тому `csi`, щоб підʼєднувати або монтувати томи, які надає драйвер CSI.

Том `csi` можна використовувати в Podʼі трьома різними способами:

- через посилання на [PersistentVolumeClaim](#persistentvolumeclaim)
- з [загальним ефемерним томом](/docs/concepts/storage/ephemeral-volumes/#generic-ephemeral-volumes)
- з [ефемерним томом CSI](/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volumes), якщо драйвер це підтримує

Адміністратори сховища можуть використовувати такі поля для налаштування постійного тому CSI:

- `driver`: Рядкове значення, яке задає назву драйвера томів. Це значення має відповідати значенню, яке драйвер CSI повертає в `GetPluginInfoResponse`, як визначено в [специфікації CSI](https://github.com/container-storage-interface/spec/blob/master/spec.md#getplugininfo). Kubernetes використовує його, щоб визначити, який драйвер CSI викликати, а компоненти драйвера CSI — щоб визначити, які обʼєкти PV належать цьому драйверу CSI.
- `volumeHandle`: Рядкове значення, яке унікально ідентифікує том. Це значення має відповідати значенню, яке драйвер CSI повертає в полі `volume.id` відповіді `CreateVolumeResponse`, як визначено в [специфікації CSI](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume). Значення передається як `volume_id` в усіх викликах драйвера томів CSI під час посилання на том.
- `readOnly`: Необовʼязкове булеве значення, яке вказує, чи має том бути "ControllerPublished" (підʼєднаний) лише для читання. Стандартно false. Це значення передається драйверу CSI через поле `readonly` у `ControllerPublishVolumeRequest`.
- `fsType`: Якщо `VolumeMode` PV має значення `Filesystem`, це поле можна використати для вказання файлової системи, яку слід використовувати для монтування тому. Якщо том не відформатовано й форматування підтримується, це значення буде використано для форматування тому. Це значення передається драйверу CSI через поле `VolumeCapability` у `ControllerPublishVolumeRequest`, `NodeStageVolumeRequest` та `NodePublishVolumeRequest`.
- `volumeAttributes`: Мапа рядків на рядки, яка задає статичні властивості тому. Ця мапа має відповідати мапі, яку драйвер CSI повертає в полі `volume.attributes` відповіді `CreateVolumeResponse`, як визначено в [специфікації CSI](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume). Мапа передається драйверу CSI через поле `volume_context` у `ControllerPublishVolumeRequest`, `NodeStageVolumeRequest` та `NodePublishVolumeRequest`.
- `controllerPublishSecretRef`: Посилання на обʼєкт Secret, що містить конфіденційну інформацію, яку слід передати драйверу CSI для завершення викликів CSI `ControllerPublishVolume` та `ControllerUnpublishVolume`. Це поле є необовʼязковим і може бути порожнім, якщо Secret не потрібен. Якщо Secret містить більше одного секрету, передаються всі секрети.
- `nodeExpandSecretRef`: Посилання на Secret, що містить конфіденційну інформацію, яку слід передати драйверу CSI для завершення виклику CSI `NodeExpandVolume`. Це поле є необовʼязковим і може бути порожнім, якщо Secret не потрібен. Якщо обʼєкт містить більше одного секрету, передаються всі секрети. Коли ви налаштували секретні дані для розширення тому, ініційованого вузлом, kubelet передає ці дані драйверу CSI через виклик `NodeExpandVolume()`. Усі підтримувані версії Kubernetes пропонують поле `nodeExpandSecretRef` і стандартно роблять його доступним. Випуски Kubernetes до v1.25 не мали цієї підтримки.
- Увімкніть функціональну можливість [`CSINodeExpandSecret`](/docs/reference/command-line-tools-reference/feature-gates-removed/#CSINodeExpandSecret) для кожного kube-apiserver і для kubelet на кожному вузлі. Починаючи з Kubernetes 1.27, цю можливість стандартно ввімкнено, і явно вмикати функціональну можливість не потрібно. Ви також повинні використовувати драйвер CSI, який підтримує або потребує секретних даних під час операцій зміни розміру сховища, ініційованих вузлом.
- `nodePublishSecretRef`: Посилання на обʼєкт Secret, що містить конфіденційну інформацію, яку слід передати драйверу CSI для завершення виклику CSI `NodePublishVolume`. Це поле є необовʼязковим і може бути порожнім, якщо Secret не потрібен. Якщо обʼєкт Secret містить більше одного секрету, передаються всі секрети.
- `nodeStageSecretRef`: Посилання на обʼєкт Secret, що містить конфіденційну інформацію, яку слід передати драйверу CSI для завершення виклику CSI `NodeStageVolume`. Це поле є необовʼязковим і може бути порожнім, якщо Secret не потрібен. Якщо Secret містить більше одного секрету, передаються всі секрети.

#### Підтримка необроблених блокових томів CSI {#csi-raw-block-volume-support}

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

Постачальники зовнішніх драйверів CSI можуть реалізувати підтримку необроблених блокових томів у робочих навантаженнях Kubernetes.

Ви можете налаштувати свій [PersistentVolume/PersistentVolumeClaim із підтримкою необроблених блокових томів](/docs/concepts/storage/persistent-volumes/#raw-block-volume-support) як зазвичай, без будь-яких змін, специфічних для CSI.

#### Ефемерні томи CSI {#csi-ephemeral-volumes}

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

Ви можете безпосередньо налаштувати томи CSI у специфікації Podʼа. Томи, вказані таким способом, є ефемерними й не зберігаються після перезапуску Podʼа. Докладніше дивіться в [Ефемерні томи](/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volumes).

Докладніше про розроблення драйвера CSI дивіться в [документації kubernetes-csi](https://kubernetes-csi.github.io/docs/)

#### Проксі CSI для Windows {#windows-csi-proxy}

{{< feature-state for_k8s_version="v1.22" state="stable" >}}

Втулки вузла CSI мають виконувати різні привілейовані операції, такі як сканування дискових пристроїв і монтування файлових систем. Ці операції відрізняються для кожної операційної системи хоста. На робочих вузлах Linux контейнеризовані втулки вузла CSI зазвичай розгортаються як привілейовані контейнери. На робочих вузлах Windows привілейовані операції для контейнеризованих втулків вузла CSI підтримуються за допомогою [csi-proxy](https://github.com/kubernetes-csi/csi-proxy) — автономного бінарного файлу, що підтримується спільнотою й має бути попередньо встановлений на кожному вузлі Windows.

Докладніше дивіться в посібнику з розгортання втулка CSI, який ви хочете розгорнути.

#### Міграція на драйвери CSI з вбудованих втулків {#migrating-to-csi-drivers-from-in-tree-plugins}

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

Можливість `CSIMigration` спрямовує операції щодо наявних вбудованих втулків до відповідних втулків CSI (які мають бути встановлені й налаштовані). Завдяки цьому операторам не потрібно змінювати конфігурацію наявних класів сховища, PersistentVolumes або PersistentVolumeClaims (які посилаються на вбудовані втулки) під час переходу на драйвер CSI, що замінює вбудований втулок.

{{< note >}}
Наявні PV, створені вбудованим втулком томів, можна й надалі використовувати без будь-яких змін конфігурації, навіть після завершення міграції на CSI для цього типу тому і навіть після оновлення до версії Kubernetes, у якій немає вкомпільованої підтримки цього типу сховища.

У межах цієї міграції ви або інший адміністратор кластера **повинні** встановити й налаштувати відповідний драйвер CSI для цього сховища. Ядро Kubernetes не встановлює це програмне забезпечення за вас.

---

Після цієї міграції ви також можете визначати нові PVC і PV, які посилаються на застарілі вбудовані інтеграції сховищ. Якщо відповідний драйвер CSI встановлено й налаштовано, створення PV і далі працює, навіть для зовсім нових томів. Фактичне керування сховищем тепер відбувається через драйвер CSI.
{{< /note >}}

Підтримувані операції та можливості включають: надання/видалення, підʼєднання/відʼєднання, монтування/розмонтування та зміну розміру томів.

Вбудовані втулки, які підтримують `CSIMigration` і мають відповідний реалізований драйвер CSI, перелічено в розділі [Типи томів](#volume-types).

### flexVolume (застаріло) {#flexvolume}

{{< feature-state for_k8s_version="v1.23" state="deprecated" >}}

FlexVolume — це інтерфейс зовнішніх втулків, який використовує модель на основі exec для взаємодії з драйверами сховища. Бінарні файли драйверів FlexVolume мають бути встановлені в попередньо визначеному шляху втулків томів на кожному вузлі, а в деяких випадках і на вузлах панелі управління.

Podʼи взаємодіють із драйверами FlexVolume через вбудований втулок томів `flexVolume`.

Такі [втулки](https://github.com/Microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows) FlexVolume, розгорнуті як сценарії PowerShell на хості, підтримують вузли Windows:

- [SMB](https://github.com/microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows/plugins/microsoft.com~smb.cmd)
- [iSCSI](https://github.com/microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows/plugins/microsoft.com~iscsi.cmd)

{{< note >}}
FlexVolume застарів. Рекомендований спосіб інтеграції зовнішнього сховища з Kubernetes — використовувати зовнішній драйвер CSI.

Супровідники драйвера FlexVolume мають реалізувати драйвер CSI й допомогти користувачам драйверів FlexVolume перейти на CSI. Користувачі FlexVolume мають перевести свої робочі навантаження на еквівалентний драйвер CSI.
{{< /note >}}

## Поширення монтування {#mount-propagation}

{{< caution >}}
Поширення монтування — це низькорівнева можливість, яка не працює однаково на всіх типах томів. Проєкт Kubernetes рекомендує використовувати поширення монтування лише з томами `hostPath` або `emptyDir` у памʼяті. Докладніше дивіться в [issue Kubernetes #95049](https://github.com/kubernetes/kubernetes/issues/95049).
{{< /caution >}}

Поширення монтування дозволяє надавати томи, змонтовані контейнером, іншим контейнерам у тому самому Podʼі або навіть іншим Podʼам на тому самому вузлі.

Поширення монтування тому контролюється полем `mountPropagation` у `containers[*].volumeMounts`. Його значення:

- `None` — Це монтування тому не отримуватиме жодних подальших монтувань, які хост монтує в цей том або будь-яку його підтеку. Так само жодні монтування, створені контейнером, не будуть видимі на хості. Це стандартний режим.

  Цей режим еквівалентний поширенню монтування `rprivate`, як описано в [`mount(8)`](https://man7.org/linux/man-pages/man8/mount.8.html)

  Однак середовище виконання CRI може вибрати поширення монтування `rslave` (тобто `HostToContainer`), коли поширення `rprivate` незастосовне. Відомо, що cri-dockerd (Docker) вибирає поширення монтування `rslave`, коли джерело монтування містить кореневу теку демона Docker (`/var/lib/docker`).

- `HostToContainer` — Це монтування тому отримуватиме всі подальші монтування, які монтуються в цей том або будь-яку його підтеку.

  Іншими словами, якщо хост монтує щось усередині монтування тому, контейнер побачить, що це там змонтовано.

  Так само, якщо будь-який Pod із поширенням монтування `Bidirectional` на той самий том монтує туди щось, контейнер із поширенням монтування `HostToContainer` це побачить.

  Цей режим еквівалентний поширенню монтування `rslave`, як описано в [`mount(8)`](https://man7.org/linux/man-pages/man8/mount.8.html)

- `Bidirectional` — Це монтування тому поводиться так само, як монтування `HostToContainer`. Крім того, усі монтування томів, створені контейнером, поширюватимуться назад на хост і на всі контейнери всіх Podʼів, які використовують той самий том.

  Звичайний випадок використання цього режиму — Pod із драйвером FlexVolume або CSI чи Pod, якому потрібно щось змонтувати на хості за допомогою тому `hostPath`.

  Цей режим еквівалентний поширенню монтування `rshared`, як описано в [`mount(8)`](https://man7.org/linux/man-pages/man8/mount.8.html)

  {{< warning >}}
  Поширення монтування `Bidirectional` може бути небезпечним. Воно може пошкодити операційну систему хоста, тому дозволене лише в привілейованих контейнерах. Наполегливо рекомендується знати поведінку ядра Linux. Крім того, усі монтування томів, створені контейнерами в Podʼах, мають бути знищені (розмонтовані) контейнерами під час завершення роботи.
  {{< /warning >}}

## Монтування лише для читання {#read-only-mounts}

Монтування можна зробити лише для читання, встановивши поле `.spec.containers[*].volumeMounts[*].readOnly` у `true`. Це не робить сам том доступним лише для читання, але конкретний контейнер не зможе записувати в нього. Інші контейнери в Podʼі можуть монтувати той самий том для читання й запису.

У Linux монтування лише для читання стандартно не є рекурсивними. Наприклад, розгляньмо Pod, який монтує `/mnt` хоста як том `hostPath`. Якщо в `/mnt/<SUBMOUNT>` змонтовано для читання й запису іншу файлову систему (таку як tmpfs, NFS або USB-сховище), том, змонтований у контейнері(ах), також матиме `/mnt/<SUBMOUNT>` із можливістю запису, навіть якщо саме монтування вказано як лише для читання.

### Рекурсивні монтування лише для читання {#recursive-read-only-mounts}

{{< feature-state feature_gate_name="RecursiveReadOnlyMounts" >}}

Рекурсивні монтування лише для читання можна ввімкнути, встановивши функціональну можливість [`RecursiveReadOnlyMounts`](/docs/reference/command-line-tools-reference/feature-gates/#RecursiveReadOnlyMounts) для kubelet і kube-apiserver та встановивши поле `.spec.containers[*].volumeMounts[*].recursiveReadOnly` для Podʼа.

Допустимі значення:

- `Disabled` (стандартно): без ефекту.
- `Enabled`: робить монтування рекурсивно лише для читання. Потрібно виконати всі такі вимоги:
  - `readOnly` встановлено в `true`
  - `mountPropagation` не встановлено або встановлено в `None`
  - Хост працює з ядром Linux v5.12 або новіше
  - Середовище виконання контейнерів [рівня CRI](/docs/concepts/architecture/cri) підтримує рекурсивні монтування лише для читання
  - Середовище виконання контейнерів рівня OCI підтримує рекурсивні монтування лише для читання.

  Якщо хоча б одна з цих умов не виконується, монтування завершиться збоєм.

- `IfPossible`: намагається застосувати `Enabled` і повертається до `Disabled`, якщо можливість не підтримується ядром або класом середовища виконання.

Приклад:
{{% code_sample file="storage/rro.yaml" %}}

Коли цю властивість розпізнають kubelet і kube-apiserver, поле `.status.containerStatuses[*].volumeMounts[*].recursiveReadOnly` встановлюється в `Enabled` або `Disabled`.

## Власник файлу {#file-owner}

### Групова власність (GID) {#group-ownership-gid}

Групова власність файлів тому (GID) контролюється полем `spec.securityContext.fsGroup` Podʼа.

Докладні кроки налаштування дивіться в [Налаштування контексту безпеки для Podʼа або контейнера](/docs/tasks/configure-pod-container/security-context/).

### Власність користувача (UID) {#user-ownership-uid}

{{< feature-state feature_gate_name="AtomicWriteVolumeUserFields" >}}

Встановлення функціональної можливості [`AtomicWriteVolumeUserFields`](/docs/reference/command-line-tools-reference/feature-gates/#AtomicWriteVolumeUserFields) вмикає поля власності користувача файлів (UID) томів `configMap`, `secret`, `downwardAPI` та `projected`.

Коли `defaultUser` вказано на рівні тому, він встановлює UID власника для всіх його файлів даних під час створення. На рівні елемента поле `user` контролює UID власника окремого файлу та має перевагу над `defaultUser`.

Приклад:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: volume-user-fields-example
spec:
  containers:
  - name: test
    image: busybox:1.28
    command: ['sh', '-c', 'echo "The app is running!" && tail -f /dev/null']
    volumeMounts:
    - name: volA
      mountPath: /mnt/volA
    - name: volB
      mountPath: /mnt/volB
    - name: volC
      mountPath: /mnt/volC
  volumes:
  - name: volA
    configMap:
      defaultUser: 1000
      name: cm1
      items:
      - key: foo # Owner=defaultUser
        path: foo
      - key: bar # Owner=user
        path: bar
        user: 1001
  - name: volB
    secret: # Owner=defaultUser
      defaultUser: 1000
      secretName: secret1
  - name: volC
    projected:
      sources:
      - secret:
          name: secret2
          items:
          - key: moo # Owner=root
            path: moo
          - key: baa # Owner=user
            path: baa
            user: 1000
```

#### Реалізації {#implementations-rro}

{{% thirdparty-content %}}

Відомо, що такі середовища виконання контейнерів підтримують рекурсивні монтування лише для читання.

Рівень CRI:

- [containerd](https://containerd.io/), починаючи з v2.0
- [CRI-O](https://cri-o.io/), починаючи з v1.30

Рівень OCI:

- [runc](https://runc.io/), починаючи з v1.1
- [crun](https://github.com/containers/crun), починаючи з v1.8.6

## Параметри bind mount {#bind-mount-options}

{{< feature-state feature_gate_name="VolumeBindMountOptions" >}}

Поле `.spec.containers[*].volumeMounts[*].bindMountOptions` дозволяє вам застосовувати повʼязані з безпекою прапорці bind mount Linux до будь-якого монтування тому. Допустимі значення:

- `noexec` — запобігає виконанню бінарних файлів на змонтованому томі
- `nodev` — ігнорує спеціальні файли пристроїв на змонтованому томі
- `nosuid` — ігнорує біти set-user-identifier або set-group-identifier на змонтованому томі

Ці параметри застосовуються для кожного контейнера, тому різні контейнери в одному Podʼі можуть монтувати той самий том із різними параметрами bind mount. Поле не підтримується з [томами образів](#image).

{{< note >}}
Середовище виконання контейнерів (таке як containerd або CRI-O) повинно підтримувати поле `mount_options` у повідомленні CRI `Mount`. Якщо середовище виконання не повідомляє про підтримку, kubelet відхиляє Podʼи, які використовують `bindMountOptions`. Це поле не впливає на вузли Windows.
{{< /note >}}

## {{% heading "whatsnext" %}} {#whats-next}

Ознайомтеся з прикладом [розгортання WordPress і MySQL із постійними томами](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/).
