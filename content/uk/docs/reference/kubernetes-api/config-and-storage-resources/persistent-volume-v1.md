---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "PersistentVolume"
content_type: "api_reference"
description: "PersistentVolume (PV) — це ресурс зберігання, який впроваджується адміністратором."
title: "PersistentVolume"
weight: 7
auto_generated: false
---

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## PersistentVolume {#PersistentVolume}

PersistentVolume (PV) — це ресурс зберігання, який впроваджується адміністратором. Він є аналогом ресурсу Node. Докладніше: [https://kubernetes.io/docs/concepts/storage/persistent-volumes](/docs/concepts/storage/persistent-volumes).

---

- **apiVersion**: v1

- **kind**: PersistentVolume

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolumeSpec" >}}">PersistentVolumeSpec</a>)

  spec визначає специфікацію постійного тому, що належить кластеру. Впроваджується адміністратором. Докладніше: [https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistent-volumes](/docs/concepts/storage/persistent-volumes#persistent-volumes)

- **status** (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolumeStatus" >}}">PersistentVolumeStatus</a>)

  status представляє поточну інформацію/статус для постійного тому. Заповнюється системою. Лише для читання. Докладніше: [https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistent-volumes](/docs/concepts/storage/persistent-volumes#persistent-volumes)

## PersistentVolumeSpec {#PersistentVolumeSpec}

PersistentVolumeSpec — це специфікація постійного тому.

---

- **accessModes** ([]string)

  *Atomic: буде замінено під час злиття*

  accessModes містить всі способи, якими том може бути змонтований. Докладніше: [https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes](/docs/concepts/storage/persistent-volumes#access-modes)

- **capacity** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  capacity — це опис ресурсів та місткості постійного тому. Докладніше: [https://kubernetes.io/docs/concepts/storage/persistent-volumes#capacity](/docs/concepts/storage/persistent-volumes#capacity)

- **claimRef** (<a href="{{< ref "../common-definitions/object-reference#ObjectReference" >}}">ObjectReference</a>)

  claimRef є частиною двостороннього звʼязування між PersistentVolume та PersistentVolumeClaim. Очікується, що він буде ненульовим при звʼязуванні. claim.VolumeName є офіційним звʼязуванням між PV та PVC. Докладніше: [https://kubernetes.io/docs/concepts/storage/persistent-volumes#binding](/docs/concepts/storage/persistent-volumes#binding)

- **mountOptions** ([]string)

  *Atomic: буде замінено під час злиття*

  mountOptions — це список опцій монтування, наприклад ["ro", "soft"]. Не перевіряється — монтування просто завершиться з помилкою, якщо одна з опцій недійсна. Докладніше: [https://kubernetes.io/docs/concepts/storage/persistent-volumes/#mount-options](/docs/concepts/storage/persistent-volumes#mount-options)

- **nodeAffinity** (VolumeNodeAffinity)

  nodeAffinity визначає обмеження, які обмежують доступ до цього тому з певних вузлів. Це поле впливає на планування Podʼів, які використовують цей том. Це поле є змінним, якщо увімкнено функціональну можливість MutablePVNodeAffinity.

  <a name="VolumeNodeAffinity"></a>
  *VolumeNodeAffinity визначає обмеження, які обмежують доступ до цього тому з певних вузлів.*

  - **nodeAffinity.required** (NodeSelector)

    обовʼязково визначає жорсткі обмеження на вузли, які повинні бути виконані.

    <a name="NodeSelector"></a>
    *Селектор вузлів представляє обʼєднання результатів одного або кількох запитів по мітках у наборі вузлів; тобто, він представляє операцію АБО для селекторів, представлених термінами селектора вузлів.*

    - **nodeAffinity.required.nodeSelectorTerms** ([]NodeSelectorTerm), обовʼязково

      *Atomic: буде замінено під час злиття*

      Обовʼязково. Список термінів селектора вузлів. Терміни обʼєднуються операцією OR.

      <a name="NodeSelectorTerm"></a>
      *Null або порожній термін селектора вузла не відповідає жодному об'єкту. Вимоги до них складаються за принципом AND. Тип TopologySelectorTerm реалізує підмножину NodeSelectorTerm.*

      - **nodeAffinity.required.nodeSelectorTerms.matchExpressions** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

        *Atomic: буде замінено під час злиття*

        Список вимог селектора вузлів за мітками вузлів.

      - **nodeAffinity.required.nodeSelectorTerms.matchFields** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

        *Atomic: буде замінено під час злиття*

        Список вимог селектора вузлів за полями вузлів.

- **persistentVolumeReclaimPolicy** (string)

  persistentVolumeReclaimPolicy визначає, що відбувається з постійним томом після його звільнення від заявки. Валідні варіанти: Retain (стандартно для створених вручну PersistentVolumes), Delete (стандартно для динамічно наданих PersistentVolumes) та Recycle (застаріле). Recycle повинен підтримуватися втулком тому, що забезпечує роботу цього PersistentVolume. Докладніше: [https://kubernetes.io/docs/concepts/storage/persistent-volumes#reclaiming](/docs/concepts/storage/persistent-volumes#reclaiming)

  Можливі значення переліку (enum):
  - `"Delete"` означає, що том буде видалено з Kubernetes після звільнення його заявки. Втулок тому повинен підтримувати видалення.
  - `"Recycle"` означає, що том буде повернений до пулу незвʼязаних постійних томів після звільнення від його вимоги. Втулок тому повинен підтримувати Recycling.
  - `"Retain"` означає, що том залишиться в поточній фазі (Released) для ручного відновлення адміністратором. Стандартна політика — Retain.

- **storageClassName** (string)

  storageClassName — це назва StorageClass, до якого належить цей постійний том. Порожнє значення означає, що цей том не належить жодному StorageClass.

- **volumeAttributesClassName** (string)

  Імʼя VolumeAttributesClass, до якого належить цей постійний том. Порожнє значення не допускається. Якщо це поле не встановлено, це означає, що цей том не належить до жодного VolumeAttributesClass. Це поле змінюване і може бути змінене драйвером CSI після успішного оновлення тому до нового класу. Для непривʼязаного PersistentVolume значення `volumeAttributesClassName` буде зіставлено з непривʼязаними PersistentVolumeClaim під час процесу привʼязування.

- **volumeMode** (string)

  volumeMode визначає, чи призначений том для використання з форматованою файловою системою або залишатиметься в необробленому блочному стані. Значення Filesystem мається на увазі, якщо не включено в специфікацію.

  Можливі значення переліку (enum):
  - `"Block"` означає, що том не буде відформатований та не міститиме файлову систему, а залишиться необробленим блоковим пристроєм.
  - `"Filesystem"` означає, що том буде або вже відформатований та містить файлову систему.

### Local {#Local}

- **hostPath** (HostPathVolumeSource)

  hostPath представляє теку на хості. Надається розробником або тестувальником. Це корисно лише для одновузлової розробки та тестування! Зберігання на хості жодним чином не підтримується та НЕ ПРАЦЮВАТИМЕ у багатовузловому кластері. Докладніше: [https://kubernetes.io/docs/concepts/storage/volumes#hostpath](/docs/concepts/storage/volumes#hostpath)

  <a name="HostPathVolumeSource"></a>
  *Представляє шлях на хості, зіставлений зі шляхом у Podʼі. Шляхи томів хосту не підтримують управління власністю або перепризначення міток SELinux.*

  - **hostPath.path** (string), обовʼязково

    path — шлях до теки на хості. Якщо шлях є символічним посиланням, він буде слідувати за посиланням до реального шляху. Докладніше: [https://kubernetes.io/docs/concepts/storage/volumes#hostpath](/docs/concepts/storage/volumes#hostpath)

  - **hostPath.type** (string)

    тип для HostPath Volume. Стандартне значення — "". Докладніше: [https://kubernetes.io/docs/concepts/storage/volumes#hostpath](/docs/concepts/storage/volumes#hostpath)

    Можливі значення переліку (enum):
    - `""` Для зворотньої суміності, залиште його порожнім, якщо не встановлено
    - `"BlockDevice"` Блок-пристрій повинен існувати за вказаним шляхом
    - `"CharDevice"` Символьний пристрій повинен існувати за вказаним шляхом
    - `"Directory"` Тека повинна існувати за вказаним шляхом
    - `"DirectoryOrCreate"` Якщо нічого не існує за вказаним шляхом, там буде створено порожню теку за потреби з режимом доступу 0755, маючи ту ж групу та власність, що й Kubelet.
    - `"File"` Файл повинен існувати за вказаним шляхом
    - `"FileOrCreate"` Якщо нічого не існує за вказаним шляхом, там буде створено порожній файл за потреби з режимом доступу 0644, маючи ту ж групу та власника, що й Kubelet.
    - `"Socket"` UNIX-сокет повинен існувати за вказаним шляхом

- **local** (LocalVolumeSource)

  local — це безпосередньо приєднане сховище зі спорідненістю до вузла

  <a name="LocalVolumeSource"></a>
  *Local представляє безпосередньо приєднане сховище зі спорідненістю до вузла*

  - **local.path** (string), обовʼязкове

    повний шлях до тому на вузлі. Це може бути або тека, або блоковий пристрій (диск, розділ і т.д.).

  - **local.fsType** (string)

    fsType — це тип файлової системи для монтування. Застосовується лише тоді, коли Path є блоковим пристроєм. Повинен бути тип файлової системи, підтримуваний операційною системою хосту. Наприклад, "ext4", "xfs", "ntfs". Стандартне значення — автоматичний вибір файлової системи, якщо не вказано.

### Постійні томи {#persistent-volumes}

- **awsElasticBlockStore** (AWSElasticBlockStoreVolumeSource)

  awsElasticBlockStore представляє ресурс AWS Disk, який приєднано до машини хосту kubelet і пізніше надано доступ поду. Застаріло: AWSElasticBlockStore застаріло. Всі операції для внутрішнього типу awsElasticBlockStore перенаправляються на CSI-драйвер ebs.csi.aws.com. Докладніше: [https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore](/docs/concepts/storage/volumes#awselasticblockstore)

  <a name="AWSElasticBlockStoreVolumeSource"></a>
  *Представляє постійний диск AWS.*

  - **awsElasticBlockStore.volumeID** (string), обовʼязково

    volumeID — це унікальний ідентифікатор ресурсу постійного диска в AWS (Amazon EBS volume). Докладніше: [https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore](/docs/concepts/storage/volumes#awselasticblockstore)

  - **awsElasticBlockStore.fsType** (string)

    fsType — це тип файлової системи тому, який ви хочете монтувати. Переконайтеся, що тип файлової системи підтримується операційною системою хосту. Приклади: "ext4", "xfs", "ntfs". Передбачається "ext4", якщо не вказано інше. Докладніше: [https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore](/docs/concepts/storage/volumes#awselasticblockstore)

  - **awsElasticBlockStore.partition** (int32)

    partition — це розділ у томі, який ви хочете монтувати. Якщо відсутній, то стандартно монтується за назвою тому. Приклади: Для тому /dev/sda1, ви вказуєте розділ як "1". Аналогічно, розділ тому /dev/sda є "0" (або ви можете залишити властивість пустою).

  - **awsElasticBlockStore.readOnly** (boolean)

    readOnly значення true змусить використовувати параметр readOnly в VolumeMounts. Докладніше: [https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore](/docs/concepts/storage/volumes#awselasticblockstore)

- **azureDisk** (AzureDiskVolumeSource)

  azureDisk представляє монтування Azure Data Disk на хості та звʼязане монтування у Podʼі. Застаріло: AzureDisk застарів. Усі операції для внутрішнього типу azureDisk переспрямовуються на драйвер CSI disk.csi.azure.com.

  <a name="AzureDiskVolumeSource"></a>
  *Представляє монтування Azure Data Disk на хості та звʼязане монтування у Podʼі.*

  - **azureDisk.diskName** (string), обовʼязково

    diskName — це імʼя диска даних у сховищі blob

  - **azureDisk.diskURI** (string), обовʼязково

    diskURI — це URI диска даних у сховищі blob

  - **azureDisk.cachingMode** (string)

    cachingMode — це режим кешування на хості: None, Read Only, Read Write.

    Можливі значення переліку (enum):
    - `"None"`
    - `"ReadOnly"`
    - `"ReadWrite"`

  - **azureDisk.fsType** (string)

    fsType — тип файлової системи для монтування. Має бути типом файлової системи, підтриманим операційною системою хосту. Наприклад, "ext4", "xfs", "ntfs". Передбачається "ext4", якщо не вказано інше.

  - **azureDisk.kind** (string)

    kind — очікувані значення:

    - Shared: декілька томів блобів на обліковому записі сховища
    - Dedicated: один том блобів на обліковому записі сховища
    - Managed: керований диск даних Azure (лише в керованому наборі доступності). Стандартне значення — shared.

    Можливі значення переліку (enum):
    - `"Dedicated"`
    - `"Managed"`
    - `"Shared"`

  - **azureDisk.readOnly** (boolean)

    readOnly — стандартне значення — false (запис/читання). Якщо тут встановлено true, то встановлюється параметр readOnly у VolumeMounts.

- **azureFile** (AzureFilePersistentVolumeSource)

  azureFile представляє монтування Azure File Service на хості та звʼязане монтування у Podʼі. Застаріло: AzureFile застарілий. Всі операції для внутрішнього типу azureFile перенаправляються на CSI-драйвер file.csi.azure.com.

  <a name="AzureFilePersistentVolumeSource"></a>
  *Представляє монтування Azure File Service на хості та звʼязане монтування у Podʼі.*

  - **azureFile.secretName** (string), обовʼязково

    secretName — це імʼя Secret, що містить імʼя та ключ облікового запису Azure Storage

  - **azureFile.shareName** (string), обовʼязково

    shareName — це назва розділу Azure

  - **azureFile.readOnly** (boolean)

    readOnly — стандартне значення — false (запис/читання). Якщо тут встановлено true, то встановлюється параметр readOnly в VolumeMounts.

  - **azureFile.secretNamespace** (string)

    secretNamespace — це простір імен Secret, що містить імʼя та ключ облікового запису Azure. Стандартно використовується той самий простір імен, що й у Podʼа.

- **cephfs** (CephFSPersistentVolumeSource)

  cephFS представляє монтування Ceph FS на хості, яке спільно використовується з життєвим циклом Pod. Застаріло: CephFS застаріла і внутрішній тип cephfs більше не підтримується.

  <a name="CephFSPersistentVolumeSource"></a>
  *Представляє монтування файлової системи Ceph, яка існує протягом життя Podʼа. Томи Cephfs не підтримують управління власниками або перепризначення міток SELinux.*

  - **cephfs.monitors** ([]string), обовʼязково

    *Atomic: буде замінено під час злиття*

    monitors — це колекція моніторів Ceph. Докладніше: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it

  - **cephfs.path** (string)

    path — необовʼязково: використовується як коренева тека для монтування, стандартно — "/"

  - **cephfs.readOnly** (boolean)

    readOnly — необовʼязково: стандартне значення — false (запис/читання). Якщо встановлено true, встановлюється параметр readOnly в VolumeMounts. Докладніше: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it

  - **cephfs.secretFile** (string)

    secretFile — необовʼязково: secretFile — це шлях до секретів для користувача, стандартне значення — /etc/ceph/user.secret. Докладніше: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it

  - **cephfs.secretRef** (SecretReference)

    secretRef — необовʼязково: secretRef — посилання на Secret для автентифікації користувача. Стандартне значення порожнє. Докладніше: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it

    <a name="SecretReference"></a>
    *SecretReference представляє посилання на Secret. Воно має достатньо інформації для отримання Secret в будь-якому просторі імен.*

    - **cephfs.secretRef.name** (string)

      name — унікальне імʼя в межах простору імен для посилання на ресурс Secret.

    - **cephfs.secretRef.namespace** (string)

      namespace — визначає простір імен, в межах якого імʼя Secret має бути унікальним.

  - **cephfs.user** (string)

    user — необовʼязково: user — імʼя користувача rados, стандартне значення — admin. Докладніше: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it

- **cinder** (CinderPersistentVolumeSource)

  cinder представляє монтування та підключення тому Cinder на машині хосту kubelet. Застаріло: Cinder застарів. Всі операції для типу cinder у внутрішньому типі перенаправляються на CSI-драйвер cinder.csi.openstack.org. Докладніше: https://examples.k8s.io/mysql-cinder-pd/README.md

  <a name="CinderPersistentVolumeSource"></a>
  *Представляє ресурс тому Cinder в OpenStack. Том Cinder повинен існувати перед монтуванням у контейнер. Том також повинен знаходитися в тому ж регіоні, що й kubelet. Томи Cinder підтримують управління власниками та перепризначення міток SELinux.*

  - **cinder.volumeID** (string), обовʼязково

    volumeID — використовується для ідентифікації тому в Cinder. Докладніше: https://examples.k8s.io/mysql-cinder-pd/README.md

  - **cinder.fsType** (string)

    fsType — тип файлової системи для монтування. Має бути підтримуваним типом файлової системи операційної системи хосту. Приклади: "ext4", "xfs", "ntfs". Передбачається "ext4", якщо не вказано інше. Докладніше: https://examples.k8s.io/mysql-cinder-pd/README.md

  - **cinder.readOnly** (boolean)

    readOnly — необовʼязково: стандартне значення — false (запис/читання). Якщо встановлено true, параметр readOnly встановлюється в VolumeMounts. Докладніше: https://examples.k8s.io/mysql-cinder-pd/README.md

  - **cinder.secretRef** (SecretReference)

    secretRef — необовʼязково: посилання на обʼєкт Secret, що містить параметри для підключення до OpenStack.

    <a name="SecretReference"></a>
    *SecretReference представляє посилання на Secret. Воно має достатньо інформації для отримання Secret в будь-якому просторі імен.*

    - **cinder.secretRef.name** (string)

      name —- унікальне імʼя в межах простору імен для посилання на ресурс Secret.

    - **cinder.secretRef.namespace** (string)

      namespace — визначає простір імен, в межах якого імʼя Secret має бути унікальним.

- **csi** (CSIPersistentVolumeSource)

  csi представляє сховище, яке обробляється зовнішнім драйвером CSI.

  <a name="CSIPersistentVolumeSource"></a>
  *Представляє сховище, яке керується зовнішнім драйвером CSI для сховища*

  - **csi.driver** (string), обовʼязково

    driver — це назва драйвера, який використовується для цього тому. Обовʼязково.

  - **csi.volumeHandle** (string), обовʼязково

    volumeHandle — це унікальне імʼя тому, яке повертається драйвером CSI для посилання на том у всіх наступних викликах. Обовʼязково.

  - **csi.controllerExpandSecretRef** (SecretReference)

    controllerExpandSecretRef — посилання на обʼєкт Secret, що містить чутливу інформацію для передачі до драйвера CSI для виконання виклику CSI ControllerExpandVolume. Це поле є необовʼязковим і може бути порожнім, якщо Secret не потрібен. Якщо обʼєкт Secret містить більше ніж один ключ, всі ключі передаються.

    <a name="SecretReference"></a>
    *SecretReference представляє посилання на Secret. Воно має достатньо інформації для отримання Secret в будь-якому просторі імен.*

    - **csi.controllerExpandSecretRef.name** (string)

      name — унікальне імʼя в межах простору імен для посилання на ресурс Secret.

    - **csi.controllerExpandSecretRef.namespace** (string)

      namespace — визначає простір імен, в межах якого імʼя Secret має бути унікальним.

  - **csi.controllerPublishSecretRef** (SecretReference)

    controllerPublishSecretRef — посилання на обʼєкт Secret, що містить чутливу інформацію для передачі до драйвера CSI для виконання викликів CSI ControllerPublishVolume і ControllerUnpublishVolume. Це поле є необовʼязковим і може бути порожнім, якщо секрет не потрібен. Якщо обʼєкт Secret містить більше ніж один ключ, всі ключі передаються.

    <a name="SecretReference"></a>
    *SecretReference представляє посилання на Secret. Воно має достатньо інформації для отримання Secret в будь-якому просторі імен.*

    - **csi.controllerPublishSecretRef.name** (string)

      name — унікальне імʼя в межах простору імен для посилання на ресурс Secret.

    - **csi.controllerPublishSecretRef.namespace** (string)

      namespace — визначає простір імен, в межах якого імʼя Secret має бути унікальним.

  - **csi.fsType** (string)

    fsType — тип файлової системи для монтування. Має бути підтримуваним типом файлової системи операційної системи хосту. Наприклад, "ext4", "xfs", "ntfs".

  - **csi.nodeExpandSecretRef** (SecretReference)

    nodeExpandSecretRef — посилання на обʼєкт Secret, що містить чутливу інформацію для передачі до драйвера CSI для виконання виклику CSI NodeExpandVolume. Це поле є необовʼязковим і може бути опущеним, якщо Secret не потрібен. Якщо обʼєкт Secret містить більше ніж один ключ, всі ключі передаються.

    <a name="SecretReference"></a>
    *SecretReference представляє посилання на Secret. Воно має достатньо інформації для отримання Secret в будь-якому просторі імен.*

    - **csi.nodeExpandSecretRef.name** (string)

      name — унікальне імʼя в межах простору імен для посилання на ресурс Secret.

    - **csi.nodeExpandSecretRef.namespace** (string)

      namespace — визначає простір імен, в межах якого імʼя Secret має бути унікальним.

  - **csi.nodePublishSecretRef** (SecretReference)

    nodePublishSecretRef — посилання на обʼєкт, Secret що містить чутливу інформацію для передачі до драйвера CSI для виконання викликів CSI NodePublishVolume і NodeUnpublishVolume. Це поле є необовʼязковим і може бути порожнім, якщо Secret не потрібен. Якщо обʼєкт Secret містить більше ніж один ключ, всі ключі передаються.

    <a name="SecretReference"></a>
    *SecretReference представляє посилання на Secret. Воно має достатньо інформації для отримання Secret в будь-якому просторі імен.*

    - **csi.nodePublishSecretRef.name** (string)

      name — унікальне імʼя в межах простору імен для посилання на ресурс Secret.

    - **csi.nodePublishSecretRef.namespace** (string)

      namespace — визначає простір імен, в межах якого імʼя Secret має бути унікальним.

  - **csi.nodeStageSecretRef** (SecretReference)

    nodeStageSecretRef — посилання на обʼєкт Secret, що містить чутливу інформацію для передачі до драйвера CSI для виконання викликів CSI NodeStageVolume і NodeUnstageVolume. Це поле є необовʼязковим і може бути порожнім, якщо Secret не потрібен. Якщо обʼєкт Secret містить більше ніж один ключ, всі ключі передаються.

    <a name="SecretReference"></a>
    *SecretReference представляє посилання на Secret. Воно має достатньо інформації для отримання Secret в будь-якому просторі імен.*

    - **csi.nodeStageSecretRef.name** (string)

      name — унікальне імʼя в межах простору імен для посилання на ресурс Secret.

    - **csi.nodeStageSecretRef.namespace** (string)

      namespace — визначає простір імен, в межах якого імʼя Secret має бути унікальним.

  - **csi.readOnly** (boolean)

    readOnly — значення для передачі до ControllerPublishVolumeRequest. Стандартне значення — false (запис/читання).

  - **csi.volumeAttributes** (map[string]string)

    volumeAttributes — атрибути тому для публікації.

- **fc** (FCVolumeSource)

  fc представляє ресурс Fibre Channel, який приєднується до хост-машини kubelet і потім експонується для використання в Podʼі.

  <a name="FCVolumeSource"></a>
  *Представляє том Fibre Channel. Томи Fibre Channel можуть бути приєднані лише як для читання/запису один раз. Томи Fibre Channel підтримують управління власниками та перепризначення міток SELinux.*

  - **fc.fsType** (string)

    fsType — це тип файлової системи для монтування. Має бути підтримуваним типом файлової системи операційної системи хосту. Наприклад, "ext4", "xfs", "ntfs". Передбачається "ext4", якщо не вказано інше.

  - **fc.lun** (int32)

    lun — необовʼязково: номер lun.

  - **fc.readOnly** (boolean)

    readOnly — необовʼязково: стандартне значення — false (запис/читання). Якщо встановлено true, встановлюється параметр readOnly у VolumeMounts.

  - **fc.targetWWNs** ([]string)

    *Atomic: буде замінено під час злиття*

    targetWWNs — необовʼязково: FC вказує всесвітні імена (worldwide names, WWN).

  - **fc.wwids** ([]string)

    *Atomic: буде замінено під час злиття*

    wwids — необовʼязково: світові ідентифікатори тома FC (WWID). Можна встановити або wwids, або комбінацію targetWWNs і lun, але не одночасно.

- **flexVolume** (FlexPersistentVolumeSource)

  flexVolume представляє загальний ресурс тома, який надається/приєднується за допомогою втулка. Застаріло: FlexVolume застарів. Розгляньте можливість використання CSIDriver замість нього.

  <a name="FlexPersistentVolumeSource"></a>
  *FlexPersistentVolumeSource представляє загальний постійний том, який надається/приєднується за допомогою втулка.*

  - **flexVolume.driver** (string), обовʼязково

    driver — це імʼя драйвера, яке використовується для цього тома.

  - **flexVolume.fsType** (string)

    fsType — тип файлової системи для монтування. Має бути підтримуваним типом файлової системи операційної системи хоста. Наприклад, "ext4", "xfs", "ntfs". Тип стандартної файлової системи залежить від сценарію FlexVolume.

  - **flexVolume.options** (map[string]string)

    options — необовʼязково: це поле містить додаткові параметри команди, якщо такі є.

  - **flexVolume.readOnly** (boolean)

    readOnly — необовʼязково: стандартне значення — false (запис/читання). Якщо встановлено true, встановлюється параметр readOnly у VolumeMounts.

  - **flexVolume.secretRef** (SecretReference)

    secretRef — необовʼязково: посилання на обʼєкт Secret, що містить чутливу інформацію для передачі в сценарії втулка. Це поле може бути порожнім, якщо обʼєкт Secret не вказано. Якщо Secret містить більше одного секрету, всі вони передаються в сценарії втулка.

    <a name="SecretReference"></a>
    *SecretReference представляє посилання на Secret. Воно має достатньо інформації для отримання Secret в будь-якому просторі імен.*

    - **flexVolume.secretRef.name** (string)

      name — унікальне імʼя в межах простору імен для посилання на ресурс Secret.

    - **flexVolume.secretRef.namespace** (string)

      namespace — визначає простір імен, в межах якого імʼя Secret має бути унікальним.

- **flocker** (FlockerVolumeSource)

  flocker представляє том Flocker, приєднаний до хост-машини kubelet і експонований для використання в Podʼі. Це залежить від того, чи працює служба керування Flocker. Застаріло: Flocker застарів, і внутрішній тип flocker більше не підтримується.

  <a name="FlockerVolumeSource"></a>
  *Представляє том Flocker, приєднаний агентом Flocker. Повинно бути встановлено одне і тільки одне значення datasetName або datasetUUID. Томи Flocker не підтримують управління власниками або перевизначення міток SELinux.*

  - **flocker.datasetName** (string)

    datasetName — імʼя набору даних, збережене як метадані -> імʼя для набору даних Flocker. Вважається застарілим.

  - **flocker.datasetUUID** (string)

    datasetUUID — UUID набору даних. Це унікальний ідентифікатор набору даних Flocker.

- **gcePersistentDisk** (GCEPersistentDiskVolumeSource)

  gcePersistentDisk представляє ресурс GCE Disk, який приєднується до хост-машини kubelet і потім експонується для використання в Podʼі. Впроваджується адміністратором.  Застаріло: GCEPersistentDisk застарів. Усі операції для внутрішнього типу gcePersistentDisk перенаправлено до драйвера CSI pd.csi.storage.gke.io. Докладніше: [https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk](/docs/concepts/storage/volumes#gcepersistentdisk)

  <a name="GCEPersistentDiskVolumeSource"></a>
  *Представляє постійний диск в Google Compute Engine.*

  *Диск GCE повинен існувати перед монтуванням в контейнер. Диск також повинен знаходитися в тому ж проєкті та зоні GCE, що і kubelet. Диск GCE може бути приєднаний тільки як для читання/запису один раз або тільки для читання багато разів. Диски GCE підтримують управління власниками та перепризначення міток SELinux.*

  - **gcePersistentDisk.pdName** (string), обовʼязково

    pdName — унікальне імʼя ресурсу PD в GCE. Використовується для ідентифікації диска в GCE.

  - **gcePersistentDisk.fsType** (string)

    fsType — тип файлової системи тома, який ви хочете монтувати. Переконайтеся, що тип файлової системи підтримується операційною системою хосту. Приклади: "ext4", "xfs", "ntfs". Передбачається "ext4", якщо не вказано інше.

  - **gcePersistentDisk.partition** (int32)

    partition — розділ у томі, який ви хочете монтувати. Якщо пропущено,стандартно монтується за іменем тома. Приклади: Для тома /dev/sda1 ви вказуєте розділ як "1". Аналогічно, розділ тома для /dev/sda - "0" (або ви можете залишити властивість пустою).

  - **gcePersistentDisk.readOnly** (boolean)

    readOnly — тут встановлює параметр readOnly у VolumeMounts. Стандартне значення — false.

- **glusterfs** (GlusterfsPersistentVolumeSource)

  glusterfs представляє том Glusterfs, який приєднується до хосту і експонується для використання в Podʼі. Впроваджується адміністратором. Застаріло: Glusterfs застарів, а внутрішній тип glusterfs більше не підтримується. Докладніше: https://examples.k8s.io/volumes/glusterfs/README.md

  <a name="GlusterfsPersistentVolumeSource"></a>
  *Представляє монтування Glusterfs, яке існує протягом життєвого циклу Podʼа. Томи Glusterfs не підтримують управління власниками або перепризначенн міток SELinux.*

  - **glusterfs.endpoints** (string), обовʼязково

    endpoints — імʼя точки доступу, яке вказує на топологію Glusterfs. Детальніше: https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod

  - **glusterfs.path** (string), обовʼязково

    path — шлях до тому Glusterfs. Детальніше: https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod

  - **glusterfs.endpointsNamespace** (string)

    endpointsNamespace — простір імен, який містить точку доступу Glusterfs. Якщо це поле порожнє, EndpointNamespace стандартно встановлюється в той же простір імен, що й звʼязаний PVC. Детальніше: https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod

  - **glusterfs.readOnly** (boolean)

    readOnly — встановлює, чи має монтуватися том Glusterfs тільки для читання. Стандартне значення — false. Детальніше: https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod

- **iscsi** (ISCSIPersistentVolumeSource)

  iscsi представляє ресурс ISCSI Disk, який приєднується до хост-машини kubelet і потім експонується для використання в Podʼі. Надається адміністратором.

  <a name="ISCSIPersistentVolumeSource"></a>
  *ISCSIPersistentVolumeSource представляє диск ISCSI. ISCSI томи можуть бути монтувані тільки один раз для читання/запису. ISCSI томи підтримують управління власниками та перепризначення міток SELinux.*

  - **iscsi.iqn** (string), обовʼязково

    iqn - кваліфіковане імʼя ISCSI цілі.

  - **iscsi.lun** (int32), обовʼязково

    lun — номер LUN цілі ISCSI.

  - **iscsi.targetPortal** (string), обовʼязково

    targetPortal — це цільовий портал ISCSI. Портал може бути IP або ip_addr:port, якщо порт відрізняється від типового (зазвичай TCP порти 860 та 3260).

  - **iscsi.chapAuthDiscovery** (boolean)

    chapAuthDiscovery — визначає підтримку автентифікації CHAP для виявлення ISCSI.

  - **iscsi.chapAuthSession** (boolean)

    chapAuthSession - визначає підтримку автентифікації CHAP сесії ISCSI.

  - **iscsi.fsType** (string)

    fsType — тип файлової системи тому, який ви хочете монтувати. Переконайтеся, що тип файлової системи підтримується операційною системою хоста. Приклади: "ext4", "xfs", "ntfs". Передбачається "ext4", якщо не вказано інше. Детальніше: [https://kubernetes.io/docs/concepts/storage/volumes#iscsi](/docs/concepts/storage/volumes#iscsi)

  - **iscsi.initiatorName** (string)

    initiatorName — це спеціальне імʼя ініціатора ISCSI. Якщо initiatorName вказано одночасно з iscsiInterface, буде створено новий інтерфейс ISCSI \<target portal\>:\<volume name\> для зʼєднання.

  - **iscsi.iscsiInterface** (string)

    iscsiInterface — це імʼя інтерфейсу, яке використовує транспорт ISCSI. Стандартне значення — 'default' (tcp).

  - **iscsi.portals** ([]string)

    *Atomic: буде замінено під час злиття*

    portals — список цільових порталів ISCSI. Портал може бути IP або ip_addr:port, якщо порт відрізняється від типового (зазвичай TCP порти 860 та 3260).

  - **iscsi.readOnly** (boolean)

    readOnly — встановлює параметр readOnly у VolumeMounts. Стандартне значення — false.

  - **iscsi.secretRef** (SecretReference)

    secretRef — це обʼєкт Secret для автентифікації цілі ISCSI та ініціатора.

    <a name="SecretReference"></a>
    *SecretReference представляє посилання на Secret. Воно має достатньо інформації для отримання Secret в будь-якому просторі імен.*

    - **iscsi.secretRef.name** (string)

      name — унікальне імʼя в межах простору імен для посилання на ресурс Secret.

    - **iscsi.secretRef.namespace** (string)

      namespace — визначає простір імен, в межах якого імʼя Secret має бути унікальним.

- **nfs** (NFSVolumeSource)

  nfs представляє монтування NFS на хості. Впроваджується адміністратором. Докладніше: [https://kubernetes.io/docs/concepts/storage/volumes#nfs](/docs/concepts/storage/volumes#nfs)

  <a name="NFSVolumeSource"></a>
  *Представляє монтування NFS, яке існує протягом життєвого циклу Podʼа. NFS томи не підтримують управління власниками або перевизначення міток SELinux.*

  - **nfs.path** (string), обовʼязково

    path — шлях, який експортується сервером NFS. Детальніше: [https://kubernetes.io/docs/concepts/storage/volumes#nfs](/docs/concepts/storage/volumes#nfs)

  - **nfs.server** (string), обовʼязково

    server — імʼя хоста або IP-адреса сервера NFS. Детальніше: [https://kubernetes.io/docs/concepts/storage/volumes#nfs](/docs/concepts/storage/volumes#nfs)

  - **nfs.readOnly** (boolean)

    readOnly — встановлює, чи має монтуватися NFS експорт тільки для читання. Стандартне значення — false. Детальніше: [https://kubernetes.io/docs/concepts/storage/volumes#nfs](/docs/concepts/storage/volumes#nfs)

- **photonPersistentDisk** (PhotonPersistentDiskVolumeSource)

  photonPersistentDisk представляє постійний диск Photon Controller, приєднаний і змонтований на хост-машині kubelet. Застаріло: PhotonPersistentDisk застарів і внутрішній тип photonPersistentDisk більше не підтримується.

  <a name="PhotonPersistentDiskVolumeSource"></a>
  *Представляє ресурс постійного диска Photon Controller.*

  - **photonPersistentDisk.pdID** (string), обовʼязково

    pdID — це ідентифікатор, який ідентифікує постійний диск Photon Controller.

  - **photonPersistentDisk.fsType** (string)

    fsType — тип файлової системи для монтування. Повинен бути типом файлової системи, який підтримується операційною системою хоста. Наприклад: "ext4", "xfs", "ntfs". Передбачається "ext4", якщо не вказано інше.

- **portworxVolume** (PortworxVolumeSource)

  portworxVolume представляє ресурс тома Portworx, приєднаний і змонтований на хост-машині kubelet. Застаріло: PortworxVolume застарів. Всі операції для внутрішнього типу portworxVolume перенаправляються на CSI-драйвер pxd.portworx.com, коли CSIMigrationPortworx функціональну можливість увімкнено.

  <a name="PortworxVolumeSource"></a>
  *Представляє ресурс тома Portworx.*

  - **portworxVolume.volumeID** (string), обовʼязково

    volumeID — унікально ідентифікує том Portworx.

  - **portworxVolume.fsType** (string)

    fsType — тип файлової системи для монтування. Повинен бути типом файлової системи, який підтримується операційною системою хоста. Наприклад: "ext4", "xfs". Передбачається "ext4", якщо не вказано інше.

  - **portworxVolume.readOnly** (boolean)

    readOnly — стандартне значення — false (читання/запис). Якщо встановлено в true, тоді монтування тома буде тільки для читання.

- **quobyte** (QuobyteVolumeSource)

  quobyte представляє монтування Quobyte на хості, яке триває протягом життєвого циклу Podʼа. Застаріло: Quobyte застарілий і внутрішній тип quobyte більше не підтримується.

  <a name="QuobyteVolumeSource"></a>
  *Представляє монтування Quobyte, яке триває протягом життєвого циклу Podʼа. Quobyte томи не підтримують управління власниками або перевизначення міток SELinux.*

  - **quobyte.registry** (string), обовʼязково

    registry — представляє один або кілька сервісів реєстрації Quobyte, вказаних як рядок у форматі host:port (кілька записів розділяються комами), які діють як центральний реєстр для томів.

  - **quobyte.volume** (string), обовʼязково

    volume — рядок, який посилається на вже створений том Quobyte за імʼям.

  - **quobyte.group** (string)

    group — група для відображення доступу до тома. Стандартно група не встановлюється.

  - **quobyte.readOnly** (boolean)

    readOnly — встановлює, чи має монтуватися том Quobyte тільки для читання. Стандартне значення — false.

  - **quobyte.tenant** (string)

    tenant — власник вказаного тома Quobyte в Backend. Використовується з динамічно створеними томами Quobyte, значення встановлюється втулком.

  - **quobyte.user** (string)

    user — користувач для відображення доступу до тома. Стандартно використовується користувач serivceaccount.

- **rbd** (RBDPersistentVolumeSource)

  rbd представляє монтування Rados Block Device на хості, яке існує протягом життєвого циклу Podʼа. Застаріло: RBD застарів і внутрішній тип rbd більше не підтримується. Детальніше: https://examples.k8s.io/volumes/rbd/README.md

  <a name="RBDPersistentVolumeSource"></a>
  *Представляє монтування Rados Block Device, яке існує протягом життєвого циклу Podʼа. RBD томи підтримують управління власниками та перевизначення міток SELinux.*

  - **rbd.image** (string), обовʼязково

    image — імʼя образу rados. Детальніше: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  - **rbd.monitors** ([]string), обовʼязково

    *Atomic: буде замінено під час злиття*

    monitors — колекція моніторів Ceph. Детальніше: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  - **rbd.fsType** (string)

    fsType — тип файлової системи тому, який ви хочете змонтувати. Переконайтеся, що тип файлової системи підтримується операційною системою хоста. Приклади: "ext4", "xfs", "ntfs". Передбачається "ext4", якщо не вказано інше. Детальніше: [https://kubernetes.io/docs/concepts/storage/volumes#rbd](/docs/concepts/storage/volumes#rbd)

  - **rbd.keyring** (string)

    keyring — шлях до ключів для RBDUser. Стандартне значення — /etc/ceph/keyring. Детальніше: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  - **rbd.pool** (string)

    pool — імʼя rados pool. Стандартне значення — rbd. Детальніше: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  - **rbd.readOnly** (boolean)

    readOnly — встановлює, що монтування RBD тому буде тільки для читання. Стандартне значення — false. Детальніше: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  - **rbd.secretRef** (SecretReference)

    secretRef - імʼя Secret автентифікації для RBDUser. Якщо вказано, перевизначає keyring. Стандартне значення — nil. Детальніше: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

    <a name="SecretReference"></a>
    *SecretReference представляє посилання на Secret. Воно містить достатньо інформації для отримання Secret в будь-якому просторі імен*

    - **rbd.secretRef.name** (string)

      name — унікальне імʼя ресурсу Secret в просторі імен.

    - **rbd.secretRef.namespace** (string)

      namespace — визначає простір імен, в якому імʼя Secret повинно бути унікальним.

  - **rbd.user** (string)

    user — імʼя користувача rados. Стандартне значення — admin. Детальніше: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

- **scaleIO** (ScaleIOPersistentVolumeSource)

  scaleIO представляє постійний том ScaleIO, приєднаний і змонтований на вузлах Kubernetes. Застаріло: ScaleIO застарів, і внутрішній тип scaleIO більше не підтримується.

  <a name="ScaleIOPersistentVolumeSource"></a>
  *ScaleIOPersistentVolumeSource представляє постійний том ScaleIO*

  - **scaleIO.gateway** (string), обовʼязково

    gateway — адреса хосту шлюза API ScaleIO.

  - **scaleIO.secretRef** (SecretReference), обовʼязково

    secretRef — посилання на Secret для користувача ScaleIO та іншої чутливої інформації. Якщо це не надано, операція входу буде невдалою.

    <a name="SecretReference"></a>
    *SecretReference представляє посилання на Secret. Воно містить достатньо інформації для отримання Secret в будь-якому просторі імен*

    - **scaleIO.secretRef.name** (string)

      name — унікальне імʼя ресурсу Secret в просторі імен.

    - **scaleIO.secretRef.namespace** (string)

      namespace — визначає простір імен, в якому імʼя Secret повинно бути унікальним.

  - **scaleIO.system** (string), обовʼязково

    system — назва системи зберігання, як налаштовано в ScaleIO.

  - **scaleIO.fsType** (string)

    fsType — тип файлової системи для монтування. Повинен бути типом файлової системи, який підтримується операційною системою хоста. Наприклад: "ext4", "xfs", "ntfs". Стандартне значення — "xfs".

  - **scaleIO.protectionDomain** (string)

    protectionDomain — назва домену захисту ScaleIO для налаштованого зберігання.

  - **scaleIO.readOnly** (boolean)

    readOnly — стандартне значення — false (читання/запис). Якщо встановлено в true, тоді монтування тому буде тільки для читання.

  - **scaleIO.sslEnabled** (boolean)

    sslEnabled — прапорець для увімкнення/вимкнення SSL-звʼязку з Gateway, стандартне значення — false.

  - **scaleIO.storageMode** (string)

    storageMode — вказує, чи повинно бути зберігання для тому ThickProvisioned або ThinProvisioned. Стандартне значення — ThinProvisioned.

  - **scaleIO.storagePool** (string)

    storagePool — Pool зберігання ScaleIO, повʼязаний з доменом захисту.

  - **scaleIO.volumeName** (string)

    volumeName — імʼя вже створеного тому в системі ScaleIO, повʼязаного з цим джерелом тому.

- **storageos** (StorageOSPersistentVolumeSource)

  storageOS представляє том StorageOS, який приєднаний до вузла kubelet і змонтований у Pod. Застаріло: StorageOS застарів і внутрішній тип сховища storageos більше не підтримується. Детальніше: https://examples.k8s.io/volumes/storageos/README.md

  <a name="StorageOSPersistentVolumeSource"></a>
  *Представляє постійний том ресурсу StorageOS.*

  - **storageos.fsType** (string)

    fsType — тип файлової системи для монтування. Повинен бути типом файлової системи, який підтримується операційною системою хоста. Наприклад: "ext4", "xfs", "ntfs". Передбачається "ext4", якщо не вказано інше.

  - **storageos.readOnly** (boolean)

    readOnly — стандартне значення — false (читання/запис). Якщо встановлено в true, то монтування тому буде тільки для читання.

  - **storageos.secretRef** (<a href="{{< ref "../common-definitions/object-reference#ObjectReference" >}}">ObjectReference</a>)

    secretRef - вказує на Secret, який використовується для отримання облікових даних API StorageOS. Якщо не вказано, спробує використати стандартне значення.

  - **storageos.volumeName** (string)

    volumeName — імʼя тому StorageOS, зорозуміле людині. Імена томів унікальні лише в межах простору імен.

  - **storageos.volumeNamespace** (string)

    volumeNamespace — визначає область тому в межах StorageOS. Якщо не вказано, використовується простір імен Podʼа. Це дозволяє відображати простори імен Kubernetes в межах StorageOS для більш тісної інтеграції. Встановіть VolumeName на будь-яке імʼя для заміни стандартної поведінки. Встановіть у "default", якщо ви не використовуєте простори імен в межах StorageOS. Простори імен, які не існують заздалегідь в межах StorageOS, будуть створені.

- **vsphereVolume** (VsphereVirtualDiskVolumeSource)

  vsphereVolume представляє том vSphere, який приєднаний і змонтований на вузлах kubelet. Застаріло: VsphereVolume застарів. Усі операції для внутрішнього типу vsphereVolume перенаправляються на драйвер CSI csi.vsphere.vmware.com.

  <a name="VsphereVirtualDiskVolumeSource"></a>
  *Представляє ресурс тому vSphere.*

  - **vsphereVolume.volumePath** (string), обовʼязково

    volumePath — шлях, який ідентифікує том vSphere vmdk.

  - **vsphereVolume.fsType** (string)

    fsType — тип файлової системи для монтування. Повинен бути типом файлової системи, який підтримується операційною системою хоста. Наприклад: "ext4", "xfs", "ntfs". Передбачається "ext4", якщо не вказано інше.

  - **vsphereVolume.storagePolicyID** (string)

    storagePolicyID — ідентифікатор профілю управління політикою зберігання (SPBM), повʼязаний з іменем політики зберігання.

  - **vsphereVolume.storagePolicyName** (string)

    storagePolicyName — імʼя профілю управління політикою зберігання (SPBM).

## PersistentVolumeStatus {#PersistentVolumeStatus}

PersistentVolumeStatus — це поточний стан постійного тома.

---

- **lastPhaseTransitionTime** (Time)

  lastPhaseTransitionTime — це час, коли фаза переходила з однієї у іншу, і автоматично скидається до поточного часу кожного разу при переході фази тома.

  <a name="Time"></a>
  *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

- **message** (string)

  message — повідомлення, зрозуміле людині, яке вказує деталі щодо причини, чому том знаходиться у цьому стані.

- **phase** (string)

  phase — вказує, чи доступний том, звʼязаний із заявкою або звільнений від заявки. Докладніше: [https://kubernetes.io/docs/concepts/storage/persistent-volumes#phase](/docs/concepts/storage/persistent-volumes#phase)

  Можливі значення переліку (enum):
  - `"Available"` використовується для PersistentVolumes, які ще не звʼязані. Доступні томи утримуються звʼязувачем і співвідносяться з PersistentVolumeClaims.
  - `"Bound"` використовується для PersistentVolumes, які звʼязані.
  - `"Failed"` використовується для PersistentVolumes, які не вдалося правильно переробити або видалити після звільнення від заявки.
  - `"Pending"` використовується для PersistentVolumes, які недоступні.
  - `"Released"` використовується для PersistentVolumes, де звʼязаний PersistentVolumeClaim був видалений. Звільнені томи повинні бути перероблені перед повторним ставленням доступними. Ця фаза використовується звʼязувачем заявок на постійні томи, щоб сигналізувати іншому процесу про відновлення ресурсу.

- **reason** (string)

  reason — короткий рядок у CamelCase, який описує будь-яку помилку і призначений для машинного аналізу і зручного відображення у CLI.

## PersistentVolumeList {#PersistentVolumeList}

PersistentVolumeList — це список елементів PersistentVolume.

---

- **apiVersion**: v1

- **kind**: PersistentVolumeList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **items** ([]<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>), обовʼязково

  items — це список постійних томів. Докладніше: [https://kubernetes.io/docs/concepts/storage/persistent-volumes](/docs/concepts/storage/persistent-volumes)

## Операції {#operations}

---

### `get` отримати вказаний PersistentVolume {#get-read-the-specified-persistentvolume}

#### HTTP запит {#http-request}

GET /api/v1/persistentvolumes/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  назва PersistentVolume

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>): OK

401: Unauthorized

### `get` отримати статус вказаного PersistentVolume {#get-read-status-of-the-specified-persistentvolume}

#### HTTP запит {#http-request-1}

GET /api/v1/persistentvolumes/{name}/status

#### Параметри {#parameters-1}

- **name** (*в шляху*): string, обовʼязково

  назва PersistentVolume

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-1}

200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів PersistentVolume {#list-list-or-watch-objects-of-kind-persistentvolume}

#### HTTP запит {#http-request-2}

GET /api/v1/persistentvolumes

#### Параметри {#parameters-2}

- **allowWatchBookmarks** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

#### Відповідь {#response-2}

200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolumeList" >}}">PersistentVolumeList</a>): OK

401: Unauthorized

### `create` створення PersistentVolume {#create-create-a-persistentvolume}

#### HTTP запит {#http-request-3}

POST /api/v1/persistentvolumes

#### Параметри {#parameters-3}

- **body**: <a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>): Created

202 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>): Accepted

401: Unauthorized

### `update` заміна вказаного PersistentVolume {#update-replace-the-specified-persistentvolume}

#### HTTP запит {#http-request-4}

PUT /api/v1/persistentvolumes/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  назва PersistentVolume

- **body**: <a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>): Created

401: Unauthorized

### `update` заміна статусу вказаного PersistentVolume {#update-replace-status-of-the-specified-persistentvolume}

#### HTTP запит {#http-request-5}

PUT /api/v1/persistentvolumes/{name}/status

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  назва PersistentVolume

- **body**: <a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-5}

200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного PersistentVolume {#patch-partially-update-the-specified-persistentvolume}

#### HTTP запит {#http-request-6}

PATCH /api/v1/persistentvolumes/{name}

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  назва PersistentVolume

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-6}

200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>): Created

401: Unauthorized

### `patch` часткове оновлення статусу вказаного PersistentVolume {#patch-partially-update-status-of-the-specified-persistentvolume}

#### HTTP запит {#http-request-7}

PATCH /api/v1/persistentvolumes/{name}/status

#### Параметри {#parameters-7}

- **name** (*в шляху*): string, обовʼязково

  назва PersistentVolume

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-7}

200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>): Created

401: Unauthorized

### `delete` видалення PersistentVolume {#delete-delete-a-persistentvolume}

#### HTTP запит {#http-request-8}

DELETE /api/v1/persistentvolumes/{name}

#### Параметри {#parameters-8}

- **name** (*в шляху*): string, обовʼязково

  назва PersistentVolume

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

#### Відповідь {#response-8}

200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>): OK

202 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>): Accepted

401: Unauthorized

### `deletecollection` видалення колекції PersistentVolume {#deletecollection-delete-collection-of-persistentvolume}

#### HTTP запит {#http-request-9}

DELETE /api/v1/persistentvolumes

#### Параметри {#parameters-9}

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **labelSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

#### Відповідь {#response-9}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
