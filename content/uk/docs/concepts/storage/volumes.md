---
title: Томи
api_metadata:
- apiVersion: ""
  kind: "Volume"
content_type: concept
weight: 10
---

<!-- overview -->

_Томи_ Kubernetes надають можливість контейнерам у {{< glossary_tooltip text="podʼах" term_id="pod" >}} отримувати доступ до даних у файловій системі та обмінюватися даними з ними. Існують різні типи томів, які можна використовувати для різних цілей, наприклад

- заповнення файлу конфігурації на основі {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} або {{< glossary_tooltip text="Secret" term_id="secret" >}}
- надання деякого тимчасового простору для зберігання podʼам
- надання спільного доступу до файлової системи двом різним контейнерам у тому самому podʼі
- надання спільного доступу до файлової системи між двома різними podʼами (навіть якщо ці podʼи запущено на різних вузлах)
- довготривале зберігання даних, щоб вони залишалися доступними навіть після перезапуску або заміни Podʼа
- передача інформації про конфігурацію застосунку, що працює у контейнері, на основі даних про Pod, у якому знаходиться контейнер (наприклад, повідомлення {{< glossary_tooltip text="контейнера sidecar" term_id="sidecar-container" >}} про те, у якому просторі імен працює Pod)
- надання доступу лише на читання до даних в іншому образі контейнера

Обмін даними може відбуватися між різними локальними процесами всередині контейнера, або між різними контейнерами, або між Podʼами.

## Чому томи важливі {#why-volumes-are-important}

- **Стійкість даних:** Файли на диску в контейнері є ефемерними, що створює певні проблеми для нетривіальних застосунків під час запуску в контейнерах. Одна з проблем виникає, коли контейнер аварійно завершує роботу або зупиняється, стан контейнера не зберігається, тому всі файли, які були створені або змінені протягом життя контейнера, втрачаються. Під час аварійного завершення роботи kubelet перезапускає контейнер з чистим станом.

- **Спільне сховище:** Ще одна проблема виникає, коли в `Pod` запущено декілька контейнерів, яким потрібно спільно використовувати файли. Налаштування та доступ до спільної файлової системи на всіх контейнерах може бути складним завданням.

Абстракція Kubernetes {{< glossary_tooltip text="volume" term_id="volume" >}} може допомогти вам вирішити обидві ці проблеми.

Перш ніж дізнатися про томи, PersistentVolumes та PersistentVolumeClaims, вам слід прочитати про {{< glossary_tooltip term_id="Pod" text="Podʼи" >}} і переконатися, що ви розумієте, як Kubernetes використовує Podʼи для запуску контейнерів.

<!-- body -->

## Як томи працюють {#how-volumes-work}

Kubernetes підтримує багато типів томів. {{<glossary_tooltip term_id="pod" text="Pod">}} може використовувати одночасно будь-яку кількість типів томів. Тип [ефемерний том](/docs/concepts/storage/ephemeral-volumes/) існує протягом життєвого циклу повʼязаного з ним Podʼа, але [постійні томи](/docs/concepts/storage/persistent-volumes/) існують поза життєвим циклом будь-якого окремого Podʼа. Коли Pod припиняє існування, Kubernetes знищує ефемеральні томи; однак Kubernetes не знищує постійні томи. Для будь-якого виду тому в певному Podʼі дані зберігаються при перезапуску контейнера.

У своєму основному визначенні том — це тека, можливо, з деякими даними в ній, яка доступна контейнерам в Podʼі. Спосіб створення теки, носій, на якому вона зберігається, і її вміст визначаються конкретним типом тома, що використовується.

Щоб використати том, вкажіть томи, які потрібно надати для Podʼа в `.spec.volumes`. і вкажіть, куди монтувати ці томи у контейнери в `.spec.containers[*].volumeMounts`.

