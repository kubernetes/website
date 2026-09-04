---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "PersistentVolume"
content_type: "api_reference"
description: "PersistentVolume (PV) є ресурсом зберігання, який надається адміністратором. Він аналогічний вузлу. Детальніше: [https://kubernetes.io/docs/concepts/storage/persistent-volumes](/uk/docs/concepts/storage/persistent-volumes)"
title: "PersistentVolume"
weight: 80
auto_generated: false
---

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## PersistentVolume {#PersistentVolume}

PersistentVolume (PV)  є ресурсом зберігання, який надається адміністратором. Він аналогічний вузлу. Детальніше: [https://kubernetes.io/docs/concepts/storage/persistent-volumes](/uk/docs/concepts/storage/persistent-volumes)

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>APIVersion визначає версію схеми цього представлення обʼєкта. Сервери повинні конвертувати розпізнані схеми до останнього внутрішнього значення і можуть відхиляти нерозпізнані значення. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources</a></td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>Kind визначає тип REST-ресурсу, який представляє цей обʼєкт. Сервери можуть визначати це з точки доступу, до якої клієнт надсилає запити. Не може бути оновлено. У CamelCase. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</a></td>
    </tr>
    <tr>
      <td><code>metadata</code><br/><em><a href="{{< ref "../definitions/object-meta-v1-meta#ObjectMeta" >}}">ObjectMeta</a></em></td>
      <td>Стан стандартних метаданих обʼєкта. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata</a></td>
    </tr>
    <tr>
      <td><code>spec</code><br/><em><a href="{{< ref "#PersistentVolumeSpec" >}}">PersistentVolumeSpec</a></em></td>
      <td>spec визначає специфікацію постійного тому, що належить кластеру. Надається адміністратором. Детальніше: <a href="/uk/docs/concepts/storage/persistent-volumes#persistent-volumes">https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistent-volumes</a></td>
    </tr>
    <tr>
      <td><code>status</code><br/><em><a href="{{< ref "#PersistentVolumeStatus" >}}">PersistentVolumeStatus</a></em></td>
      <td>status представляє поточну інформацію/стан постійного тому. Заповнюється системою. Тільки для читання. Детальніше: <a href="/uk/docs/concepts/storage/persistent-volumes#persistent-volumes">https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistent-volumes</a></td>
    </tr>
  </tbody>
</table>

## PersistentVolumeSpec {#PersistentVolumeSpec}

PersistentVolumeSpec є специфікацією постійного тому.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>accessModes</code><br/><em>string array</em></td>
      <td>accessModes містить всі способи, якими том може бути змонтований. Детальніше: <a href="/uk/docs/concepts/storage/persistent-volumes#access-modes">https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes</a></td>
    </tr>
    <tr>
      <td><code>awsElasticBlockStore</code><br/><em><a href="{{< ref "#AWSElasticBlockStoreVolumeSource" >}}">AWSElasticBlockStoreVolumeSource</a></em></td>
      <td>awsElasticBlockStore представляє ресурс диска AWS, який підключається до хост-машини kubelet і потім надається поду. Застаріло: AWSElasticBlockStore застарів. Всі операції для типу awsElasticBlockStore перенаправляються до драйвера CSI ebs.csi.aws.com. Детальніше: <a href="/uk/docs/concepts/storage/volumes#awselasticblockstore">https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore</a></td>
    </tr>
    <tr>
      <td><code>azureDisk</code><br/><em><a href="{{< ref "#AzureDiskVolumeSource" >}}">AzureDiskVolumeSource</a></em></td>
      <td>azureDisk представляє монтування диска Azure Data на хості та привʼязку до поду. Застаріло: AzureDisk застарів. Всі операції для типу azureDisk перенаправляються до драйвера CSI disk.csi.azure.com.</td>
    </tr>
    <tr>
      <td><code>azureFile</code><br/><em><a href="{{< ref "#AzureFilePersistentVolumeSource" >}}">AzureFilePersistentVolumeSource</a></em></td>
      <td>azureFile представляє монтування служби Azure File на хості та привʼязку до поду. Застаріло: AzureFile застарів. Всі операції для типу azureFile перенаправляються до драйвера CSI file.csi.azure.com.</td>
    </tr>
    <tr>
      <td><code>capacity</code><br/><em>object</em></td>
      <td>capacity є описом ресурсів та ємності постійного тому. Детальніше: <a href="/uk/docs/concepts/storage/persistent-volumes#capacity">https://kubernetes.io/docs/concepts/storage/persistent-volumes#capacity</a></td>
    </tr>
    <tr>
      <td><code>cephfs</code><br/><em><a href="{{< ref "#CephFSPersistentVolumeSource" >}}">CephFSPersistentVolumeSource</a></em></td>
      <td>cephFS представляє монтування Ceph FS на хості, яке ділить життєвий цикл поду. Застаріло: CephFS застарів, і тип cephfs більше не підтримується.</td>
    </tr>
    <tr>
      <td><code>cinder</code><br/><em><a href="{{< ref "#CinderPersistentVolumeSource" >}}">CinderPersistentVolumeSource</a></em></td>
      <td>cinder представляє том Cinder, підключений і змонтований на хості kubelet. Застаріло: Cinder застарів. Всі операції для типу cinder перенаправляються до драйвера CSI cinder.csi.openstack.org. Детальніше: <a href="https://examples.k8s.io/mysql-cinder-pd/README.md">https://examples.k8s.io/mysql-cinder-pd/README.md</a></td>
    </tr>
    <tr>
      <td><code>claimRef</code><br/><em><a href="{{< ref "../definitions/object-reference-v1#ObjectReference" >}}">ObjectReference</a></em></td>
      <td>claimRef є частиною двостороннього звʼязку між PersistentVolume та PersistentVolumeClaim. Очікується, що буде ненульовим, коли звʼязок встановлено. claim.VolumeName є авторитетним звʼязком між PV та PVC. Детальніше: <a href="/uk/docs/concepts/storage/persistent-volumes#binding">https://kubernetes.io/docs/concepts/storage/persistent-volumes#binding</a></td>
    </tr>
    <tr>
      <td><code>csi</code><br/><em><a href="{{< ref "#CSIPersistentVolumeSource" >}}">CSIPersistentVolumeSource</a></em></td>
      <td>csi представляє сховище, яке обробляється зовнішнім драйвером CSI.</td>
    </tr>
    <tr>
      <td><code>fc</code><br/><em><a href="{{< ref "#FCVolumeSource" >}}">FCVolumeSource</a></em></td>
      <td>fc представляє ресурс Fibre Channel, який підключається до хост-машини kubelet і потім надається поду.</td>
    </tr>
    <tr>
      <td><code>flexVolume</code><br/><em><a href="{{< ref "#FlexPersistentVolumeSource" >}}">FlexPersistentVolumeSource</a></em></td>
      <td>flexVolume представляє загальний ресурс тому, який надається/підключається за допомогою втулка на основі exec. Застаріло: FlexVolume застарів. Розгляньте можливість використання CSIDriver замість цього.</td>
    </tr>
    <tr>
      <td><code>flocker</code><br/><em><a href="{{< ref "#FlockerVolumeSource" >}}">FlockerVolumeSource</a></em></td>
      <td>flocker представляє том Flocker, підключений до хост-машини kubelet і наданий поду для використання. Це залежить від того, що служба керування Flocker працює. Застаріло: Flocker застарів, і тип flocker більше не підтримується.</td>
    </tr>
    <tr>
      <td><code>gcePersistentDisk</code><br/><em><a href="{{< ref "#GCEPersistentDiskVolumeSource" >}}">GCEPersistentDiskVolumeSource</a></em></td>
      <td>gcePersistentDisk представляє ресурс диска GCE, який підключається до хост-машини kubelet і потім надається поду. Надається адміністратором. Застаріло: GCEPersistentDisk застарів. Всі операції для типу gcePersistentDisk перенаправляються до драйвера CSI pd.csi.storage.gke.io. Детальніше: <a href="/uk/docs/concepts/storage/volumes#gcepersistentdisk">https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk</a></td>
    </tr>
    <tr>
      <td><code>glusterfs</code><br/><em><a href="{{< ref "#GlusterfsPersistentVolumeSource" >}}">GlusterfsPersistentVolumeSource</a></em></td>
      <td>glusterfs представляє том Glusterfs, який підключається до хост-машини і надається поду. Надається адміністратором. Застаріло: Glusterfs застарів, і тип glusterfs більше не підтримується. Детальніше: <a href="https://examples.k8s.io/volumes/glusterfs/README.md">https://examples.k8s.io/volumes/glusterfs/README.md</a></td>
    </tr>
    <tr>
      <td><code>hostPath</code><br/><em><a href="{{< ref "#HostPathVolumeSource" >}}">HostPathVolumeSource</a></em></td>
      <td>hostPath представляє теку на хості. Надається розробником або тестувальником. Це корисно лише для розробки та тестування на одновузловій системі! Зберігання на хості не підтримується і НЕ ПРАЦЮВАТИМЕ в багатовузловому кластері. Детальніше: <a href="https://kubernetes.io/docs/concepts/storage/volumes#hostpath">https://kubernetes.io/docs/concepts/storage/volumes#hostpath</a></td>
    </tr>
    <tr>
      <td><code>iscsi</code><br/><em><a href="{{< ref "#ISCSIPersistentVolumeSource" >}}">ISCSIPersistentVolumeSource</a></em></td>
      <td>iscsi представляє ресурс диска ISCSI, який підключається до хост-машини kubelet і потім надається поду. Надається адміністратором.</td>
    </tr>
    <tr>
      <td><code>local</code><br/><em><a href="{{< ref "#LocalVolumeSource" >}}">LocalVolumeSource</a></em></td>
      <td>local представляє безпосередньо підключене сховище зі спорідненістю до вузла</td>
    </tr>
    <tr>
      <td><code>mountOptions</code><br/><em>string array</em></td>
      <td>mountOptions є списком параметрів монтування, наприклад ["ro", "soft"]. Не перевіряється — монтування просто не вдасться, якщо один з параметрів недійсний. Детальніше: <a href="/uk/docs/concepts/storage/persistent-volumes/#mount-options">https://kubernetes.io/docs/concepts/storage/persistent-volumes/#mount-options</a></td>
    </tr>
    <tr>
      <td><code>nfs</code><br/><em><a href="{{< ref "#NFSVolumeSource" >}}">NFSVolumeSource</a></em></td>
      <td>nfs представляє монтування NFS на хості. Надається адміністратором. Детальніше: <a href="/uk/docs/concepts/storage/volumes#nfs">https://kubernetes.io/docs/concepts/storage/volumes#nfs</a></td>
    </tr>
    <tr>
      <td><code>nodeAffinity</code><br/><em><a href="{{< ref "#VolumeNodeAffinity" >}}">VolumeNodeAffinity</a></em></td>
      <td>nodeAffinity визначає обмеження, які обмежують, з яких вузлів цей том може бути доступний. Це поле впливає на планування подів, які використовують цей том. Це поле можна змінювати, якщо увімкнено функціональну можливість MutablePVNodeAffinity.</td>
    </tr>
    <tr>
      <td><code>persistentVolumeReclaimPolicy</code><br/><em>string</em></td>
      <td>persistentVolumeReclaimPolicy визначає, що відбувається з постійним томом після його звільнення від заявки. Дійсні варіанти: Retain (стандартно для створених вручну PersistentVolumes), Delete (стандартно для динамічно створених PersistentVolumes) та Recycle (застарілий). Recycle повинен підтримуватися втулком томів, що лежить в основі цього PersistentVolume. Детальніше: <a href="/uk/docs/concepts/storage/persistent-volumes#reclaiming">https://kubernetes.io/docs/concepts/storage/persistent-volumes#reclaiming</a>
      <br/><br/>
      Можливі значення enum:
      <ul>
        <li><code>"Delete"</code> означає, що том буде видалено з Kubernetes після звільнення від його заявки. Втулок томів повинен підтримувати видалення.</li>
        <li><code>"Recycle"</code> означає, що том буде перероблено назад у пул невикористаних постійних томів після звільнення від його заявки. Втулок томів повинен підтримувати Recycling.</li>
        <li><code>"Retain"</code> означає, що том залишиться у своєму поточному стані (Released) для ручного відновлення адміністратором. Стандартна політика — Retain.</li>
      </ul>
    </td>
    </tr>
    <tr>
      <td><code>photonPersistentDisk</code><br/><em><a href="{{< ref "#PhotonPersistentDiskVolumeSource" >}}">PhotonPersistentDiskVolumeSource</a></em></td>
      <td>photonPersistentDisk представляє постійний диск PhotonController, підключений і змонтований на хості kubelets. Застаріло: PhotonPersistentDisk застарів, і внутрішній тип photonPersistentDisk більше не підтримується.</td>
    </tr>
    <tr>
      <td><code>portworxVolume</code><br/><em><a href="{{< ref "#PortworxVolumeSource" >}}">PortworxVolumeSource</a></em></td>
      <td>portworxVolume представляє том portworx, підключений і змонтований на хості kubelets. Застаріло: PortworxVolume застарів. Усі операції для внутрішнього типу portworxVolume перенаправляються до драйвера CSI pxd.portworx.com.</td>
    </tr>
    <tr>
      <td><code>quobyte</code><br/><em><a href="{{< ref "#QuobyteVolumeSource" >}}">QuobyteVolumeSource</a></em></td>
      <td>quobyte представляє монтування Quobyte на хості, яке триває протягом життєвого циклу пода. Застаріло: Quobyte застарів, і внутрішній тип quobyte більше не підтримується.</td>
    </tr>
    <tr>
      <td><code>rbd</code><br/><em><a href="{{< ref "#RBDPersistentVolumeSource" >}}">RBDPersistentVolumeSource</a></em></td>
      <td>rbd представляє монтування Rados Block Device на хості, яке триває протягом життєвого циклу пода. Застаріло: RBD застарів, і внутрішній тип rbd більше не підтримується. Більше інформації: <a href="https://examples.k8s.io/volumes/rbd/README.md">https://examples.k8s.io/volumes/rbd/README.md</a></td>
    </tr>
    <tr>
      <td><code>scaleIO</code><br/><em><a href="{{< ref "#ScaleIOPersistentVolumeSource" >}}">ScaleIOPersistentVolumeSource</a></em></td>
      <td>scaleIO представляє постійний том ScaleIO, підключений і змонтований на вузлах Kubernetes. Застаріло: ScaleIO застарів, і внутрішній тип scaleIO більше не підтримується.</td>
    </tr>
    <tr>
      <td><code>storageClassName</code><br/><em>string</em></td>
      <td>storageClassName — це назва StorageClass, до якої належить цей постійний том. Порожнє значення означає, що цей том не належить до жодного StorageClass.</td>
    </tr>
    <tr>
      <td><code>storageos</code><br/><em><a href="{{< ref "#StorageOSPersistentVolumeSource" >}}">StorageOSPersistentVolumeSource</a></em></td>
      <td>storageOS представляє том StorageOS, підключений до хост-машини kubelet і змонтований у поді. Застаріло: StorageOS застарів, і внутрішній тип storageos більше не підтримується. Більше інформації: <a href="https://examples.k8s.io/volumes/storageos/README.md">https://examples.k8s.io/volumes/storageos/README.md</a></td>
    </tr>
    <tr>
      <td><code>volumeAttributesClassName</code><br/><em>string</em></td>
      <td>volumeAttributesClassName — це назва VolumeAttributesClass, до якої належить цей постійний том. Порожнє значення не дозволяється. Якщо це поле не встановлено, це означає, що цей том не належить до жодного VolumeAttributesClass. Це поле є змінним і може бути змінене драйвером CSI після успішного оновлення тому до нового класу. Для незвʼязаного PersistentVolume, volumeAttributesClassName буде співставлено з незвʼязаними PersistentVolumeClaims під час процесу звʼязування.</td>
    </tr>
    <tr>
      <td><code>volumeMode</code><br/><em>string</em></td>
      <td>volumeMode визначає, чи призначено том для використання з форматованою файловою системою, чи залишити його у стані сирого блоку. Значення Filesystem передбачається, якщо не включено в spec.
      <br/><br/>
      Можливі значення enum:
      <ul>
        <li><code>"Block"</code> означає, що том не буде форматуватися файловою системою і залишиться сирим блочним пристроєм.</li>
        <li><code>"Filesystem"</code> означає, що том буде або вже форматований файловою системою.</li>
      </ul>
    </tr>
    <tr>
      <td><code>vsphereVolume</code><br/><em><a href="{{< ref "#VsphereVirtualDiskVolumeSource" >}}">VsphereVirtualDiskVolumeSource</a></em></td>
      <td>vsphereVolume представляє vSphere том, підключений і змонтований на хості kubelet. Застаріло: VsphereVolume застарів. Всі операції для внутрішнього типу vsphereVolume перенаправляються до CSI драйвера csi.vsphere.vmware.com.</td>
    </tr>
  </tbody>
</table>

## PersistentVolumeStatus {#PersistentVolumeStatus}

PersistentVolumeStatus є поточним станом постійного тому.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>lastPhaseTransitionTime</code><br/><em><a href="{{< ref "../definitions/time-v1-meta#Time" >}}">Time</a></em></td>
      <td>lastPhaseTransitionTime — це час, коли фаза перейшла з однієї в іншу, і автоматично скидається на поточний час щоразу, коли фаза тому змінюється.</td>
    </tr>
    <tr>
      <td><code>message</code><br/><em>string</em></td>
      <td>message є зрозумілим для людини повідомленням, яке вказує деталі про те, чому том знаходиться в цьому стані.</td>
    </tr>
    <tr>
      <td><code>phase</code><br/><em>string</em></td>
      <td>phase вказує, чи том доступний, привʼязаний до запиту, або звільнений з запиту. Детальніше: <a href="/uk/docs/concepts/storage/persistent-volumes#phase">https://kubernetes.io/docs/concepts/storage/persistent-volumes#phase</a>
      <br/><br/>
      Можливі значення enum:
      <ul>
        <li><code>"Available"</code> використовується для PersistentVolumes, які ще не привʼязані. Доступні томи утримуються звʼязувачем і зіставляються з PersistentVolumeClaims</li>
        <li><code>"Bound"</code> використовується для PersistentVolumes, які привʼязані</li>
        <li><code>"Failed"</code> використовується для PersistentVolumes, які не вдалося правильно переробити або видалити після звільнення з запиту</li>
        <li><code>"Pending"</code> використовується для PersistentVolumes, які недоступні</li>
        <li><code>"Released"</code> використовується для PersistentVolumes, де привʼязаний PersistentVolumeClaim був видалений. Звільнені томи повинні бути перероблені перед тим, як знову стати доступними. Ця фаза використовується звʼязувачем PersistentVolumeClaim для сигналізації іншому процесу про необхідність повторного захоплення ресурсу</li>
      </ul>
    </td>
    </tr>
    <tr>
      <td><code>reason</code><br/><em>string</em></td>
      <td>reason є коротким рядком у CamelCase, який описує будь-яку помилку і призначений для машинного аналізу та акуратного відображення в CLI.</td>
    </tr>
  </tbody>
</table>

## PersistentVolumeList {#PersistentVolumeList}

PersistentVolumeList є списком елементів PersistentVolume.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>APIVersion визначає версію схеми цього представлення обʼєкта. Сервери повинні конвертувати розпізнані схеми до останнього внутрішнього значення і можуть відхиляти нерозпізнані значення. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources</a></td>
    </tr>
    <tr>
      <td><code>items</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "persistent-volume-v1#PersistentVolume" >}}">Масив PersistentVolume</a></em></td>
      <td>items є списком постійних томів. Детальніше: <a href="/uk/docs/concepts/storage/persistent-volumes">https://kubernetes.io/docs/concepts/storage/persistent-volumes</a></td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>Kind визначає тип REST-ресурсу, який представляє цей обʼєкт. Сервери можуть визначати це з точки доступу, до якої клієнт надсилає запити. Не може бути оновлено. У CamelCase. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</a></td>
    </tr>
    <tr>
      <td><code>metadata</code><br/><em><a href="{{< ref "../definitions/list-meta-v1-meta#ListMeta" >}}">ListMeta</a></em></td>
      <td>Стандартні метадані списку. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</a></td>
    </tr>
  </tbody>
