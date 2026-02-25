---
title: Класи сховищ
api_metadata:
- apiVersion: "storage.k8s.io/v1"
  kind: "StorageClass"
content_type: concept
weight: 40
---

<!-- overview -->

Цей документ описує концепцію StorageClass в Kubernetes. Рекомендується мати знайомство
з [томами](/docs/concepts/storage/volumes/) та [постійними томами](/docs/concepts/storage/persistent-volumes).

StorageClass надає можливість адміністраторам описати _класи_ сховищ, які вони надають. Різні класи можуть відповідати рівням обслуговування, політикам резервного копіювання або будь-яким політикам, визначеним адміністраторами кластера. Kubernetes сам не визначає, що являють собою класи.

Концепція Kubernetes StorageClass схожа на "профілі" в деяких інших дизайнах систем збереження.

<!-- body -->

## Обʼєкти StorageClass {#storageclass-objects}

Кожен StorageClass містить поля `provisioner`, `parameters` та `reclaimPolicy`, які використовуються, коли PersistentVolume, який належить до класу, має бути динамічно резервований для задоволення PersistentVolumeClaim (PVC).

Імʼя обʼєкта StorageClass має значення, і саме воно дозволяє користувачам запитувати певний клас. Адміністратори встановлюють імʼя та інші параметри класу під час першого створення обʼєктів StorageClass.

Як адміністратор, ви можете вказати типовий StorageClass, який застосовується до будь-яких PVC, які не вимагають конкретного класу. Докладніше див. концепцію [PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims).

Тут наведено приклад StorageClass:

{{% code_sample file="storage/storageclass-low-latency.yaml" %}}

## Типовий StorageClass {#default-storageclass}

Ви можете визначити StorageClass як типовий для вашого кластера. Щоб дізнатися, як встановити типовий StorageClass, див. [Зміна типового StorageClass](/docs/tasks/administer-cluster/change-default-storage-class/).

Якщо PVC не вказує `storageClassName`, буде використовуватися типовий StorageClass.

