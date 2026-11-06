---
title: Класи сховищ
api_metadata:
- apiVersion: "storage.k8s.io/v1"
  kind: "StorageClass"
content_type: concept
weight: 40
---

<!-- overview -->

У цьому документі описано концепцію StorageClass у Kubernetes. Рекомендується ознайомитися з [томами](/docs/concepts/storage/volumes/) та [постійними томами](/docs/concepts/storage/persistent-volumes).

StorageClass надає адміністраторам можливість описати _класи_ сховища, які вони пропонують. Різні класи можуть відповідати рівням якості обслуговування, політикам резервного копіювання або довільним політикам, визначеним адміністраторами кластера. Сам Kubernetes не має власної думки щодо того, що представляють класи.

Концепція класу сховища в Kubernetes схожа на «профілі» в дизайні деяких інших систем зберігання.

<!-- body -->

## Обʼєкти StorageClass {#storageclass-objects}

Кожен StorageClass містить поля `provisioner`, `parameters` та `reclaimPolicy`, які використовуються, коли PersistentVolume, що належить до цього класу, потрібно надати динамічно, щоб задовольнити PersistentVolumeClaim (PVC).

Назва обʼєкта StorageClass є важливою: саме за нею користувачі можуть запитати певний клас. Адміністратори встановлюють назву та інші параметри класу під час першого створення обʼєктів StorageClass.

Як адміністратор, ви можете вказати стандартний StorageClass, який застосовується до будь-яких PVC, що не запитують конкретний клас. Докладніше дивіться [концепцію PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims).

Ось приклад StorageClass:

{{% code_sample file="storage/storageclass-low-latency.yaml" %}}

## Стандартний StorageClass {#default-storageclass}

Ви можете позначити StorageClass як стандартний для свого кластера. Інструкції щодо встановлення стандартного StorageClass дивіться в [Зміна стандартного StorageClass](/docs/tasks/administer-cluster/change-default-storage-class/).

Якщо PVC не вказує `storageClassName`, використовується стандартний StorageClass.