</table>

## AWSElasticBlockStoreVolumeSource {#AWSElasticBlockStoreVolumeSource}

Представляє ресурс Persistent Disk в AWS.

Диск AWS EBS повинен існувати перед монтуванням до контейнера. Диск також повинен знаходитися в тій же зоні AWS, що й kubelet. Диск AWS EBS можна монтувати лише як читання/запис один раз. Томи AWS EBS підтримують управління власністю та переназначення SELinux.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>fsType</code><br/><em>string</em></td>
      <td>fsType є типом файлової системи тому, який ви хочете змонтувати. Порада: переконайтеся, що тип файлової системи підтримується операційною системою хоста. Приклади: "ext4", "xfs", "ntfs". Якщо не вказано, зазвичай використовується "ext4". Детальніше: <a href="/uk/docs/concepts/storage/volumes#awselasticblockstore">https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore</a></td>
    </tr>
    <tr>
      <td><code>partition</code><br/><em>integer</em></td>
      <td>partition є розділом у томі, який ви хочете змонтувати. Якщо не вказано, зазвичай монтується за іменем тому. Приклади: для тому /dev/sda1 вкажіть розділ як "1". Аналогічно, розділ тому для /dev/sda - "0" (або можна залишити властивість порожньою).</td>
    </tr>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly значення true змусить встановити параметр readOnly у VolumeMounts. Детальніше: <a href="/uk/docs/concepts/storage/volumes#awselasticblockstore">https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore</a></td>
    </tr>
    <tr>
      <td><code>volumeID</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>volumeID є унікальним ідентифікатором ресурсу постійного диска в AWS (том Amazon EBS). Детальніше: <a href="/uk/docs/concepts/storage/volumes#awselasticblockstore">https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore</a></td>
    </tr>
  </tbody>
</table>

## AzureDiskVolumeSource {#AzureDiskVolumeSource}

AzureDisk представляє монтування диска даних Azure на хості та привʼязку до поду.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>cachingMode</code><br/><em>string</em></td>
      <td>cachingMode є режимом кешування хоста: None, Read Only, Read Write.
      <br/><br/>
      Можливі значення enum:
      <ul>
        <li><code>"None"</code></li>
        <li><code>"ReadOnly"</code></li>
        <li><code>"ReadWrite"</code></li>
      </ul>
      </td>
    </tr>
    <tr>
      <td><code>diskName</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>diskName є імʼям диска даних у сховищі блобів</td>
    </tr>
    <tr>
      <td><code>diskURI</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>diskURI є URI диска даних у сховищі блобів</td>
    </tr>
    <tr>
      <td><code>fsType</code><br/><em>string</em></td>
      <td>fsType є типом файлової системи для монтування. Повинно бути типом файлової системи, підтримуваним операційною системою хоста. Наприклад: "ext4", "xfs", "ntfs". Якщо не вказано, за замовчуванням використовується "ext4".</td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>Очікуваними значеннями kind є
      <ul>
        <li>Shared: кілька блоб-дисків на обліковий запис зберігання</li>
        <li>Dedicated: один блоб-диск на обліковий запис зберігання</li>
        <li>Managed: керований Azure диск даних (тільки в керованому наборі доступності). За замовчуванням використовується shared</li>
      </ul>
      Можливі значення enum:
      <ul>
        <li><code>"Dedicated"</code></li>
        <li><code>"Managed"</code></li>
        <li><code>"Shared"</code></li>
      </ul>
      </td>
    </tr>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly Стандартне значення — false (читання/запис). Якщо встановлено true, це змусить встановити параметр readOnly у VolumeMounts.</td>
    </tr>
  </tbody>
</table>

## AzureFilePersistentVolumeSource {#AzureFilePersistentVolumeSource}

AzureFile представляє монтування Azure File Service на хості та привʼязку до поду.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly Стандартне значення — false (читання/запис). Якщо встановлено true, це змусить встановити параметр readOnly у VolumeMounts.</td>
    </tr>
    <tr>
      <td><code>secretName</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>secretName є імʼям секрету, який містить імʼя облікового запису Azure Storage та ключ</td>
    </tr>
    <tr>
      <td><code>secretNamespace</code><br/><em>string</em></td>
      <td>secretNamespace є простором імен секрету, який містить імʼя облікового запису Azure Storage та ключ. Зазвичай використовується той самий простір імен, що й для Pod</td>
    </tr>
    <tr>
      <td><code>shareName</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>shareName є імʼям спільного ресурсу Azure</td>
    </tr>
  </tbody>
</table>

## CSIPersistentVolumeSource {#CSIPersistentVolumeSource}

CSIPersistentVolumeSource представляє сховище, яке керується зовнішнім драйвером CSI.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>controllerExpandSecretRef</code><br/><em><a href="{{< ref "#SecretReference" >}}">SecretReference</a></em></td>
      <td>controllerExpandSecretRef є посиланням на обʼєкт секрету, який містить конфіденційну інформацію для передачі драйверу CSI для завершення виклику CSI ControllerExpandVolume. Це поле є опціональним і може бути порожнім, якщо секрет не потрібен. Якщо обʼєкт секрету містить більше одного секрету, передаються всі секрети.</td>
    </tr>
    <tr>
      <td><code>controllerPublishSecretRef</code><br/><em><a href="{{< ref "#SecretReference" >}}">SecretReference</a></em></td>
      <td>controllerPublishSecretRef є посиланням на обʼєкт секрету, який містить конфіденційну інформацію для передачі драйверу CSI для завершення виклику CSI ControllerPublishVolume та ControllerUnpublishVolume. Це поле є опціональним і може бути порожнім, якщо секрет не потрібен. Якщо обʼєкт секрету містить більше одного секрету, передаються всі секрети.</td>
    </tr>
    <tr>
      <td><code>driver</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>driver є імʼям драйвера, який використовується для цього тома. Обовʼязково.</td>
    </tr>
    <tr>
      <td><code>fsType</code><br/><em>string</em></td>
      <td>fsType для монтування. Повинно бути типом файлової системи, підтримуваним операційною системою хоста. Напр. "ext4", "xfs", "ntfs".</td>
    </tr>
    <tr>
      <td><code>nodeExpandSecretRef</code><br/><em><a href="{{< ref "#SecretReference" >}}">SecretReference</a></em></td>
      <td>nodeExpandSecretRef є посиланням на обʼєкт секрету, який містить конфіденційну інформацію для передачі драйверу CSI для завершення виклику CSI NodeExpandVolume. Це поле є опціональним і може бути порожнім, якщо секрет не потрібен. Якщо обʼєкт секрету містить більше одного секрету, передаються всі секрети.</td>
    </tr>
    <tr>
      <td><code>nodePublishSecretRef</code><br/><em><a href="{{< ref "#SecretReference" >}}">SecretReference</a></em></td>
      <td>nodePublishSecretRef є посиланням на обʼєкт секрету, який містить конфіденційну інформацію для передачі драйверу CSI для завершення виклику CSI NodePublishVolume та NodeUnpublishVolume. Це поле є опціональним і може бути порожнім, якщо секрет не потрібен. Якщо обʼєкт секрету містить більше одного секрету, передаються всі секрети.</td>
    </tr>
    <tr>
      <td><code>nodeStageSecretRef</code><br/><em><a href="{{< ref "#SecretReference" >}}">SecretReference</a></em></td>
      <td>nodeStageSecretRef є посиланням на обʼєкт секрету, який містить конфіденційну інформацію для передачі драйверу CSI для завершення виклику CSI NodeStageVolume та NodeUnstageVolume. Це поле є опціональним і може бути порожнім, якщо секрет не потрібен. Якщо обʼєкт секрету містить більше одного секрету, передаються всі секрети.</td>
    </tr>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly значення для передачі в ControllerPublishVolumeRequest. За замовчуванням false (читання/запис).</td>
    </tr>
    <tr>
      <td><code>volumeAttributes</code><br/><em>object</em></td>
      <td>volumeAttributes тома для публікації.</td>
    </tr>
    <tr>
      <td><code>volumeHandle</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>volumeHandle є унікальним імʼям тома, яке повертається втулком CSI під час виклику CreateVolume для посилання на том у всіх наступних викликах. Обовʼязково.</td>
    </tr>
  </tbody>