Якщо ви встановите анотацію [`storageclass.kubernetes.io/is-default-class`](/docs/reference/labels-annotations-taints/#storageclass-kubernetes-io-is-default-class) у значення true для більше ніж одного StorageClass у вашому кластері, і потім створите PersistentVolumeClaim без вказання `storageClassName`, Kubernetes використовуватиме найновіший типовий StorageClass.

{{< note >}}
Спробуйте мати лише один типовий StorageClass у вашому кластері. Причина, чому Kubernetes дозволяє вам мати кілька типових StorageClass, — це можливість безшовної міграції.
{{< /note >}}

Ви можете створити PersistentVolumeClaim, не вказуючи `storageClassName` для нового PVC, і ви можете це зробити навіть тоді, коли у вашому кластері немає типового StorageClass. У цьому випадку новий PVC створюється так, як ви його визначили, і `storageClassName` цього PVC залишається невизначеним до тих пір, поки не стане доступний типовий StorageClass.

Ви можете мати кластер без типового StorageClass. Якщо ви не встановлюєте жодного StorageClass як типового (і його не визначено, наприклад, постачальником хмари), то Kubernetes не може застосовувати ці типові класи до PersistentVolumeClaims, які йому потрібні.

Якщо або коли стає доступний типовий StorageClass, система керування визначає будь-які наявні PVC без `storageClassName`. Для PVC, які або мають порожнє значення для `storageClassName`, або не мають цього ключа, система керування потім оновлює ці PVC, щоб встановити `storageClassName` відповідно до нового типового StorageClass. Якщо у вас є наявний PVC з `storageClassName` `""`, і ви налаштовуєте типовий StorageClass, то цей PVC не буде оновлено.

Щоб продовжити привʼязку до PV із `storageClassName`, встановленим як `""` (при наявності типового StorageClass), вам потрібно встановити `storageClassName` асоційованого PVC як `""`.

## Постачальник {#provisioner}

У кожного StorageClass є постачальник, який визначає, який модуль обробника тому використовується для надання PV. Це поле повинно бути визначено.

| Модуль обробника тому   | Внутрішній постачальник |            Приклад конфігурації            |
| :---------------------- | :---------------------: | :----------------------------------------: |
| AzureFile               |        &#x2713;         |       [Azure File](#azure-file)            |
| CephFS                  |           -             |                   -                        |
| FC                      |           -             |                   -                        |
| FlexVolume              |           -             |                   -                        |
| iSCSI                   |           -             |                   -                        |
| Local                   |           -             |            [Local](#local)                 |
| NFS                     |           -             |              [NFS](#nfs)                   |
| PortworxVolume          |        &#x2713;         |  [Portworx Volume](#portworx-volume)       |
| RBD                     |           -             |         [Ceph RBD](#ceph-rbd)              |
| VsphereVolume           |        &#x2713;         |          [vSphere](#vsphere)               |

Ви не обмежені вказанням "внутрішніх" постачальників, вказаних тут (імена яких починаються з "kubernetes.io" і входять до складу Kubernetes). Ви також можете запускати і вказувати зовнішні постачальники, які є незалежними програмами і слідують [специфікації](https://git.k8s.io/design-proposals-archive/storage/volume-provisioning.md), визначеній Kubernetes. Автори зовнішніх постачальників мають на власний розсуд поводитись щодо того, де розташований їх код, як постачальник надається, як його слід запускати, який модуль обробника тому він використовує (включаючи Flex) тощо.
У репозиторії [kubernetes-sigs/sig-storage-lib-external-provisioner](https://github.com/kubernetes-sigs/sig-storage-lib-external-provisioner) знаходиться бібліотека для написання зовнішніх постачальників, яка реалізує більшість специфікації. Деякі зовнішні постачальники перелічені у репозиторії [kubernetes-sigs/sig-storage-lib-external-provisioner](https://github.com/kubernetes-sigs/sig-storage-lib-external-provisioner).

Наприклад, NFS не надає внутрішнього постачальника, але можна використовувати зовнішній. Існують також випадки, коли сторонні виробники систем зберігання надають свій власний зовнішній постачальник.

## Політика повторного використання {#reclaim-policy}

PersistentVolumes, які динамічно створюються за допомогою StorageClass, матимуть [політику повторного використання](/docs/concepts/storage/persistent-volumes/#reclaiming) вказану в полі `reclaimPolicy` класу, яке може бути або `Delete`, або `Retain`. Якщо поле `reclaimPolicy` не вказано при створенні обʼєкта StorageClass, то типово воно буде `Delete`.

PersistentVolumes, які створені вручну та управляються за допомогою StorageClass, матимуть таку політику повторного використання, яку їм було призначено при створенні.

## Розширення тому {#allow-volume-expansion}

PersistentVolumes можуть бути налаштовані на розширення. Це дозволяє змінювати розмір тому, редагуючи відповідний обʼєкт PVC і запитуючи новий, більший том зберігання.

Наступні типи томів підтримують розширення тому, коли базовий StorageClass має поле `allowVolumeExpansion`, встановлене в значення true.

{{< table caption = "Таблиця типів томів та версії Kubernetes, які вони вимагають для розширення тому" >}}

| Тип тому             | Потрібна версія Kubernetes для розширення тому |
| :------------------- | :--------------------------------------------- |
| Azure File           | 1.11                                           |
| CSI                  | 1.24                                           |
| FlexVolume           | 1.13                                           |
| Portworx             | 1.11                                           |
| rbd                  | 1.11                                           |

{{< /table >}}

{{< note >}}
Ви можете використовувати функцію розширення тому лише для збільшення тому, але не для його зменшення.
{{< /note >}}

## Опції монтування {#mount-options}

PersistentVolumes, які динамічно створюються за допомогою StorageClass, матимуть опції монтування, вказані в полі `mountOptions` класу.

Якщо обʼєкт тому не підтримує опції монтування, але вони вказані, створення тому завершиться невдачею. Опції монтування **не** перевіряються ні на рівні класу, ні на рівні PV. Якщо опція монтування є недійсною, монтування PV не вдасться.

## Режим привʼязки тому {#volume-binding-mode}

Поле `volumeBindingMode` керує тим, коли [привʼязка тому та динамічне створення](/docs/concepts/storage/persistent-volumes/#provisioning) повинно відбуватися. Коли воно не встановлене, типово використовується режим `Immediate`.

Режим `Immediate` вказує, що привʼязка тому та динамічне створення відбувається після створення PersistentVolumeClaim. Для сховищ, які обмежені топологією і не доступні з усіх вузлів в кластері, PersistentVolumes буде привʼязаний або створений без знання про планування Podʼа. Це може призвести до неможливості планування Podʼів.

Адміністратор кластера може розвʼязати цю проблему, вказавши режим `WaitForFirstConsumer`, який затримає привʼязку та створення PersistentVolume до створення Podʼа з PersistentVolumeClaim. PersistentVolumes будуть обрані або створені відповідно до топології, яку визначають обмеження планування Podʼа. Сюди входять, але не обмежуються [вимоги до ресурсів](/docs/concepts/configuration/manage-resources-containers/), [селектори вузлів](/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector), [affinity та anti-affinity Podʼа](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity), і [taint та toleration](/docs/concepts/scheduling-eviction/taint-and-toleration).

Наступні втулки підтримують `WaitForFirstConsumer` разом із динамічним створенням:

- CSI-томи, за умови, що конкретний драйвер CSI підтримує це

Наступні втулки підтримують `WaitForFirstConsumer` разом із попередньо створеною привʼязкою PersistentVolume:

- CSI-томи, за умови, що конкретний драйвер CSI підтримує це
- [`local`](#local)

{{< note >}}
Якщо ви вирішили використовувати `WaitForFirstConsumer`, не використовуйте `nodeName` в специфікації Podʼа, щоб вказати спорідненість (affinity) вузла. Якщо в цьому випадку використовується `nodeName`, планувальника буде оминати PVC і вона залишиться в стані `pending`.

Замість цього ви можете використовувати селектор вузла для `kubernetes.io/hostname`:
{{< /note >}}

{{% code_sample language="yaml" file="storage/storageclass/pod-volume-binding.yaml" %}}

## Дозволені топології {#allowed-topologies}

Коли оператор кластера вказує режим привʼязки тому `WaitForFirstConsumer`, в більшості випадків не потрібно обмежувати забезпечення конкретних топологій. Однак, якщо це все ще необхідно, можна вказати `allowedTopologies`.

У цьому прикладі показано, як обмежити топологію запроваджених томів конкретними зонами та використовувати як заміну параметрам `zone` та `zones` для підтримуваних втулків.

{{% code_sample language="yaml" file="storage/storageclass/storageclass-topology.yaml" %}}

## Параметри {#parameters}

У StorageClasses є параметри, які описують томи, які належать класу сховища. Різні параметри можуть прийматися залежно від `provisioner`. Коли параметр відсутній, використовується який-небудь типове значення.

Може бути визначено не більше 512 параметрів для StorageClass. Загальна довжина обʼєкта параметрів разом із ключами та значеннями не може перевищувати 256 КіБ.

### AWS EBS

<!-- maintenance note: OK to remove all mention of awsElasticBlockStore once the v1.27 release of
Kubernetes has gone out of support -->

У Kubernetes {{< skew currentVersion >}} не включено тип тому `awsElasticBlockStore`.

Драйвер зберігання AWSElasticBlockStore у вузлі був відзначений як застарілий у релізі Kubernetes v1.19 і повністю видалений у релізі v1.27.

Проєкт Kubernetes рекомендує використовувати [AWS EBS](https://github.com/kubernetes-sigs/aws-ebs-csi-driver) замість вбудованого драйвера зберігання.

Нижче подано приклад StorageClass для драйвера CSI AWS EBS:

{{% code_sample language="yaml" file="storage/storageclass/storageclass-aws-ebs.yaml" %}}

`tagSpecification`: Теґи з цим префіксом застосовуються до динамічно наданих томів EBS.

### AWS EFS

Щоб налаштувати сховище AWS EFS, можна використовувати сторонній драйвер [AWS_EFS_CSI_DRIVER](https://github.com/kubernetes-sigs/aws-efs-csi-driver).

{{% code_sample language="yaml" file="storage/storageclass/storageclass-aws-efs.yaml" %}}

- `provisioningMode`: Тип тому, що створюється за допомогою Amazon EFS. Наразі підтримується лише створення на основі точки доступу (`efs-ap`).
- `fileSystemId`: Файлова система, під якою створюється точка доступу.
- `directoryPerms`: Дозволи на теки для кореневої теки, створеної точкою доступу.

Для отримання додаткової інформації зверніться до документації [AWS_EFS_CSI_Driver Dynamic Provisioning](https://github.com/kubernetes-sigs/aws-efs-csi-driver/blob/master/examples/kubernetes/dynamic_provisioning/README.md).

### NFS

Для налаштування NFS-сховища можна використовувати вбудований драйвер або [драйвер CSI для NFS в Kubernetes](https://github.com/kubernetes-csi/csi-driver-nfs#readme)
(рекомендовано).

{{% code_sample language="yaml" file="storage/storageclass/storageclass-nfs.yaml" %}}

- `server`: Server — це імʼя хосту або IP-адреса сервера NFS.
- `path`: Шлях, який експортується сервером NFS.
- `readOnly`: Прапорець, який вказує, чи буде сховище змонтовано тільки для читання (типово – false).

Kubernetes не включає внутрішній NFS-провайдер. Вам потрібно використовувати зовнішній провайдер для створення StorageClass для NFS. Ось деякі приклади:

- [Сервер NFS Ganesha та зовнішній провайдер](https://github.com/kubernetes-sigs/nfs-ganesha-server-and-external-provisioner)
- [Зовнішній провайдер NFS subdir](https://github.com/kubernetes-sigs/nfs-subdir-external-provisioner)

### vSphere

Існують два типи провайдерів для класів сховища vSphere:

- [CSI провайдер](#vsphere-provisioner-csi): `csi.vsphere.vmware.com`
- [vCP провайдер](#vcp-provisioner): `kubernetes.io/vsphere-volume`

Вбудовані провайдери [застарілі](/blog/2019/12/09/kubernetes-1-17-feature-csi-migration-beta/#why-are-we-migrating-in-tree-plugins-to-csi). Для отримання додаткової інформації про провайдера CSI, див. [Kubernetes vSphere CSI Driver](https://vsphere-csi-driver.sigs.k8s.io/) та [міграцію vSphereVolume CSI](/docs/concepts/storage/volumes/#vsphere-csi-migration).

#### CSI провайдер {#vsphere-provisioner-csi}

Постачальник сховища StorageClass для vSphere CSI працює з кластерами Tanzu Kubernetes. Для прикладу див. [репозитарій vSphere CSI](https://github.com/kubernetes-sigs/vsphere-csi-driver/blob/master/example/vanilla-k8s-RWM-filesystem-volumes/example-sc.yaml).

#### vCP провайдер {#vcp-provisioner}

У наступних прикладах використовується постачальник сховища VMware Cloud Provider (vCP).

1. Створіть StorageClass із зазначенням формату диска користувачем.

   ```yaml
   apiVersion: storage.k8s.io/v1
   kind: StorageClass
   metadata:
     name: fast
   provisioner: kubernetes.io/vsphere-volume
   parameters:
     diskformat: zeroedthick
   ```

   `diskformat`: `thin`, `zeroedthick` та `eagerzeroedthick`. Стандартно: `"thin"`.

2. Створіть StorageClass із форматуванням диска на зазначеному користувачем сховищі.

   ```yaml
   apiVersion: storage.k8s.io/v1
   kind: StorageClass
   metadata:
     name: fast
   provisioner: kubernetes.io/vsphere-volume
   parameters:
     diskformat: zeroedthick
     datastore: VSANDatastore
   ```

   `datastore`: Користувач також може вказати сховище в StorageClass. Том буде створено на сховищі, вказаному в StorageClass, у цьому випадку — `VSANDatastore`. Це поле є необовʼязковим. Якщо сховище не вказано, том буде створено у сховищі, вказаному в конфігураційному файлі vSphere, який використовується для ініціалізації
   хмарного провайдера vSphere.

3. Керування політикою сховища в Kubernetes

   - Використання наявної політики SPBM vCenter

     Однією з найважливіших функцій vSphere для керування сховищем є керування на основі політики сховища (SPBM). Система управління сховищем на основі політики (SPBM) — це каркас політики сховища, який надає єдину уніфіковану панель управління для широкого спектра служб обробки даних та рішень зберігання. SPBM дозволяє адміністраторам vSphere подолати виклики щодо передбачуваного виділення сховища, такі як планування потужності, різні рівні обслуговування та управління потужністю.

     Політики SPBM можна вказати в StorageClass за допомогою параметра `storagePolicyName`.

   - Підтримка політики Virtual SAN всередині Kubernetes

     Адміністратори Vsphere Infrastructure (VI) будуть мати можливість вказувати власні віртуальні можливості сховища SAN під час динамічного виділення томів. Тепер ви можете визначити вимоги до сховища, такі як продуктивність та доступність, у вигляді можливостей сховища під час динамічного виділення томів. Вимоги до можливостей сховища перетворюються в політику Virtual SAN, яка потім передається на рівень віртуального SAN при створенні постійного тому (віртуального диска). Віртуальний диск розподіляється по сховищу віртуального SAN для відповідності вимогам.

     Детальнішу інформацію щодо використання політик сховища для управління постійними томами можна переглянути в [Керуванні політикою на основі зберігання для динамічного виділення томів](https://github.com/vmware-archive/vsphere-storage-for-kubernetes/blob/fa4c8b8ad46a85b6555d715dd9d27ff69839df53/documentation/policy-based-mgmt.md).

### Ceph RBD (застарілий) {#ceph-rbd}

{{< note >}}
{{< feature-state state="deprecated" for_k8s_version="v1.28" >}}
Цей внутрішній провайдер Ceph RBD застарів. Будь ласка, використовуйте [CephFS RBD CSI driver](https://github.com/ceph/ceph-csi).
{{< /note >}}

{{% code_sample language="yaml" file="storage/storageclass/storageclass-ceph-rbd.yaml" %}}

- `monitors`: Монітори Ceph, розділені комою. Цей параметр є обовʼязковим.
- `adminId`: Ідентифікатор клієнта Ceph, який може створювати образи в пулі. Типово — "admin".
- `adminSecretName`: Імʼя секрету для `adminId`. Цей параметр є обовʼязковим. Наданий секрет повинен мати тип "kubernetes.io/rbd".
- `adminSecretNamespace`: Простір імен для `adminSecretName`. Типово — "default".
- `pool`: Ceph RBD pool. Типово — "rbd".
- `userId`: Ідентифікатор клієнта Ceph, який використовується для зіставлення образу RBD. Типово — такий самий, як і `adminId`.
- `userSecretName`: Імʼя Ceph Secret для `userId` для зіставлення образу RBD. Він повинен існувати в тому ж просторі імен, що і PVC. Цей параметр є обовʼязковим. Наданий секрет повинен мати тип "kubernetes.io/rbd", наприклад, створений таким чином:

  ```shell
  kubectl create secret generic ceph-secret --type="kubernetes.io/rbd" \
    --from-literal=key='QVFEQ1pMdFhPUnQrSmhBQUFYaERWNHJsZ3BsMmNjcDR6RFZST0E9PQ==' \
    --namespace=kube-system
  ```

- `userSecretNamespace`: Простір імен для `userSecretName`.
- `fsType`: fsType, який підтримується Kubernetes. Типово: `"ext4"`.
- `imageFormat`: Формат образу Ceph RBD, "1" або "2". Типово — "2".
- `imageFeatures`: Цей параметр є необовʼязковим і слід використовувати тільки в разі якщо ви встановили `imageFormat` на "2". Зараз підтримуються тільки функції
  `layering`. Типово — "", і жодна функція не включена.

### Azure Disk

<!-- maintenance note: OK to remove all mention of azureDisk once the v1.27 release of
Kubernetes has gone out of support -->

У Kubernetes {{< skew currentVersion >}} не включено типу тому `azureDisk`.

Внутрішній драйвер зберігання `azureDisk` був застарілий у випуску Kubernetes v1.19 і потім був повністю вилучений у випуску v1.27.

Проєкт Kubernetes рекомендує використовувати замість цього сторонній драйвер зберігання [Azure Disk](https://github.com/kubernetes-sigs/azuredisk-csi-driver).

### Azure File (застаріло) {#azure-file}

{{% code_sample language="yaml" file="storage/storageclass/storageclass-azure-file.yaml" %}}

- `skuName`: Рівень SKU облікового запису Azure Storage. Типово відсутній.
- `location`: Місце розташування облікового запису Azure Storage. Типово відсутнє.
- `storageAccount`: Назва облікового запису Azure Storage. Типово відсутня. Якщо обліковий запис зберігання не наданий, весь обліковий запис, повʼязаний із групою ресурсів, перевіряється на наявність збігу `skuName` та `location`. Якщо обліковий запис зберігання надано, він повинен перебувати в тій самій групі ресурсів, що й кластер, і значення `skuName` та `location` ігноруються.
- `secretNamespace`: простір імен секрету, що містить імʼя та ключ облікового запису Azure Storage. Типово такий самий, як у Pod.
- `secretName`: імʼя секрету, що містить імʼя та ключ облікового запису Azure Storage. Типово `azure-storage-account-<accountName>-secret`.
- `readOnly`: прапорець, що вказує, чи буде ресурс зберігання монтуватися лише для читання. Типово `false`, що означає монтування для читання/запису. Це значення впливає також на налаштування `ReadOnly` в `VolumeMounts`.

Під час надання ресурсів зберігання, для монтованих облікових даних створюється секрет з імʼям `secretName`. Якщо кластер активував як [RBAC](/docs/reference/access-authn-authz/rbac/), так і [Ролі контролера](/docs/reference/access-authn-authz/rbac/#controller-roles), додайте дозвіл `create` ресурсу `secret` для clusterrole контролера
`system:controller:persistent-volume-binder`.

У контексті multi-tenancy наполегливо рекомендується явно встановлювати значення для `secretNamespace`, інакше дані облікового запису для зберігання можуть бути прочитані іншими користувачами.

### Portworx volume (застаріло) {#portworx-volume}

{{% code_sample language="yaml" file="storage/storageclass/storageclass-portworx-volume.yaml" %}}

- `fs`: файлова система для створення: `none/xfs/ext4` (типово: `ext4`).
- `block_size`: розмір блоку у кілобайтах (типово: `32`).
- `repl`: кількість синхронних реплік у формі коефіцієнта реплікації `1..3` (типово: `1`). Тут потрібен рядок, наприклад `"1"`, а не `1`.
- `priority_io`: визначає, чи буде том створений з використанням зберігання високої чи низької пріоритетності `high/medium/low` (типово: `low`).
- `snap_interval`: інтервал годинника/часу у хвилинах для того, щоб запускати моментальні знімки. Моментальні знімки є інкрементальними на основі різниці з попереднім знімком, 0 вимикає знімки (типово: `0`). Тут потрібен рядок, наприклад `"70"`, а не `70`.
- `aggregation_level`: вказує кількість частин, на які розподілений том, 0 вказує на нерозподілений том (типово: `0`). Тут потрібен рядок, наприклад `"0"`, а не `0`.
- `ephemeral`: вказує, чи слід очищати том після відмонтовування, чи він повинен бути постійним. Використання випадку `emptyDir` може встановлювати для цього значення `true`, а випадок використання `постійних томів`, таких як для баз даних, наприклад Cassandra, повинен встановлювати `false`, `true/false` (типово `false`). Тут потрібен рядок, наприклад `"true"`, а не `true`.

### Локальне сховище {#local}

{{% code_sample language="yaml" file="storage/storageclass/storageclass-local.yaml" %}}

Локальні томи не підтримують динамічне впровадження в Kubernetes {{< skew currentVersion >}}; однак все одно слід створити StorageClass, щоб відкласти звʼязування тому до моменту фактичного планування Podʼа на відповідний вузол. Це вказано параметром звʼязування тому `WaitForFirstConsumer`.

Відкладення звʼязування тому дозволяє планувальнику враховувати всі обмеження планування Podʼа при виборі відповідного PersistenVolume для PersistenVolumeClaim.
