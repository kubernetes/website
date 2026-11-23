---
title: Томи
api_metadata:
- apiVersion: ""
  kind: "Volume"
content_type: concept
weight: 10
---

<!-- overview -->

_{{< glossary_tooltip text="Томи" term_id="volume">}}_ Kubernetes дають контейнерам у {{< glossary_tooltip text="Podʼі" term_id="pod" >}} змогу отримувати доступ до даних і обмінюватися ними через файлову систему. Існують різні види томів, які можна використовувати для різних цілей, зокрема:

- заповнення файлу конфігурації на основі {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} або {{< glossary_tooltip text="Secret" term_id="secret" >}}
- надання Podʼу тимчасового робочого простору
- спільне використання файлової системи двома різними контейнерами в одному Podʼі
- спільне використання файлової системи двома різними Podʼами (навіть якщо ці Podʼи працюють на різних вузлах)
- надійне зберігання даних, щоб вони залишалися доступними, навіть якщо Pod перезапускається або замінюється
- передавання конфігураційної інформації застосунку, що працює в контейнері, на основі відомостей про Pod, у якому перебуває контейнер (наприклад, повідомлення {{< glossary_tooltip text="sidecar-контейнеру" term_id="sidecar-container" >}}, у якому просторі імен працює Pod)
- надання доступу лише для читання до даних в іншому образі контейнера

Обмін даними може відбуватися між різними локальними процесами всередині контейнера, або між різними контейнерами, або між Podʼами.

## Чому томи важливі {#why-volumes-are-important}

- **Збереження даних:** Файли на диску в {{< glossary_tooltip text="контейнері" term_id="container">}}  є ефемерними, що створює певні проблеми для нетривіальних застосунків, які працюють у контейнерах. Одна з проблем виникає, коли контейнер аварійно завершує роботу або зупиняється: стан контейнера не зберігається, тому всі файли, створені або змінені протягом життя контейнера, втрачаються. Після аварійного завершення kubelet перезапускає контейнер із чистим станом.

- **Спільне сховище:** Ще одна проблема виникає, коли в `Pod` працює кілька контейнерів, яким потрібно спільно використовувати файли. Налаштувати спільну файлову систему для всіх контейнерів і отримати до неї доступ може бути складно.

Абстракція {{< glossary_tooltip text="тому" term_id="volume" >}} в Kubernetes може допомогти розвʼязати обидві ці проблеми.

Перш ніж дізнатися про  {{< glossary_tooltip text="томи" term_id="volume" >}}, {{< glossary_tooltip text="PersistentVolumes" term_id="persistent-volume" >}} та {{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}}, вам слід прочитати про {{< glossary_tooltip term_id="Pod" text="Podʼи" >}} і переконатися, що ви розумієте, як Kubernetes використовує Podʼи для запуску контейнерів.

<!-- body -->

## Як томи працюють {#how-volumes-work}

Kubernetes підтримує багато типів томів. {{<glossary_tooltip term_id="pod" text="Pod">}} може використовувати будь-яку кількість типів томів одночасно. Типи [ефемерних томів](/docs/concepts/storage/ephemeral-volumes/) мають життєвий цикл, повʼязаний із конкретним Podʼом, а [постійні томи](/docs/concepts/storage/persistent-volumes/) існують довше за будь-який окремий Pod. Коли Pod припиняє існування, Kubernetes знищує ефемерні томи; однак Kubernetes не знищує постійні томи. Для будь-якого виду тому в певному Podʼі дані зберігаються під час перезапусків контейнерів.

По суті, том — це тека, можливо, з деякими даними, доступна контейнерам у Podʼі. Те, як ця тека зʼявляється, який носій її підтримує і який вона має вміст, визначається конкретним типом тому.

Щоб використати том, вкажіть томи, які потрібно надати Podʼу, у `.spec.volumes` і вкажіть, куди монтувати ці томи в контейнерах, у `.spec.containers[*].volumeMounts`.