</table>

## CephFSPersistentVolumeSource {#CephFSPersistentVolumeSource}

Представляє монтування файлової системи Ceph, яке триває протягом життя поду. Томи Cephfs не підтримують управління власністю або переназначення SELinux.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>monitors</code>&nbsp;<strong>*</strong><br/><em>string array</em></td>
      <td>monitors є обовʼязковим: Monitors є колекцією моніторів Ceph. Більше інформації: <a href="https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it">https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it</a></td>
    </tr>
    <tr>
      <td><code>path</code><br/><em>string</em></td>
      <td>path є опціональним: Використовується як змонтований корінь, а не повне дерево Ceph, стандартно /</td>
    </tr>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly є опціональним: Зазвичай false (читання/запис). ReadOnly тут примусово встановить параметр ReadOnly у VolumeMounts. Більше інформації: <a href="https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it">https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it</a></td>
    </tr>
    <tr>
      <td><code>secretFile</code><br/><em>string</em></td>
      <td>secretFile є опціональним: SecretFile є шляхом до вʼязки ключів користувача, зазвичай /etc/ceph/user.secret. Більше інформації: <a href="https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it">https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it</a></td>
    </tr>
    <tr>
      <td><code>secretRef</code><br/><em><a href="{{< ref "#SecretReference" >}}">SecretReference</a></em></td>
      <td>secretRef є опціональним: SecretRef є посиланням на обʼєкт секрету для автентифікації користувача, зазвичай порожнє. Більше інформації: <a href="https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it">https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it</a></td>
    </tr>
    <tr>
      <td><code>user</code><br/><em>string</em></td>
      <td>user є опціональним: User є імʼям користувача rados, за звичай — admin. Більше інформації: <a href="https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it">https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it</a></td>
    </tr>
  </tbody>
</table>

## CinderPersistentVolumeSource {#CinderPersistentVolumeSource}

Представляє ресурс тома Cinder в Openstack. Том Cinder повинен існувати перед монтуванням до контейнера. Том також повинен бути в тому ж регіоні, що й kubelet. Томи Cinder підтримують управління власністю та переназначення SELinux.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>fsType</code><br/><em>string</em></td>
      <td>fsType є типом файлової системи для монтування. Повинно бути типом файлової системи, підтримуваним операційною системою хоста. Приклади: "ext4", "xfs", "ntfs". Якщо не вказано, зазвичай використовується "ext4". Більше інформації: <a href="https://examples.k8s.io/mysql-cinder-pd/README.md">https://examples.k8s.io/mysql-cinder-pd/README.md</a></td>
    </tr>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly є опціональним: Зазвичай false (читання/запис). ReadOnly тут примусово встановить параметр ReadOnly у VolumeMounts. Більше інформації: <a href="https://examples.k8s.io/mysql-cinder-pd/README.md">https://examples.k8s.io/mysql-cinder-pd/README.md</a></td>
    </tr>
    <tr>
      <td><code>secretRef</code><br/><em><a href="{{< ref "#SecretReference" >}}">SecretReference</a></em></td>
      <td>secretRef є опціональним: вказує на обʼєкт секрету, що містить параметри для підключення до OpenStack.</td>
    </tr>
    <tr>
      <td><code>volumeID</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>volumeID використовується для ідентифікації тому в Cinder. Більше інформації: <a href="https://examples.k8s.io/mysql-cinder-pd/README.md">https://examples.k8s.io/mysql-cinder-pd/README.md</a></td>
    </tr>
  </tbody>
</table>

## FCVolumeSource {#FCVolumeSource}

Представляє ресурс тома Fibre Channel. Томи Fibre Channel можна монтувати лише для читання/запису один раз. Томи Fibre Channel підтримують управління власністю та переназначення SELinux.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>fsType</code><br/><em>string</em></td>
      <td>fsType є типом файлової системи для монтування. Повинно бути типом файлової системи, підтримуваним операційною системою хоста. Приклади: "ext4", "xfs", "ntfs". Якщо не вказано, зазвичай використовується "ext4".</td>
    </tr>
    <tr>
      <td><code>lun</code><br/><em>integer</em></td>
      <td>lun є опціональним: номер цільового lun для FC</td>
    </tr>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly є опціональним: зазвичай false (читання/запис). ReadOnly тут примусово встановить параметр ReadOnly у VolumeMounts.</td>
    </tr>
    <tr>
      <td><code>targetWWNs</code><br/><em>string array</em></td>
      <td>targetWWNs є опціональним: FC вказує всесвітні імена (worldwide names, WWN).</td>
    </tr>
    <tr>
      <td><code>wwids</code><br/><em>string array</em></td>
      <td>wwids є опціональним: всесвітні ідентифікатори томів FC (wwids). Потрібно встановити або wwids, або комбінацію targetWWNs і lun, але не обидва одночасно.</td>
    </tr>
  </tbody>
</table>

## FlexPersistentVolumeSource {#FlexPersistentVolumeSource}

FlexPersistentVolumeSource представляє загальний ресурс постійного тому, який надається/підключається за допомогою втулка на основі виконуваного файлу.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>driver</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>driver є імʼям драйвера, який використовується для цього тому.</td>
    </tr>
    <tr>
      <td><code>fsType</code><br/><em>string</em></td>
      <td>fsType є типом файлової системи для монтування. Повинно бути типом файлової системи, підтримуваним операційною системою хоста. Приклади: "ext4", "xfs", "ntfs". Зазвичай файлову систему визначає скрипт FlexVolume.</td>
    </tr>
    <tr>
      <td><code>options</code><br/><em>object</em></td>
      <td>options є опціональним: це поле містить додаткові параметри команд, якщо вони є.</td>
    </tr>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly є опціональним: зазвичай false (читання/запис). ReadOnly тут примусово встановить параметр ReadOnly у VolumeMounts.</td>
    </tr>
    <tr>
      <td><code>secretRef</code><br/><em><a href="{{< ref "#SecretReference" >}}">SecretReference</a></em></td>
      <td>secretRef є опціональним: SecretRef є посиланням на обʼєкт секрету, що містить конфіденційну інформацію для передачі скриптам втулка. Це поле може бути порожнім, якщо обʼєкт секрету не вказано. Якщо обʼєкт секрету містить більше одного секрету, всі секрети передаються скриптам плагіна.</td>
    </tr>
  </tbody>
</table>

## FlockerVolumeSource {#FlockerVolumeSource}

Представляє том Flocker, змонтований агентом Flocker. Потрібно встановити лише одне з полів datasetName або datasetUUID. Томи Flocker не підтримують управління власністю або переназначення SELinux.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>datasetName</code><br/><em>string</em></td>
      <td>datasetName є імʼям набору даних, збереженого як метадані -> імʼя набору даних для Flocker слід вважати за застаріле</td>
    </tr>
    <tr>
      <td><code>datasetUUID</code><br/><em>string</em></td>
      <td>datasetUUID є UUID набору даних. Це унікальний ідентифікатор набору даних Flocker</td>
    </tr>
  </tbody>
</table>

## GCEPersistentDiskVolumeSource {#GCEPersistentDiskVolumeSource}

Представляє ресурс Persistent Disk у Google Compute Engine.

Том GCE PD повинен існувати перед монтуванням у контейнер. Диск також повинен знаходитися в тому ж проєкті та зоні GCE, що й kubelet. GCE PD можна монтувати лише як читання/запис один раз або як тільки для читання багато разів. GCE PD підтримує управління власністю та переназначення SELinux.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>fsType</code><br/><em>string</em></td>
      <td>fsType є типом файлової системи для монтування. Порада: переконайтеся, що тип файлової системи підтримується операційною системою хоста. Приклади: "ext4", "xfs", "ntfs". Якщо не вказано, неявно вважається "ext4". Більше інформації: <a href="/uk/docs/concepts/storage/volumes#gcepersistentdisk">https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk</a></td>
    </tr>
    <tr>
      <td><code>partition</code><br/><em>integer</em></td>
      <td>partition є розділом у томі, який ви хочете змонтувати. Якщо не вказано, зазвичай монтується за іменем тому. Приклади: для тому /dev/sda1 вкажіть розділ як "1". Аналогічно, розділ тому для /dev/sda - "0" (або можна залишити властивість порожньою). Більше інформації: <a href="/uk/docs/concepts/storage/volumes#gcepersistentdisk">https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk</a></td>
    </tr>
    <tr>
      <td><code>pdName</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>pdName є унікальним імʼям ресурсу PD у GCE. Використовується для ідентифікації диска в GCE. Більше інформації: <a href="/uk/docs/concepts/storage/volumes#gcepersistentdisk">https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk</a></td>
    </tr>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly тут примусово встановлює параметр ReadOnly у VolumeMounts. Зазвичай — false. Більше інформації: <a href="/uk/docs/concepts/storage/volumes#gcepersistentdisk">https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk</a></td>
    </tr>
  </tbody>
</table>

## GlusterfsPersistentVolumeSource {#GlusterfsPersistentVolumeSource}

Представляє монтування Glusterfs, яке триває протягом життя поду. Томи Glusterfs не підтримують управління власністю або переназначення SELinux.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>endpoints</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>endpoints є іменем точки доступу, яка описує топологію Glusterfs. Більше інформації: <a href="https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod">https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod</a></td>
    </tr>
    <tr>
      <td><code>endpointsNamespace</code><br/><em>string</em></td>
      <td>endpointsNamespace є простором імен, який містить точку доступу Glusterfs. Якщо це поле порожнє, EndpointNamespace зазвичай буде таким самим, як і простір імен привʼязаного PVC. Більше інформації: <a href="https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod">https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod</a></td>
    </tr>
    <tr>
      <td><code>path</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>path є шляхом до тому Glusterfs. Більше інформації: <a href="https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod">https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod</a></td>
    </tr>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly тут примусово встановлює параметр ReadOnly у VolumeMounts. Зазвичай — false. Більше інформації: <a href="https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod">https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod</a></td>
    </tr>
  </tbody>
</table>

## HostPathVolumeSource {#HostPathVolumeSource}

Представляє шлях хоста, змонтований у под. Томи HostPath не підтримують управління власністю або переназначення SELinux.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>path</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>шлях до теки на хості. Якщо шлях є символічним посиланням, воно буде слідувати до реального шляху. Більше інформації: <a href="/uk/docs/concepts/storage/volumes#hostpath">https://kubernetes.io/docs/concepts/storage/volumes#hostpath</a></td>
    </tr>
    <tr>
      <td><code>type</code><br/><em>string</em></td>
      <td>type для тома HostPath. Зазвичай порожнє. Більше інформації: <a href="/uk/docs/concepts/storage/volumes#hostpath">https://kubernetes.io/docs/concepts/storage/volumes#hostpath</a>
      <br/><br/>
      Можливі значення enum:
      <ul>
        <li><code>""</code> Для зворотної сумісності, залиште порожнім, якщо не встановлено</li>
        <li><code>"BlockDevice"</code> Блоковий пристрій повинен існувати за вказаним шляхом</li>
        <li><code>"CharDevice"</code> Символьний пристрій повинен існувати за вказаним шляхом</li>
        <li><code>"Directory"</code> Тека повинна існувати за вказаним шляхом</li>
        <li><code>"DirectoryOrCreate"</code> Якщо нічого не існує за вказаним шляхом, буде створена порожня тека з режимом файлу 0755, з тією ж групою та власником, що й Kubelet.</li>
        <li><code>"File"</code> Файл повинен існувати за вказаним шляхом</li>
        <li><code>"FileOrCreate"</code> Якщо нічого не існує за вказаним шляхом, буде створений порожній файл з режимом файлу 0644, з тією ж групою та власником, що й Kubelet.</li>
        <li><code>"Socket"</code> UNIX-сокет повинен існувати за вказаним шляхом</li>
      </ul>
    </td>
    </tr>
  </tbody>
