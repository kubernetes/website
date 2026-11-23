---
title: Типи томів
content_type: reference
weight: 10
---

<!-- overview -->

На цій сторінці описано всі вбудовані типи {{< glossary_tooltip text="томів" term_id="volume" >}}, зокрема застарілі та вилучені.

Щоб дізнатися про {{< glossary_tooltip text="CSI" term_id="csi" >}} і {{< glossary_tooltip text="FlexVolume" term_id="flexvolume" >}}, дивіться [Зовнішні втулки томів](/docs/concepts/storage/volumes/#out-of-tree-volume-plugins).

Докладніше про томи дивіться в розділі [Томи](/docs/concepts/storage/volumes/).

<!-- body -->

## configMap

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

- Контейнер, який використовує ConfigMap як монтування тому [`subPath`](/docs/concepts/storage/volumes/#using-subpath), не отримуватиме оновлень, коли ConfigMap змінюється.

- Текстові дані надаються у вигляді файлів у кодуванні UTF-8. Для інших кодувань символів використовуйте `binaryData`.

{{< /note >}}

## downwardAPI {#downwardapi}

Том `downwardAPI` робить дані {{< glossary_tooltip term_id="downward-api" text="downward API" >}} доступними для застосунків. Докладніше дивіться в розділі [Downward API](/docs/concepts/workloads/pods/downward-api/).

{{< note >}}
Контейнер, який використовує downward API як монтування тому [`subPath`](/docs/concepts/storage/volumes/#using-subpath), не отримує оновлень, коли значення полів змінюються.
{{< /note >}}

## emptyDir {#emptydir}

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
[Перегляньте](/docs/concepts/configuration/manage-resources-containers/#memory-backed-emptydir) моменти, які слід врахувати щодо керування ресурсами під час використання `emptyDir` у памʼяті.
{{< /caution >}}

{{< feature-state feature_gate_name="EmptyDirVolumeMode" >}}

Поле `emptyDir.mode` дозволяє встановити біти дозволів Unix на теці emptyDir, вказавши значення від `0000` до `01777` (у вісімковій системі). Це відповідає тому самому шаблону, що й поле `defaultMode` у томах Secret і ConfigMap. Якщо `mode` не вказано, тека створюється зі стандартними дозволами `0777`.

Встановлення власного режиму корисне, коли ви хочете обмежити доступ лише власником і групою (наприклад, `0750`) або встановити sticky bit на спільній теці, щоб лише власники файлів могли видаляти свої файли (наприклад, `01777`).

{{< note >}}
Якщо `fsGroup` встановлено в контексті безпеки Podʼа, групові дозволи, застосовані `fsGroup`, перевизначають `mode`, вказаний тут. Поле `mode` не впливає на Windows.
{{< /note >}}

### Приклад конфігурації emptyDir {#emptydir-configuration-example}

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

### Приклад конфігурації emptyDir у памʼяті {#emptydir-memory-configuration-example}

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

### emptyDir і зміна розміру Podʼа на місці {#emptydir-and-in-place-pod-resizing}

{{< feature-state feature_gate_name="InPlacePodVerticalScalingMemoryBackedVolumes" >}}

Коли функціональну можливість `InPlacePodVerticalScalingMemoryBackedVolumes` ввімкнено, ви можете динамічно змінювати `sizeLimit` томів `emptyDir` у памʼяті (`medium: Memory`) без перезапуску Podʼа або його контейнерів.

Докладніше дивіться в [Зміна розміру ресурсів CPU та памʼяті, призначених контейнерам](/docs/tasks/configure-pod-container/resize-container-resources/#resizing-memory-backed-emptydir-volumes).

### Приклад конфігурації дозволів emptyDir {#emptydir-permissions-configuration-example}

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

## ephemeral {#ephemeral}

Ефемерний том `ephemeral` — це тимчасовий том, який Kubernetes створює разом із Podʼом і видаляє разом із ним. Докладніше дивіться в розділі [ефемерні томи](/docs/concepts/storage/ephemeral-volumes/#generic-ephemeral-volumes).

## fc (fibre channel) {#fc}

Тип тому `fc` дозволяє монтувати в Pod наявний блоковий том сховища Fibre Channel. Ви можете вказати одне чи кілька цільових всесвітніх імен (world wide names, WWN) за допомогою параметра `targetWWNs` у конфігурації тому. Якщо вказано кілька WWN, targetWWNs очікує, що ці WWN належать до багатошляхових зʼєднань.

{{< note >}}
Ви повинні заздалегідь налаштувати зонування FC SAN, щоб виділити та маскувати ці LUN (томи) для цільових WWN, щоб хости Kubernetes могли отримати до них доступ.
{{< /note >}}

## gitRepo (вимкнено) {#gitrepo}

{{< warning >}}

Kubernetes {{< skew latestVersion >}} *не* містить драйвера томів `gitRepo`. Останньою версією, яка надавала можливість використовувати цей драйвер, була Kubernetes v1.35, а застарілим він став із мінорного випуску [v1.11](/releases/1.11).

Щоб надати Pod зі змонтованим репозиторієм Git, ви можете змонтувати том [`emptyDir`](#emptydir) в [init-контейнер](/docs/concepts/workloads/pods/init-containers/), який клонує репозиторій за допомогою Git, а потім змонтувати [EmptyDir](#emptydir) у контейнер Podʼа.

---

Ви можете обмежити використання томів `gitRepo` у своєму кластері за допомогою [політик](/docs/concepts/policy/), таких як [ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/). Ви можете використати наведений нижче вираз Common Expression Language (CEL) як частину політики, щоб відхиляти використання томів `gitRepo`:

```cel
!has(object.spec.volumes) || !object.spec.volumes.exists(v, has(v.gitRepo))
```

{{< /warning >}}

## hostPath {#hostpath}

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

### Типи томів `hostPath` {#hostpath-volume-types}

Крім обовʼязкової властивості `path`, ви можете за потреби вказати `type` для тому `hostPath`.

Доступні значення для `type`:

<!-- порожній рядок подано за допомогою U+200C ZERO WIDTH NON-JOINER -->

| Значення | Поведінка |
| :--------- | :---------- |
| `‌""` | Порожній рядок (стандартно) призначений для зворотної сумісності й означає, що перед монтуванням тому `hostPath` перевірки не виконуватимуться. |
| `DirectoryOrCreate` | Якщо за вказаним шляхом нічого немає, там за потреби буде створено порожню теку з дозволами 0755, з тією самою групою та власником, що й у kubelet. |
| `Directory` | Тека має існувати за вказаним шляхом. |
| `FileOrCreate` | Якщо за вказаним шляхом нічого немає, там за потреби буде створено порожній файл із дозволами 0644, з тією самою групою та власником, що й у kubelet. |
| `File` | Повинен існувати файл за вказаним шляхом. |
| `Socket` | Має існувати UNIX-сокет за вказаним шляхом. |
| `CharDevice` | *(Лише вузли Linux)* Має існувати символьний пристрій за вказаним шляхом. |
| `BlockDevice` | *(Лише вузли Linux)* Має існувати блоковий пристрій за вказаним шляхом. |

{{< caution >}}
Режим `FileOrCreate` **не** створює батьківську теку файлу. Якщо батьківської теки змонтованого файлу не існує, Podʼу не вдасться запуститися. Щоб забезпечити роботу цього режиму, можна спробувати монтувати теки та файли окремо, як показано в [прикладі `FileOrCreate`](#hostpath-fileorcreate-example) для `hostPath`.
{{< /caution >}}

Деякі файли або теки, створені на базових хостах, можуть бути доступні лише користувачу root. Тоді вам потрібно або запускати процес як root у [привілейованому контейнері](/docs/tasks/configure-pod-container/security-context/), або змінити дозволи файлів на хості, щоб читати з тому `hostPath` або записувати в нього.

### Приклад конфігурації `hostPath` {#hostpath-configuration-example}

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

### Приклад конфігурації `hostPath` для `FileOrCreate` {#hostpath-fileorcreate-example}

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

## image

{{< feature-state feature_gate_name="ImageVolume" >}}

Джерело тому `image` представляє обʼєкт OCI (образ контейнера або артефакт), який доступний на хост-машині kubelet.

Ось приклад використання джерела тому `image`:

{{% code_sample file="pods/image-volumes.yaml" %}}

Том визначається під час запуску Podʼа залежно від значення `pullPolicy`:

`Always`
: kubelet завжди намагається завантажити посилання. Якщо завантаження не вдається, kubelet переводить Pod у стан `Failed`.

`Never`
: kubelet ніколи не завантажує посилання й використовує лише локальний образ або артефакт. Pod переходить у стан `Failed`, якщо будь-які шари образу ще не присутні локально або якщо маніфест цього образу ще не закешовано.

`IfNotPresent`
: kubelet завантажує посилання, якщо його ще немає на диску. Pod переходить у стан `Failed`, якщо посилання немає й завантаження не вдається.

Том визначається повторно, якщо Pod видаляють і створюють заново, тобто новий віддалений вміст стане доступним після повторного створення Podʼа. Збій розвʼязання або завантаження образу під час запуску Podʼа заблокує запуск контейнерів і може додати значну затримку. Спроби після збоїв повторюватимуться за звичайним механізмом backoff для томів, а про збої буде повідомлено в полях reason і message Podʼа.

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

Докладніше про використання цього джерела тому дивіться в прикладі [*Використання тому image з Podʼом*](/docs/tasks/configure-pod-container/image-volumes).

### Статус Podʼа та томи `image` {#image-volume-pod-status}

{{< feature-state feature_gate_name="ImageVolumeWithDigest" >}}

Якщо у вашому кластері ввімкнено функціональну можливість [`ImageVolumeWithDigest`](/docs/reference/command-line-tools-reference/feature-gates/), то щоразу, коли ви вказуєте том `image` для Podʼа, kubelet оновлює статус Podʼа, щоб записати *digest* образу контейнера, який використовується як джерело тому.

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

## iscsi

Том `iscsi` дозволяє монтувати наявний том iSCSI (SCSI через IP) у ваш Pod. На відміну від `emptyDir`, який стирається, коли Pod вилучається, вміст тому `iscsi` зберігається, а том лише розмонтовується. Це означає, що том iSCSI можна попередньо заповнити даними, і ці дані можна спільно використовувати між Podʼами.

{{< note >}}
Вам потрібно мати власний сервер iSCSI, на якому створено том, перш ніж ви зможете його використовувати.
{{< /note >}}

Особливість iSCSI полягає в тому, що його можуть одночасно монтувати кілька споживачів лише для читання. Це означає, що ви можете попередньо заповнити том своїм набором даних, а потім паралельно надавати його зі стількох Podʼів, скільки потрібно. На жаль, томи iSCSI може монтувати лише один споживач у режимі читання й запису. Одночасний запис не дозволений.

## local

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

## nfs

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

## persistentVolumeClaim {#persistentvolumeclaim}

Том `persistentVolumeClaim` використовується для монтування [PersistentVolume](/docs/concepts/storage/persistent-volumes/) у Pod. PersistentVolumeClaims — це спосіб для користувачів «запросити» надійне сховище (наприклад, том iSCSI), не знаючи деталей конкретного хмарного середовища.

Докладніше дивіться в інформації про [PersistentVolumes](/docs/concepts/storage/persistent-volumes/).

## projected

Проєкційний том зіставляє кілька наявних джерел томів з однією текою. Докладніше дивіться [проєкційні томи](/docs/concepts/storage/projected-volumes/).

## secret

Том `secret` використовується для передавання конфіденційної інформації, такої як паролі, у Podʼи. Ви можете зберігати Secrets в API Kubernetes і монтувати їх як файли для використання Podʼами без прямої привʼязки до Kubernetes. Томи `secret` підтримуються tmpfs (файловою системою в оперативній памʼяті), тому вони ніколи не записуються на енергонезалежне сховище.

{{< note >}}

- Ви повинні створити Secret в API Kubernetes, перш ніж ви зможете його використовувати.

- Secret завжди монтується як `readOnly`.

- Контейнер, який використовує Secret як монтування тому [`subPath`](/docs/concepts/storage/volumes/#using-subpath), не отримуватиме оновлень Secret.

{{< /note >}}

Докладніше дивіться [Налаштування Secrets](/docs/concepts/configuration/secret/).

## Вилучені типи томів {#removed-volume-types}

У Kubernetes {{< skew currentVersion >}} немає вбудованих драйверів для наведених нижче типів томів, хоча відповідні поля все ще є в API Podʼа. Для деяких типів усі операції перенаправляються на драйвер {{< glossary_tooltip text="CSI" term_id="csi" >}}.

### awsElasticBlockStore (вилучено) {#awselasticblockstore}

Вбудований драйвер `awsElasticBlockStore` вилучено у Kubernetes v1.27. Kubernetes перенаправляє всі операції для цього типу на драйвер CSI `ebs.csi.aws.com`. Натомість використовуйте [драйвер CSI для AWS EBS](https://github.com/kubernetes-sigs/aws-ebs-csi-driver).

### azureDisk (вилучено) {#azuredisk}

Вбудований драйвер `azureDisk` вилучено у Kubernetes v1.27. Kubernetes перенаправляє всі операції для цього типу на драйвер CSI `disk.csi.azure.com`. Натомість використовуйте [драйвер CSI для Azure Disk](https://github.com/kubernetes-sigs/azuredisk-csi-driver).

### azureFile (вилучено) {#azurefile}

Вбудований драйвер `azureFile` вилучено у Kubernetes v1.30. Kubernetes перенаправляє всі операції для цього типу на драйвер CSI `file.csi.azure.com`. Натомість використовуйте [драйвер CSI для Azure File](https://github.com/kubernetes-sigs/azurefile-csi-driver).

### cephfs (вилучено) {#cephfs}

Вбудований драйвер `cephfs` вилучено у Kubernetes v1.31. Томи `cephfs` більше не працюють. Натомість використовуйте [драйвер CSI для Ceph](https://github.com/ceph/ceph-csi/).

### cinder (вилучено) {#cinder}

Вбудований драйвер `cinder` вилучено у Kubernetes v1.26. Kubernetes перенаправляє всі операції для цього типу на драйвер CSI `cinder.csi.openstack.org`. Натомість використовуйте [драйвер CSI для OpenStack Cinder](https://github.com/kubernetes/cloud-provider-openstack/blob/master/docs/cinder-csi-plugin/using-cinder-csi-plugin.md).

### flocker (вилучено) {#flocker}

Вбудований драйвер `flocker` вилучено у Kubernetes v1.25. Томи `flocker` більше не працюють.

### gcePersistentDisk (вилучено) {#gcepersistentdisk}

Вбудований драйвер `gcePersistentDisk` вилучено у Kubernetes v1.28. Kubernetes перенаправляє всі операції для цього типу на драйвер CSI `pd.csi.storage.gke.io`. Натомість використовуйте [драйвер CSI для Google Compute Engine Persistent Disk](https://github.com/kubernetes-sigs/gcp-compute-persistent-disk-csi-driver).

### glusterfs (вилучено) {#glusterfs}

Вбудований драйвер `glusterfs` вилучено у Kubernetes v1.26. Томи `glusterfs` більше не працюють.

### photonPersistentDisk (вилучено) {#photonpersistentdisk}

Вбудований драйвер `photonPersistentDisk` вилучено у Kubernetes v1.16. Томи `photonPersistentDisk` більше не працюють.

### portworxVolume (вилучено) {#portworxvolume}

Вбудований драйвер `portworxVolume` вилучено у Kubernetes v1.36. Kubernetes перенаправляє всі операції для цього типу на драйвер CSI `pxd.portworx.com`. Натомість використовуйте [драйвер CSI для Portworx](https://docs.portworx.com/portworx-enterprise/operations/operate-kubernetes/storage-operations/csi).

### quobyte (вилучено) {#quobyte}

Вбудований драйвер `quobyte` вилучено у Kubernetes v1.25. Томи `quobyte` більше не працюють. Натомість використовуйте [драйвер CSI для Quobyte](https://github.com/quobyte/quobyte-csi-driver).

### rbd (вилучено) {#rbd}

Вбудований драйвер `rbd` вилучено у Kubernetes v1.31 разом із підтримкою міграції на CSI. Томи `rbd` більше не працюють. Натомість використовуйте [драйвер CSI для Ceph](https://github.com/ceph/ceph-csi/).

### scaleIO (вилучено) {#scaleio}

Вбудований драйвер `scaleIO` вилучено у Kubernetes v1.22. Томи `scaleIO` більше не працюють. ScaleIO тепер називається Dell PowerFlex. Натомість використовуйте [драйвер CSI для PowerFlex](https://github.com/dell/csi-powerflex).

### storageos (вилучено) {#storageos}

Вбудований драйвер `storageos` вилучено у Kubernetes v1.25. Томи `storageos` більше не працюють.

### vsphereVolume (вилучено) {#vspherevolume}

Вбудований драйвер `vsphereVolume` вилучено у Kubernetes v1.30. Kubernetes перенаправляє всі операції для цього типу на драйвер CSI `csi.vsphere.vmware.com`. Натомість використовуйте [драйвер CSI для vSphere](https://github.com/kubernetes-sigs/vsphere-csi-driver).