Коли Pod запускається, процес у контейнері бачить файлову систему, складену з початкового вмісту {{< glossary_tooltip text="образу контейнера" term_id="image" >}} і томів (якщо їх визначено), змонтованих усередині контейнера. Процес бачить кореневу файлову систему, яка спочатку відповідає вмісту образу контейнера. Будь-які записи в цій ієрархії файлової системи, якщо їх дозволено, впливають на те, що процес бачить під час наступного доступу до файлової системи. Томи монтуються за [вказаними шляхами](#using-subpath) у файловій системі контейнера. Для кожного контейнера, визначеного в Podʼі, потрібно окремо вказати, куди монтувати кожен том, який він використовує.

Томи не можуть монтуватися всередині інших томів (але дивіться [Використання subPath](#using-subpath) про споріднений механізм). Також том не може містити жорстке посилання на щось в іншому томі.

## Типи томів {#volume-types}

<a id="types-of-volumes"></a>

Kubernetes підтримує такі типи {{< glossary_tooltip text="томів" term_id="volume" >}}.

<a id="gcepersistentdisk"></a>
<a id="gitrepo"></a>
<a id="portworxvolume"></a>
<a id="portworx-csi-migration"></a>
<a id="awselasticblockstore"></a>
<a id="azuredisk"></a>
<a id="azurefile"></a>
<a id="cephfs"></a>
<a id="cinder"></a>
<a id="glusterfs"></a>
<a id="rbd"></a>
<a id="storageos"></a>
<a id="vspherevolume"></a>
<a id="vsphere-csi-migration"></a>
<a id="flocker"></a>
<a id="quobyte"></a>
<a id="scaleio"></a>
Докладний опис усіх типів, зокрема застарілих і вилучених, наведено в [довіднику типів томів](/docs/reference/storage/volume-types/).

### Томи з життєвим циклом Podʼа {#pod-lifetime-volume-types}

Kubernetes створює ці томи, коли Pod запускається на вузлі, і видаляє їх разом із Podʼом.

Використовувати їх можна лише в Podʼі.

- <a id="configmap"></a>[`configMap`](/docs/reference/storage/volume-types/#configmap): монтує дані з {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} у теку лише для читання.
- <a id="downwardapi"></a>[`downwardAPI`](/docs/reference/storage/volume-types/#downwardapi): надає відомості про Pod, як-от його {{< glossary_tooltip text="мітки" term_id="label" >}}, через {{< glossary_tooltip text="downward API" term_id="downward-api" >}} у теку лише для читання.
- <a id="emptydir"></a>
  <a id="emptydir-configuration-example"></a>
  <a id="emptydir-memory-configuration-example"></a>
  <a id="emptydir-permissions-configuration-example"></a>
  [`emptyDir`](/docs/reference/storage/volume-types/#emptydir): порожній тимчасовий простір, який ініціалізується, коли Pod призначається вузлу, та видаляється разом із Podʼом із цього вузла.
- <a id="image"></a>
  <a id="image-volume-pod-status"></a>
  [`image`](/docs/reference/storage/volume-types/#image): файли з {{< glossary_tooltip text="образу контейнера" term_id="image" >}} або артефакту, змонтовані лише для читання.
- <a id="projected"></a>[`projected`](/docs/reference/storage/volume-types/#projected): обʼєднує кілька джерел, наприклад {{< glossary_tooltip text="Secret" term_id="secret" >}} і {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}, в одній теці.
- <a id="secret"></a>[`secret`](/docs/reference/storage/volume-types/#secret): монтує дані з {{< glossary_tooltip text="Secret" term_id="secret" >}} у теку лише для читання.

### Томи, що посилаються на сховище за розташуванням {#location-volume-types}

Ці томи підʼєднуються до сховища поза Podʼом. Їхні дані зберігаються після видалення Podʼа.

Типи `hostPath`, `nfs`, `iscsi` і `fc` можна використовувати в Podʼі або в {{< glossary_tooltip text="PersistentVolume" term_id="persistent-volume" >}}.

- <a id="fc"></a>[`fc`](/docs/reference/storage/volume-types/#fc): блоковий том Fibre Channel.
- <a id="hostpath"></a>
  <a id="hostpath-volume-types"></a>
  <a id="hostpath-configuration-example"></a>
  <a id="hostpath-fileorcreate-example"></a>
  [`hostPath`](/docs/reference/storage/volume-types/#hostpath): файл або теку із файлової системи вузла.
- <a id="iscsi"></a>[`iscsi`](/docs/reference/storage/volume-types/#iscsi): том iSCSI.
- <a id="local"></a>[`local`](/docs/reference/storage/volume-types/#local): диск, розділ або каталог у файловій системі вузла.
- <a id="nfs"></a>[`nfs`](/docs/reference/storage/volume-types/#nfs): спільний ресурс NFS.

{{< note >}}
Тип `local` можна використовувати лише в PersistentVolume.
{{< /note >}}

### Томи з PersistentVolumeClaim {#persistentvolumeclaim-volume-types}

Ці томи запитують сховище через {{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}}.

Використовувати ці типи можна лише в Podʼі.

- <a id="persistentvolumeclaim"></a>[`persistentVolumeClaim`](/docs/reference/storage/volume-types/#persistentvolumeclaim): надійне сховище, запитане через {{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}}.
- [`ephemeral`](/docs/reference/storage/volume-types/#ephemeral): {{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}}, який Kubernetes створює та видаляє разом із Podʼом.

PersistentVolumeClaim привʼязується до {{< glossary_tooltip text="PersistentVolume" term_id="persistent-volume" >}}, який надає базове сховище. PersistentVolume може використовувати такі сучасні типи, що не належать до застарілих:

Рекомендований тип — `csi`. Він підтримує надання сховища, створення знімків і клонування.

- [`csi`](#csi): сховище від зовнішнього драйвера.
- [`fc`](/docs/reference/storage/volume-types/#fc): блокове сховище Fibre Channel.
- [`hostPath`](/docs/reference/storage/volume-types/#hostpath): шлях на вузлі; натомість використовуйте `local`.
- [`iscsi`](/docs/reference/storage/volume-types/#iscsi): сховище iSCSI (SCSI через IP).
- [`local`](/docs/reference/storage/volume-types/#local): пристрій, змонтований локально на вузлі.
- [`nfs`](/docs/reference/storage/volume-types/#nfs): спільний ресурс NFS.

### Томи зі сторонніх втулків {#out-of-tree-volume-types}

Ці типи використовують {{< glossary_tooltip text="втулки томів" term_id="volume-plugin" >}}, розроблені постачальниками сховищ поза кодовою базою Kubernetes.

Їх можна використовувати в Podʼі або в PersistentVolume.

Докладніше дивіться в розділі [Зовнішні втулки томів](#out-of-tree-volume-plugins).

- [`csi`](#csi): драйвер, який реалізує {{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} (CSI).
- [`flexVolume`](#flexvolume) (застаріло): старіший інтерфейс втулків, що працює на основі exec.

{{< note >}}
У Podʼі тип `csi` працює лише з драйверами, які підтримують ефемерні томи.
{{< /note >}}

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

- через посилання на [PersistentVolumeClaim](/docs/reference/storage/volume-types/#persistentvolumeclaim)
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

Вбудовані втулки, які підтримують `CSIMigration` і мають відповідний реалізований драйвер CSI, перелічено в розділі [Видалені типи томів](/docs/reference/storage/volume-types/#removed-volume-types)

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

Ці параметри застосовуються для кожного контейнера, тому різні контейнери в одному Podʼі можуть монтувати той самий том із різними параметрами bind mount. Поле не підтримується з [томами образів](/docs/reference/storage/volume-types/#image).

{{< note >}}
Середовище виконання контейнерів (таке як containerd або CRI-O) повинно підтримувати поле `mount_options` у повідомленні CRI `Mount`. Якщо середовище виконання не повідомляє про підтримку, kubelet відхиляє Podʼи, які використовують `bindMountOptions`. Це поле не впливає на вузли Windows.
{{< /note >}}

## {{% heading "whatsnext" %}} {#whats-next}

Ознайомтеся з прикладом [розгортання WordPress і MySQL із постійними томами](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/).