</table>

## ISCSIPersistentVolumeSource {#ISCSIPersistentVolumeSource}

ISCSIPersistentVolumeSource представляє iSCSI диск. iSCSI томи можна монтувати лише як читання/запис один раз. iSCSI томи підтримують управління власністю та переназначення SELinux.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>chapAuthDiscovery</code><br/><em>boolean</em></td>
      <td>chapAuthDiscovery визначає, чи підтримується автентифікація iSCSI Discovery CHAP</td>
    </tr>
    <tr>
      <td><code>chapAuthSession</code><br/><em>boolean</em></td>
      <td>chapAuthSession визначає, чи підтримується автентифікація iSCSI Session CHAP</td>
    </tr>
    <tr>
      <td><code>fsType</code><br/><em>string</em></td>
      <td>fsType визначає тип файлової системи тому, який ви хочете змонтувати. Порада: переконайтеся, що тип файлової системи підтримується операційною системою хоста. Приклади: "ext4", "xfs", "ntfs". Якщо не вказано, неявно вважається "ext4". Більше інформації: <a href="/uk/docs/concepts/storage/volumes#iscsi">https://kubernetes.io/docs/concepts/storage/volumes#iscsi</a></td>
    </tr>
    <tr>
      <td><code>initiatorName</code><br/><em>string</em></td>
      <td>initiatorName визначає користувацьке імʼя ініціатора iSCSI. Якщо initiatorName вказано разом з iscsiInterface, буде створено новий інтерфейс iSCSI &lt;target portal&gt;:\&lt;volume name&gt; для підключення.</td>
    </tr>
    <tr>
      <td><code>iqn</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>iqn визначає iSCSI Qualified Name цільового пристрою.</td>
    </tr>
    <tr>
      <td><code>iscsiInterface</code><br/><em>string</em></td>
      <td>iscsiInterface визначає імʼя інтерфейсу, який використовує iSCSI транспорт. Зазвичай 'default' (tcp).</td>
    </tr>
    <tr>
      <td><code>lun</code>&nbsp;<strong>*</strong><br/><em>integer</em></td>
      <td>lun визначає номер iSCSI Target Lun.</td>
    </tr>
    <tr>
      <td><code>portals</code><br/><em>string array</em></td>
      <td>portals визначає список iSCSI Target Portal. Портал може бути або IP-адресою, або ip_addr:port, якщо порт відрізняється від стандартного (зазвичай TCP порти 860 та 3260).</td>
    </tr>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly визначає, чи буде примусово встановлено режим лише для читання в VolumeMounts. Зазвичай — false.</td>
    </tr>
    <tr>
      <td><code>secretRef</code><br/><em><a href="{{< ref "#SecretReference" >}}">SecretReference</a></em></td>
      <td>secretRef визначає CHAP Secret для автентифікації iSCSI цілі та ініціатора</td>
    </tr>
    <tr>
      <td><code>targetPortal</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>targetPortal визначає iSCSI Target Portal. Портал може бути або IP-адресою, або ip_addr:port, якщо порт відрізняється від стандартного (зазвичай TCP порти 860 та 3260).</td>
    </tr>
  </tbody>
</table>

## LocalVolumeSource {#LocalVolumeSource}

Local представляє безпосередньо підключене сховище зі спорідненістю до вузла

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>fsType</code><br/><em>string</em></td>
      <td>fsType визначає тип файлової системи тому, який ви хочете змонтувати. Застосовується лише тоді, коли Path є блочним пристроєм. Повинно бути типом файлової системи, підтримуваним операційною системою хоста. Наприклад: "ext4", "xfs", "ntfs". Стандартно — автоматичний вибір файлової системи, якщо не вказано.</td>
    </tr>
    <tr>
      <td><code>path</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>path визначає повний шлях до тому на вузлі. Це може бути або тека, або блочний пристрій (диск, розділ тощо).</td>
    </tr>
  </tbody>
</table>

## NFSVolumeSource {#NFSVolumeSource}

Представляє NFS монтування, яке триває протягом життя поду. NFS томи не підтримують управління власністю або переназначення SELinux.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>path</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>path визначає шлях, який експортується NFS сервером. Більше інформації: <a href="/uk/docs/concepts/storage/volumes#nfs">https://kubernetes.io/docs/concepts/storage/volumes#nfs</a></td>
    </tr>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly визначає, чи буде примусово встановлено режим лише для читання при монтуванні NFS експорту. Стандартно — false. Більше інформації: <a href="/uk/docs/concepts/storage/volumes#nfs">https://kubernetes.io/docs/concepts/storage/volumes#nfs</a></td>
    </tr>
    <tr>
      <td><code>server</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>server визначає імʼя хоста або IP-адресу NFS сервера. Більше інформації: <a href="/uk/docs/concepts/storage/volumes#nfs">https://kubernetes.io/docs/concepts/storage/volumes#nfs</a></td>
    </tr>
  </tbody>
</table>

## PhotonPersistentDiskVolumeSource {#PhotonPersistentDiskVolumeSource}

Представляє ресурс постійного диска Photon Controller.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>fsType</code><br/><em>string</em></td>
      <td>fsType визначає тип файлової системи тому, який ви хочете змонтувати. Повинно бути типом файлової системи, підтримуваним операційною системою хоста. Наприклад: "ext4", "xfs", "ntfs". Стандартно — автоматичний вибір файлової системи, якщо не вказано.</td>
    </tr>
    <tr>
      <td><code>pdID</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>pdID визначає ідентифікатор постійного диска Photon Controller</td>
    </tr>
  </tbody>
</table>

## PortworxVolumeSource {#PortworxVolumeSource}

PortworxVolumeSource представляє ресурс тому Portworx.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>fsType</code><br/><em>string</em></td>
      <td>fsType визначає тип файлової системи тому, який ви хочете змонтувати. Повинно бути типом файлової системи, підтримуваним операційною системою хоста. Наприклад: "ext4", "xfs". Стандартно — автоматичний вибір файлової системи, якщо не вказано.</td>
    </tr>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly визначає, чи буде примусово встановлено режим лише для читання при монтуванні тому. Стандартно — false. Більше інформації: <a href="/uk/docs/concepts/storage/volumes#portworx">https://kubernetes.io/docs/concepts/storage/volumes#portworx</a></td>
    </tr>
    <tr>
      <td><code>volumeID</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>volumeID визначає унікальний ідентифікатор тому Portworx</td>
    </tr>
  </tbody>
</table>

## QuobyteVolumeSource {#QuobyteVolumeSource}

Представляє Quobyte монтування, яке триває протягом життя поду. Quobyte томи не підтримують управління власністю або переназначення SELinux.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>group</code><br/><em>string</em></td>
      <td>group для відображення доступу до тому. Стандартно — група не вказана.</td>
    </tr>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly визначає, чи буде примусово встановлено режим лише для читання при монтуванні Quobyte тому. Стандартно — false.</td>
    </tr>
    <tr>
      <td><code>registry</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>registry представляє один або кілька сервісів Quobyte Registry, вказаних як рядок у форматі host:port (кілька записів розділяються комами), який виступає центральним реєстром для томів</td>
    </tr>
    <tr>
      <td><code>tenant</code><br/><em>string</em></td>
      <td>tenant визначає власника даного Quobyte тому в бекенді. Використовується з динамічно створеними Quobyte томами, значення встановлюється плагіном</td>
    </tr>
    <tr>
      <td><code>user</code><br/><em>string</em></td>
      <td>user для відображення доступу до тому. Стандартно — користувач облікового запису сервісу.</td>
    </tr>
    <tr>
      <td><code>volume</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>volume визначає рядок, який посилається на вже створений Quobyte том за назвою.</td>
    </tr>
  </tbody>
</table>

## RBDPersistentVolumeSource {#RBDPersistentVolumeSource}

Представляє монтування Rados Block Device, яке триває протягом життя поду. RBD томи підтримують управління власністю та переназначення SELinux.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>fsType</code><br/><em>string</em></td>
      <td>fsType визначає тип файлової системи тому, який ви хочете змонтувати. Порада: переконайтеся, що тип файлової системи підтримується операційною системою хоста. Приклади: "ext4", "xfs", "ntfs". Якщо не вказано, зазвичай використовується "ext4". Більше інформації: <a href="/uk/docs/concepts/storage/volumes#rbd">https://kubernetes.io/docs/concepts/storage/volumes#rbd</a></td>
    </tr>
    <tr>
      <td><code>image</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>image визначає назву rados image. Більше інформації: <a href="https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it">https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it</a></td>
    </tr>
    <tr>
      <td><code>keyring</code><br/><em>string</em></td>
      <td>keyring визначає шлях до key ring для RBDUser. Зазвичай /etc/ceph/keyring. Більше інформації: <a href="https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it">https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it</a></td>
    </tr>
    <tr>
      <td><code>monitors</code>&nbsp;<strong>*</strong><br/><em>string array</em></td>
      <td>monitors визначає колекцію Ceph моніторів. Більше інформації: <a href="https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it">https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it</a></td>
    </tr>
    <tr>
      <td><code>pool</code><br/><em>string</em></td>
      <td>pool визначає назву rados pool. Зазвичай використовується rbd. Більше інформації: <a href="https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it">https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it</a></td>
    </tr>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly тут примусово встановлює параметр ReadOnly у VolumeMounts. За замовчуванням false. Більше інформації: <a href="https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it">https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it</a></td>
    </tr>
    <tr>
      <td><code>secretRef</code><br/><em><a href="{{< ref "#SecretReference" >}}">SecretReference</a></em></td>
      <td>secretRef визначає назву секрету для автентифікації RBDUser. Якщо вказано, перевизначає keyring. За замовчуванням nil. Більше інформації: <a href="https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it">https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it</a></td>
    </tr>
    <tr>
      <td><code>user</code><br/><em>string</em></td>
      <td>user визначає імʼя користувача rados. За замовчуванням admin. Більше інформації: <a href="https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it">https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it</a></td>
    </tr>
  </tbody>
</table>

## ScaleIOPersistentVolumeSource {#ScaleIOPersistentVolumeSource}

ScaleIOPersistentVolumeSource представляє постійний том ScaleIO

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>fsType</code><br/><em>string</em></td>
      <td>fsType визначає тип файлової системи для монтування. Повинно бути типом файлової системи, підтримуваним операційною системою хоста. Наприклад: "ext4", "xfs", "ntfs". Зазвичай "xfs"</td>
    </tr>
    <tr>
      <td><code>gateway</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>gateway визначає адресу хоста ScaleIO API Gateway.</td>
    </tr>
    <tr>
      <td><code>protectionDomain</code><br/><em>string</em></td>
      <td>protectionDomain визначає назву ScaleIO Protection Domain для налаштованого сховища.</td>
    </tr>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly зазвичай — false (читання/запис). readOnly тут примусово встановлює параметр ReadOnly у VolumeMounts.</td>
    </tr>
    <tr>
      <td><code>secretRef</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#SecretReference" >}}">SecretReference</a></em></td>
      <td>secretRef визначає секрет для користувача ScaleIO та іншої конфіденційної інформації. Якщо не вказано, операція входу завершиться невдачею.</td>
    </tr>
    <tr>
      <td><code>sslEnabled</code><br/><em>boolean</em></td>
      <td>sslEnabled визначає прапорець для увімкнення/вимкнення SSL-зʼєднання з Gateway, зазвичай — false.</td>
    </tr>
    <tr>
      <td><code>storageMode</code><br/><em>string</em></td>
      <td>storageMode визначає, чи має сховище для тому бути ThickProvisioned або ThinProvisioned. Зазвичай — ThinProvisioned.</td>
    </tr>
    <tr>
      <td><code>storagePool</code><br/><em>string</em></td>
      <td>storagePool визначає пул сховища ScaleIO, повʼязаний із доменом захисту.</td>
    </tr>
    <tr>
      <td><code>system</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>system визначає назву системи зберігання, як налаштовано в ScaleIO.</td>
    </tr>
    <tr>
      <td><code>volumeName</code><br/><em>string</em></td>
      <td>volumeName визначає назву тому, який вже створено в системі ScaleIO і який повʼязаний із цим джерелом тому.</td>
    </tr>
  </tbody>
</table>

## SecretReference {#SecretReference}

SecretReference представляє Secret Reference. Містить достатньо інформації для отримання секрету в будь-якому просторі імен.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code><br/><em>string</em></td>
      <td>name є унікальним у межах простору імен для посилання на ресурс секрету.</td>
    </tr>
    <tr>
      <td><code>namespace</code><br/><em>string</em></td>
      <td>namespace визначає простір, у межах якого імʼя секрету має бути унікальним.</td>
    </tr>
  </tbody>
</table>

## StorageOSPersistentVolumeSource {#StorageOSPersistentVolumeSource}