Якщо ви встановите анотацію [`storageclass.kubernetes.io/is-default-class`](/docs/reference/labels-annotations-taints/#storageclass-kubernetes-io-is-default-class) у true для кількох StorageClass у своєму кластері, а потім створите PersistentVolumeClaim без встановленого `storageClassName`, Kubernetes використає найновіший стандартний StorageClass.

{{< note >}}
Намагайтеся мати у своєму кластері лише один StorageClass, позначений як стандартний. Kubernetes дозволяє мати кілька стандартних StorageClasses, щоб забезпечити безшовну міграцію.
{{< /note >}}

Ви можете створити PersistentVolumeClaim, не вказуючи `storageClassName` для нового PVC, навіть якщо у вашому кластері немає стандартного StorageClass. У цьому випадку новий PVC створюється так, як ви його визначили, а `storageClassName` цього PVC залишається невстановленим, доки не стане доступним стандартний клас.

Ви можете мати кластер без стандартного StorageClass. Якщо ви не позначите жоден StorageClass як стандартний (і його не встановлено для вас, наприклад, хмарним провайдером), Kubernetes не зможе застосувати це стандартне значення до PersistentVolumeClaims, яким воно потрібне.

Якщо або коли стандартний StorageClass стає доступним, панель управління визначає всі наявні PVC без `storageClassName`. Для PVC, які мають порожнє значення `storageClassName` або не мають цього ключа, панель управління оновлює `storageClassName` відповідно до нового стандартного StorageClass. Якщо у вас є наявний PVC, де `storageClassName` має значення `""`, і ви налаштовуєте стандартний StorageClass, цей PVC не буде оновлено.

Щоб і надалі привʼязуватися до PV із `storageClassName`, встановленим у `""` (за наявності стандартного StorageClass), вам потрібно встановити `storageClassName` повʼязаного PVC у `""`.

## Provisioner {#provisioner}

Кожен StorageClass має provisioner, який визначає, який втулок томів використовується для надання PV. Це поле є обовʼязковим.

| Втулок томів            | Внутрішній provisioner  |            Приклад конфігурації            |
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

Ви не обмежені вказанням перелічених тут «внутрішніх» provisioners (назви яких мають префікс "kubernetes.io" і які постачаються разом із Kubernetes). Ви також можете запускати та вказувати зовнішні provisioners — незалежні програми, які відповідають [специфікації](https://github.com/kubernetes/design-proposals-archive/blob/main/storage/volume-provisioning.md), визначеній Kubernetes. Автори зовнішніх provisioners мають повну свободу щодо того, де розміщено їхній код, як постачається provisioner, як його потрібно запускати, який втулок томів він використовує (зокрема Flex) тощо. У репозиторії [kubernetes-sigs/sig-storage-lib-external-provisioner](https://github.com/kubernetes-sigs/sig-storage-lib-external-provisioner) розміщено бібліотеку для написання зовнішніх provisioners, яка реалізує більшу частину специфікації. Деякі зовнішні provisioners перелічено в репозиторії [kubernetes-sigs/sig-storage-lib-external-provisioner](https://github.com/kubernetes-sigs/sig-storage-lib-external-provisioner).

Наприклад, NFS не надає внутрішнього provisioner, але можна використовувати зовнішній. Також трапляється, що сторонні постачальники сховищ надають власний зовнішній provisioner.

## Політика повторного використання {#reclaim-policy}

PersistentVolumes, які динамічно створюються за допомогою StorageClass, матимуть [політику повторного використання](/docs/concepts/storage/persistent-volumes/#reclaiming), вказану в полі `reclaimPolicy` класу, яка може бути `Delete` або `Retain`. Якщо `reclaimPolicy` не вказано під час створення обʼєкта StorageClass, стандартним значенням буде `Delete`.

PersistentVolumes, створені вручну та керовані за допомогою StorageClass, матимуть ту політику повторного використання, яку їм було призначено під час створення.

## Розширення томів {#allow-volume-expansion}

PersistentVolumes можна налаштувати як розширювані. Це дозволяє змінювати розмір тому, редагуючи відповідний обʼєкт PVC і запитуючи новий, більший обсяг сховища.

Такі типи томів підтримують розширення, коли базовий StorageClass має поле `allowVolumeExpansion` зі значенням true.

{{< table caption = "Таблиця типів томів і версій Kubernetes, яких вони потребують" >}}

| Тип тому             | Потрібна версія Kubernetes для розширення тому |
| :------------------- | :--------------------------------------------- |
| Azure File           | 1.11                                           |
| CSI                  | 1.24                                           |
| FlexVolume           | 1.13                                           |
| Portworx             | 1.11                                           |
| rbd                  | 1.11                                           |

{{< /table >}}

{{< note >}}
Можливість розширення томів можна використовувати лише для збільшення тому, але не для його зменшення.
{{< /note >}}

## Параметри монтування {#mount-options}

PersistentVolumes, які динамічно створюються за допомогою StorageClass, матимуть параметри монтування, вказані в полі `mountOptions` класу.

Якщо втулок томів не підтримує параметри монтування, але їх вказано, надання завершиться невдачею. Параметри монтування **не** перевіряються ні на рівні класу, ні на рівні PV. Якщо параметр монтування недійсний, монтування PV завершиться невдачею.

## Режим привʼязки тому {#volume-binding-mode}

Поле `volumeBindingMode` визначає, коли мають відбуватися [привʼязка томів і динамічне надання](/docs/concepts/storage/persistent-volumes/#provisioning). Якщо його не встановлено, стандартно використовується режим `Immediate`.

Режим `Immediate` означає, що привʼязка томів і динамічне надання відбуваються одразу після створення PersistentVolumeClaim. Для бекендів сховища, які обмежені топологією й не доступні глобально з усіх вузлів кластера, PersistentVolumes будуть привʼязані або надані без урахування вимог планування Podʼа. Це може призвести до Podʼів, не придатних для планування.

Адміністратор кластера може розвʼязати цю проблему, вказавши режим `WaitForFirstConsumer`, який відкладає привʼязку та надання PersistentVolume до створення Podʼа, що використовує PersistentVolumeClaim. PersistentVolumes будуть вибрані або надані відповідно до топології, заданої обмеженнями планування Podʼа. Це, зокрема, [вимоги до ресурсів](/docs/concepts/configuration/manage-resources-containers/), [селектори вузлів](/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector), [спорідненість та антиспорідненість Podʼів](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity), а також [taints і tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration).

Такі втулки підтримують `WaitForFirstConsumer` із динамічним наданням:

- Томи CSI, за умови, що конкретний драйвер CSI це підтримує

Такі втулки підтримують `WaitForFirstConsumer` із привʼязкою попередньо створених PersistentVolume:

- Томи CSI, за умови, що конкретний драйвер CSI це підтримує
- [`local`](#local)

{{< note >}}
Якщо ви вирішили використовувати `WaitForFirstConsumer`, не використовуйте `nodeName` у специфікації Podʼа для задання спорідненості вузла. Якщо в цьому випадку використати `nodeName`, планувальник буде оминуто, а PVC залишиться в стані `pending`.

Натомість ви можете використати селектор вузла для `kubernetes.io/hostname`:
{{< /note >}}

{{% code_sample language="yaml" file="storage/storageclass/pod-volume-binding.yaml" %}}

## Дозволені топології {#allowed-topologies}

Коли оператор кластера вказує режим привʼязки томів `WaitForFirstConsumer`, у більшості випадків більше не потрібно обмежувати надання конкретними топологіями. Однак, якщо це все ще потрібно, можна вказати `allowedTopologies`.

У цьому прикладі показано, як обмежити топологію наданих томів конкретними зонами; це слід використовувати як заміну параметрам `zone` та `zones` для підтримуваних втулків.

{{% code_sample language="yaml" file="storage/storageclass/storageclass-topology.yaml" %}}

## Параметри {#parameters}

StorageClasses мають параметри, які описують томи, що належать до класу сховища. Залежно від `provisioner` можуть прийматися різні параметри. Якщо параметр пропущено, використовується певне стандартне значення.

Для StorageClass можна визначити не більше 512 параметрів. Загальна довжина обʼєкта параметрів, включно з ключами та значеннями, не може перевищувати 256 KiB.

### AWS EBS

<!-- maintenance note: OK to remove all mention of awsElasticBlockStore once the v1.27 release of
Kubernetes has gone out of support -->

Kubernetes {{< skew currentVersion >}} не містить типу тому `awsElasticBlockStore`.

Вбудований драйвер сховища AWSElasticBlockStore визнано застарілим у випуску Kubernetes v1.19, а потім повністю вилучено у випуску v1.27.

Проєкт Kubernetes пропонує натомість використовувати зовнішній драйвер сховища [AWS EBS](https://github.com/kubernetes-sigs/aws-ebs-csi-driver).

Ось приклад StorageClass для драйвера CSI AWS EBS:

{{% code_sample language="yaml" file="storage/storageclass/storageclass-aws-ebs.yaml" %}}

`tagSpecification`: Теґи з цим префіксом застосовуються до динамічно наданих томів EBS.

### AWS EFS

Щоб налаштувати сховище AWS EFS, можна використовувати зовнішній драйвер [AWS_EFS_CSI_DRIVER](https://github.com/kubernetes-sigs/aws-efs-csi-driver).

{{% code_sample language="yaml" file="storage/storageclass/storageclass-aws-efs.yaml" %}}

- `provisioningMode`: Тип тому, який надає Amazon EFS. Наразі підтримується лише надання на основі точки доступу (`efs-ap`).
- `fileSystemId`: Файлова система, під якою створюється точка доступу.
- `directoryPerms`: Дозволи кореневої теки, створеної точкою доступу.

Докладніше дивіться в документації [AWS_EFS_CSI_Driver Dynamic Provisioning](https://github.com/kubernetes-sigs/aws-efs-csi-driver/blob/master/examples/kubernetes/efs/dynamic_provisioning/README.md).

### NFS

Щоб налаштувати сховище NFS, можна використовувати вбудований драйвер або [драйвер CSI для NFS у Kubernetes](https://github.com/kubernetes-csi/csi-driver-nfs#readme) (рекомендовано).

{{% code_sample language="yaml" file="storage/storageclass/storageclass-nfs.yaml" %}}

- `server`: Server — це імʼя хоста або IP-адреса сервера NFS.
- `path`: Шлях, який експортується сервером NFS.
- `readOnly`: Прапорець, який вказує, чи буде сховище змонтовано лише для читання (стандартно false).

Kubernetes не містить внутрішнього provisioner для NFS. Щоб створити StorageClass для NFS, потрібно використовувати зовнішній provisioner. Ось кілька прикладів:

- [Сервер NFS Ganesha та зовнішній provisioner](https://github.com/kubernetes-sigs/nfs-ganesha-server-and-external-provisioner)
- [NFS subdir external provisioner](https://github.com/kubernetes-sigs/nfs-subdir-external-provisioner)

### vSphere

Існує два типи provisioners для класів сховища vSphere:

- [Provisioner CSI](#vsphere-provisioner-csi): `csi.vsphere.vmware.com`
- [Provisioner vCP](#vcp-provisioner): `kubernetes.io/vsphere-volume`

Вбудовані provisioners [застаріли](/blog/2019/12/09/kubernetes-1-17-feature-csi-migration-beta/#why-are-we-migrating-in-tree-plugins-to-csi). Докладніше про provisioner CSI дивіться в [Kubernetes vSphere CSI Driver](https://vsphere-csi-driver.sigs.k8s.io/) та [міграції vSphereVolume на CSI](/docs/concepts/storage/volumes/#vsphere-csi-migration).

#### Provisioner CSI {#vsphere-provisioner-csi}

Provisioner StorageClass для vSphere CSI працює з кластерами Tanzu Kubernetes. Приклад дивіться в [репозиторії vSphere CSI](https://github.com/kubernetes-sigs/vsphere-csi-driver/blob/master/example/vanilla-k8s-RWM-filesystem-volumes/example-sc.yaml).

#### Provisioner vCP {#vcp-provisioner}

У наведених нижче прикладах використовується provisioner StorageClass VMware Cloud Provider (vCP).

1. Створіть StorageClass із форматом диска, вказаним користувачем.

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

2. Створіть StorageClass із форматом диска на вказаному користувачем сховищі даних.

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

   `datastore`: Користувач також може вказати datastore у StorageClass. Том буде створено в datastore, вказаному в StorageClass, у цьому випадку — `VSANDatastore`. Це поле є необовʼязковим. Якщо datastore не вказано, том буде створено в datastore, вказаному у файлі конфігурації vSphere, який використовується для ініціалізації хмарного провайдера vSphere.

3. Керування політикою сховища в Kubernetes

   - Використання наявної політики SPBM vCenter

     Однією з найважливіших можливостей vSphere для керування сховищем є керування на основі політик. Керування сховищем на основі політик (Storage Policy Based Management, SPBM) — це фреймворк політик сховища, який надає єдину уніфіковану панель управління для широкого спектра сервісів даних і рішень зберігання. SPBM дозволяє адміністраторам vSphere долати початкові проблеми надання сховища, такі як планування місткості, диференційовані рівні обслуговування та керування запасом місткості.

     Політики SPBM можна вказати в StorageClass за допомогою параметра `storagePolicyName`.

   - Підтримка політики Virtual SAN всередині Kubernetes

     Адміністратори Vsphere Infrastructure (VI) матимуть змогу вказувати власні можливості сховища Virtual SAN під час динамічного надання томів. Тепер ви можете визначати вимоги до сховища, такі як продуктивність і доступність, у вигляді можливостей сховища під час динамічного надання томів. Вимоги до можливостей сховища перетворюються на політику Virtual SAN, яка потім передається на рівень Virtual SAN під час створення постійного тому (віртуального диска). Віртуальний диск розподіляється по сховищу даних Virtual SAN відповідно до вимог.

     Докладніше про використання політик сховища для керування постійними томами дивіться в [Storage Policy Based Management for dynamic provisioning of volumes](https://github.com/vmware-archive/vsphere-storage-for-kubernetes/blob/fa4c8b8ad46a85b6555d715dd9d27ff69839df53/documentation/policy-based-mgmt.md).

### Ceph RBD (застаріло) {#ceph-rbd}

{{< note >}}
{{< feature-state state="deprecated" for_k8s_version="v1.28" >}}
Цей внутрішній provisioner Ceph RBD застарів. Використовуйте [CephFS RBD CSI driver](https://github.com/ceph/ceph-csi).
{{< /note >}}

{{% code_sample language="yaml" file="storage/storageclass/storageclass-ceph-rbd.yaml" %}}

- `monitors`: Монітори Ceph, розділені комою. Цей параметр є обовʼязковим.
- `adminId`: Ідентифікатор клієнта Ceph, який може створювати образи в пулі. Стандартно "admin".
- `adminSecretName`: Назва Secret для `adminId`. Цей параметр є обовʼязковим. Наданий Secret повинен мати тип "kubernetes.io/rbd".
- `adminSecretNamespace`: Простір імен для `adminSecretName`. Стандартно "default".
- `pool`: Пул Ceph RBD. Стандартно "rbd".
- `userId`: Ідентифікатор клієнта Ceph, який використовується для зіставлення образу RBD. Стандартно такий самий, як `adminId`.
- `userSecretName`: Назва Ceph Secret для `userId` для зіставлення образу RBD. Він має існувати в тому самому просторі імен, що й PVC. Цей параметр є обовʼязковим. Наданий Secret повинен мати тип "kubernetes.io/rbd", наприклад, створений таким чином:

  ```shell
  kubectl create secret generic ceph-secret --type="kubernetes.io/rbd" \
    --from-literal=key='QVFEQ1pMdFhPUnQrSmhBQUFYaERWNHJsZ3BsMmNjcDR6RFZST0E9PQ==' \
    --namespace=kube-system
  ```

- `userSecretNamespace`: Простір імен для `userSecretName`.
- `fsType`: fsType, який підтримує Kubernetes. Стандартно: `"ext4"`.
- `imageFormat`: Формат образу Ceph RBD, "1" або "2". Стандартно "2".
- `imageFeatures`: Цей параметр є необовʼязковим, і його слід використовувати лише тоді, коли ви встановили `imageFormat` у "2". Наразі підтримується лише можливість `layering`. Стандартно "", і жодну можливість не ввімкнено.

### Azure Disk

<!-- maintenance note: OK to remove all mention of azureDisk once the v1.27 release of
Kubernetes has gone out of support -->

Kubernetes {{< skew currentVersion >}} не містить типу тому `azureDisk`.

Вбудований драйвер сховища `azureDisk` визнано застарілим у випуску Kubernetes v1.19, а потім повністю вилучено у випуску v1.27.

Проєкт Kubernetes пропонує натомість використовувати сторонній драйвер сховища [Azure Disk](https://github.com/kubernetes-sigs/azuredisk-csi-driver).

### Azure File (застаріло) {#azure-file}

{{% code_sample language="yaml" file="storage/storageclass/storageclass-azure-file.yaml" %}}

- `skuName`: Рівень SKU облікового запису Azure Storage. Стандартно порожній.
- `location`: Розташування облікового запису Azure Storage. Стандартно порожнє.
- `storageAccount`: Назва облікового запису Azure Storage. Стандартно порожня. Якщо обліковий запис сховища не вказано, серед усіх облікових записів сховища, повʼязаних із групою ресурсів, шукається той, що відповідає `skuName` та `location`. Якщо обліковий запис сховища вказано, він має бути в тій самій групі ресурсів, що й кластер, а `skuName` та `location` ігноруються.
- `secretNamespace`: Простір імен Secret, що містить назву та ключ облікового запису Azure Storage. Стандартно той самий, що й у Podʼа.
- `secretName`: Назва Secret, що містить назву та ключ облікового запису Azure Storage. Стандартно `azure-storage-account-<accountName>-secret`.
- `readOnly`: Прапорець, який вказує, чи буде сховище змонтовано лише для читання. Стандартно false, що означає монтування для читання й запису. Це налаштування також впливає на налаштування `ReadOnly` у VolumeMounts.

Під час надання сховища для облікових даних монтування створюється Secret із назвою `secretName`. Якщо в кластері ввімкнено і [RBAC](/docs/reference/access-authn-authz/rbac/), і [ролі контролерів](/docs/reference/access-authn-authz/rbac/#controller-roles), додайте дозвіл `create` на ресурс `secret` для clusterrole `system:controller:persistent-volume-binder`.

У контексті багатоорендності наполегливо рекомендується явно встановлювати значення `secretNamespace`, інакше облікові дані облікового запису сховища можуть прочитати інші користувачі.

### Portworx volume (застаріло) {#portworx-volume}

{{% code_sample language="yaml" file="storage/storageclass/storageclass-portworx-volume.yaml" %}}

- `fs`: файлова система для створення: `none/xfs/ext4` (стандартно: `ext4`).
- `block_size`: розмір блоку в кілобайтах (стандартно: `32`).
- `repl`: кількість синхронних реплік у формі коефіцієнта реплікації `1..3` (стандартно: `1`). Тут очікується рядок, тобто `"1"`, а не `1`.
- `priority_io`: визначає, чи буде том створено зі сховища вищої продуктивності чи нижчого пріоритету: `high/medium/low` (стандартно: `low`).
- `snap_interval`: інтервал у хвилинах для запуску знімків. Знімки є інкрементними на основі різниці з попереднім знімком, 0 вимикає знімки (стандартно: `0`). Тут очікується рядок, тобто `"70"`, а не `70`.
- `aggregation_level`: вказує кількість частин, на які буде розподілено том, 0 означає неагрегований том (стандартно: `0`). Тут очікується рядок, тобто `"0"`, а не `0`.
- `ephemeral`: вказує, чи слід очищати том після відмонтування, чи він має бути постійним. Для випадку використання `emptyDir` це значення можна встановити в true, а для випадку `persistent volumes`, наприклад, для баз даних на кшталт Cassandra, слід установити false: `true/false` (стандартно `false`). Тут очікується рядок, тобто `"true"`, а не `true`.

### Локальне сховище {#local}

{{% code_sample language="yaml" file="storage/storageclass/storageclass-local.yaml" %}}

Локальні томи не підтримують динамічне надання в Kubernetes {{< skew currentVersion >}}; однак StorageClass однаково слід створити, щоб відкласти привʼязку тому до фактичного планування Podʼа на відповідний вузол. Це задається режимом привʼязки томів `WaitForFirstConsumer`.

Відкладення привʼязки тому дозволяє планувальнику враховувати всі обмеження планування Podʼа під час вибору відповідного PersistentVolume для PersistentVolumeClaim.