Коли pod запускається, процес в контейнері бачить файлову систему, створену з початкового вмісту {{< glossary_tooltip text="образу контейнера" term_id="image" >}}, а також томи (якщо визначено), змонтовані всередині контейнера. Процес бачить кореневу файлову систему, яка спочатку відповідає вмісту образу контейнера. Будь-які записи всередині ієрархії файлової системи, якщо дозволено, впливають на те, що цей процес бачить при виконанні наступного доступу до файлової системи. Томи монтуються за [вказаними шляхами](#using-subpath) всередині файлової системи контейнера. Для кожного контейнера, визначеного в Podʼі, ви повинні незалежно вказати, куди монтувати кожен том, яким користується контейнер.

Томи не можуть монтуватися всередині інших томів (але див. [Використання subPath](#using-subpath) про відповідний механізм). Також том не може містити жорстке посилання на будь-що в іншому томі.

## Типи томів {#volume-types}

Kubernetes підтримує кілька типів томів.

### awsElasticBlockStore (застаріло) {#awselasticblockstore}

<!-- Примітка про обслуговування: Дозволено вилучати всі вказівки про awsElasticBlockStore, якщо випуск v1.27
Kubernetes перестав підтримуватися -->

У Kubernetes {{< skew currentVersion >}}, всі операції з типом `awsElasticBlockStore` будуть перенаправлені на драйвер `ebs.csi.aws.com` {{< glossary_tooltip text="CSI" term_id="csi" >}}.

Вбудований драйвер сховища AWSElasticBlockStore був визнаний застарілим у випуску Kubernetes v1.19 і потім був повністю вилучений у випуску v1.27.

Проєкт Kubernetes рекомендує використовувати сторонній драйвер сховища [AWS EBS](https://github.com/kubernetes-sigs/aws-ebs-csi-driver) замість.

### azureDisk (застаріло) {#azuredisk}

<!-- Примітка про обслуговування: Дозволено вилучати всі вказівки про azureDisk, якщо випуск v1.27
Kubernetes перестав підтримуватися -->

У Kubernetes {{< skew currentVersion >}}, всі операції з типом `azureDisk` будуть перенаправлені на драйвер `disk.csi.azure.com` {{< glossary_tooltip text="CSI" term_id="csi" >}}.

Вбудований драйвер сховища AzureDisk був визнаний застарілим у випуску Kubernetes v1.19 і потім був повністю вилучений у випуску v1.27.

Проєкт Kubernetes рекомендує використовувати сторонній драйвер сховища [Azure Disk](https://github.com/kubernetes-sigs/azuredisk-csi-driver) замість.

### azureFile (застаріло) {#azurefile}

<!-- maintenance note: OK to remove all mention of azureFile once the v1.30 release of Kubernetes has gone out of support -->

У Kubernetes {{< skew currentVersion >}} всі операції для вбудованого типу `azureFile` перенаправляються на драйвер `file.csi.azure.com` {{< glossary_tooltip text="CSI" term_id="csi" >}}.

Вбудований драйвер сховища AzureFile було визнано застарілим у випуску Kubernetes v1.21, а потім повністю вилучено у випуску v1.30.

Проєкт Kubernetes рекомендує замість нього використовувати сторонній драйвер сховища [Azure File](https://github.com/kubernetes-sigs/azurefile-csi-driver).

### cephfs (видалено) {#cephfs}

<!-- примітка для обслуговування: можна видалити всі згадки про cephfs після того, як випуск Kubernetes v1.30 вийде з підтримки -->

Kubernetes {{< skew currentVersion >}} не містить типу тому `cephfs`.

Драйвер вбудованої системи зберігання `cephfs` був визнаний застарілим у випуску Kubernetes v1.28, а потім повністю видалений у випуску v1.31.

### cinder (застаріло) {#cinder}

<!-- Примітка про обслуговування: Дозволено вилучати всі вказівки про cinder, якщо випуск v1.26
Kubernetes перестав підтримуватися -->

У Kubernetes {{< skew currentVersion >}}, всі операції з типом `cinder` будуть перенаправлені на драйвер `cinder.csi.openstack.org` {{< glossary_tooltip text="CSI" term_id="csi" >}}.

Вбудований драйвер сховища Cinder для OpenStack був визнаний застарілим ще у випуску Kubernetes v1.11 і потім був повністю вилучений у випуску v1.26.

Проєкт Kubernetes рекомендує натомість використовувати сторонній драйвер сховища [OpenStack Cinder](https://github.com/kubernetes/cloud-provider-openstack/blob/master/docs/cinder-csi-plugin/using-cinder-csi-plugin.md).

### configMap

[ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) надає спосіб вставити конфігураційні дані у Podʼи. Дані, збережені в ConfigMap, можуть бути використані у томі типу `configMap` і потім використовуватись контейнеризованими застосунками, що працюють у Podʼі.

При посиланні на ConfigMap ви вказуєте імʼя ConfigMap у томі. Ви можете налаштувати шлях для конкретного запису в ConfigMap. Наведена нижче конфігурація показує, як замонтувати ConfigMap з імʼям `log-config` у Pod з імʼям `configmap-pod`:

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

ConfigMap `log-config` змонтовано як том, і весь вміст, збережений у його запису `log_level`, змонтовано в Pod за шляхом `/etc/config/log_level.conf`. Зверніть увагу, що цей шлях отримується з `mountPath` тому та `path` з ключем `log_level`.

{{< note >}}

- Ви повинні [створити ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/#create-a-configmap), перш ніж ви зможете його використовувати.

- ConfigMap завжди монтується як `readOnly`.

- Контейнер, який використовує ConfigMap як том з [`subPath`](#using-subpath) монтування тому, не буде отримувати оновлення при зміні ConfigMap.

- Текстові дані використовуються як файли закодовані у UTF-8. Для інших кодувань символів використовуйте `binaryData`.

{{< /note >}}

### downwardAPI {#downwardapi}

Том `downwardAPI` робить дані {{< glossary_tooltip term_id="downward-api" text="downward API" >}} доступними для застосунків. У межах тому ви можете знайти відкриті дані, експоновані у вигляді файлів у форматі звичайного тексту, доступні для читання.

{{< note >}}
Контейнер, який використовує downward API як монтування тому з [`subPath`](#using-subpath), не отримує оновлень при зміні значень полів.
{{< /note >}}

Дивіться [Передавання інформації про Podʼи контейнерам через файли](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/) для отримання докладнішої інформації.

### emptyDir {#emptydir}

Для Podʼа, який містить том `emptyDir`, том створюється, коли Pod призначається до вузла. Як і зазначено в назві, том `emptyDir` спочатку є порожнім. Всі контейнери в Pod можуть читати та записувати ті самі файли у томі `emptyDir`, хоча цей том може бути змонтований у той самий чи різні шляхи в кожному контейнері. При видаленні Podʼа з вузла з будь-якої причини дані в томі `emptyDir` видаляються назавжди.

{{< note >}}
Крах контейнера _не_ призводить до видалення Podʼа з вузла. Дані в томі `emptyDir` зберігаються при аваріях контейнера.
{{< /note >}}

Деякі використання тому `emptyDir`:

- робочий простір, наприклад, для сортування злиття на основі диска
- контрольна точка для тривалого обчислення для відновлення після аварії
- утримання файлів, якими управляє контейнер вмісту, поки контейнер вебсервер обслуговує дані

Поле `emptyDir.medium` контролює, де зберігаються томи `emptyDir`. Типово томи `emptyDir` зберігаються у томі, який підтримує вузол такому як диск, SSD або мережеве сховище, залежно від вашого середовища. Якщо ви встановите поле `emptyDir.medium` в `"Memory"`, Kubernetes автоматично монтує tmpfs (віртуальна файлова система в памʼяті) замість цього. Хоча tmpfs дуже швидкий, слід памʼятати, що, на відміну від дисків, файли, які ви записуєте, враховуються у ліміті памʼяті контейнера, який їх записав.

Можна вказати обмеження розміру для типового носія, яке обмежує місткість тому `emptyDir`. Простір виділяється з [ефемерного сховища вузла](/docs/concepts/storage/ephemeral-storage/#setting-requests-and-limits-for-local-ephemeral-storage). Якщо він заповнюється з іншого джерела (наприклад, файли логів чи образи), том `emptyDir` може вийти з ладу через це обмеження.

Якщо розмір не вказаний, том, що розмішується в памʼяті, буде обмежений обсягом доступної памʼяті вузла.

{{< caution >}}
Будь ласка, перевірте [тут](/docs/concepts/configuration/manage-resources-containers/#memory-backed-emptydir) пункти, які слід врахувати з точки зору управління ресурсами при використанні `emptyDir`, що зберігаються в памʼяті.
{{< /caution >}}

### Приклад налаштування emptyDir {#emptydir-configuration-example}

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

#### Приклад конфігурації памʼяті emptyDir {#emptydir-memory-configuration-example}

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

### fc (fibre channel) {#fc}

Тип тома `fc` дозволяє монтувати існуючий fibre channel блоковий том для зберігання даних у Pod. Ви можете вказати одне чи кілька імен шляхів цілей (world wide name, WWN) за допомогою параметра `targetWWNs` у конфігурації вашого тому. Якщо вказано кілька WWN, `targetWWNs` очікує, що ці WWN належать до зʼєднань з багатьма шляхами.

{{< note >}}
Ви повинні налаштувати зону FC SAN, щоб виділити та приховати ці LUN (томи) для WWN цілей заздалегідь, щоб хости Kubernetes могли до них отримувати доступ.
{{< /note >}}

### gcePersistentDisk (застаріло) {#gcepersistentdisk}

У Kubernetes {{< skew currentVersion >}}, всі операції з типом `gcePersistentDisk` будуть перенаправлені на драйвер `pd.csi.storage.gke.io` {{< glossary_tooltip text="CSI" term_id="csi" >}}.

Вбудований драйвер сховища `gcePersistentDisk` був визнаний застарілим ще у випуску Kubernetes v1.17 і потім був повністю вилучений у випуску v1.28.

Проєкт Kubernetes рекомендує натомість використовувати сторонній драйвер сховища [Google Compute Engine Persistent Disk CSI](https://github.com/kubernetes-sigs/gcp-compute-persistent-disk-csi-driver).

### gitRepo (застаріло) {#gitrepo}

{{< warning >}}
Втулок тому `gitRepo` застарів і стандартно є вимкненим. Щоб стоврити Pod, що має змонтований репозиторій git, ви можете змонтувати том [EmptyDir](#emptydir), який монтується в [init container](/docs/concepts/workloads/pods/init-containers/), що клонує репозиторій за допомогою git, а потім монтує [EmptyDir](#emptydir) в контейнер Podʼа.

---

Ви можете обмежити використання томів `gitRepo` у вашому кластері, використовуючи [політики](/docs/concepts/policy/), такі як [ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/). Ви можете використовувати наступний вираз мови загальних виразів (Common Expression Language, CEL) як частину політики для відхилення використання томів `gitRepo`: `!has(object.spec.volumes) || !object.spec.volumes.exists(v, has(v.gitRepo))`.

```cel
!has(object.spec.volumes) || !object.spec.volumes.exists(v, has(v.gitRepo))
```

{{< /warning >}}

Ви можете використовувати цей застарілий втулок сховища у своєму кластері, якщо ви явно увімкнете [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `GitRepoVolumeDriver`.

Том `gitRepo` є прикладом втулка тому. Цей втулок монтує порожню теку і клонує репозиторій git у цю теку для використання вашим Podʼом.

Ось приклад тому `gitRepo`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: server
spec:
  containers:
  - image: nginx
    name: nginx
    volumeMounts:
    - mountPath: /mypath
      name: git-volume
  volumes:
  - name: git-volume
    gitRepo:
      repository: "git@somewhere:me/my-git-repository.git"
      revision: "22f1d8406d464b0c0874075539c1f2e96c253775"
```

### glusterfs (вилучено) {#glusterfs}

<!-- Примітка про обслуговування: Дозволено вилучати всі вказівки про glusterfs, якщо випуск v1.25
Kubernetes перестав підтримуватися -->

Тип тому `glusterfs` не включено в Kubernetes {{< skew currentVersion >}}.

Вбудований драйвер сховища GlusterFS був визнаний застарілим ще у випуску Kubernetes v1.25 і потім був повністю вилучений у випуску v1.26.

### hostPath {#hostpath}

Том `hostPath` монтує файл або теку з файлової системи вузла хосту у ваш Pod. Це не є необхідним для більшості Podʼів, але це надає потужний аварійний вихід для деяких застосунків.

{{< warning >}}
Використання типу тому `hostPath` призводить до багатьох ризиків з погляду безпеки. Якщо ви можете уникнути використання тому `hostPath`, то слід це зробити. Наприклад, визначте [`local` PersistentVolume](#local) та використовуйте натомість його.

Якщо ви обмежуєте доступ до конкретних тек на вузлі за допомогою перевірки часу допуску, це обмеження є ефективним лише тоді, коли ви додатково вимагаєте, щоб будь-які монтування тому `hostPath` були **тільки для читання**. Якщо ви дозволяєте монтування тому `hostPath` на читання та запис для ненадійного Podʼа, контейнери в цьому Podʼі можуть порушувати монтування хосту для читання та запису.

---

Будьте обережні при використанні томів `hostPath`, незалежно від того, чи вони монтуються як тільки для читання, чи для читання та запису, оскільки:

- Доступ до файлової системи вузла може викрити привілейовані системні облікові дані (такі як для kubelet) або привілейовані API (такі як сокет середовища виконання контейнера), які можуть бути використані для втечі з контейнера або для атаки інших частин кластера.
- Podʼи з однаковою конфігурацією (такою як створені за допомогою PodTemplate) можуть поводитися по-різному на різних вузлах через різні файли на вузлах.
- Використання тома `hostPath` не розглядається як використання ефемерного сховища. Ви маєте самостійно стежити за використанням диска, оскільки надмірне використання диска `hostPath призведе до тиску на диск на вузлі.
{{< /warning >}}

Деякі використання тому `hostPath`:

- виконання контейнера, який потребує доступу до системних компонентів рівня вузла (такого як контейнер, який передає системні логи до центрального сховища, з доступом до цих логів за допомогою монтування `/var/log` тільки для читання)
- надання конфігураційного файлу, збереженого на хост-системі, доступного тільки для читання для {{< glossary_tooltip text="статичного Podʼа" term_id="static-pod" >}}; на відміну від звичайних Podʼів, статичні Podʼи не можуть отримувати доступ до ConfigMaps.

#### Типи томів `hostPath` {#hostpath-volume-types}

Крім обовʼязкової властивості `path`, ви можете вказати необовʼязковий параметр `type` для тому `hostPath`.

Доступні значення для `type`:

<!-- пустий рядок представляється за допомогою ZERO WIDTH NON-JOINER U+200C -->

| Значення | Поведінка |
|:---------|:----------|
| `‌""` | Порожній рядок (стандартно) призначений для забезпечення сумісності з попередніми версіями, що означає, що перед монтуванням тому `hostPath` не виконуватимуться перевірки. |
| `DirectoryOrCreate` | Якщо нічого не існує за вказаним шляхом, буде створено порожню теку за необхідності з правами на виконання, встановленими на 0755, з тією ж групою і власником, що й Kubelet. |
| `Directory` | Тека має існувати за вказаним шляхом. |
| `FileOrCreate` | Якщо нічого не існує за вказаним шляхом, буде створено порожній файл за необхідності з правами на виконання, встановленими на 0644, з тією ж групою і власником, що й Kubelet. |
| `File` | Повинен існувати файл за вказаним шляхом. |
| `Socket` | Має існувати UNIX-сокет за вказаним шляхом. |
| `CharDevice` | _(Лише вузли Linux)_ Має існувати символьний пристрій за вказаним шляхом. |
| `BlockDevice` | _(Лише вузли Linux)_ Має існувати блочний пристрій за вказаним шляхом. |

{{< caution >}}
Режим `FileOrCreate` **не** створює батьківську теку файлу. Якщо батьківської теки змонтованого файлу не існує, Podʼу не вдасться запуститися. Щоб забезпечити роботу цього режиму, можна спробувати монтувати теки та файли окремо, як показано в [прикладі `FileOrCreate`](#hostpath-fileorcreate-example) для `hostPath`.
{{< /caution >}}

Деякі файли або теки, створені на вузлах, на яких запускається Pod, можуть бути доступні лише користувачу root. В такому випадку вам слід або запускати свій процес як root у [привілейованому контейнері](/docs/tasks/configure-pod-container/security-context/) або змінювати права доступу до файлів на вузлі щоб мати змогу читати (або записувати) у том `hostPath`.

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

У наступному маніфесті визначено Pod, який монтує `/var/local/aaa` всередині єдиного контейнера в Podʼі. Якщо на вузлі не існує шляху `/var/local/aaa`, kubelet створює його як теку і потім монтує його в Pod.

Якщо `/var/local/aaa` вже існує, але не є текою, Pod зазнає невдачі. Крім того, kubelet намагається створити файл із назвою `/var/local/aaa/1.txt` всередині цієї теки (як це бачить хост); якщо щось вже існує за цим шляхом і це не є звичайним файлом, Pod також зазнає невдачі.

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
      # Забезпечте створення теки файлів.
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

Том визначається при запуску Podʼа в залежності від значення `pullPolicy`:

`Always`
: kubelet завжди намагається завантажити посилання. Якщо завантаження не вдається, kubelet встановлює статус Podʼа як `Failed`.

`Never`
: kubelet ніколи не завантажує посилання і використовує лише локальний образ або артефакт. Pod стає `Failed`, якщо будь-які шари образу не присутні локально або якщо маніфест для цього образу не закешований.

`IfNotPresent`
: kubelet завантажує образ, якщо посилання не присутнє на диску. Pod стає `Failed`, якщо посилання не присутнє і завантаження не вдалося.

Том буде перерозподілено, якщо Pod буде видалено і перезавантажено, що означає, що новий віддалений контент стане доступним після відновлення Podʼа. Невдача у визначені або завантаженні образу під час запуску Podʼа заблокує запуск контейнерів і може спричинити значну затримку. Невдалі спроби будуть повторені з використанням звичайного механізму відновлення тому і буде повідомлено в причини та повідомленні Podʼа.

Типи обʼєктів, які можуть бути змонтовані цим томом, визначені реалізацією середовища виконання контейнерів на хост-машині і повинні включати всі дійсні типи, підтримувані полем образу контейнера. Обʼєкт OCI монтується в одну теку (`spec.containers[*].volumeMounts[*].mountPath`) і буде змонтований в режимі тільки для читання.

Крім того:

- [`subPath`](/docs/concepts/storage/volumes/#using-subpath) або [`subPathExpr`](/docs/concepts/storage/volumes/#using-subpath-expanded-environment) монтуються для контейнерів (`spec.containers[*].volumeMounts[*].subPath`, `spec.containers[*].volumeMounts[*].subPathExpr`) видтримуються тільки у Kubernetes v1.33.
- Поле `spec.securityContext.fsGroupChangePolicy` не має жодного ефекту для цього типу тому.
- [Котролер допуску `AlwaysPullImages`](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages) також працює для цього джерела тому, як і для образів контейнерів.

Доступні наступні поля для типу `image`:

`reference`
: Посилання на артефакт, який слід використовувати. Наприклад, ви можете вказати `registry.k8s.io/conformance:v{{< skew currentPatchVersion >}}` для завантаження файлів з образу тестування Kubernetes. Працює так само, як `pod.spec.containers[*].image`. Секрети завантаження образів будуть зібрані так само, як для образу контейнера, шукаючи облікові дані вузла, секрети службового облікового запису завантаження образів та секрети завантаження образів з специфікації Podʼа. Це поле є необовʼязковим, щоб дозволити вищому рівню управління конфігурацією використовувати стандартні або перевизначати образи контейнерів у контролерах навантаження, таких як Deployments і StatefulSets. [Більше інформації про образи контейнерів](/docs/concepts/containers/images).

`pullPolicy`
: Політика завантаження обʼєктів OCI. Можливі значення: `Always`, `Never` або `IfNotPresent`. Стандартно встановлюється `Always`, якщо вказано теґ `:latest`, або `IfNotPresent` в іншому випадку.

Дивіться приклад [_Використання образу тому з Podʼом_](/docs/tasks/configure-pod-container/image-volumes) для більш детальної інформації про те, як використовувати джерело тому.

### iscsi

Обʼєкт `iscsi` дозволяє монтувати наявний том iSCSI (SCSI через IP) у ваш Pod. На відміну від `emptyDir`, який видаляється, коли Pod видаляється, вміст тому `iscsi` зберігається, і том просто розмонтується. Це означає, що том iSCSI можна наперед наповнити даними, і ці дані можна спільно використовувати між Podʼами.

{{< note >}}
Вам потрібно мати власний сервер iSCSI, на якому створено том, перш ніж ви зможете його використовувати.
{{< /note >}}

Особливістю iSCSI є те, що його можна монтувати як тільки для читання одночасно багатьма споживачами. Це означає, що ви можете наперед наповнити том своїми даними та потім надавати їх паралельно зі стількох Podʼів, скільки вам потрібно. На жаль, томи iSCSI можна монтувати тільки одним споживачем у режимі читання-запису. Одночасні операції запису не допускаються.

### local

Обʼєкт `local` представляє собою підключений локальний пристрій зберігання, такий як диск, розділ чи теку.

Локальні томи можна використовувати лише як статично створені PersistentVolume. Динамічне розгортання не підтримується.

Порівняно з томами `hostPath`, томи `local` використовуються довговічніше і мобільніше, без ручного планування подів на вузли. Система обізнана з обмеженнями вузла тому, переглядаючи приналежність вузла до PersistentVolume.

Однак томи `local` є залежать від доступності базового вузла і не підходять для всіх застосунків. Якщо вузол стає несправним, то том `local` стає недоступним для podʼів. Pod, що використовує цей том, не зможе працювати. Застосунки, які використовують томи `local`, повинні бути готові до такого стану зниження доступності, а також потенційної втрати даних, залежно від характеристик стійкості підключеного диска.

У наступному прикладі показано PersistentVolume з використанням тому `local` і `nodeAffinity`:

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

Вам потрібно встановити `nodeAffinity` для PersistentVolume при використанні томів `local`. Планувальник Kubernetes використовує `nodeAffinity` PersistentVolume для планування цих Podʼів на відповідний вузол.

PersistentVolume `volumeMode` може бути встановлено на "Block" (замість станадартного значення "Filesystem") для експонування локального тому як чистого (raw) блокового пристрою.

При використанні локальних томів рекомендується створити StorageClass із встановленим `volumeBindingMode` в `WaitForFirstConsumer`. Докладніше дивіться у прикладі [StorageClass для локальних томів](/docs/concepts/storage/storage-classes/#local). Затримка вибору тому дозволяє переконатися, що рішення щодо привʼязки PersistentVolumeClaim буде оцінено разом із будь-якими іншими обмеженнями вузла, які може мати Pod, такими як вимоги до ресурсів вузла, вибір вузла, спорідненість Podʼа та анти-спорідненість Podʼа.

Можна використовувати зовнішнього статичного постачальника для кращого управління циклом життя локального тому. Зазначте, що цей постачальник не підтримує динамічне постачання. Для прикладу того, як запустити зовнішнього постачальника локального тому, дивіться [посібник користувача постачальника локального тому](https://github.com/kubernetes-sigs/sig-storage-local-static-provisioner).

{{< note >}}
Локальний PersistentVolume вимагає вручного очищення та видалення користувачем, якщо зовнішній статичний постачальник  не використовується для управління циклом життя тому.
{{< /note >}}

### nfs

Обʼєкт `nfs` дозволяє приєднати наявний розділ NFS (Network File System) до Podʼа. На відміну від `emptyDir`, який видаляється, коли Pod видаляється, вміст тому `nfs` зберігається, і том просто відмонтується. Це означає, що том NFS можна попередньо наповнити даними, і ці дані можна спільно використовувати між Podʼами. Том NFS може бути приєднаний одночасно кількома записувачами.

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
Перед його використанням, вам потрібно мати власний сервер NFS, на якому експоновано розділ.

Також враховуйте, що ви не можете вказувати параметри монтування NFS у специфікації Podʼа. Ви можете встановлювати параметри монтування на боці сервера або використовувати [/etc/nfsmount.conf](https://man7.org/linux/man-pages/man5/nfsmount.conf.5.html). Ви також можете монтувати томи NFS через PersistentVolumes, які дозволяють вам встановлювати параметри монтування.
{{< /note >}}

### persistentVolumeClaim {#persistentvolumeclaim}

Обʼєкт `persistentVolumeClaim` використовується для монтування [PersistentVolume](/docs/concepts/storage/persistent-volumes/) в Pod. PersistentVolumeClaim є способом для користувачів "вимагати" надійне сховище (наприклад, том iSCSI) без знання деталей конкретного хмарного середовища.

Дивіться інформацію щодо [PersistentVolumes](/docs/concepts/storage/persistent-volumes/) для отримання додаткових деталей.

### portworxVolume (застаріло) {#portworxvolume}

{{< feature-state for_k8s_version="v1.25" state="deprecated" >}}

Обʼєкт `portworxVolume` — це еластичний рівень блочного сховища, який працює в режимі гіперконвергенції з Kubernetes. [Portworx](https://portworx.com/use-case/kubernetes-storage/) визначає сховище на сервері, розділяє його за можливостями і агрегує місткість на кількох серверах. Portworx працює в гостьовій операційній системі віртуальних машин або на bare metal серверах з ОС Linux.

Обʼєкт `portworxVolume` можна динамічно створити через Kubernetes або його можна попередньо налаштувати та вказати в Podʼі. Тут наведено приклад Podʼа, який посилається на попередньо налаштований том Portworx:

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
Переконайтеся, що існує том Portworx з іменем `pxvol`, перш ніж використовувати його в Podʼі.
{{< /note >}}

#### Міграція на Portworx CSI {#portworx-csi-migration}

{{< feature-state feature_gate_name="CSIMigrationPortworx" >}}

У Kubernetes {{% skew currentVersion %}} всі операції для внутрішніх томів Portworx стандартно перенаправляються на драйвер Container Storage Interface (CSI) `pxd.portworx.com`. [Portworx CSI Driver](https://docs.portworx.com/portworx-enterprise/operations/operate-kubernetes/storage-operations/csi) повинен бути встановлений в кластері.

### projected

Том projected підʼєднує кілька існуючих джерел томів в одну теку. Докладніше дивіться [projected томи](/docs/concepts/storage/projected-volumes/).

### rbd (вилучено) {#rbd}

<!-- maintenance note: OK to remove all mention of rbd once the v1.30 release of
Kubernetes has gone out of support -->

Kubernetes {{< skew currentVersion >}} не включає тип тому `rbd`.

[Драйвер зберігання Rados Block Device](https://docs.ceph.com/en/latest/rbd/) (RBD) і підтримка його міграції CSI були визнані застарілими у випуску Kubernetes v1.28 і повністю видалені в випуску v1.31.

### secret

Том `secret` використовується для передачі конфіденційної інформації, такої як паролі, у Podʼи. Ви можете зберігати секрети в API Kubernetes і монтувати їх як файли для використання Podʼами без привʼязки безпосередньо до Kubernetes. Томи `secret` підтримуються tmpfs (файлова система, яка знаходиться в оперативній памʼяті), тому їх ніколи не записують на постіний носій.

{{< note >}}

- Ви повинні створити Secret в API Kubernetes, перш ніж ви зможете його використовувати.

- Секрет завжди монтується як `readOnly`.

- Контейнер, який використовує Secret як том [`subPath`](#using-subpath), не отримує оновлення Secret.

{{< /note >}}

Для отримання додаткової інформації дивіться [Налаштування Secret](/docs/concepts/configuration/secret/).

### vsphereVolume (застаріло) {#vspherevolume}

<!-- maintenance note: OK to remove all mention of vsphereVolume once the v1.30 release of Kubernetes has gone out of support -->

У Kubernetes {{< skew currentVersion >}}, всі операції для типу `vsphereVolume`, що використовується в інтегрованому стеку, перенаправляються на драйвер `csi.vsphere.vmware.com` {{< glossary_tooltip text="CSI" term_id="csi" >}}.

Драйвер сховища `vsphereVolume` був визнаний застарілим у випуску Kubernetes v1.19, а потім повністю видалений у випуску v1.30.

Проєкт Kubernetes пропонує замість цього використовувати драйвер сховища сторонніх розробників [vSphere CSI](https://github.com/kubernetes-sigs/vsphere-csi-driver).

## Використання subPath {#using-subpath}

Іноді корисно ділити один том для кількох цілей у одному Podʼі. Властивість `volumeMounts[*].subPath` вказує підшлях всередині посилання на том, а не його корінь.

У наступному прикладі показано, як налаштувати Pod із стеком LAMP (Linux Apache MySQL PHP) за допомогою одного загального тому. Ця конфігурація `subPath` у прикладі не рекомендується для використання в операційному середовищі.

Код та ресурси PHP-застосунку відображаються на томі у теці `html`, а база даних MySQL зберігається у теці `mysql` на цьому томі. Наприклад:

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

Використовуйте поле `subPathExpr` для створення імен тек `subPath` із змінних середовища downward API. Властивості `subPath` та `subPathExpr` є взаємовиключними.

У цьому прикладі `Pod` використовує `subPathExpr` для створення теки `pod1` всередині тома `hostPath` `/var/log/pods`. Том `hostPath` отримує імʼя `Pod` із `downwardAPI`. Тека хоста `/var/log/pods/pod1` монтується у `/logs` в контейнері.

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

Носій інформації (напрриклад, Disk чи SSD) тома `emptyDir` визначається середовищем файлової системи, яке утримує коренева тека kubelet (зазвичай `/var/lib/kubelet`). Немає обмежень щодо того, скільки місця може використовувати том `emptyDir` чи `hostPath`, і відсутня ізоляція між контейнерами чи між Podʼами.

Щоб дізнатися про те, як запросити місце за допомогою специфікації ресурсів, дивіться [як управляти ресурсами](/docs/concepts/configuration/manage-resources-containers/).

## Сторонні втулки томів {#out-of-tree-volume-plugins}

До стороннії втулків томів включають {{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} (CSI), а також FlexVolume (який є застарілим). Ці втулки дозволяють виробникам засобів для зберігання створювати власні зовнішні втулки томів без додавання їх вихідного коду до репозиторію Kubernetes.

Раніше всі втулки томів були "вбудованими". "Вбудовані" втулки збиралися, звʼязувалися, компілювалися і входили до базових бінарних файлів Kubernetes. Це означало, що для додавання нової системи зберігання до Kubernetes (втулка тому) потрібно було додавати код у основний репозиторій коду Kubernetes.

Як CSI, так і FlexVolume дозволяють розробляти втулки томів незалежно від кодової бази Kubernetes і встановлювати їх (інсталювати) у кластерах Kubernetes як розширення.

Для виробників засобів для зберігання, які прагнуть створити зовнішній втулок тома, будь ласка, звертайтеся до [Поширених питань щодо втулків томів](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md).

### csi

[Інтерфейс зберігання контейнерів (Container Storage Interface)](https://github.com/container-storage-interface/spec/blob/master/spec.md) (CSI) визначає стандартний інтерфейс для систем оркестрування контейнерів (таких як Kubernetes), щоб вони могли надавати доступ до різних систем зберігання своїм робочим навантаженням контейнерів.

Будь ласка, прочитайте [пропозицію щодо дизайну CSI](https://git.k8s.io/design-proposals-archive/storage/container-storage-interface.md) для отримання додаткової інформації.

{{< note >}}
Підтримка версій специфікації CSI 0.2 та 0.3 є застарілою в Kubernetes v1.13 і буде видалена у майбутньому релізі.
{{< /note >}}

{{< note >}}
Драйвери CSI можуть бути несумісними у всіх версіях Kubernetes. Перевірте документацію конкретного драйвера CSI для підтримуваних кроків розгортання для кожного релізу Kubernetes та матриці сумісності.
{{< /note >}}

Після розгортання сумісного з CSI драйвера тому у кластері Kubernetes, користувачі можуть використовувати тип тома `csi`, щоб долучати чи монтувати томи, які надаються драйвером CSI.

Том `csi` можна використовувати в Pod трьома різними способами:

- через посилання на [PersistentVolumeClaim](#persistentvolumeclaim)
- з [загальним ефемерним томом](/docs/concepts/storage/ephemeral-volumes/#generic-ephemeral-volumes)
- з [CSI ефемерним томом](/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volumes), якщо драйвер підтримує це

Для налаштування постійного тому CSI адміністраторам доступні такі поля:

- `driver`: Рядкове значення, яке вказує імʼя драйвера тома, яке треба використовувати. Це значення повинно відповідати значенню, що повертається відповіддю `GetPluginInfoResponse` драйвера CSI, як це визначено в [специфікації CSI](https://github.com/container-storage-interface/spec/blob/master/spec.md#getplugininfo). Воно використовується Kubernetes для ідентифікації того, який драйвер CSI слід викликати, і драйверами CSI для ідентифікації того, які обʼєкти PV належать драйверу CSI.
- `volumeHandle`: Рядкове значення, яке унікально ідентифікує том. Це значення повинно відповідати значенню, що повертається в полі `volume.id` відповіддю `CreateVolumeResponse` драйвера CSI, як це визначено в [специфікації CSI](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume). Значення передається як `volume_id` у всі виклики драйвера тома CSI при посиланні на том.
- `readOnly`: Необовʼязкове булеве значення, яке вказує, чи повинен бути том "ControllerPublished" (приєднаний) як тільки для читання. Станадртно — false. Це значення передається драйверу CSI через поле `readonly` у `ControllerPublishVolumeRequest`.
- `fsType`: Якщо `VolumeMode` PV — `Filesystem`, тоді це поле може бути використано для вказівки файлової системи, яку слід використовувати для монтування тому. Якщо том не був відформатований і підтримується форматування, це значення буде використано для форматування тому. Це значення передається драйверу CSI через поле `VolumeCapability` у
  `ControllerPublishVolumeRequest`, `NodeStageVolumeRequest` та `NodePublishVolumeRequest`.
- `volumeAttributes`: Масив зі строк, що вказує статичні властивості тому. Цей масив має відповідати масиву, що повертається в полі `volume.attributes` відповіддю `CreateVolumeResponse` драйвера CSI, як це визначено в [специфікації CSI](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume). Масив передається драйверу CSI через поле `volume_context` у `ControllerPublishVolumeRequest`, `NodeStageVolumeRequest` та
  `NodePublishVolumeRequest`.
- `controllerPublishSecretRef`: Посилання на обʼєкт secret, який містить конфіденційну інформацію для передачі драйверу CSI для завершення викликів `ControllerPublishVolume` та `ControllerUnpublishVolume` CSI. Це поле є необовʼязковим і може бути порожнім, якщо не потрібно жодного secretʼу. Якщо Secret містить більше одного secret, передаються всі secretʼи.
- `nodeExpandSecretRef`: Посилання на secret, який містить конфіденційну інформацію для передачі драйверу CSI для завершення виклику `NodeExpandVolume`. Це поле є необовʼязковим і може бути порожнім, якщо не потрібен жоден secret. Якщо обʼєкт містить більше одного secret, передаються всі secretʼи. Коли ви налаштовуєте конфіденційні дані secret для розширення тому, kubelet передає ці дані через виклик `NodeExpandVolume()` драйверу CSI. Усі підтримувані версії Kubernetes пропонують поле `nodeExpandSecretRef` і мають його стандартно доступним. Випуски Kubernetes до v1.25 не включали цю підтримку.
- Увімкніть [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) з назвою `CSINodeExpandSecret` для кожного kube-apiserver та для kubelet на кожному вузлі. З версії Kubernetes 1.27 цю функцію типово ввімкнено і не потрібно явно використовувати функціональну можливість. Також вам потрібно використовувати драйвер CSI, який підтримує або вимагає конфіденційні дані secret під час операцій зміни розміру зберігання, ініційованих вузлом.
- `nodePublishSecretRef`: Посилання на обʼєкт secret, який містить конфіденційну інформацію для передачі драйверу CSI для завершення виклику `NodePublishVolume`. Це поле є необовʼязковим і може бути порожнім, якщо не потрібен жоден secret. Якщо обʼєкт secret містить більше одного secret, передаються всі secretʼи.
- `nodeStageSecretRef`: Посилання на обʼєкт secret, який містить конфіденційну інформацію для передачі драйверу CSI для завершення виклику `NodeStageVolume`. Це поле є необовʼязковим і може бути порожнім, якщо не потрібен жоден secret. Якщо Secret містить більше одного secret, передаються всі secretʼи.

#### Підтримка CSI для блочних томів {#csi-raw-block-volume-support}

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

Постачальники зовнішніх драйверів CSI можуть реалізувати підтримку блочних томів безпосередньо в робочих навантаженнях Kubernetes.

Ви можете налаштувати ваш [PersistentVolume/PersistentVolumeClaim із підтримкою блочних томів](/docs/concepts/storage/persistent-volumes/#raw-block-volume-support) як зазвичай, без будь-яких конкретних змін CSI.

#### Ефемерні томи CSI {#csi-ephemeral-volumes}

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

Ви можете безпосередньо налаштувати томи CSI в межах специфікації Pod. Такі томи є ефемерними і не зберігаються після перезапуску Podʼів. Див. [Ефемерні томи](/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volumes) для отримання додаткової інформації.

Для отримання додаткової інформації про те, як розробити драйвер CSI, див. [документацію kubernetes-csi](https://kubernetes-csi.github.io/docs/)

#### Проксі CSI для Windows {#windows-csi-proxy}

{{< feature-state for_k8s_version="v1.22" state="stable" >}}

Драйвери вузла CSI повинні виконувати різні привілейовані операції, такі як сканування пристроїв диска та монтування файлових систем. Ці операції відрізняються для кожної операційної системи хоста. Для робочих вузлів Linux, контейнеризовані вузли CSI зазвичай розгортуто як привілейовані контейнери. Для робочих вузлів Windows, підтримка привілеїрованих операцій для контейнеризованих вузлів CSI підтримується за допомогою [csi-proxy](https://github.com/kubernetes-csi/csi-proxy), бінарного файлц, що розробляється спільнотою, який повинен бути встановлений на кожному вузлі Windows.

Докладніше див. в посібнику з розгортання втулку CSI, який ви хочете розгортати.

#### Міграція на драйвери CSI з вбудованих втулків {#migrating-to-CSI-drivers-from-in-tree-plugins}

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

Функція `CSIMigration` направляє операції щодо існуючих вбудованих втулків до відповідних втулків CSI (які очікується, що вони будуть встановлені та налаштовані). Внаслідок цього операторам не потрібно робити жодних змін конфігурації існуючих класів сховища, PersistentVolumes або PersistentVolumeClaims (які посилаються на вбудовані втулки) при переході до драйвера CSI, який заміщає вбудований втулок.

{{< note >}}
Існуючі постійні томи (PV), створені вбудованим втулком томів, можна продовжувати використовувати у майбутньому без будь-яких змін конфігурації, навіть після завершення міграції до драйвера CSI для цього типу тома і навіть після оновлення до версії Kubernetes, у якій вже немає вбудованої підтримки для цього типу сховища.

Для здійснення цієї міграції вам або іншому адміністратору кластера **необхідно** встановити та налаштувати відповідний драйвер CSI для цього типу сховища. Основна частина Kubernetes не встановлює це програмне забезпечення за вас.

---

Після завершення цієї міграції ви також можете визначати нові заявки на постійні томи (PVC) та постійні томи (PV), які посилаються на старі, вбудовані інтеграції сховищ. Забезпечивши встановлення та налаштування відповідного драйвера CSI, створення постійних томів продовжує працювати, навіть для зовсім нових томів. Фактичне управління сховищем тепер відбувається через драйвер CSI.
{{< /note >}}

Підтримувані операції та функції включають: створення/видалення, приєднання/відʼєднання, монтування/розмонтовування та зміна розміру томів.

Вбудовані втулки, які підтримують `CSIMigration` і мають відповідний реалізований драйвер CSI перераховуються в [Типи томів](#volume-types).

### flexVolume (застаріло) {#flexvolume}

{{< feature-state for_k8s_version="v1.23" state="deprecated" >}}

FlexVolume — це інтерфейс зовнішнього втулка, який використовує модель на основі викликів exec для взаємодії із засобами сховища. Виконувані файли драйверів FlexVolume повинні бути встановлені в попередньо визначений шлях для втулків томів на кожному вузлі і, в деяких випадках, на вузлах панелі управління.

Podʼи взаємодіють із драйверами FlexVolume через вбудований втулок тому `flexVolume`.

Наступні [втулки FlexVolume](https://github.com/Microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows), розгорнуті як сценарії PowerShell на хості, підтримують вузли Windows:

- [SMB](https://github.com/microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows/plugins/microsoft.com~smb.cmd)
- [iSCSI](https://github.com/microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows/plugins/microsoft.com~iscsi.cmd)

{{< note >}}
FlexVolume застарів. Рекомендований спосіб інтеграції зовнішнього сховища з Kubernetes — використовувати сторонній драйвер CSI.

Розробники драйвера FlexVolume повинні реалізувати драйвер CSI та допомагати переходити користувачам драйверів FlexVolume на CSI. Користувачі FlexVolume повинні переміщати свої робочі навантаження на еквівалентний драйвер CSI.
{{< /note >}}

## Поширення монтування {#mount-propagation}

{{< caution >}}
Поширення монтування є низькорівневою функцією, яка не працює послідовно на всіх типах томів. Рекомендується використовувати її тільки з томами типу `hostPath` або з томами `emptyDir`, що розміщені в памʼяті. Більше деталей можна знайти в [тікеті #95049](https://github.com/kubernetes/kubernetes/issues/95049).
{{< /caution >}}

Поширення монтування дозволяє надавати доступ до томів, змонтованих контейнером, іншим контейнерам у тому ж Podʼі або навіть іншим Podʼам на тому самому вузлі.

Поширення монтування тому керується полем `mountPropagation` в `containers[*].volumeMounts`. Його значення такі:

- `None` — Це монтування тома не отримає жодних подальших монтувань, які монтуються на цей том або будь-які його вкладені теки хостом. Також ніякі монтування, створені контейнером, не будуть видимими на хості. Це стандартний режим.

  Цей режим еквівалентний поширенню монтування `rprivate`, як описано в [`mount(8)`](https://man7.org/linux/man-pages/man8/mount.8.html)

  Однак CRI runtime може вибрати поширення монтування `rslave` (тобто, `HostToContainer`), коли поширення `rprivate` не може бути використано. Відомо, що cri-dockerd (Docker) обирає поширення монтування `rslave`, коли джерело монтування містить кореневу теку демона Docker (`/var/lib/docker`).

- `HostToContainer` — Це монтування тома отримає всі подальші монтування, які монтуються у цей том або будь-які його вкладені теки.

  Іншими словами, якщо хост монтує будь-що всередині тома, контейнер побачить, що щось змонтовано там.

  Також, якщо будь-який Pod із поширенням монтування `Bidirectional` на той же том монтує будь-що там, контейнер із монтуванням `HostToContainer` буде це бачити.

  Цей режим еквівалентний поширенню монтування `rslave`, як описано в [`mount(8)`](https://man7.org/linux/man-pages/man8/mount.8.html)

- `Bidirectional` — Це монтування тома веде себе так само, як монтування `HostToContainer`. Крім того, всі монтування тома, створені контейнером, будуть поширені назад на хост і на всі контейнери всіх Podʼів, які використовують той самий том.

  Типовим використанням для цього режиму є Pod із драйвером FlexVolume або CSI або Pod, який повинен щось змонтувати на хості за допомогою тома типу `hostPath`.

  Цей режим еквівалентний поширенню монтування `rshared`, як описано в [`mount(8)`](https://man7.org/linux/man-pages/man8/mount.8.html)

  {{< warning >}}
  Поширення монтування `Bidirectional` може бути небезпечним. Воно може пошкодити операційну систему хоста і тому дозволяється тільки в привілейованих контейнерах. Рекомендується ретельне знайомство з поведінкою ядра Linux. Крім того, всі монтування томів, створені контейнерами в Podʼах, повинні бути знищені (розмонтовані) контейнерами під час їх завершення.
  {{< /warning >}}

## Монтування тільки для читання {#read-only-mounts}

Монтування може бути зроблено тільки для читання, встановленням у поле `.spec.containers[*].volumeMounts[*].readOnly` значення `true`. Це не робить том сам по собі тільки для читання, але конкретний контейнер не зможе записувати в нього. Інші контейнери в Podʼі можуть монтувати той самий том з правами читання-запису.

У Linux, монтування тільки для читання стандартно не є рекурсивними. Наприклад, розгляньте Pod, який монтує `/mnt` хостів як том `hostPath`. Якщо існує інша файлова система, яка монтується для читання-запису на `/mnt/<SUBMOUNT>` (така як tmpfs, NFS або USB-сховище), то том, змонтований у контейнерах, також буде мати запис для `/mnt/<SUBMOUNT>`, навіть якщо монтування само було вказано як тільки для читання.

### Рекурсивне монтування тільки для читання {#recursive-read-only-mounts}

{{< feature-state feature_gate_name="RecursiveReadOnlyMounts" >}}

Рекурсивне монтування тільки для читання може бути увімкнено встановленням [функціональної можливості](/docs/reference/command-line-tools-reference/feature-gates/) `RecursiveReadOnlyMounts` для kubelet та kube-apiserver, і встановленням поля `.spec.containers[*].volumeMounts[*].recursiveReadOnly` для Podʼа.

Допустимі значення:

- `Disabled` (стандартно): без ефекту.
- `Enabled`: робить монтування рекурсивно тільки для читання. Потрібно задовольнити всі наступні вимоги:
  - `readOnly` встановлено на `true`
  - `mountPropagation` не встановлено або встановлено на `None`
  - Хост працює з ядром Linux v5.12 або новіше
  - Середовище виконання контейнерів рівня [CRI](/docs/concepts/architecture/cri) підтримує рекурсивне монтування тільки для читання
  - Середовище виконання контейнерів рівня OCI підтримує рекурсивне монтування тільки для читання. Це не спрацює якщо хоча б одна з цих умов не виконується.
- `IfPossible`: намагається застосувати `Enabled` і повертається до `Disabled`, якщо функція не підтримується ядром або класом середовища виконання.

Приклад:
{{% code_sample file="storage/rro.yaml" %}}

Коли ця властивість розпізнається kubelet та kube-apiserver, поле `.status.containerStatuses[*].volumeMounts[*].recursiveReadOnly` буде встановлено на `Enabled` або `Disabled`.

#### Реалізації {#implementations-rro}

{{% thirdparty-content %}}

Відомо, що наступні середовища виконання контейнерів підтримують рекурсивне монтування тільки для читання.

Рівень CRI:

- [containerd](https://containerd.io/), починаючи з v2.0
- [CRI-O](https://cri-o.io/), починаючи з v1.30

Рівень OCI:

- [runc](https://runc.io/), починаючи з v1.1
- [crun](https://github.com/containers/crun), починаючи з v1.8.6

## {{% heading "whatsnext" %}}

Ознайомтесь з прикладом [розгортання WordPress та MySQL з Persistent Volume](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/).