Представляє ресурс постійного тому StorageOS.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>fsType</code><br/><em>string</em></td>
      <td>fsType визначає тип файлової системи для монтування. Повинно бути типом файлової системи, підтримуваним операційною системою хоста. Наприклад: "ext4", "xfs", "ntfs". Зазвичай "ext4"</td>
    </tr>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly зазвичай — false (читання/запис). readOnly тут примусово встановлює параметр ReadOnly у VolumeMounts.</td>
    </tr>
    <tr>
      <td><code>secretRef</code><br/><em><a href="{{< ref "../definitions/object-reference-v1#ObjectReference" >}}">ObjectReference</a></em></td>
      <td>secretRef визначає секрет для отримання облікових даних API StorageOS. Якщо не вказано, будуть використані стандартнізначення.</td>
    </tr>
    <tr>
      <td><code>volumeName</code><br/><em>string</em></td>
      <td>volumeName є зрозумілим для людини імʼям тому StorageOS. Імена томів унікальні лише в межах простору імен.</td>
    </tr>
    <tr>
      <td><code>volumeNamespace</code><br/><em>string</em></td>
      <td>volumeNamespace визначає область дії тому в межах StorageOS. Якщо простір імен не вказано, буде використано простір імен Pod. Це дозволяє відобразити область дії імен Kubernetes у StorageOS для більш тісної інтеграції. Встановіть VolumeName на будь-яке імʼя, щоб перевизначити стандартну поведінку. Встановіть "default", якщо ви не використовуєте простори імен у StorageOS. Простори імен, які не існують у StorageOS, будуть створені.</td>
    </tr>
  </tbody>
</table>

## VolumeNodeAffinity {#VolumeNodeAffinity}

VolumeNodeAffinity визначає обмеження, які обмежують, з яких вузлів можна отримати доступ до цього тому.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>required</code><br/><em><a href="{{< ref "../definitions/node-selector-v1#NodeSelector" >}}">NodeSelector</a></em></td>
      <td>required визначає жорсткі обмеження для вузлів, які повинні бути виконані.</td>
    </tr>
  </tbody>
</table>

## VsphereVirtualDiskVolumeSource {#VsphereVirtualDiskVolumeSource}

Представляє ресурс тому vSphere.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>fsType</code><br/><em>string</em></td>
      <td>fsType визначає тип файлової системи для монтування. Повинно бути типом файлової системи, підтримуваним операційною системою хоста. Наприклад: "ext4", "xfs", "ntfs". Якщо не вказано, зазвичай використовується "ext4".</td>
    </tr>
    <tr>
      <td><code>storagePolicyID</code><br/><em>string</em></td>
      <td>storagePolicyID є ідентифікатором профілю управління політиками зберігання (SPBM), повʼязаного з StoragePolicyName.</td>
    </tr>
    <tr>
      <td><code>storagePolicyName</code><br/><em>string</em></td>
      <td>storagePolicyName є імʼям профілю управління політиками зберігання (SPBM).</td>
    </tr>
    <tr>
      <td><code>volumePath</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>volumePath визначає шлях, який ідентифікує vSphere том vmdk.</td>
    </tr>
  </tbody>
</table>

## Операції {#Operations}

---

### `post` Create

#### HTTP Запит {#http-request}

POST /api/v1/persistentvolumes

#### Параметри запиту {#query-parameters}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>Коли параметр присутній, це вказує, що зміни не повинні зберігатися. Неправильна або нерозпізнана директива dryRun призведе до помилки та припинення обробки запиту. Дійсні значення:
      <ul>
        <li>All: всі етапи dry run будуть виконані</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>fieldManager</code></td>
      <td><em>string</em></td>
      <td>fieldManager є імʼям, повʼязаним з а́ктором або сутністю, яка вносить ці зміни. Значення повинно бути менше або дорівнювати 128 символам і містити лише друковані символи, як визначено в <a href="https://golang.org/pkg/unicode/#IsPrint">https://golang.org/pkg/unicode/#IsPrint</a>.</td>
    </tr>
    <tr>
      <td><code>fieldValidation</code></td>
      <td><em>string</em></td>
      <td>fieldValidation інструктує сервер, як обробляти обʼєкти в запиті (POST/PUT/PATCH), що містять невідомі або дубльовані поля. Дійсні значення:
      <ul>
        <li>Ignore: Ігнорує всі невідомі поля, які без попередження видаляються з обʼєкта, а також ігнорує всі дублікати полів, крім останнього, на які натрапляє декодер. Це стандартна поведінка до v1.23.</li>
        <li>Warn: Надсилає попередження через стандартний заголовок відповіді для кожного невідомого поля, яке видаляється з обʼєкта, і для кожного дубльованого поля, яке зустрічається. Запит все ще буде успішним, якщо немає інших помилок, і буде зберігатися лише останнє з будь-яких дубльованих полів. Це стандартна поведінка у v1.23+</li>
        <li>Strict: У цьому випадку запит завершиться з помилкою BadRequest, якщо з обʼєкта будуть вилучені невідомі поля або якщо будуть виявлені дублікати полів. Помилка, що повертається сервером, міститиме всі виявлені невідомі та дубльовані поля.</li>
      </ul></td>
    </tr>
  </tbody>
</table>

#### Параметри тіла запиту {#body-parameters}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a></em></td>
    </tr>
    <tr>
      <td>202</td>
      <td>Accepted</td>
      <td><em><a href="{{< ref "persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a></em></td>
    </tr>
  </tbody>
</table>

### `patch` Patch

#### HTTP Запит {#http-request-1}

PATCH /api/v1/persistentvolumes/{name}

#### Параметри шляху {#path-parameters}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва PersistentVolume</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-1}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>Коли параметр присутній, це вказує, що зміни не повинні зберігатися. Неправильна або нерозпізнана директива dryRun призведе до помилки та припинення обробки запиту. Дійсні значення:
      <ul>
        <li>All: всі етапи dry run будуть виконані</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>fieldManager</code></td>
      <td><em>string</em></td>
      <td>fieldManager є імʼям, повʼязаним з а́ктором або сутністю, яка вносить ці зміни. Значення повинно бути менше або дорівнювати 128 символам і містити лише друковані символи, як визначено в <a href="https://golang.org/pkg/unicode/#IsPrint">https://golang.org/pkg/unicode/#IsPrint</a>. Це поле обовʼязкове для запитів apply (application/apply-patch), але необовʼязкове для типів патчів, що не застосовуються (JsonPatch, MergePatch, StrategicMergePatch).</td>
    </tr>
    <tr>
      <td><code>fieldValidation</code></td>
      <td><em>string</em></td>
      <td>fieldValidation інструктує сервер, як обробляти обʼєкти в запиті (POST/PUT/PATCH), що містять невідомі або дубльовані поля. Дійсні значення:
      <ul>
        <li>Ignore: Ігнорує всі невідомі поля, які без попередження видаляються з обʼєкта, а також ігнорує всі дублікати полів, крім останнього, на які натрапляє декодер. Це стандартна поведінка до v1.23.</li>
        <li>Warn: Надсилає попередження через стандартний заголовок відповіді для кожного невідомого поля, яке видаляється з обʼєкта, і для кожного дубльованого поля, яке зустрічається. Запит все ще буде успішним, якщо немає інших помилок, і буде зберігатися лише останнє з будь-яких дубльованих полів. Це стандартна поведінка у v1.23+</li>
        <li>Strict: У цьому випадку запит завершиться з помилкою BadRequest, якщо з обʼєкта будуть вилучені невідомі поля або якщо будуть виявлені дублікати полів. Помилка, що повертається сервером, міститиме всі виявлені невідомі та дубльовані поля.</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>force</code></td>
      <td><em>boolean</em></td>
      <td>Force має на меті "примусово" застосовувати запити Apply. Це означає, що користувач повторно отримає конфліктні поля, що належать іншим користувачам. Прапорець Force повинен бути скасований для запитів, що не є патчами apply.</td>
    </tr>
  </tbody>
</table>

#### Параметри тіла запиту {#body-parameters-1}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "../definitions/patch-v1-meta#Patch" >}}">Patch</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-1}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a></em></td>
    </tr>
  </tbody>
</table>

### `put` Replace

#### HTTP Запит {#http-request-2}

PUT /api/v1/persistentvolumes/{name}

#### Параметри шляху {#path-parameters-1}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва PersistentVolume</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-2}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>Коли параметр присутній, це вказує, що зміни не повинні зберігатися. Неправильна або нерозпізнана директива dryRun призведе до помилки та припинення обробки запиту. Дійсні значення:
      <ul>
        <li>All: всі етапи dry run будуть виконані</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>fieldManager</code></td>
      <td><em>string</em></td>
      <td>fieldManager є імʼям, повʼязаним з а́ктором або сутністю, яка вносить ці зміни. Значення повинно бути менше або дорівнювати 128 символам і містити лише друковані символи, як визначено в <a href="https://golang.org/pkg/unicode/#IsPrint">https://golang.org/pkg/unicode/#IsPrint</a>.</td>
    </tr>
    <tr>
      <td><code>fieldValidation</code></td>
      <td><em>string</em></td>
      <td>fieldValidation інструктує сервер, як обробляти обʼєкти в запиті (POST/PUT/PATCH), що містять невідомі або дубльовані поля. Дійсні значення:
      <ul>
        <li>Ignore: Ігнорує всі невідомі поля, які без попередження видаляються з обʼєкта, а також ігнорує всі дублікати полів, крім останнього, на які натрапляє декодер. Це стандартна поведінка до v1.23.</li>
        <li>Warn: Надсилає попередження через стандартний заголовок відповіді для кожного невідомого поля, яке видаляється з обʼєкта, і для кожного дубльованого поля, яке зустрічається. Запит все ще буде успішним, якщо немає інших помилок, і буде зберігатися лише останнє з будь-яких дубльованих полів. Це стандартна поведінка у v1.23+</li>
        <li>Strict: У цьому випадку запит завершиться з помилкою BadRequest, якщо з обʼєкта будуть вилучені невідомі поля або якщо будуть виявлені дублікати полів. Помилка, що повертається сервером, міститиме всі виявлені невідомі та дубльовані поля.</li>
      </ul></td>
    </tr>
  </tbody>
</table>

#### Параметри тіла запиту {#body-parameters-2}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-2}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a></em></td>
    </tr>
  </tbody>
</table>

### `delete` Delete

#### HTTP Запит {#http-request-3}

DELETE /api/v1/persistentvolumes/{name}

#### Параметри шляху {#path-parameters-2}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва PersistentVolume</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-3}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>Коли параметр присутній, це вказує, що зміни не повинні зберігатися. Неправильна або нерозпізнана директива dryRun призведе до помилки та припинення обробки запиту. Дійсні значення:
      <ul>
        <li>All: всі етапи dry run будуть виконані</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>gracePeriodSeconds</code></td>
      <td><em>integer</em></td>
      <td>Часу у секундах перед видаленням обʼєкта. Значення повинно бути невідʼємним цілим числом. Значення нуль вказує на негайне видалення. Якщо це значення відсутнє, буде використано стандартний період очікування для зазначеного типу. Зазвичай використовується значення для конкретного обʼєкта, якщо не вказано. Нуль означає негайне видалення.</td>
    </tr>
    <tr>
      <td><code>ignoreStoreReadErrorWithClusterBreakingPotential</code></td>
      <td><em>boolean</em></td>
      <td>Якщо встановлено в true, це призведе до небезпечного видалення ресурсу у випадку, якщо нормальний процес видалення не вдасться через помилку пошкодженого обʼєкта. Ресурс вважається пошкодженим, якщо його не можна успішно отримати з відповідного сховища томущо: a) його дані не можна трансформувати, наприклад, помилка дешифрування, або b) не вдається декодувати в обʼєкт. ПРИМІТКА: небезпечне видалення ігнорує обмеження завершувача, пропускає перевірки передумов і видаляє обʼєкт зі сховища. ПОПЕРЕДЖЕННЯ: це може потенційно порушити роботу кластера, якщо робоче навантаження, повʼязане з ресурсом, що видаляється небезпечно, покладається на нормальний процес видалення. Використовуйте лише якщо ви ДІЙСНО знаєте, що робите. Стандартне значення — false, і користувач повинен явно погодитися на його використання.</td>
    </tr>
    <tr>
      <td><code>orphanDependents</code></td>
      <td><em>boolean</em></td>
      <td>Застаріло: будь ласка, використовуйте PropagationPolicy, це поле буде застарілим у версії 1.7. Чи повинні залежні обʼєкти залишатися покинутими. Якщо true/false, завершувач "orphan" буде доданий до/видалений з списку завершувачів обʼєкта. Можна встановити або це поле, або PropagationPolicy, але не обидва.</td>
    </tr>
    <tr>
      <td><code>propagationPolicy</code></td>
      <td><em>string</em></td>
      <td>Чи і як буде виконано збір сміття. Можна встановити або це поле, або OrphanDependents, але не обидва. Стандартна політика визначається наявним завершувачем у metadata.finalizers та стандартною політикою для конкретного ресурсу. Допустимі значення: 'Orphan' — залишити залежні обʼєкти покинутими; 'Background' — дозволити збирачу сміття видаляти залежні обʼєкти у фоновому режимі; 'Foreground' — каскадна політика, яка видаляє всі залежні обʼєкти з показом всіх дій.</td>
    </tr>
  </tbody>
</table>

#### Параметри тіла запиту {#body-parameters-3}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "../definitions/delete-options-v1-meta#DeleteOptions" >}}">DeleteOptions</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-3}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a></em></td>
    </tr>
    <tr>
      <td>202</td>
      <td>Accepted</td>
      <td><em><a href="{{< ref "persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a></em></td>
    </tr>
  </tbody>
</table>

### `delete` Delete Collection

#### HTTP Запит {#http-request-4}

DELETE /api/v1/persistentvolumes

#### Параметри запиту {#query-parameters-4}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>continue</code></td>
      <td><em>string</em></td>
      <td>Опція continue повинна бути встановлена при отриманні додаткових результатів від сервера. Оскільки це значення визначається сервером, клієнти можуть використовувати значення continue лише з попереднього результату запиту з ідентичними параметрами запиту (крім значення continue), і сервер може відхилити значення continue, яке він не розпізнає. Якщо вказане значення continue більше не дійсне через закінчення терміну дії (зазвичай пʼять-пʼятнадцять хвилин) або зміну конфігурації на сервері, сервер відповість помилкою 410 ResourceExpired разом з токеном continue. Якщо клієнту потрібен послідовний список, він повинен перезапустити свій список без поля continue. В іншому випадку клієнт може надіслати ще один запит списку з токеном, отриманим з помилкою 410, сервер відповість списком, починаючи з наступного ключа, але з останнього знімка, що не відповідає попереднім результатам списку — обʼєкти, які були створені, змінені або видалені після першого запиту списку, будуть включені у відповідь, якщо їх ключі йдуть після "наступного ключа". Це поле не підтримується, коли watch встановлено в true. Клієнти можуть почати спостереження з останнього значення resourceVersion, повернутого сервером, і не пропустити жодних змін.</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>Коли параметр присутній, це вказує, що зміни не повинні зберігатися. Неправильна або нерозпізнана директива dryRun призведе до помилки та припинення обробки запиту. Дійсні значення:
      <ul>
        <li>All: всі етапи dry run будуть виконані</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>fieldSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку обʼєктів, що повертаються, за їхніми полями. Зазвичай повертаються всі обʼєкти.</td>
    </tr>
    <tr>
      <td><code>gracePeriodSeconds</code></td>
      <td><em>integer</em></td>
      <td>Часу у секундах перед видаленням обʼєкта. Значення повинно бути невідʼємним цілим числом. Значення нуль вказує на негайне видалення. Якщо це значення відсутнє, буде використано стандартний період очікування для зазначеного типу. Зазвичай використовується значення для конкретного обʼєкта, якщо не вказано. Нуль означає негайне видалення.</td>
    </tr>
    <tr>
      <td><code>ignoreStoreReadErrorWithClusterBreakingPotential</code></td>
      <td><em>boolean</em></td>
      <td>Якщо встановлено в true, це призведе до небезпечного видалення ресурсу у випадку, якщо нормальний процес видалення не вдасться через помилку пошкодженого обʼєкта. Ресурс вважається пошкодженим, якщо його не можна успішно отримати з відповідного сховища томущо: a) його дані не можна трансформувати, наприклад, помилка дешифрування, або b) не вдається декодувати в обʼєкт. ПРИМІТКА: небезпечне видалення ігнорує обмеження завершувача, пропускає перевірки передумов і видаляє обʼєкт зі сховища. ПОПЕРЕДЖЕННЯ: це може потенційно порушити роботу кластера, якщо робоче навантаження, повʼязане з ресурсом, що видаляється небезпечно, покладається на нормальний процес видалення. Використовуйте лише якщо ви ДІЙСНО знаєте, що робите. Стандартне значення — false, і користувач повинен явно погодитися на його використання.</td>
    </tr>
    <tr>
      <td><code>labelSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку обʼєктів, що повертаються, за їхніми мітками. Зазвичай повертаються всі обʼєкти.</td>
    </tr>
    <tr>
      <td><code>limit</code></td>
      <td><em>integer</em></td>
      <td>limit є максимальним числом відповідей, які потрібно повернути для виклику списку. Якщо існує більше елементів, сервер встановить поле <code>continue</code> у метаданих списку на значення, яке можна використовувати з тим самим початковим запитом для отримання наступного набору результатів. Встановлення обмеження може повернути менше, ніж запитана кількість елементів (до нуля елементів) у випадку, якщо всі запитані обʼєкти відфільтровані, і клієнти повинні використовувати лише наявність поля continue, щоб визначити, чи доступні додаткові результати. Сервери можуть вирішити не підтримувати аргумент limit і повернуть усі доступні результати. Якщо limit вказано, а поле continue порожнє, клієнти можуть припустити, що результатів більше немає. Це поле не підтримується, якщо watch дорівнює true. Сервер гарантує, що обʼєкти, повернені при використанні continue, будуть ідентичні до виконання одного виклику списку без обмеження — тобто жодні обʼєкти, створені, змінені або видалені після першого запиту, не будуть включені в будь-які наступні продовжені запити. Це іноді називають послідовним знімком, і забезпечує, що клієнт, який використовує limit для отримання менших частин дуже великого результату, може бути впевнений, що він бачить усі можливі обʼєкти. Якщо обʼєкти оновлюються під час отримання часткового списку, повертається версія обʼєкта, яка була присутня на момент обчислення першого результату списку.</td>
    </tr>
    <tr>
      <td><code>orphanDependents</code></td>
      <td><em>boolean</em></td>
      <td>Застаріло: будь ласка, використовуйте PropagationPolicy, це поле буде застарілим у версії 1.7. Чи повинні залежні обʼєкти залишатися покинутими. Якщо true/false, завершувач "orphan" буде доданий до/видалений з списку завершувачів обʼєкта. Можна встановити або це поле, або PropagationPolicy, але не обидва.</td>
    </tr>
    <tr>
      <td><code>propagationPolicy</code></td>
      <td><em>string</em></td>
      <td>Чи і як буде виконано збір сміття. Можна встановити або це поле, або OrphanDependents, але не обидва. Стандартна політика визначається наявним завершувачем у metadata.finalizers та стандартною політикою для конкретного ресурсу. Допустимі значення: 'Orphan' — залишити залежні обʼєкти покинутими; 'Background' — дозволити збирачу сміття видаляти залежні обʼєкти у фоновому режимі; 'Foreground' — каскадна політика, яка видаляє всі залежні обʼєкти з показом всіх дій.</td>
    </tr>
    <tr>
      <td><code>resourceVersion</code></td>
      <td><em>string</em></td>
      <td>resourceVersion встановлює обмеження на те, з яких версій ресурсів може обслуговуватися запит. Див. <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a> для деталей. Стандартне значення не встановлено</td>
    </tr>
    <tr>
      <td><code>resourceVersionMatch</code></td>
      <td><em>string</em></td>
      <td>resourceVersionMatch визначає, як resourceVersion застосовується до викликів списку. Рекомендується встановлювати resourceVersionMatch для викликів списку, де встановлено resourceVersion. Див. <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a> для деталей. Стандартне значення не встановлено</td>
    </tr>
    <tr>
      <td><code>sendInitialEvents</code></td>
      <td><em>boolean</em></td>
      <td><code>sendInitialEvents=true</code> може бути встановлено разом з <code>watch=true</code>. У цьому випадку потік спостереження почнеться з синтетичних подій для відтворення поточного стану обʼєктів у колекції. Після надсилання всіх таких подій буде надіслано синтетичну подію "Bookmark". Закладка повідомить ResourceVersion (RV), що відповідає набору обʼєктів, і буде позначена анотацією <code>"k8s.io/initial-events-end": "true"</code>. Після цього потік спостереження продовжиться як зазвичай, надсилаючи події спостереження, що відповідають змінам (після RV) для спостережуваних обʼєктів. Коли встановлено опцію <code>sendInitialEvents</code>, ми вимагаємо також встановлення опції <code>resourceVersionMatch</code>. Семантика запиту спостереження наступна:
      <ul>
        <li><code>resourceVersionMatch = NotOlderThan</code> інтерпретується як «дані, що є принаймні такими ж новими, як зазначена <code>resourceVersion</code>», і подія bookmark надсилається, коли стан синхронізується з <code>resourceVersion</code>, яка є принаймні такою ж актуальною, як та, що вказана в ListOptions. Якщо <code>resourceVersion</code> не встановлено, це інтерпретується як «послідовне читання», і подія bookmark надсилається, коли стан синхронізується принаймні до моменту, коли почалася обробка запиту.</li>
        <li><code>resourceVersionMatch</code>, встановлений на будь-яке інше значення або не встановлений — повертається помилка Invalid. Стандартне значення true, якщо <code>resourceVersion=""</code> або <code>resourceVersion="0"</code> (з міркувань сумісності) і false в іншому випадку.</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>shardSelector</code></td>
      <td><em>string</em></td>
      <td>shardSelector обмежує список обʼєктів, що повертаються, за допомогою виразу вибору шардів на основі CEL. Формат використовує функцію shardRange() у поєднанні з || (логічне АБО) для вказівки одного або кількох діапазонів хешів:<br/>shardRange(object.metadata.uid, '0x0', '0x8000000000000000')<br/>shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')<br/>Шляхи полів використовують синтаксис CEL, що починається з обʼєкта (наприклад, "object.metadata.uid"), а не формат fieldSelector ("metadata.uid"). Наразі підтримуються такі шляхи:
      <ul>
        <li>object.metadata.uid</li>
        <li>object.metadata.namespace</li>
      </ul>
      hexStart і hexEnd є рядковими літералами CEL у одинарних лапках з префіксом '0x', що визначають включну нижню і виключну верхню межі в 64-бітовому просторі хешів FNV-1a. Повний діапазон: [0x0, 0x10000000000000000), де виключна верхня межа дорівнює 2^64.  Приклади:
      <ul>
        <li>2-шардове розділення:<br/>шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')<br/>шард 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')</li>
        <li>4-шардове розділення:<br/>шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')<br/>шард 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')<br/>шард 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')<br/>шард 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')  </li>
      </ul>
      Це альфа-поле і вимагає увімкнення функціональної можливості ShardedListAndWatch.
      </td>
    </tr>
    <tr>
      <td><code>timeoutSeconds</code></td>
      <td><em>integer</em></td>
      <td>Час очікування для виклику list/watch. Це обмежує тривалість виклику, незалежно від будь-якої активності чи неактивності.</td>
    </tr>
  </tbody>
</table>

#### Параметри тіла запиту {#body-parameters-4}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "../definitions/delete-options-v1-meta#DeleteOptions" >}}">DeleteOptions</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-4}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "../definitions/status-v1-meta#Status" >}}">Status</a></em></td>
    </tr>
  </tbody>
</table>

### `get` Read

#### HTTP Запит {#http-request-5}

GET /api/v1/persistentvolumes/{name}

#### Параметри шляху {#path-parameters-3}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва PersistentVolume</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-5}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-5}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a></em></td>
    </tr>
  </tbody>
</table>

### `get` List

#### HTTP Запит {#http-request-6}

GET /api/v1/persistentvolumes

#### Параметри запиту {#query-parameters-6}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>allowWatchBookmarks</code></td>
      <td><em>boolean</em></td>
      <td>allowWatchBookmarks запитує події спостереження з типом "BOOKMARK". Сервери, які не реалізують закладки, можуть ігнорувати цей прапорець, а закладки надсилаються на розсуд сервера. Клієнти не повинні припускати, що закладки повертаються через певний інтервал, і не можуть припускати, що сервер надішле будь-яку подію BOOKMARK під час сеансу. Якщо це не спостереження, це поле ігнорується.</td>
    </tr>
    <tr>
      <td><code>continue</code></td>
      <td><em>string</em></td>
      <td>Опція continue повинна бути встановлена при отриманні додаткових результатів від сервера. Оскільки це значення визначається сервером, клієнти можуть використовувати значення continue лише з попереднього результату запиту з ідентичними параметрами запиту (крім значення continue), і сервер може відхилити значення continue, яке він не розпізнає. Якщо вказане значення continue більше не дійсне через закінчення терміну дії (зазвичай пʼять-пʼятнадцять хвилин) або зміну конфігурації на сервері, сервер відповість помилкою 410 ResourceExpired разом з токеном continue. Якщо клієнту потрібен послідовний список, він повинен перезапустити свій список без поля continue. В іншому випадку клієнт може надіслати ще один запит списку з токеном, отриманим з помилкою 410, сервер відповість списком, починаючи з наступного ключа, але з останнього знімка, що не відповідає попереднім результатам списку — обʼєкти, які були створені, змінені або видалені після першого запиту списку, будуть включені у відповідь, якщо їх ключі йдуть після "наступного ключа". Це поле не підтримується, коли watch встановлено в true. Клієнти можуть почати спостереження з останнього значення resourceVersion, повернутого сервером, і не пропустити жодних змін.</td>
    </tr>
    <tr>
      <td><code>fieldSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку обʼєктів, що повертаються, за їхніми полями. Зазвичай повертаються всі обʼєкти.</td>
    </tr>
    <tr>
      <td><code>labelSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку обʼєктів, що повертаються, за їхніми мітками. Зазвичай повертаються всі обʼєкти.</td>
    </tr>
    <tr>
      <td><code>limit</code></td>
      <td><em>integer</em></td>
      <td>limit є максимальним числом відповідей, які потрібно повернути для виклику списку. Якщо існує більше елементів, сервер встановить поле <code>continue</code> у метаданих списку на значення, яке можна використовувати з тим самим початковим запитом для отримання наступного набору результатів. Встановлення обмеження може повернути менше, ніж запитана кількість елементів (до нуля елементів) у випадку, якщо всі запитані обʼєкти відфільтровані, і клієнти повинні використовувати лише наявність поля continue, щоб визначити, чи доступні додаткові результати. Сервери можуть вирішити не підтримувати аргумент limit і повернуть усі доступні результати. Якщо limit вказано, а поле continue порожнє, клієнти можуть припустити, що результатів більше немає. Це поле не підтримується, якщо watch дорівнює true. Сервер гарантує, що обʼєкти, повернені при використанні continue, будуть ідентичні до виконання одного виклику списку без обмеження — тобто жодні обʼєкти, створені, змінені або видалені після першого запиту, не будуть включені в будь-які наступні продовжені запити. Це іноді називають послідовним знімком, і забезпечує, що клієнт, який використовує limit для отримання менших частин дуже великого результату, може бути впевнений, що він бачить усі можливі обʼєкти. Якщо обʼєкти оновлюються під час отримання часткового списку, повертається версія обʼєкта, яка була присутня на момент обчислення першого результату списку.</td>
    </tr>
    <tr>
      <td><code>resourceVersion</code></td>
      <td><em>string</em></td>
      <td>resourceVersion встановлює обмеження на те, з яких версій ресурсів може обслуговуватися запит. Див. <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a> для деталей. Стандартне значення не встановлено</td>
    </tr>
    <tr>
      <td><code>resourceVersionMatch</code></td>
      <td><em>string</em></td>
      <td>resourceVersionMatch визначає, як resourceVersion застосовується до викликів списку. Рекомендується встановлювати resourceVersionMatch для викликів списку, де встановлено resourceVersion. Див. <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a> для деталей. Стандартне значення не встановлено</td>
    </tr>
    <tr>
      <td><code>sendInitialEvents</code></td>
      <td><em>boolean</em></td>
      <td><code>sendInitialEvents=true</code> може бути встановлено разом з <code>watch=true</code>. У цьому випадку потік спостереження почнеться з синтетичних подій для відтворення поточного стану обʼєктів у колекції. Після надсилання всіх таких подій буде надіслано синтетичну подію "Bookmark". Закладка повідомить ResourceVersion (RV), що відповідає набору обʼєктів, і буде позначена анотацією <code>"k8s.io/initial-events-end": "true"</code>. Після цього потік спостереження продовжиться як зазвичай, надсилаючи події спостереження, що відповідають змінам (після RV) для спостережуваних обʼєктів. Коли встановлено опцію <code>sendInitialEvents</code>, ми вимагаємо також встановлення опції <code>resourceVersionMatch</code>. Семантика запиту спостереження наступна:
      <ul>
        <li><code>resourceVersionMatch = NotOlderThan</code> інтерпретується як «дані, що є принаймні такими ж новими, як зазначена <code>resourceVersion</code>», і подія bookmark надсилається, коли стан синхронізується з <code>resourceVersion</code>, яка є принаймні такою ж актуальною, як та, що вказана в ListOptions. Якщо <code>resourceVersion</code> не встановлено, це інтерпретується як «послідовне читання», і подія bookmark надсилається, коли стан синхронізується принаймні до моменту, коли почалася обробка запиту.</li>
        <li><code>resourceVersionMatch</code>, встановлений на будь-яке інше значення або не встановлений — повертається помилка Invalid. Стандартне значення true, якщо <code>resourceVersion=""</code> або <code>resourceVersion="0"</code> (з міркувань сумісності) і false в іншому випадку.</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>shardSelector</code></td>
      <td><em>string</em></td>
      <td>shardSelector обмежує список обʼєктів, що повертаються, за допомогою виразу вибору шардів на основі CEL. Формат використовує функцію shardRange() у поєднанні з || (логічне АБО) для вказівки одного або кількох діапазонів хешів:<br/>shardRange(object.metadata.uid, '0x0', '0x8000000000000000')<br/>shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')<br/>Шляхи полів використовують синтаксис CEL, що починається з обʼєкта (наприклад, "object.metadata.uid"), а не формат fieldSelector ("metadata.uid"). Наразі підтримуються такі шляхи:
      <ul>
        <li>object.metadata.uid</li>
        <li>object.metadata.namespace</li>
      </ul>
      hexStart і hexEnd є рядковими літералами CEL у одинарних лапках з префіксом '0x', що визначають включну нижню і виключну верхню межі в 64-бітовому просторі хешів FNV-1a. Повний діапазон: [0x0, 0x10000000000000000), де виключна верхня межа дорівнює 2^64.  Приклади:
      <ul>
        <li>2-шардове розділення:<br/>шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')<br/>шард 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')</li>
        <li>4-шардове розділення:<br/>шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')<br/>шард 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')<br/>шард 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')<br/>шард 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')  </li>
      </ul>
      Це альфа-поле і вимагає увімкнення функціональної можливості ShardedListAndWatch.
      </td>
    </tr>
    <tr>
      <td><code>timeoutSeconds</code></td>
      <td><em>integer</em></td>
      <td>Час очікування для виклику list/watch. Це обмежує тривалість виклику, незалежно від будь-якої активності чи неактивності.</td>
    </tr>
    <tr>
      <td><code>watch</code></td>
      <td><em>boolean</em></td>
      <td>Спостерігати за змінами описаних ресурсів і повертати їх як потік сповіщень про додавання, оновлення та видалення. Вкажіть resourceVersion.</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-6}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "persistent-volume-v1#PersistentVolumeList" >}}">PersistentVolumeList</a></em></td>
    </tr>
  </tbody>
</table>

### `get` Watch

#### HTTP Запит {#http-request-7}

GET /api/v1/watch/persistentvolumes/{name}

#### Параметри шляху {#path-parameters-4}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва PersistentVolume</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-7}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>allowWatchBookmarks</code></td>
      <td><em>boolean</em></td>
      <td>allowWatchBookmarks запитує події спостереження з типом "BOOKMARK". Сервери, які не реалізують закладки, можуть ігнорувати цей прапорець, а закладки надсилаються на розсуд сервера. Клієнти не повинні припускати, що закладки повертаються через певний інтервал, і не можуть припускати, що сервер надішле будь-яку подію BOOKMARK під час сеансу. Якщо це не спостереження, це поле ігнорується.</td>
    </tr>
    <tr>
      <td><code>continue</code></td>
      <td><em>string</em></td>
      <td>Опція continue повинна бути встановлена при отриманні додаткових результатів від сервера. Оскільки це значення визначається сервером, клієнти можуть використовувати значення continue лише з попереднього результату запиту з ідентичними параметрами запиту (крім значення continue), і сервер може відхилити значення continue, яке він не розпізнає. Якщо вказане значення continue більше не дійсне через закінчення терміну дії (зазвичай пʼять-пʼятнадцять хвилин) або зміну конфігурації на сервері, сервер відповість помилкою 410 ResourceExpired разом з токеном continue. Якщо клієнту потрібен послідовний список, він повинен перезапустити свій список без поля continue. В іншому випадку клієнт може надіслати ще один запит списку з токеном, отриманим з помилкою 410, сервер відповість списком, починаючи з наступного ключа, але з останнього знімка, що не відповідає попереднім результатам списку — обʼєкти, які були створені, змінені або видалені після першого запиту списку, будуть включені у відповідь, якщо їх ключі йдуть після "наступного ключа". Це поле не підтримується, коли watch встановлено в true. Клієнти можуть почати спостереження з останнього значення resourceVersion, повернутого сервером, і не пропустити жодних змін.</td>
    </tr>
    <tr>
      <td><code>fieldSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку обʼєктів, що повертаються, за їхніми полями. Зазвичай повертаються всі обʼєкти.</td>
    </tr>
    <tr>
      <td><code>labelSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку обʼєктів, що повертаються, за їхніми мітками. Зазвичай повертаються всі обʼєкти.</td>
    </tr>
    <tr>
      <td><code>limit</code></td>
      <td><em>integer</em></td>
      <td>limit є максимальним числом відповідей, які потрібно повернути для виклику списку. Якщо існує більше елементів, сервер встановить поле <code>continue</code> у метаданих списку на значення, яке можна використовувати з тим самим початковим запитом для отримання наступного набору результатів. Встановлення обмеження може повернути менше, ніж запитана кількість елементів (до нуля елементів) у випадку, якщо всі запитані обʼєкти відфільтровані, і клієнти повинні використовувати лише наявність поля continue, щоб визначити, чи доступні додаткові результати. Сервери можуть вирішити не підтримувати аргумент limit і повернуть усі доступні результати. Якщо limit вказано, а поле continue порожнє, клієнти можуть припустити, що результатів більше немає. Це поле не підтримується, якщо watch дорівнює true. Сервер гарантує, що обʼєкти, повернені при використанні continue, будуть ідентичні до виконання одного виклику списку без обмеження — тобто жодні обʼєкти, створені, змінені або видалені після першого запиту, не будуть включені в будь-які наступні продовжені запити. Це іноді називають послідовним знімком, і забезпечує, що клієнт, який використовує limit для отримання менших частин дуже великого результату, може бути впевнений, що він бачить усі можливі обʼєкти. Якщо обʼєкти оновлюються під час отримання часткового списку, повертається версія обʼєкта, яка була присутня на момент обчислення першого результату списку.</td>
    </tr>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>resourceVersion</code></td>
      <td><em>string</em></td>
      <td>resourceVersion встановлює обмеження на те, з яких версій ресурсів може обслуговуватися запит. Див. <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a> для деталей. Стандартне значення не встановлено</td>
    </tr>
    <tr>
      <td><code>resourceVersionMatch</code></td>
      <td><em>string</em></td>
      <td>resourceVersionMatch визначає, як resourceVersion застосовується до викликів списку. Рекомендується встановлювати resourceVersionMatch для викликів списку, де встановлено resourceVersion. Див. <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a> для деталей. Стандартне значення не встановлено</td>
    </tr>
    <tr>
      <td><code>sendInitialEvents</code></td>
      <td><em>boolean</em></td>
      <td><code>sendInitialEvents=true</code> може бути встановлено разом з <code>watch=true</code>. У цьому випадку потік спостереження почнеться з синтетичних подій для відтворення поточного стану обʼєктів у колекції. Після надсилання всіх таких подій буде надіслано синтетичну подію "Bookmark". Закладка повідомить ResourceVersion (RV), що відповідає набору обʼєктів, і буде позначена анотацією <code>"k8s.io/initial-events-end": "true"</code>. Після цього потік спостереження продовжиться як зазвичай, надсилаючи події спостереження, що відповідають змінам (після RV) для спостережуваних обʼєктів. Коли встановлено опцію <code>sendInitialEvents</code>, ми вимагаємо також встановлення опції <code>resourceVersionMatch</code>. Семантика запиту спостереження наступна:
      <ul>
        <li><code>resourceVersionMatch = NotOlderThan</code> інтерпретується як «дані, що є принаймні такими ж новими, як зазначена <code>resourceVersion</code>», і подія bookmark надсилається, коли стан синхронізується з <code>resourceVersion</code>, яка є принаймні такою ж актуальною, як та, що вказана в ListOptions. Якщо <code>resourceVersion</code> не встановлено, це інтерпретується як «послідовне читання», і подія bookmark надсилається, коли стан синхронізується принаймні до моменту, коли почалася обробка запиту.</li>
        <li><code>resourceVersionMatch</code>, встановлений на будь-яке інше значення або не встановлений — повертається помилка Invalid. Стандартне значення true, якщо <code>resourceVersion=""</code> або <code>resourceVersion="0"</code> (з міркувань сумісності) і false в іншому випадку.</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>shardSelector</code></td>
      <td><em>string</em></td>
      <td>shardSelector обмежує список обʼєктів, що повертаються, за допомогою виразу вибору шардів на основі CEL. Формат використовує функцію shardRange() у поєднанні з || (логічне АБО) для вказівки одного або кількох діапазонів хешів:<br/>shardRange(object.metadata.uid, '0x0', '0x8000000000000000')<br/>shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')<br/>Шляхи полів використовують синтаксис CEL, що починається з обʼєкта (наприклад, "object.metadata.uid"), а не формат fieldSelector ("metadata.uid"). Наразі підтримуються такі шляхи:
      <ul>
        <li>object.metadata.uid</li>
        <li>object.metadata.namespace</li>
      </ul>
      hexStart і hexEnd є рядковими літералами CEL у одинарних лапках з префіксом '0x', що визначають включну нижню і виключну верхню межі в 64-бітовому просторі хешів FNV-1a. Повний діапазон: [0x0, 0x10000000000000000), де виключна верхня межа дорівнює 2^64.  Приклади:
      <ul>
        <li>2-шардове розділення:<br/>шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')<br/>шард 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')</li>
        <li>4-шардове розділення:<br/>шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')<br/>шард 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')<br/>шард 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')<br/>шард 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')  </li>
      </ul>
      Це альфа-поле і вимагає увімкнення функціональної можливості ShardedListAndWatch.
      </td>
    </tr>
    <tr>
      <td><code>timeoutSeconds</code></td>
      <td><em>integer</em></td>
      <td>Час очікування для виклику list/watch. Це обмежує тривалість виклику, незалежно від будь-якої активності чи неактивності.</td>
    </tr>
    <tr>
      <td><code>watch</code></td>
      <td><em>boolean</em></td>
      <td>Спостерігати за змінами описаних ресурсів і повертати їх як потік сповіщень про додавання, оновлення та видалення. Вкажіть resourceVersion.</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-7}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "../definitions/watch-event-v1-meta#WatchEvent" >}}">WatchEvent</a></em></td>
    </tr>
  </tbody>
</table>

### `get` Watch List

#### HTTP Запит {#http-request-8}

GET /api/v1/watch/persistentvolumes

#### Параметри запиту {#query-parameters-8}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>allowWatchBookmarks</code></td>
      <td><em>boolean</em></td>
      <td>allowWatchBookmarks запитує події спостереження з типом "BOOKMARK". Сервери, які не реалізують закладки, можуть ігнорувати цей прапорець, а закладки надсилаються на розсуд сервера. Клієнти не повинні припускати, що закладки повертаються через певний інтервал, і не можуть припускати, що сервер надішле будь-яку подію BOOKMARK під час сеансу. Якщо це не спостереження, це поле ігнорується.</td>
    </tr>
    <tr>
      <td><code>continue</code></td>
      <td><em>string</em></td>
      <td>Опція continue повинна бути встановлена при отриманні додаткових результатів від сервера. Оскільки це значення визначається сервером, клієнти можуть використовувати значення continue лише з попереднього результату запиту з ідентичними параметрами запиту (крім значення continue), і сервер може відхилити значення continue, яке він не розпізнає. Якщо вказане значення continue більше не дійсне через закінчення терміну дії (зазвичай пʼять-пʼятнадцять хвилин) або зміну конфігурації на сервері, сервер відповість помилкою 410 ResourceExpired разом з токеном continue. Якщо клієнту потрібен послідовний список, він повинен перезапустити свій список без поля continue. В іншому випадку клієнт може надіслати ще один запит списку з токеном, отриманим з помилкою 410, сервер відповість списком, починаючи з наступного ключа, але з останнього знімка, що не відповідає попереднім результатам списку — обʼєкти, які були створені, змінені або видалені після першого запиту списку, будуть включені у відповідь, якщо їх ключі йдуть після "наступного ключа". Це поле не підтримується, коли watch встановлено в true. Клієнти можуть почати спостереження з останнього значення resourceVersion, повернутого сервером, і не пропустити жодних змін.</td>
    </tr>
    <tr>
      <td><code>fieldSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку обʼєктів, що повертаються, за їхніми полями. Зазвичай повертаються всі обʼєкти.</td>
    </tr>
    <tr>
      <td><code>labelSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку обʼєктів, що повертаються, за їхніми мітками. Зазвичай повертаються всі обʼєкти.</td>
    </tr>
    <tr>
      <td><code>limit</code></td>
      <td><em>integer</em></td>
      <td>limit є максимальним числом відповідей, які потрібно повернути для виклику списку. Якщо існує більше елементів, сервер встановить поле <code>continue</code> у метаданих списку на значення, яке можна використовувати з тим самим початковим запитом для отримання наступного набору результатів. Встановлення обмеження може повернути менше, ніж запитана кількість елементів (до нуля елементів) у випадку, якщо всі запитані обʼєкти відфільтровані, і клієнти повинні використовувати лише наявність поля continue, щоб визначити, чи доступні додаткові результати. Сервери можуть вирішити не підтримувати аргумент limit і повернуть усі доступні результати. Якщо limit вказано, а поле continue порожнє, клієнти можуть припустити, що результатів більше немає. Це поле не підтримується, якщо watch дорівнює true. Сервер гарантує, що обʼєкти, повернені при використанні continue, будуть ідентичні до виконання одного виклику списку без обмеження — тобто жодні обʼєкти, створені, змінені або видалені після першого запиту, не будуть включені в будь-які наступні продовжені запити. Це іноді називають послідовним знімком, і забезпечує, що клієнт, який використовує limit для отримання менших частин дуже великого результату, може бути впевнений, що він бачить усі можливі обʼєкти. Якщо обʼєкти оновлюються під час отримання часткового списку, повертається версія обʼєкта, яка була присутня на момент обчислення першого результату списку.</td>
    </tr>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>resourceVersion</code></td>
      <td><em>string</em></td>
      <td>resourceVersion встановлює обмеження на те, з яких версій ресурсів може обслуговуватися запит. Див. <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a> для деталей. Стандартне значення не встановлено</td>
    </tr>
    <tr>
      <td><code>resourceVersionMatch</code></td>
      <td><em>string</em></td>
      <td>resourceVersionMatch визначає, як resourceVersion застосовується до викликів списку. Рекомендується встановлювати resourceVersionMatch для викликів списку, де встановлено resourceVersion. Див. <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a> для деталей. Стандартне значення не встановлено</td>
    </tr>
    <tr>
      <td><code>sendInitialEvents</code></td>
      <td><em>boolean</em></td>
      <td><code>sendInitialEvents=true</code> може бути встановлено разом з <code>watch=true</code>. У цьому випадку потік спостереження почнеться з синтетичних подій для відтворення поточного стану обʼєктів у колекції. Після надсилання всіх таких подій буде надіслано синтетичну подію "Bookmark". Закладка повідомить ResourceVersion (RV), що відповідає набору обʼєктів, і буде позначена анотацією <code>"k8s.io/initial-events-end": "true"</code>. Після цього потік спостереження продовжиться як зазвичай, надсилаючи події спостереження, що відповідають змінам (після RV) для спостережуваних обʼєктів. Коли встановлено опцію <code>sendInitialEvents</code>, ми вимагаємо також встановлення опції <code>resourceVersionMatch</code>. Семантика запиту спостереження наступна:
      <ul>
        <li><code>resourceVersionMatch = NotOlderThan</code> інтерпретується як «дані, що є принаймні такими ж новими, як зазначена <code>resourceVersion</code>», і подія bookmark надсилається, коли стан синхронізується з <code>resourceVersion</code>, яка є принаймні такою ж актуальною, як та, що вказана в ListOptions. Якщо <code>resourceVersion</code> не встановлено, це інтерпретується як «послідовне читання», і подія bookmark надсилається, коли стан синхронізується принаймні до моменту, коли почалася обробка запиту.</li>
        <li><code>resourceVersionMatch</code>, встановлений на будь-яке інше значення або не встановлений — повертається помилка Invalid. Стандартне значення true, якщо <code>resourceVersion=""</code> або <code>resourceVersion="0"</code> (з міркувань сумісності) і false в іншому випадку.</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>shardSelector</code></td>
      <td><em>string</em></td>
      <td>shardSelector обмежує список обʼєктів, що повертаються, за допомогою виразу вибору шардів на основі CEL. Формат використовує функцію shardRange() у поєднанні з || (логічне АБО) для вказівки одного або кількох діапазонів хешів:<br/>shardRange(object.metadata.uid, '0x0', '0x8000000000000000')<br/>shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')<br/>Шляхи полів використовують синтаксис CEL, що починається з обʼєкта (наприклад, "object.metadata.uid"), а не формат fieldSelector ("metadata.uid"). Наразі підтримуються такі шляхи:
      <ul>
        <li>object.metadata.uid</li>
        <li>object.metadata.namespace</li>
      </ul>
      hexStart і hexEnd є рядковими літералами CEL у одинарних лапках з префіксом '0x', що визначають включну нижню і виключну верхню межі в 64-бітовому просторі хешів FNV-1a. Повний діапазон: [0x0, 0x10000000000000000), де виключна верхня межа дорівнює 2^64.  Приклади:
      <ul>
        <li>2-шардове розділення:<br/>шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')<br/>шард 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')</li>
        <li>4-шардове розділення:<br/>шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')<br/>шард 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')<br/>шард 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')<br/>шард 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')  </li>
      </ul>
      Це альфа-поле і вимагає увімкнення функціональної можливості ShardedListAndWatch.
      </td>
    </tr>
    <tr>
      <td><code>timeoutSeconds</code></td>
      <td><em>integer</em></td>
      <td>Час очікування для виклику list/watch. Це обмежує тривалість виклику, незалежно від будь-якої активності чи неактивності.</td>
    </tr>
    <tr>
      <td><code>watch</code></td>
      <td><em>boolean</em></td>
      <td>Спостерігати за змінами описаних ресурсів і повертати їх як потік сповіщень про додавання, оновлення та видалення. Вкажіть resourceVersion.</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-8}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "../definitions/watch-event-v1-meta#WatchEvent" >}}">WatchEvent</a></em></td>
    </tr>
  </tbody>
</table>

### `patch` Patch Status

#### HTTP Запит {#http-request-9}

PATCH /api/v1/persistentvolumes/{name}/status

#### Параметри шляху {#path-parameters-5}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва PersistentVolume</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-9}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>Коли параметр присутній, це вказує, що зміни не повинні зберігатися. Неправильна або нерозпізнана директива dryRun призведе до помилки та припинення обробки запиту. Дійсні значення:
      <ul>
        <li>All: всі етапи dry run будуть виконані</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>fieldManager</code></td>
      <td><em>string</em></td>
      <td>fieldManager є імʼям, повʼязаним з а́ктором або сутністю, яка вносить ці зміни. Значення повинно бути менше або дорівнювати 128 символам і містити лише друковані символи, як визначено в <a href="https://golang.org/pkg/unicode/#IsPrint">https://golang.org/pkg/unicode/#IsPrint</a>. Це поле обовʼязкове для запитів apply (application/apply-patch), але необовʼязкове для типів патчів, що не застосовуються (JsonPatch, MergePatch, StrategicMergePatch).</td>
    </tr>
    <tr>
      <td><code>fieldValidation</code></td>
      <td><em>string</em></td>
      <td>fieldValidation інструктує сервер, як обробляти обʼєкти в запиті (POST/PUT/PATCH), що містять невідомі або дубльовані поля. Дійсні значення:
      <ul>
        <li>Ignore: Ігнорує всі невідомі поля, які без попередження видаляються з обʼєкта, а також ігнорує всі дублікати полів, крім останнього, на які натрапляє декодер. Це стандартна поведінка до v1.23.</li>
        <li>Warn: Надсилає попередження через стандартний заголовок відповіді для кожного невідомого поля, яке видаляється з обʼєкта, і для кожного дубльованого поля, яке зустрічається. Запит все ще буде успішним, якщо немає інших помилок, і буде зберігатися лише останнє з будь-яких дубльованих полів. Це стандартна поведінка у v1.23+</li>
        <li>Strict: У цьому випадку запит завершиться з помилкою BadRequest, якщо з обʼєкта будуть вилучені невідомі поля або якщо будуть виявлені дублікати полів. Помилка, що повертається сервером, міститиме всі виявлені невідомі та дубльовані поля.</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>force</code></td>
      <td><em>boolean</em></td>
      <td>Force має на меті "примусово" застосовувати запити Apply. Це означає, що користувач повторно отримає конфліктні поля, що належать іншим користувачам. Прапорець Force повинен бути скасований для запитів, що не є патчами apply.</td>
    </tr>
  </tbody>
</table>

#### Параметри тіла запиту {#body-parameters-5}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "../definitions/patch-v1-meta#Patch" >}}">Patch</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-9}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a></em></td>
    </tr>
  </tbody>
</table>

### `get` Read Status

#### HTTP Запит {#http-request-10}

GET /api/v1/persistentvolumes/{name}/status

#### Параметри шляху {#path-parameters-6}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва PersistentVolume</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-10}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-10}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a></em></td>
    </tr>
  </tbody>
</table>

### `put` Replace Status

#### HTTP Запит {#http-request-11}

PUT /api/v1/persistentvolumes/{name}/status

#### Параметри шляху {#path-parameters-7}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва PersistentVolume</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-11}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>Коли параметр присутній, це вказує, що зміни не повинні зберігатися. Неправильна або нерозпізнана директива dryRun призведе до помилки та припинення обробки запиту. Дійсні значення:
      <ul>
        <li>All: всі етапи dry run будуть виконані</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>fieldManager</code></td>
      <td><em>string</em></td>
      <td>fieldManager є імʼям, повʼязаним з а́ктором або сутністю, яка вносить ці зміни. Значення повинно бути менше або дорівнювати 128 символам і містити лише друковані символи, як визначено в <a href="https://golang.org/pkg/unicode/#IsPrint">https://golang.org/pkg/unicode/#IsPrint</a>.</td>
    </tr>
    <tr>
      <td><code>fieldValidation</code></td>
      <td><em>string</em></td>
      <td>fieldValidation інструктує сервер, як обробляти обʼєкти в запиті (POST/PUT/PATCH), що містять невідомі або дубльовані поля. Дійсні значення:
      <ul>
        <li>Ignore: Ігнорує всі невідомі поля, які без попередження видаляються з обʼєкта, а також ігнорує всі дублікати полів, крім останнього, на які натрапляє декодер. Це стандартна поведінка до v1.23.</li>
        <li>Warn: Надсилає попередження через стандартний заголовок відповіді для кожного невідомого поля, яке видаляється з обʼєкта, і для кожного дубльованого поля, яке зустрічається. Запит все ще буде успішним, якщо немає інших помилок, і буде зберігатися лише останнє з будь-яких дубльованих полів. Це стандартна поведінка у v1.23+</li>
        <li>Strict: У цьому випадку запит завершиться з помилкою BadRequest, якщо з обʼєкта будуть вилучені невідомі поля або якщо будуть виявлені дублікати полів. Помилка, що повертається сервером, міститиме всі виявлені невідомі та дубльовані поля.</li>
      </ul></td>
    </tr>
  </tbody>
</table>

#### Параметри тіла запиту {#body-parameters-6}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-11}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a></em></td>
    </tr>
  </tbody>
</table>
