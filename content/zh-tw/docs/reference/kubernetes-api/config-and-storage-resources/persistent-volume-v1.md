---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "PersistentVolume"
content_type: "api_reference"
description: "PersistentVolume (PV) 是管理員製備的一個存儲資源。"
title: "PersistentVolume"
weight: 7
---
<!--
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "PersistentVolume"
content_type: "api_reference"
description: "PersistentVolume (PV) is a storage resource provisioned by an administrator."
title: "PersistentVolume"
weight: 7
auto_generated: true
-->

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## PersistentVolume {#PersistentVolume}

<!--
PersistentVolume (PV) is a storage resource provisioned by an administrator. It is analogous to a node. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes
-->
PersistentVolume (PV) 是管理員製備的一個存儲資源。它類似於一個節點。更多信息：
https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes

<hr>

- **apiVersion**: v1

- **kind**: PersistentVolume

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolumeSpec" >}}">PersistentVolumeSpec</a>)

  spec defines a specification of a persistent volume owned by the cluster. Provisioned by an administrator. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistent-volumes
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  標準的對象元數據。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolumeSpec" >}}">PersistentVolumeSpec</a>)

  spec 定義了集羣所擁有的持久卷的規約。由管理員進行製備。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes#persistent-volumes

<!--
- **status** (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolumeStatus" >}}">PersistentVolumeStatus</a>)

  status represents the current information/status for the persistent volume. Populated by the system. Read-only. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistent-volumes
-->
- **status** (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolumeStatus" >}}">PersistentVolumeStatus</a>)

  status 表示持久卷的當前信息/狀態。該值由系統填充，只讀。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes#persistent-volumes

## PersistentVolumeSpec {#PersistentVolumeSpec}

<!--
PersistentVolumeSpec is the specification of a persistent volume.
-->
PersistentVolumeSpec 是持久卷的規約。

<hr>

<!--
- **accessModes** ([]string)

  *Atomic: will be replaced during a merge*
  
  accessModes contains all ways the volume can be mounted. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes

- **capacity** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  capacity is the description of the persistent volume's resources and capacity. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#capacity
-->
- **accessModes** ([]string)

  **原子：將在合併期間被替換**

  accessModes 包含可以掛載卷的所有方式。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes#access-modes

- **capacity** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  capacity 描述持久卷的資源和容量。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes#capacity

<!--
- **claimRef** (<a href="{{< ref "../common-definitions/object-reference#ObjectReference" >}}">ObjectReference</a>)

  claimRef is part of a bi-directional binding between PersistentVolume and PersistentVolumeClaim. Expected to be non-nil when bound. claim.VolumeName is the authoritative bind between PV and PVC. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#binding

- **mountOptions** ([]string)

  *Atomic: will be replaced during a merge*
  
  mountOptions is the list of mount options, e.g. ["ro", "soft"]. Not validated - mount will simply fail if one is invalid. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes/#mount-options
-->
- **claimRef** (<a href="{{< ref "../common-definitions/object-reference#ObjectReference" >}}">ObjectReference</a>)

  claimRef 是 PersistentVolume 和 PersistentVolumeClaim 之間雙向綁定的一部分。
  預期在綁定時爲非空。claim.VolumeName 是在 PV 和 PVC 間綁定關係的正式確認。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes#binding

- **mountOptions** ([]string)

  **原子：將在合併期間被替換**

  mountOptions 是掛載選項的列表，例如 ["ro", "soft"]。
  針對此字段無合法性檢查——如果某選項無效，則只是掛載會失敗。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes/#mount-options

<!--
- **nodeAffinity** (VolumeNodeAffinity)

  nodeAffinity defines constraints that limit what nodes this volume can be accessed from. This field influences the scheduling of pods that use this volume.

  <a name="VolumeNodeAffinity"></a>
  *VolumeNodeAffinity defines constraints that limit what nodes this volume can be accessed from.*
-->
- **nodeAffinity** (VolumeNodeAffinity)

  nodeAffinity 定義可以從哪些節點訪問此卷的約束限制。此字段會影響調度使用此卷的 Pod。

  <a name="VolumeNodeAffinity"></a>
  **VolumeNodeAffinity 定義可以從哪些節點訪問此卷的約束限制。**

  <!--
  - **nodeAffinity.required** (NodeSelector)

    required specifies hard node constraints that must be met.

    <a name="NodeSelector"></a>
    *A node selector represents the union of the results of one or more label queries over a set of nodes; that is, it represents the OR of the selectors represented by the node selector terms.*
  -->

  - **nodeAffinity.required** (NodeSelector)

    required 指定必須滿足的硬性節點約束。

    <a name="NodeSelector"></a>
    **節點選擇器表示在一組節點上一個或多個標籤查詢結果的並集；
    也就是說，它表示由節點選擇器條件表示的選擇器的邏輯或計算結果。**

    <!--
    - **nodeAffinity.required.nodeSelectorTerms** ([]NodeSelectorTerm), required

      *Atomic: will be replaced during a merge*
      
      Required. A list of node selector terms. The terms are ORed.

      <a name="NodeSelectorTerm"></a>
      *A null or empty node selector term matches no objects. The requirements of them are ANDed. The TopologySelectorTerm type implements a subset of the NodeSelectorTerm.*
    -->

    - **nodeAffinity.required.nodeSelectorTerms** ([]NodeSelectorTerm)，必需

      **原子：將在合併期間被替換**

      必需。節點選擇器條件的列表。這些條件是邏輯或的計算結果。

      <a name="NodeSelectorTerm"></a>
      **一個 null 或空的節點選擇器條件不會與任何對象匹配。這些條件會按邏輯與的關係來計算。
      TopologySelectorTerm 類別實現了 NodeSelectorTerm 的子集。**

      <!--
      - **nodeAffinity.required.nodeSelectorTerms.matchExpressions** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

        *Atomic: will be replaced during a merge*
        
        A list of node selector requirements by node's labels.

      - **nodeAffinity.required.nodeSelectorTerms.matchFields** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

        *Atomic: will be replaced during a merge*
        
        A list of node selector requirements by node's fields.
      -->
      
      - **nodeAffinity.required.nodeSelectorTerms.matchExpressions** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

        **原子：將在合併期間被替換**

        基於節點標籤所設置的節點選擇器要求的列表。

      - **nodeAffinity.required.nodeSelectorTerms.matchFields** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

        **原子：將在合併期間被替換**

        基於節點字段所設置的節點選擇器要求的列表。

<!--
- **persistentVolumeReclaimPolicy** (string)

  persistentVolumeReclaimPolicy defines what happens to a persistent volume when released from its claim. Valid options are Retain (default for manually created PersistentVolumes), Delete (default for dynamically provisioned PersistentVolumes), and Recycle (deprecated). Recycle must be supported by the volume plugin underlying this PersistentVolume. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#reclaiming
-->
- **persistentVolumeReclaimPolicy** (string)

  persistentVolumeReclaimPolicy 定義當從持久卷聲明釋放持久卷時會發生什麼。
  有效的選項爲 Retain（手動創建 PersistentVolumes 所用的默認值）、
  Delete（動態製備 PersistentVolumes 所用的默認值）和 Recycle（已棄用）。
  Recycle 選項必須被 PersistentVolume 下層的卷插件所支持纔行。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes#reclaiming

<!--
- **storageClassName** (string)

  storageClassName is the name of StorageClass to which this persistent volume belongs. Empty value means that this volume does not belong to any StorageClass.

- **volumeAttributesClassName** (string)

  Name of VolumeAttributesClass to which this persistent volume belongs. Empty value is not allowed. When this field is not set, it indicates that this volume does not belong to any VolumeAttributesClass. This field is mutable and can be changed by the CSI driver after a volume has been updated successfully to a new class. For an unbound PersistentVolume, the volumeAttributesClassName will be matched with unbound PersistentVolumeClaims during the binding process.
-->
- **storageClassName** (string)

  storageClassName 是這個持久卷所屬於的 StorageClass 的名稱。
  空值意味着此卷不屬於任何 StorageClass。

- **volumeAttributesClassName** (string)

  此持久卷所屬的 VolumeAttributesClass 的名稱。不能爲空。
  當此字段未設置時，表示此卷不屬於任何 VolumeAttributesClass。
  此字段是可變更的，在某個卷已被成功更新爲新類後可以由 CSI 驅動更改此字段。對於未綁定的 PersistentVolume，
  volumeAttributesClassName 將在綁定過程中與未綁定的 PersistentVolumeClaim 進行匹配。

<!--
- **volumeMode** (string)

  volumeMode defines if a volume is intended to be used with a formatted filesystem or to remain in raw block state. Value of Filesystem is implied when not included in spec.
-->
- **volumeMode** (string)

  volumeMode 定義一個卷是帶着已格式化的文件系統來使用還是保持在原始塊狀態來使用。
  當 spec 中未包含此字段時，意味着取值爲 Filesystem。

### Local

<!--
- **hostPath** (HostPathVolumeSource)

  hostPath represents a directory on the host. Provisioned by a developer or tester. This is useful for single-node development and testing only! On-host storage is not supported in any way and WILL NOT WORK in a multi-node cluster. More info: https://kubernetes.io/docs/concepts/storage/volumes#hostpath

  <a name="HostPathVolumeSource"></a>
  *Represents a host path mapped into a pod. Host path volumes do not support ownership management or SELinux relabeling.*

  - **hostPath.path** (string), required

    path of the directory on the host. If the path is a symlink, it will follow the link to the real path. More info: https://kubernetes.io/docs/concepts/storage/volumes#hostpath

  - **hostPath.type** (string)

    type for HostPath Volume Defaults to "" More info: https://kubernetes.io/docs/concepts/storage/volumes#hostpath
-->
- **hostPath** (HostPathVolumeSource)

  hostPath 表示主機上的目錄，由開發或測試人員進行製備。hostPath 僅對單節點開發和測試有用！
  不會以任何方式支持主機存儲（On-host storage），並且**不能用於**多節點集羣中。
  更多信息： https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#hostpath

  <a name="HostPathVolumeSource"></a>
  **表示映射到 Pod 中的主機路徑。主機路徑卷不支持所有權管理或 SELinux 重新打標籤。**

  - **hostPath.path** (string)，必需

    目錄在主機上的路徑。如果該路徑是一個符號鏈接，則它將沿着鏈接指向真實路徑。
    更多信息： https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#hostpath

  - **hostPath.type** (string)

    HostPath 卷的類型。默認爲 ""。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#hostpath

<!--
- **local** (LocalVolumeSource)

  local represents directly-attached storage with node affinity

  <a name="LocalVolumeSource"></a>
  *Local represents directly-attached storage with node affinity*

  - **local.path** (string), required

    path of the full path to the volume on the node. It can be either a directory or block device (disk, partition, ...).

  - **local.fsType** (string)

    fsType is the filesystem type to mount. It applies only when the Path is a block device. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". The default value is to auto-select a filesystem if unspecified.
-->
- **local** (LocalVolumeSource)

  local 表示具有節點親和性的直連式存儲。

  <a name="LocalVolumeSource"></a>
  **local 表示具有節點親和性的直連式存儲。**

  - **local.path** (string)，必需

    指向節點上卷的完整路徑。它可以是一個目錄或塊設備（磁盤、分區...）。

  - **local.fsType** (string)

    fsType 是要掛載的文件系統類型。它僅適用於 path 是一個塊設備的情況。
    必須是主機操作系統所支持的文件系統類型之一。例如 “ext4”、“xfs”、“ntfs”。
    在未指定的情況下，默認值是自動選擇一個文件系統。

<!--
### Persistent volumes

- **awsElasticBlockStore** (AWSElasticBlockStoreVolumeSource)

  awsElasticBlockStore represents an AWS Disk resource that is attached to a kubelet's host machine and then exposed to the pod. Deprecated: AWSElasticBlockStore is deprecated. All operations for the in-tree awsElasticBlockStore type are redirected to the ebs.csi.aws.com CSI driver. More info: https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore

  <a name="AWSElasticBlockStoreVolumeSource"></a>
  *Represents a Persistent Disk resource in AWS.

  An AWS EBS disk must exist before mounting to a container. The disk must also be in the same AWS zone as the kubelet. An AWS EBS disk can only be mounted as read/write once. AWS EBS volumes support ownership management and SELinux relabeling.*
-->
### 持久卷 {#persistent-volumes}

- **awsElasticBlockStore** (AWSElasticBlockStoreVolumeSource)

  awsElasticBlockStore 表示掛接到 kubelet 的主機隨後暴露給 Pod 的一個 AWS Disk 資源。
  已棄用：AWSElasticBlockStore 已被棄用。所有針對樹內 awsElasticBlockStore 類型的操作都被重定向到
  ebs.csi.aws.com CSI 驅動。
  更多信息：https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#awselasticblockstore

  <a name="AWSElasticBlockStoreVolumeSource"></a>
  **表示 AWS 上的 Persistent Disk 資源。掛載到一個容器之前 AWS EBS 磁盤必須存在。
  該磁盤還必須與 kubelet 位於相同的 AWS 區域中。AWS EBS 磁盤只能以讀/寫一次進行掛載。
  AWS EBS 卷支持所有權管理和 SELinux 重新打標籤。**

  <!--
  - **awsElasticBlockStore.volumeID** (string), required

    volumeID is unique ID of the persistent disk resource in AWS (Amazon EBS volume). More info: https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore

  - **awsElasticBlockStore.fsType** (string)

    fsType is the filesystem type of the volume that you want to mount. Tip: Ensure that the filesystem type is supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore

  - **awsElasticBlockStore.partition** (int32)

    partition is the partition in the volume that you want to mount. If omitted, the default is to mount by volume name. Examples: For volume /dev/sda1, you specify the partition as "1". Similarly, the volume partition for /dev/sda is "0" (or you can leave the property empty).

  - **awsElasticBlockStore.readOnly** (boolean)

    readOnly value true will force the readOnly setting in VolumeMounts. More info: https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore
  -->

  - **awsElasticBlockStore.volumeID** (string)，必需

    volumeID 是 AWS（Amazon EBS 卷）中持久磁盤資源的唯一 ID。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#awselasticblockstore

  - **awsElasticBlockStore.fsType** (string)

    fsType 是你要掛載的卷的文件系統類型。提示：確保主機操作系統支持此文件系統類型。
    例如：“ext4”、“xfs”、“ntfs”。如果未指定，則隱式推斷爲“ext4”。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#awselasticblockstore

  - **awsElasticBlockStore.partition** (int32)

    partition 是你要掛載的卷中的分區。如果省略，則默認爲按卷名稱進行掛載。
    例如：對於卷 /dev/sda1，將分區指定爲 “1”。
    類似地，/dev/sda 的卷分區爲 “0”（或可以將屬性留空）。

  - **awsElasticBlockStore.readOnly** (boolean)

    readOnly 值爲 true 將在 VolumeMounts 中強制設置 readOnly。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#awselasticblockstore

<!--
- **azureDisk** (AzureDiskVolumeSource)

  azureDisk represents an Azure Data Disk mount on the host and bind mount to the pod. Deprecated: AzureDisk is deprecated. All operations for the in-tree azureDisk type are redirected to the disk.csi.azure.com CSI driver.

  <a name="AzureDiskVolumeSource"></a>
  *AzureDisk represents an Azure Data Disk mount on the host and bind mount to the pod.*
-->
- **azureDisk** (AzureDiskVolumeSource)

  azureDisk 表示主機上掛載的 Azure Data Disk 並綁定掛載到 Pod 上。
  已棄用：AzureDisk 已被棄用。所有針對樹內 azureDisk 類型的操作都被重定向到
  disk.csi.azure.com CSI 驅動。

  <a name="AzureDiskVolumeSource"></a>
  **azureDisk 表示主機上掛載的 Azure Data Disk 並綁定掛載到 Pod 上。**

  <!--
  - **azureDisk.diskName** (string), required

    diskName is the Name of the data disk in the blob storage

  - **azureDisk.diskURI** (string), required

    diskURI is the URI of data disk in the blob storage

  - **azureDisk.cachingMode** (string)

    cachingMode is the Host Caching mode: None, Read Only, Read Write.
  -->

  - **azureDisk.diskName** (string)，必需

    diskName 是 Blob 存儲中數據盤的名稱。

  - **azureDisk.diskURI** (string)，必需

    diskURI 是 Blob 存儲中數據盤的 URI。

  - **azureDisk.cachingMode** (string)

    cachingMode 是主機緩存（Host Caching）模式：None、Read Only、Read Write。

  <!--
  - **azureDisk.fsType** (string)

    fsType is Filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified.

  - **azureDisk.kind** (string)

    kind expected values are Shared: multiple blob disks per storage account  Dedicated: single blob disk per storage account  Managed: azure managed data disk (only in managed availability set). defaults to shared

  - **azureDisk.readOnly** (boolean)

    readOnly Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.
  -->

  - **azureDisk.fsType** (string)

    fsType 是要掛載的文件系統類型。必須是主機操作系統所支持的文件系統類型之一。
    例如 “ext4”、“xfs”、“ntfs”。如果未指定，則隱式推斷爲 “ext4”。

  - **azureDisk.kind** (string)

    kind 預期值包括：

    - Shared：每個存儲帳戶多個 Blob 磁盤；
    - Dedicated：每個存儲帳戶單個 Blob 磁盤；
    - Managed：azure 託管的數據盤（僅託管的可用性集合中）。
    
    默認爲 Shared。

  - **azureDisk.readOnly** (boolean)

    readOnly 默認爲 false（讀/寫）。此處 readOnly 將在 VolumeMounts 中強制設置 readOnly。

<!--
- **azureFile** (AzureFilePersistentVolumeSource)

  azureFile represents an Azure File Service mount on the host and bind mount to the pod. Deprecated: AzureFile is deprecated. All operations for the in-tree azureFile type are redirected to the file.csi.azure.com CSI driver.

  <a name="AzureFilePersistentVolumeSource"></a>
  *AzureFile represents an Azure File Service mount on the host and bind mount to the pod.*
-->
- **azureFile** (AzureFilePersistentVolumeSource)

  azureDisk 表示主機上掛載並綁定掛載到 Pod 上的 Azure File Service。
  已棄用：AzureFile 已被棄用。所有針對 in-tree azureFile 類型的操作都被重定向到
  file.csi.azure.com CSI 驅動。

  <a name="AzureFilePersistentVolumeSource"></a>
  **azureFile 表示主機上掛載的並綁定掛載到 Pod 上的 Azure File Service。**

  <!--
  - **azureFile.secretName** (string), required

    secretName is the name of secret that contains Azure Storage Account Name and Key

  - **azureFile.shareName** (string), required

    shareName is the azure Share Name

  - **azureFile.readOnly** (boolean)

    readOnly defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.

  - **azureFile.secretNamespace** (string)

    secretNamespace is the namespace of the secret that contains Azure Storage Account Name and Key default is the same as the Pod
  -->

  - **azureFile.secretName** (string)，必需

    secretName 是包含 Azure 存儲賬號名稱和主鍵的 Secret 的名稱。

  - **azureFile.shareName** (string)，必需

    shareName 是 azure Share Name。

  - **azureFile.readOnly** (boolean)

    readOnly 默認爲 false（讀/寫）。此處 readOnly 將在 VolumeMounts 中強制設置 readOnly。

  - **azureFile.secretNamespace** (string)

    secretNamespace 是包含 Azure 存儲賬號名稱和主鍵的 Secret 的名字空間，默認與 Pod 相同。

<!--
- **cephfs** (CephFSPersistentVolumeSource)

  cephFS represents a Ceph FS mount on the host that shares a pod's lifetime. Deprecated: CephFS is deprecated and the in-tree cephfs type is no longer supported.

  <a name="CephFSPersistentVolumeSource"></a>
  *Represents a Ceph Filesystem mount that lasts the lifetime of a pod Cephfs volumes do not support ownership management or SELinux relabeling.*
-->
- **cephfs** (CephFSPersistentVolumeSource)

  cephfs 表示在主機上掛載的 Ceph FS，該文件系統掛載與 Pod 的生命週期相同。
  已棄用：CephFS 已被棄用，且不再支持 in-tree cephfs 類型。

  <a name="CephFSPersistentVolumeSource"></a>
  **表示在 Pod 的生命週期內持續的 Ceph Filesystem 掛載。cephfs 卷不支持所有權管理或 SELinux 重新打標籤。**

  <!--
  - **cephfs.monitors** ([]string), required

    *Atomic: will be replaced during a merge*
    
    monitors is Required: Monitors is a collection of Ceph monitors More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it
  -->

  - **cephfs.monitors** ([]string)，必需

    **原子：將在合併期間被替換**

    monitors 是必需的。monitors 是 Ceph 監測組件的集合。更多信息：
    https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it

  <!--
  - **cephfs.path** (string)

    path is Optional: Used as the mounted root, rather than the full Ceph tree, default is /

  - **cephfs.readOnly** (boolean)

    readOnly is Optional: Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts. More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it

  - **cephfs.secretFile** (string)

    secretFile is Optional: SecretFile is the path to key ring for User, default is /etc/ceph/user.secret More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it
  -->

  - **cephfs.path** (string)

    path 是可選的。用作掛載的根，而不是完整的 Ceph 樹，默認爲 /。

  - **cephfs.readOnly** (boolean)

    readOnly 是可選的。默認爲 false（讀/寫）。此處 readOnly 將在 VolumeMounts 中強制設置 readOnly。
    更多信息： https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it

  - **cephfs.secretFile** (string)

    secretFile 是可選的。secretFile 是 user 對應的密鑰環的路徑，默認爲 /etc/ceph/user.secret。
    更多信息： https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it

  <!--
  - **cephfs.secretRef** (SecretReference)

    secretRef is Optional: SecretRef is reference to the authentication secret for User, default is empty. More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it

    <a name="SecretReference"></a>
    *SecretReference represents a Secret Reference. It has enough information to retrieve secret in any namespace*

    - **cephfs.secretRef.name** (string)

      name is unique within a namespace to reference a secret resource.

    - **cephfs.secretRef.namespace** (string)

      namespace defines the space within which the secret name must be unique.

  - **cephfs.user** (string)

    user is Optional: User is the rados user name, default is admin More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it
  -->

  - **cephfs.secretRef** (SecretReference)

    secretRef 是可選的。secretRef 是針對用戶到身份認證 Secret 的引用，默認爲空。更多信息：
    https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it

    <a name="SecretReference"></a>
    **SecretReference 表示對某 Secret 的引用，其中包含足夠的信息來訪問任何名字空間中的 Secret。**

    - **cephfs.secretRef.name** (string)

      name 在名字空間內是唯一的，以引用一個 Secret 資源。

    - **cephfs.secretRef.namespace** (string)

      namespace 指定一個名字空間，Secret 名稱在該名字空間中必須唯一。

  - **cephfs.user** (string)

    user 是可選的。user 是 rados 用戶名，默認爲 admin。更多信息：
    https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it

<!--
- **cinder** (CinderPersistentVolumeSource)

  cinder represents a cinder volume attached and mounted on kubelets host machine. All operations for the in-tree cinder type are redirected to the cinder.csi.openstack.org CSI driver. More info: https://examples.k8s.io/mysql-cinder-pd/README.md

  <a name="CinderPersistentVolumeSource"></a>
  *Represents a cinder volume resource in Openstack. A Cinder volume must exist before mounting to a container. The volume must also be in the same region as the kubelet. Cinder volumes support ownership management and SELinux relabeling.*
-->
- **cinder** (CinderPersistentVolumeSource)

  cinder 表示 kubelet 主機上掛接和掛載的 Cinder 卷。
  所有針對樹內 cinder 類型的操作都被重定向到 cinder.csi.openstack.org
  CSI 驅動。更多信息：
  https://examples.k8s.io/mysql-cinder-pd/README.md

  <a name="CinderPersistentVolumeSource"></a>
  **表示 OpenStack 中的一個 Cinder 卷資源。掛載到一個容器之前 Cinder 卷必須已經存在。
  該卷還必須與 kubelet 位於相同的地區中。cinder 卷支持所有權管理和 SELinux 重新打標籤。**

  <!--
  - **cinder.volumeID** (string), required

    volumeID used to identify the volume in cinder. More info: https://examples.k8s.io/mysql-cinder-pd/README.md

  - **cinder.fsType** (string)

    fsType Filesystem type to mount. Must be a filesystem type supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://examples.k8s.io/mysql-cinder-pd/README.md

  - **cinder.readOnly** (boolean)

    readOnly is Optional: Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts. More info: https://examples.k8s.io/mysql-cinder-pd/README.md
  -->

  - **cinder.volumeID** (string)，必需

    volumeID 用於標識 Cinder 中的卷。更多信息：
    https://examples.k8s.io/mysql-cinder-pd/README.md

  - **cinder.fsType** (string)

    fsType 是要掛載的文件系統類型。必須是主機操作系統支持的文件系統類型。
    例如：“ext4”、“xfs”、“ntfs”。如果未指定，則隱式推斷爲 “ext4”。更多信息：
    https://examples.k8s.io/mysql-cinder-pd/README.md

  - **cinder.readOnly** (boolean)

    readOnly 是可選的。默認爲 false（讀/寫）。
    此處 readOnly 將在 VolumeMounts 中強制設置 readOnly。更多信息：
    https://examples.k8s.io/mysql-cinder-pd/README.md

  <!--
  - **cinder.secretRef** (SecretReference)

    secretRef is Optional: points to a secret object containing parameters used to connect to OpenStack.

    <a name="SecretReference"></a>
    *SecretReference represents a Secret Reference. It has enough information to retrieve secret in any namespace*

    - **cinder.secretRef.name** (string)

      name is unique within a namespace to reference a secret resource.

    - **cinder.secretRef.namespace** (string)

      namespace defines the space within which the secret name must be unique.
  -->

  - **cinder.secretRef** (SecretReference)

    secretRef 是可選的。指向 Secret 對象，內含的參數用於連接到 OpenStack。

    <a name="SecretReference"></a>
    **SecretReference 表示對某 Secret 的引用，其中包含足夠的信息來訪問任何名字空間中的 Secret。**

    - **cinder.secretRef.name** (string)

      name 在名字空間內是唯一的，以引用一個 Secret 資源。

    - **cinder.secretRef.namespace** (string)

      namespace 指定一個名字空間，Secret 名稱在該名字空間中必須唯一。

<!--
- **csi** (CSIPersistentVolumeSource)

  csi represents storage that is handled by an external CSI driver.

  <a name="CSIPersistentVolumeSource"></a>
  *Represents storage that is managed by an external CSI volume driver*

  - **csi.driver** (string), required

    driver is the name of the driver to use for this volume. Required.

  - **csi.volumeHandle** (string), required

    volumeHandle is the unique volume name returned by the CSI volume plugin’s CreateVolume to refer to the volume on all subsequent calls. Required.
-->

- **csi** (CSIPersistentVolumeSource)

  csi 表示由一個外部 CSI 驅動處理的存儲。

  <a name="CSIPersistentVolumeSource"></a>
  **表示由一個外部 CSI 卷驅動管理的存儲。**

  - **csi.driver** (string)，必需

    driver 是此卷所使用的驅動的名稱。必需。

  - **csi.volumeHandle** (string)，必需

    volumeHandle 是 CSI 卷插件的 CreateVolume 所返回的唯一卷名稱，用於在所有後續調用中引用此卷。必需。

  <!--
  - **csi.controllerExpandSecretRef** (SecretReference)

    controllerExpandSecretRef is a reference to the secret object containing sensitive information to pass to the CSI driver to complete the CSI ControllerExpandVolume call. This field is optional, and may be empty if no secret is required. If the secret object contains more than one secret, all secrets are passed.

    <a name="SecretReference"></a>
    *SecretReference represents a Secret Reference. It has enough information to retrieve secret in any namespace*

    - **csi.controllerExpandSecretRef.name** (string)

      name is unique within a namespace to reference a secret resource.

    - **csi.controllerExpandSecretRef.namespace** (string)

      namespace defines the space within which the secret name must be unique.
  -->

  - **csi.controllerExpandSecretRef** (SecretReference)

    controllerExpandSecretRef 是對包含敏感信息的 Secret 對象的引用，
    該 Secret 會被傳遞到 CSI 驅動以完成 CSI ControllerExpandVolume 調用。
    此字段是可選的，且如果不需要 Secret，則此字段可以爲空。
    如果 Secret 對象包含多個 Secret，則所有 Secret 被傳遞。

    <a name="SecretReference"></a>
    **SecretReference 表示對某 Secret 的引用，其中包含足夠的信息來訪問任何名字空間中的 Secret。**

    - **csi.controllerExpandSecretRef.name** (string)

      name 在名字空間內是唯一的，以引用一個 Secret 資源。

    - **csi.controllerExpandSecretRef.namespace** (string)

      namespace 指定一個名字空間，Secret 名稱在該名字空間中必須唯一。

  <!--
  - **csi.controllerPublishSecretRef** (SecretReference)

    controllerPublishSecretRef is a reference to the secret object containing sensitive information to pass to the CSI driver to complete the CSI ControllerPublishVolume and ControllerUnpublishVolume calls. This field is optional, and may be empty if no secret is required. If the secret object contains more than one secret, all secrets are passed.

    <a name="SecretReference"></a>
    *SecretReference represents a Secret Reference. It has enough information to retrieve secret in any namespace*

    - **csi.controllerPublishSecretRef.name** (string)

      name is unique within a namespace to reference a secret resource.

    - **csi.controllerPublishSecretRef.namespace** (string)

      namespace defines the space within which the secret name must be unique.
  -->

  - **csi.controllerPublishSecretRef** (SecretReference)

    controllerPublishSecretRef 是對包含敏感信息的 Secret 對象的引用，
    該 Secret 會被傳遞到 CSI 驅動以完成 CSI ControllerPublishVolume 和 ControllerUnpublishVolume 調用。
    此字段是可選的，且如果不需要 Secret，則此字段可以爲空。
    如果 Secret 對象包含多個 Secret，則所有 Secret 被傳遞。

    <a name="SecretReference"></a>
    **SecretReference 表示對某 Secret 的引用，其中包含足夠的信息來訪問任何名字空間中的 Secret。**

    - **csi.controllerPublishSecretRef.name** (string)

      name 在名字空間內是唯一的，以引用一個 Secret 資源。

    - **csi.controllerPublishSecretRef.namespace** (string)

      namespace 指定一個名字空間，Secret 名稱在該名字空間中必須唯一。

  <!--
  - **csi.fsType** (string)

    fsType to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs".

  - **csi.nodeExpandSecretRef** (SecretReference)

    nodeExpandSecretRef is a reference to the secret object containing sensitive information to pass to the CSI driver to complete the CSI NodeExpandVolume call. This field is optional, may be omitted if no secret is required. If the secret object contains more than one secret, all secrets are passed.

    <a name="SecretReference"></a>
    *SecretReference represents a Secret Reference. It has enough information to retrieve secret in any namespace*

    - **csi.nodeExpandSecretRef.name** (string)

      name is unique within a namespace to reference a secret resource.

    - **csi.nodeExpandSecretRef.namespace** (string)

      namespace defines the space within which the secret name must be unique.
  -->

  - **csi.fsType** (string)

    要掛載的 fsType。必須是主機操作系統所支持的文件系統類型之一。例如 “ext4”、“xfs”、“ntfs”。

  - **csi.nodeExpandSecretRef** (SecretReference)

    nodeExpandSecretRef 是對包含敏感信息的 Secret 對象的引用，
    從而傳遞到 CSI 驅動以完成 CSI NodeExpandVolume 調用。
    此字段是可選的，且如果不需要 Secret，則此字段可以爲空。
    如果 Secret 對象包含多個 Secret，則所有 Secret 被傳遞。

    <a name="SecretReference"></a>
    **SecretReference 表示對某 Secret 的引用，其中包含足夠的信息來訪問任何名字空間中的 Secret。**

    - **csi.nodeExpandSecretRef.name** (string)

      name 在名字空間內是唯一的，以引用一個 Secret 資源。

    - **csi.nodeExpandSecretRef.namespace** (string)

      namespace 指定一個名字空間，Secret 名稱在該名字空間中必須唯一。

  <!--
  - **csi.nodePublishSecretRef** (SecretReference)

    nodePublishSecretRef is a reference to the secret object containing sensitive information to pass to the CSI driver to complete the CSI NodePublishVolume and NodeUnpublishVolume calls. This field is optional, and may be empty if no secret is required. If the secret object contains more than one secret, all secrets are passed.

    <a name="SecretReference"></a>
    *SecretReference represents a Secret Reference. It has enough information to retrieve secret in any namespace*

    - **csi.nodePublishSecretRef.name** (string)

      name is unique within a namespace to reference a secret resource.

    - **csi.nodePublishSecretRef.namespace** (string)

      namespace defines the space within which the secret name must be unique.
  -->

  - **csi.nodePublishSecretRef** (SecretReference)

    nodePublishSecretRef 是對包含敏感信息的 Secret 對象的引用，
    以傳遞到 CSI 驅動以完成 CSI NodePublishVolume 和 NodeUnpublishVolume 調用。
    此字段是可選的，且如果不需要 Secret，則此字段可以爲空。
    如果 Secret 對象包含多個 Secret，則所有 Secret 被傳遞。

    **SecretReference 表示對某 Secret 的引用，其中包含足夠的信息來訪問任何名字空間中的 Secret。**

    - **csi.nodePublishSecretRef.name** (string)

      name 在名字空間內是唯一的，以引用一個 Secret 資源。

    - **csi.nodePublishSecretRef.namespace** (string)

      namespace 定義了 Secret 名稱必須唯一的空間。

  <!--
  - **csi.nodeStageSecretRef** (SecretReference)
    nodeStageSecretRef is a reference to the secret object containing sensitive information to pass to the CSI driver to complete the CSI NodeStageVolume and NodeStageVolume and NodeUnstageVolume calls. This field is optional, and may be empty if no secret is required. If the secret object contains more than one secret, all secrets are passed.

    <a name="SecretReference"></a>
    *SecretReference represents a Secret Reference. It has enough information to retrieve secret in any namespace*

    - **csi.nodeStageSecretRef.name** (string)
      name is unique within a namespace to reference a secret resource.

    - **csi.nodeStageSecretRef.namespace** (string)
      namespace defines the space within which the secret name must be unique.
  -->

  - **csi.nodeStageSecretRef** (SecretReference)

    nodeStageSecretRef 是對包含敏感信息的 Secret 對象的引用，
    從而傳遞到 CSI 驅動以完成 CSI NodeStageVolume、NodeStageVolume 和 NodeUnstageVolume 調用。
    此字段是可選的，且如果不需要 Secret，則此字段可以爲空。
    如果 Secret 對象包含多個 Secret，則所有 Secret 被傳遞。

    <a name="SecretReference"></a>
    **SecretReference 表示對某 Secret 的引用，其中包含足夠的信息來訪問任何名字空間中的 Secret。**

    - **csi.nodeStageSecretRef.name** (string)

      name 在名字空間內是唯一的，以引用一個 Secret 資源。

    - **csi.nodeStageSecretRef.namespace** (string)

      namespace 指定一個名字空間，Secret 名稱在該名字空間中必須唯一。

  <!--
  - **csi.readOnly** (boolean)

    readOnly value to pass to ControllerPublishVolumeRequest. Defaults to false (read/write).

  - **csi.volumeAttributes** (map[string]string)
    volumeAttributes of the volume to publish.
  -->

  - **csi.readOnly** (boolean)

    傳遞到 ControllerPublishVolumeRequest 的 readOnly 值。默認爲 false（讀/寫）。

  - **csi.volumeAttributes** (map[string]string)

    要發佈的卷的 volumeAttributes。

<!--
- **fc** (FCVolumeSource)
  fc represents a Fibre Channel resource that is attached to a kubelet's host machine and then exposed to the pod.

  <a name="FCVolumeSource"></a>
  *Represents a Fibre Channel volume. Fibre Channel volumes can only be mounted as read/write once. Fibre Channel volumes support ownership management and SELinux relabeling.*
-->

- **fc** (FCVolumeSource)

  fc 表示掛接到 kubelet 的主機並隨後暴露給 Pod 的一個光纖通道（FC）資源。

  <a name="FCVolumeSource"></a>
  **表示光纖通道卷。光纖通道卷只能以讀/寫一次進行掛載。光纖通道卷支持所有權管理和 SELinux 重新打標籤。**

  <!--
  - **fc.fsType** (string)

    fsType is the filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified.

  - **fc.lun** (int32)

    lun is Optional: FC target lun number

  - **fc.readOnly** (boolean)

    readOnly is Optional: Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.
  -->

  - **fc.fsType** (string)

    fsType 是要掛載的文件系統類型。必須是主機操作系統所支持的文件系統類型之一。
    例如 “ext4”、“xfs”、“ntfs”。如果未指定，則隱式推斷爲 “ext4”。

  - **fc.lun** (int32)

    lun 是可選的。FC 目標 lun 編號。

  - **fc.readOnly** (boolean)

    readOnly 是可選的。默認爲 false（讀/寫）。
    此處 readOnly 將在 VolumeMounts 中強制設置 readOnly。

  <!--
  - **fc.targetWWNs** ([]string)

    *Atomic: will be replaced during a merge*
    
    targetWWNs is Optional: FC target worldwide names (WWNs)

  - **fc.wwids** ([]string)

    *Atomic: will be replaced during a merge*
    
    wwids Optional: FC volume world wide identifiers (wwids) Either wwids or combination of targetWWNs and lun must be set, but not both simultaneously.
  -->

  - **fc.targetWWNs** ([]string)

    **原子：將在合併期間被替換**

    targetWWNs 是可選的。FC 目標全球名稱（WWN）。

  - **fc.wwids** ([]string)

    **原子：將在合併期間被替換**

    wwids 是可選的。FC 卷全球識別號（wwids）。
    必須設置 wwids 或 targetWWNs 及 lun 的組合，但不能同時設置兩者。

<!--
- **flexVolume** (FlexPersistentVolumeSource)

  flexVolume represents a generic volume resource that is provisioned/attached using an exec based plugin. Deprecated: FlexVolume is deprecated. Consider using a CSIDriver instead.

  <a name="FlexPersistentVolumeSource"></a>
  *FlexPersistentVolumeSource represents a generic persistent volume resource that is provisioned/attached using an exec based plugin.*
-->
- **flexVolume** (FlexPersistentVolumeSource)

  flexVolume 表示使用基於 exec 的插件製備/掛接的通用卷資源。
  已棄用：FlexVolume 已被棄用，請考慮使用 CSIDriver 代替。

  <a name="FlexPersistentVolumeSource"></a>
  **FlexPersistentVolumeSource 表示使用基於 exec 的插件製備/掛接的通用持久卷資源。**

  <!--
  - **flexVolume.driver** (string), required

    driver is the name of the driver to use for this volume.

  - **flexVolume.fsType** (string)

    fsType is the Filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". The default filesystem depends on FlexVolume script.

  - **flexVolume.options** (map[string]string)

    options is Optional: this field holds extra command options if any.

  - **flexVolume.readOnly** (boolean)

    readOnly is Optional: defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.
  -->

  - **flexVolume.driver** (string)，必需

    driver 是此卷所使用的驅動的名稱。

  - **flexVolume.fsType** (string)

    fsType 是要掛載的文件系統類型。必須是主機操作系統所支持的文件系統類型之一。
    例如 “ext4”、“xfs”、“ntfs”。默認的文件系統取決於 flexVolume 腳本。

  - **flexVolume.options** (map[string]string)

    options 是可選的。此字段包含額外的命令選項（如果有）。

  - **flexVolume.readOnly** (boolean)

    readOnly 是可選的。默認爲 false（讀/寫）。
    此處 readOnly 將在 VolumeMounts 中強制設置 readOnly。

  <!--
  - **flexVolume.secretRef** (SecretReference)

    secretRef is Optional: SecretRef is reference to the secret object containing sensitive information to pass to the plugin scripts. This may be empty if no secret object is specified. If the secret object contains more than one secret, all secrets are passed to the plugin scripts.

    <a name="SecretReference"></a>
    *SecretReference represents a Secret Reference. It has enough information to retrieve secret in any namespace*

    - **flexVolume.secretRef.name** (string)

      name is unique within a namespace to reference a secret resource.

    - **flexVolume.secretRef.namespace** (string)

      namespace defines the space within which the secret name must be unique.
  -->

  - **flexVolume.secretRef** (SecretReference)

    secretRef 是可選的。secretRef 是對包含敏感信息的 Secret 對象的引用，從而傳遞到插件腳本。
    如果未指定 Secret 對象，則此字段可以爲空。如果 Secret 對象包含多個 Secret，則所有 Secret 被傳遞到插件腳本。

    <a name="SecretReference"></a>
    **SecretReference 表示對某 Secret 的引用，其中包含足夠的信息來訪問任何名字空間中的 Secret。**

    - **flexVolume.secretRef.name** (string)

      name 在名字空間內是唯一的，以引用一個 Secret 資源。

    - **flexVolume.secretRef.namespace** (string)

      namespace 指定一個名字空間，Secret 名稱在該名字空間中必須唯一。

<!--
- **flocker** (FlockerVolumeSource)

  flocker represents a Flocker volume attached to a kubelet's host machine and exposed to the pod for its usage. This depends on the Flocker control service being running. Deprecated: Flocker is deprecated and the in-tree flocker type is no longer supported.

  <a name="FlockerVolumeSource"></a>
  *Represents a Flocker volume mounted by the Flocker agent. One and only one of datasetName and datasetUUID should be set. Flocker volumes do not support ownership management or SELinux relabeling.*

  - **flocker.datasetName** (string)

    datasetName is Name of the dataset stored as metadata -> name on the dataset for Flocker should be considered as deprecated

  - **flocker.datasetUUID** (string)

    datasetUUID is the UUID of the dataset. This is unique identifier of a Flocker dataset
-->
- **flocker** (FlockerVolumeSource)

  flocker 表示掛接到 kubelet 的主機並暴露給 Pod 供其使用的 Flocker 卷。
  這取決於所運行的 Flocker 控制服務。
  已棄用：Flocker 已被棄用，且樹內 Flocker 類型不再受支持。

  <a name="FlockerVolumeSource"></a>
  **表示 Flocker 代理掛載的 Flocker 卷。應設置且僅設置 datasetName 和 datasetUUID 中的一個。
  Flocker 卷不支持所有權管理或 SELinux 重新打標籤。**

  - **flocker.datasetName** (string)

    datasetName 是存儲爲元數據的數據集的名稱。針對 Flocker 有關數據集的名稱應視爲已棄用。

  - **flocker.datasetUUID** (string)

    datasetUUID 是數據集的 UUID。這是 Flocker 數據集的唯一標識符。

<!--
- **gcePersistentDisk** (GCEPersistentDiskVolumeSource)

  gcePersistentDisk represents a GCE Disk resource that is attached to a kubelet's host machine and then exposed to the pod. Deprecated: GCEPersistentDisk is deprecated. All operations for the in-tree gcePersistentDisk type are redirected to the pd.csi.storage.gke.io CSI driver. Provisioned by an admin. More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk

  <a name="GCEPersistentDiskVolumeSource"></a>
  *Represents a Persistent Disk resource in Google Compute Engine.

  A GCE PD must exist before mounting to a container. The disk must also be in the same GCE project and zone as the kubelet. A GCE PD can only be mounted as read/write once or read-only many times. GCE PDs support ownership management and SELinux relabeling.*
-->
- **gcePersistentDisk** (GCEPersistentDiskVolumeSource)

  gcePersistentDisk 表示掛接到 kubelet 的主機隨後暴露給 Pod 的一個 GCE Disk 資源。
  由管理員進行製備。
  已棄用：GCEPersistentDisk 已被棄用。所有針對樹內 gcePersistentDisk
  類型的操作都將重定向至 pd.csi.storage.gke.io CSI 驅動。
  更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#gcepersistentdisk

  <a name="GCEPersistentDiskVolumeSource"></a>

  **表示 Google 計算引擎中的 Persistent Disk 資源。掛載到一個容器之前 GCE PD 必須存在。
  該磁盤還必須與 kubelet 位於相同的 GCE 項目和區域中。GCE PD 只能掛載爲讀/寫一次或只讀多次。
  GCE PD 支持所有權管理和 SELinux 重新打標籤。**

  <!--
  - **gcePersistentDisk.pdName** (string), required

    pdName is unique name of the PD resource in GCE. Used to identify the disk in GCE. More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk

  - **gcePersistentDisk.fsType** (string)

    fsType is filesystem type of the volume that you want to mount. Tip: Ensure that the filesystem type is supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk

  - **gcePersistentDisk.partition** (int32)

    partition is the partition in the volume that you want to mount. If omitted, the default is to mount by volume name. Examples: For volume /dev/sda1, you specify the partition as "1". Similarly, the volume partition for /dev/sda is "0" (or you can leave the property empty). More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk

  - **gcePersistentDisk.readOnly** (boolean)

    readOnly here will force the ReadOnly setting in VolumeMounts. Defaults to false. More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk
  -->

  - **gcePersistentDisk.pdName** (string)，必需

    pdName 是 GCE 中 PD 資源的唯一名稱。用於標識 GCE 中的磁盤。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#gcepersistentdisk

  - **gcePersistentDisk.fsType** (string)

    fsType 是你要掛載的卷的文件系統類型。提示：確保主機操作系統支持此文件系統類型。
    例如：“ext4”、“xfs”、“ntfs”。如果未指定，則隱式推斷爲 “ext4”。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#gcepersistentdisk

  - **gcePersistentDisk.partition** (int32)

    partition 是你要掛載的卷中的分區。如果省略，則默認爲按卷名稱進行掛載。
    例如：對於卷 /dev/sda1，將分區指定爲 “1”。類似地，/dev/sda 的卷分區爲 “0”（或可以將屬性留空）。
    更多信息： https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#gcepersistentdisk

  - **gcePersistentDisk.readOnly** (boolean)

    此處 readOnly 將在 VolumeMounts 中強制設置 readOnly。默認爲 false。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#gcepersistentdisk

<!--
- **glusterfs** (GlusterfsPersistentVolumeSource)

  glusterfs represents a Glusterfs volume that is attached to a host and exposed to the pod. Provisioned by an admin. Deprecated: Glusterfs is deprecated and the in-tree glusterfs type is no longer supported. More info: https://examples.k8s.io/volumes/glusterfs/README.md

  <a name="GlusterfsPersistentVolumeSource"></a>
  *Represents a Glusterfs mount that lasts the lifetime of a pod. Glusterfs volumes do not support ownership management or SELinux relabeling.*
-->
- **glusterfs** （GlusterfsPersistentVolumeSource）

  glusterfs 表示關聯到主機並暴露給 Pod 的 Glusterfs 卷。由管理員配置。
  已棄用：glusterfs 已被棄用，且樹內 glusterfs 類型不再受支持。
  更多信息：https://examples.k8s.io/volumes/glusterfs/README.md

  <a name="GlusterfsPersistentVolumeSource"></a>
  **表示在 Pod 生命週期內一直存在的 Glusterfs 掛載卷。Glusterfs 卷不支持屬主管理或 SELinux 重標記。**

  <!--
  - **glusterfs.endpoints** (string), required

    endpoints is the endpoint name that details Glusterfs topology. More info: https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod

  - **glusterfs.path** (string), required

    path is the Glusterfs volume path. More info: https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod

  - **glusterfs.endpointsNamespace** (string)

    endpointsNamespace is the namespace that contains Glusterfs endpoint. If this field is empty, the EndpointNamespace defaults to the same namespace as the bound PVC. More info: https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod

  - **glusterfs.readOnly** (boolean)

    readOnly here will force the Glusterfs volume to be mounted with read-only permissions. Defaults to false. More info: https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod
  -->

  - **glusterfs.endpoints** (string)，必需

    endpoints 是詳細給出 Glusterfs 拓撲結構的端點的名稱。
    更多信息：https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod

  - **glusterfs.path** (string)，必需

    path 是 Glusterfs 卷的路徑。
    更多信息：https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod

  - **glusterfs.endpointsNamespace** (string)

    endpointsNamespace 是 Glusterfs 端點所在的命名空間。
    如果 endpointNamespace 爲空，則默認值與所綁定的 PVC 的命名空間相同。
    更多信息：https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod

  - **glusterfs.readOnly** (boolean)

    此處的 readOnly 將強制以只讀權限掛載 Glusterfs 卷。
    默認爲 false。
    更多信息：https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod

<!--
- **iscsi** (ISCSIPersistentVolumeSource)

  iscsi represents an ISCSI Disk resource that is attached to a kubelet's host machine and then exposed to the pod. Provisioned by an admin.

  <a name="ISCSIPersistentVolumeSource"></a>
  *ISCSIPersistentVolumeSource represents an ISCSI disk. ISCSI volumes can only be mounted as read/write once. ISCSI volumes support ownership management and SELinux relabeling.*
-->

- **iscsi** (ISCSIPersistentVolumeSource)

  iscsi 表示掛接到 kubelet 的主機隨後暴露給 Pod 的一個 ISCSI Disk 資源。由管理員進行製備。

  <a name="ISCSIPersistentVolumeSource"></a>
  **ISCSIPersistentVolumeSource 表示一個 ISCSI 磁盤。ISCSI 卷只能以讀/寫一次進行掛載。ISCSI 卷支持所有權管理和 SELinux 重新打標籤。**

  <!--
  - **iscsi.iqn** (string), required

    iqn is Target iSCSI Qualified Name.

  - **iscsi.lun** (int32), required

    lun is iSCSI Target Lun number.

  - **iscsi.targetPortal** (string), required

    targetPortal is iSCSI Target Portal. The Portal is either an IP or ip_addr:port if the port is other than default (typically TCP ports 860 and 3260).
  -->

  - **iscsi.iqn** (string)，必需

    iqn 是目標 iSCSI 限定名稱（Target iSCSI Qualified Name）。

  - **iscsi.lun** (int32)，必需

    lun 是 iSCSI 目標邏輯單元號（iSCSI Target Lun）。

  - **iscsi.targetPortal** (string)，必需

    targetPortal 是 iSCSI 目標門戶（iSCSI Target Portal）。
    如果不是默認端口（通常是 TCP 端口 860 和 3260），則 Portal 爲 IP 或 ip_addr:port。

  <!--
  - **iscsi.chapAuthDiscovery** (boolean)

    chapAuthDiscovery defines whether support iSCSI Discovery CHAP authentication

  - **iscsi.chapAuthSession** (boolean)

    chapAuthSession defines whether support iSCSI Session CHAP authentication

  - **iscsi.fsType** (string)

    fsType is the filesystem type of the volume that you want to mount. Tip: Ensure that the filesystem type is supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://kubernetes.io/docs/concepts/storage/volumes#iscsi
  -->

  - **iscsi.chapAuthDiscovery** (boolean)

    chapAuthDiscovery 定義是否支持 iSCSI Discovery CHAP 身份認證。

  - **iscsi.chapAuthSession** (boolean)

    chapAuthSession 定義是否支持 iSCSI Session CHAP 身份認證。

  - **iscsi.fsType** (string)

    fsType 是你要掛載的卷的文件系統類型。提示：確保主機操作系統支持此文件系統類型。
    例如：“ext4”、“xfs”、“ntfs”。如果未指定，則隱式推斷爲 “ext4”。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#iscsi

  <!--
  - **iscsi.initiatorName** (string)

    initiatorName is the custom iSCSI Initiator Name. If initiatorName is specified with iscsiInterface simultaneously, new iSCSI interface \<target portal>:\<volume name> will be created for the connection.

  - **iscsi.iscsiInterface** (string)

    iscsiInterface is the interface Name that uses an iSCSI transport. Defaults to 'default' (tcp).

  - **iscsi.portals** ([]string)

    *Atomic: will be replaced during a merge*
    
    portals is the iSCSI Target Portal List. The Portal is either an IP or ip_addr:port if the port is other than default (typically TCP ports 860 and 3260).

  - **iscsi.readOnly** (boolean)

    readOnly here will force the ReadOnly setting in VolumeMounts. Defaults to false.
  -->

  - **iscsi.initiatorName** (string)

    initiatorName 是自定義的 iSCSI 發起程序名稱（iSCSI Initiator Name）。
    如果同時用 iscsiInterface 指定 initiatorName，將爲連接創建新的 iSCSI 接口 \<目標門戶>:\<卷名稱>。

  - **iscsi.iscsiInterface** (string)

    iscsiInterface 是使用 iSCSI 傳輸的接口名稱。默認爲 “default”（tcp）。

  - **iscsi.portals** ([]string)

    **原子：將在合併期間被替換**

    portals 是 iSCSI 目標門戶列表（iSCSI Target Portal List）。
    如果不是默認端口（通常是 TCP 端口 860 和 3260），則 Portal 爲 IP 或 ip_addr:port。

  - **iscsi.readOnly** (boolean)

    此處 readOnly 將在 VolumeMounts 中強制設置 readOnly。默認爲 false。

  <!--
  - **iscsi.secretRef** (SecretReference)

    secretRef is the CHAP Secret for iSCSI target and initiator authentication

    <a name="SecretReference"></a>
    *SecretReference represents a Secret Reference. It has enough information to retrieve secret in any namespace*

    - **iscsi.secretRef.name** (string)

      name is unique within a namespace to reference a secret resource.

    - **iscsi.secretRef.namespace** (string)

      namespace defines the space within which the secret name must be unique.
  -->

  - **iscsi.secretRef** (SecretReference)

    secretRef 是 iSCSI 目標和發起程序身份認證所用的 CHAP Secret。

    <a name="SecretReference"></a>
    **SecretReference 表示對某 Secret 的引用，其中包含足夠的信息來訪問任何名字空間中的 Secret。**

    - **iscsi.secretRef.name** (string)

      name 在名字空間內是唯一的，以引用一個 Secret 資源。

    - **iscsi.secretRef.namespace** (string)

      namespace 指定一個名字空間，Secret 名稱在該名字空間中必須唯一。

<!--
- **nfs** (NFSVolumeSource)

  nfs represents an NFS mount on the host. Provisioned by an admin. More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs

  <a name="NFSVolumeSource"></a>
  *Represents an NFS mount that lasts the lifetime of a pod. NFS volumes do not support ownership management or SELinux relabeling.*

  - **nfs.path** (string), required

    path that is exported by the NFS server. More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs

  - **nfs.server** (string), required

    server is the hostname or IP address of the NFS server. More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs

  - **nfs.readOnly** (boolean)

    readOnly here will force the NFS export to be mounted with read-only permissions. Defaults to false. More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs
-->
- **nfs** (NFSVolumeSource)

  nfs 表示主機上掛載的 NFS。由管理員進行製備。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#nfs

  <a name="NFSVolumeSource"></a>
  **表示 Pod 的生命週期內持續的 NFS 掛載。NFS 卷不支持所有權管理或 SELinux 重新打標籤。**

  - **nfs.path** (string)，必需

    path 是由 NFS 服務器導出的路徑。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#nfs

  - **nfs.server** (string)，必需

    server 是 NFS 服務器的主機名或 IP 地址。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#nfs

  - **nfs.readOnly** (boolean)

    此處 readOnly 將強制使用只讀權限掛載 NFS 導出。默認爲 false。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#nfs

<!--
- **photonPersistentDisk** (PhotonPersistentDiskVolumeSource)

  photonPersistentDisk represents a PhotonController persistent disk attached and mounted on kubelets host machine. Deprecated: PhotonPersistentDisk is deprecated and the in-tree photonPersistentDisk type is no longer supported.

  <a name="PhotonPersistentDiskVolumeSource"></a>
  *Represents a Photon Controller persistent disk resource.*

  - **photonPersistentDisk.pdID** (string), required

    pdID is the ID that identifies Photon Controller persistent disk

  - **photonPersistentDisk.fsType** (string)

    fsType is the filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified.
-->
- **photonPersistentDisk** (PhotonPersistentDiskVolumeSource)

  photonPersistentDisk 表示 kubelet 主機上掛接和掛載的 PhotonController 持久磁盤。
  已棄用：PhotonPersistentDisk 已被棄用，且樹內 photonPersistentDisk 類型不再受支持。

  <a name="PhotonPersistentDiskVolumeSource"></a>
  **表示 Photon Controller 持久磁盤資源。**

  - **photonPersistentDisk.pdID** (string)，必需

    pdID 是標識 Photon Controller 持久磁盤的 ID。

  - **photonPersistentDisk.fsType** (string)

    fsType 是要掛載的文件系統類型。必須是主機操作系統所支持的文件系統類型之一。
    例如 “ext4”、“xfs”、“ntfs”。如果未指定，則隱式推斷爲 “ext4”。

<!--
- **portworxVolume** (PortworxVolumeSource)

  portworxVolume represents a portworx volume attached and mounted on kubelets host machine Deprecated: PortworxVolume is deprecated. All operations for the in-tree portworxVolume type are redirected to the pxd.portworx.com CSI driver when the CSIMigrationPortworx feature-gate is on.

  <a name="PortworxVolumeSource"></a>
  *PortworxVolumeSource represents a Portworx volume resource.*

  - **portworxVolume.volumeID** (string), required

    volumeID uniquely identifies a Portworx volume

  - **portworxVolume.fsType** (string)

    fSType represents the filesystem type to mount Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs". Implicitly inferred to be "ext4" if unspecified.

  - **portworxVolume.readOnly** (boolean)

    readOnly defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.
-->
- **portworxVolume** (PortworxVolumeSource)

  portworxVolume 表示 kubelet 主機上掛接和掛載的 portworx 卷。
  已棄用：PortworxVolume 已被棄用。當 CSIMigrationPortworx 特性開關開啓時，
  所有樹內 PortworxVolume 類型的操作都將重定向到 pxd.portworx.com CSI 驅動。

  <a name="PortworxVolumeSource"></a>
  **PortworxVolumeSource 表示 Portworx 卷資源。**

  - **portworxVolume.volumeID** (string)，必需

    volumeID 唯一標識 Portworx 卷。

  - **portworxVolume.fsType** (string)

    fSType 表示要掛載的文件系統類型。必須是主機操作系統所支持的文件系統類型之一。
    例如 “ext4”、“xfs”。如果未指定，則隱式推斷爲 “ext4”。

  - **portworxVolume.readOnly** (boolean)

    readOnly 默認爲 false（讀/寫）。此處 readOnly 將在 VolumeMounts 中強制設置 readOnly。

<!--
- **quobyte** (QuobyteVolumeSource)

  quobyte represents a Quobyte mount on the host that shares a pod's lifetime. Deprecated: Quobyte is deprecated and the in-tree quobyte type is no longer supported.

  <a name="QuobyteVolumeSource"></a>
  *Represents a Quobyte mount that lasts the lifetime of a pod. Quobyte volumes do not support ownership management or SELinux relabeling.*

  - **quobyte.registry** (string), required

    registry represents a single or multiple Quobyte Registry services specified as a string as host:port pair (multiple entries are separated with commas) which acts as the central registry for volumes

  - **quobyte.volume** (string), required

    volume is a string that references an already created Quobyte volume by name.
-->
- **quobyte** (QuobyteVolumeSource)

  quobyte 表示在共享 Pod 生命週期的主機上掛載的 Quobyte。
  已棄用：quobyte 已被棄用，且樹內 quobyte 類型不再受支持。

  <a name="QuobyteVolumeSource"></a>
  **表示在 Pod 的生命週期內持續的 Quobyte 掛載。Quobyte 卷不支持所有權管理或 SELinux 重新打標籤。**

  - **quobyte.registry** (string)，必需

    registry 表示將一個或多個 Quobyte Registry 服務指定爲 host:port
    對的字符串形式（多個條目用英文逗號分隔），用作卷的中央註冊表。

  - **quobyte.volume** (string)，必需

    volume 是一個字符串，通過名稱引用已創建的 Quobyte 卷。

  <!--
  - **quobyte.group** (string)

    group to map volume access to Default is no group

  - **quobyte.readOnly** (boolean)

    readOnly here will force the Quobyte volume to be mounted with read-only permissions. Defaults to false.

  - **quobyte.tenant** (string)

    tenant owning the given Quobyte volume in the Backend Used with dynamically provisioned Quobyte volumes, value is set by the plugin

  - **quobyte.user** (string)

    user to map volume access to Defaults to serivceaccount user
  -->

  - **quobyte.group** (string)

    group 是將卷訪問映射到的組。默認爲無組。

  - **quobyte.readOnly** (boolean)

    此處 readOnly 將強制使用只讀權限掛載 Quobyte 卷。默認爲 false。

  - **quobyte.tenant** (string)

    後臺中擁有給定 Quobyte 卷的租戶。用於動態製備的 Quobyte 卷，其值由插件設置。

  - **quobyte.user** (string)

    user 是將卷訪問映射到的用戶。默認爲 serivceaccount 用戶。

<!--
- **rbd** (RBDPersistentVolumeSource)

  rbd represents a Rados Block Device mount on the host that shares a pod's lifetime. Deprecated: RBD is deprecated and the in-tree rbd type is no longer supported. More info: https://examples.k8s.io/volumes/rbd/README.md

  <a name="RBDPersistentVolumeSource"></a>
  *Represents a Rados Block Device mount that lasts the lifetime of a pod. RBD volumes support ownership management and SELinux relabeling.*

  - **rbd.image** (string), required

    image is the rados image name. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  - **rbd.monitors** ([]string), required

    *Atomic: will be replaced during a merge*
    
    monitors is a collection of Ceph monitors. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it
-->

- **rbd** (RBDPersistentVolumeSource)

  rbd 表示主機上掛載的 Rados 塊設備，其生命週期與 Pod 生命週期相同。
  已棄用：RBD 已被棄用，且樹內 rbd 類型不再受支持。
  更多信息：
  https://examples.k8s.io/volumes/rbd/README.md

  <a name="RBDPersistentVolumeSource"></a>
  **表示在 Pod 的生命週期內一直存在的 Rados 塊設備掛載。RBD 卷支持所有權管理和 SELinux 重新打標籤。**

  - **rbd.image** (string)，必需

    image 是 rados 鏡像名稱。更多信息：
    https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  - **rbd.monitors** ([]string)，必需

    **原子：將在合併期間被替換**

    monitors 是 Ceph 監測的集合。更多信息：
    https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  <!--
  - **rbd.fsType** (string)

    fsType is the filesystem type of the volume that you want to mount. Tip: Ensure that the filesystem type is supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://kubernetes.io/docs/concepts/storage/volumes#rbd

  - **rbd.keyring** (string)

    keyring is the path to key ring for RBDUser. Default is /etc/ceph/keyring. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it
  -->

  - **rbd.fsType** (string)

    fsType 是你要掛載的卷的文件系統類型。提示：確保主機操作系統支持此文件系統類型。
    例如：“ext4”、“xfs”、“ntfs”。如果未指定，則隱式推斷爲 “ext4”。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#rbd

  - **rbd.keyring** (string)

    keyring 是給定用戶的密鑰環的路徑。默認爲 /etc/ceph/keyring。更多信息：
    https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it
  
  <!--
  - **rbd.pool** (string)

    pool is the rados pool name. Default is rbd. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  - **rbd.readOnly** (boolean)

    readOnly here will force the ReadOnly setting in VolumeMounts. Defaults to false. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it
  -->

  - **rbd.pool** (string)

    pool 是 rados 池名稱。默認爲 rbd。更多信息：
    https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  - **rbd.readOnly** (boolean)

    此處 readOnly 將在 VolumeMounts 中強制設置 readOnly。默認爲 false。更多信息：
    https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  <!--
  - **rbd.secretRef** (SecretReference)

    secretRef is name of the authentication secret for RBDUser. If provided overrides keyring. Default is nil. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

    <a name="SecretReference"></a>
    *SecretReference represents a Secret Reference. It has enough information to retrieve secret in any namespace*

    - **rbd.secretRef.name** (string)

      name is unique within a namespace to reference a secret resource.

    - **rbd.secretRef.namespace** (string)

      namespace defines the space within which the secret name must be unique.

  - **rbd.user** (string)

    user is the rados user name. Default is admin. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it
  -->

  - **rbd.secretRef** (SecretReference)

    secretRef 是針對 RBDUser 的身份認證 Secret 的名稱。如果提供，則重載 keyring。默認爲 nil。
    更多信息： https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

    <a name="SecretReference"></a>
    **SecretReference 表示對某 Secret 的引用，其中包含足夠的信息來訪問任何名字空間中的 Secret。**

    - **rbd.secretRef.name** (string)

      name 在名字空間內是唯一的，以引用一個 Secret 資源。

    - **rbd.secretRef.namespace** (string)

      namespace 指定一個名字空間，Secret 名稱在該名字空間中必須唯一。

  - **rbd.user** (string)

    user 是 rados 用戶名。默認爲 admin。更多信息：
    https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

<!--
- **scaleIO** (ScaleIOPersistentVolumeSource)

  scaleIO represents a ScaleIO persistent volume attached and mounted on Kubernetes nodes. Deprecated: ScaleIO is deprecated and the in-tree scaleIO type is no longer supported.

  <a name="ScaleIOPersistentVolumeSource"></a>
  *ScaleIOPersistentVolumeSource represents a persistent ScaleIO volume*

  - **scaleIO.gateway** (string), required

    gateway is the host address of the ScaleIO API Gateway.
-->

- **scaleIO** (ScaleIOPersistentVolumeSource)

  scaleIO 表示 Kubernetes 節點上掛接和掛載的 ScaleIO 持久卷。
  已棄用：scaleIO 已被棄用，且樹內 scaleIO 類型不再受支持。

  <a name="ScaleIOPersistentVolumeSource"></a>
  **ScaleIOPersistentVolumeSource 表示一個 ScaleIO 持久卷。**

  - **scaleIO.gateway** (string)，必需

    gateway 是 ScaleIO API 網關的主機地址。

  <!--
  - **scaleIO.secretRef** (SecretReference), required

    secretRef references to the secret for ScaleIO user and other sensitive information. If this is not provided, Login operation will fail.

    <a name="SecretReference"></a>
    *SecretReference represents a Secret Reference. It has enough information to retrieve secret in any namespace*

    - **scaleIO.secretRef.name** (string)

      name is unique within a namespace to reference a secret resource.

    - **scaleIO.secretRef.namespace** (string)

      namespace defines the space within which the secret name must be unique.
  -->

  - **scaleIO.secretRef** (SecretReference)，必需

    secretRef 引用包含 ScaleIO 用戶和其他敏感信息的 Secret。如果未提供此項，則 Login 操作將失敗。

    <a name="SecretReference"></a>
    **SecretReference 表示對某 Secret 的引用，其中包含足夠的信息來訪問任何名字空間中的 Secret。**

    - **scaleIO.secretRef.name** (string)

      name 在名字空間內是唯一的，以引用一個 Secret 資源。

    - **scaleIO.secretRef.namespace** (string)

      namespace 指定一個名字空間，Secret 名稱在該名字空間中必須唯一。

  <!--
  - **scaleIO.system** (string), required

    system is the name of the storage system as configured in ScaleIO.

  - **scaleIO.fsType** (string)

    fsType is the filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Default is "xfs"

  - **scaleIO.protectionDomain** (string)

    protectionDomain is the name of the ScaleIO Protection Domain for the configured storage.

  - **scaleIO.readOnly** (boolean)

    readOnly defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.
  -->

  - **scaleIO.system** (string)，必需

    system 是 ScaleIO 中所配置的存儲系統的名稱。

  - **scaleIO.fsType** (string)

    fsType 是要掛載的文件系統類型。必須是主機操作系統所支持的文件系統類型之一。
    例如 “ext4”、“xfs”、“ntfs”。默認爲 “xfs”。

  - **scaleIO.protectionDomain** (string)

    protectionDomain 是 ScaleIO 保護域（ScaleIO Protection Domain）的名稱，用於已配置的存儲。

  - **scaleIO.readOnly** (boolean)

    readOnly 默認爲 false（讀/寫）。此處 readOnly 將在 VolumeMounts 中強制設置 readOnly。

  <!--
  - **scaleIO.sslEnabled** (boolean)

    sslEnabled is the flag to enable/disable SSL communication with Gateway, default false

  - **scaleIO.storageMode** (string)

    storageMode indicates whether the storage for a volume should be ThickProvisioned or ThinProvisioned. Default is ThinProvisioned.

  - **scaleIO.storagePool** (string)

    storagePool is the ScaleIO Storage Pool associated with the protection domain.

  - **scaleIO.volumeName** (string)

    volumeName is the name of a volume already created in the ScaleIO system that is associated with this volume source.
  -->

  - **scaleIO.sslEnabled** (boolean)

    sslEnabled 是啓用/禁用與網關（Gateway）進行 SSL 通信的標誌，默認爲 false。

  - **scaleIO.storageMode** (string)

    storageMode 指示卷所用的存儲應是 ThickProvisioned 或 ThinProvisioned。
    默認爲 ThinProvisioned。

  - **scaleIO.storagePool** (string)

    storagePool 是與保護域關聯的 ScaleIO Storage Pool。

  - **scaleIO.volumeName** (string)

    volumeName 是在與此卷源關聯的 ScaleIO 系統中已創建的卷的名稱。

<!--
- **storageos** (StorageOSPersistentVolumeSource)

  storageOS represents a StorageOS volume that is attached to the kubelet's host machine and mounted into the pod. Deprecated: StorageOS is deprecated and the in-tree storageos type is no longer supported. More info: https://examples.k8s.io/volumes/storageos/README.md

  <a name="StorageOSPersistentVolumeSource"></a>
  *Represents a StorageOS persistent volume resource.*

  - **storageos.fsType** (string)

    fsType is the filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified.

  - **storageos.readOnly** (boolean)

    readOnly defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.
-->
- **storageos** (StorageOSPersistentVolumeSource)

  storageOS 表示一個 storageOS 卷，該卷被掛接到 kubelet 的主機並掛載到 Pod 中。
  已棄用：storageOS 已被棄用，且樹內 storageOS 類型不再受支持。
  更多信息：
  https://examples.k8s.io/volumes/storageos/README.md

  <a name="StorageOSPersistentVolumeSource"></a>
  **表示 StorageOS 持久卷資源。**

  - **storageos.fsType** (string)

    fsType 是要掛載的文件系統類型。必須是主機操作系統所支持的文件系統類型之一。
    例如 “ext4”、“xfs”、“ntfs”。如果未指定，則隱式推斷爲 “ext4”。

  - **storageos.readOnly** (boolean)

    readOnly 默認爲 false（讀/寫）。此處 readOnly 將在 VolumeMounts 中強制設置 readOnly。

  <!--
  - **storageos.secretRef** (<a href="{{< ref "../common-definitions/object-reference#ObjectReference" >}}">ObjectReference</a>)

    secretRef specifies the secret to use for obtaining the StorageOS API credentials.  If not specified, default values will be attempted.

  - **storageos.volumeName** (string)

    volumeName is the human-readable name of the StorageOS volume.  Volume names are only unique within a namespace.

  - **storageos.volumeNamespace** (string)

    volumeNamespace specifies the scope of the volume within StorageOS.  If no namespace is specified then the Pod's namespace will be used.  This allows the Kubernetes name scoping to be mirrored within StorageOS for tighter integration. Set VolumeName to any name to override the default behaviour. Set to "default" if you are not using namespaces within StorageOS. Namespaces that do not pre-exist within StorageOS will be created.
  -->

  - **storageos.secretRef** (<a href="{{< ref "../common-definitions/object-reference#ObjectReference" >}}">ObjectReference</a>)

    secretRef 指定用於獲取 StorageOS API 憑據的 Secret。如果未指定，則將嘗試使用默認值。

  - **storageos.volumeName** (string)

    volumeName 是 StorageOS 卷的人類可讀名稱。這些卷名稱在一個名字空間內是唯一的。

  - **storageos.volumeNamespace** (string)

    volumeNamespace 指定 StorageOS 內卷的作用域。如果未指定名字空間，則將使用 Pod 的名字空間。
    這一字段的存在允許 Kubernetes 中名稱作用域與 StorageOS 進行映射，實現更緊密的集成。
    將 volumeName 設爲任何名稱均可以重載默認的行爲。
    如果你未在 StorageOS 內使用名字空間，則設爲 “default”。
    StorageOS 內預先不存在的名字空間會被創建。

<!--
- **vsphereVolume** (VsphereVirtualDiskVolumeSource)

  vsphereVolume represents a vSphere volume attached and mounted on kubelets host machine. Deprecated: VsphereVolume is deprecated. All operations for the in-tree vsphereVolume type are redirected to the csi.vsphere.vmware.com CSI driver.

  <a name="VsphereVirtualDiskVolumeSource"></a>
  *Represents a vSphere volume resource.*

  - **vsphereVolume.volumePath** (string), required

    volumePath is the path that identifies vSphere volume vmdk

  - **vsphereVolume.fsType** (string)

    fsType is filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified.

  - **vsphereVolume.storagePolicyID** (string)

    storagePolicyID is the storage Policy Based Management (SPBM) profile ID associated with the StoragePolicyName.

  - **vsphereVolume.storagePolicyName** (string)

    storagePolicyName is the storage Policy Based Management (SPBM) profile name.
-->
- **vsphereVolume** (VsphereVirtualDiskVolumeSource)

  vsphereVolume 表示 kubelet 主機上掛接和掛載的 vSphere 卷。
  已棄用：VsphereVolume 已被棄用。所有針對樹內 vsphereVolume
  類型的操作都將重定向至 csi.vsphere.vmware.com CSI 驅動。

  <a name="VsphereVirtualDiskVolumeSource"></a>
  **表示 vSphere 卷資源。**

  - **vsphereVolume.volumePath** (string)，必需

    volumePath 是標識 vSphere 卷 vmdk 的路徑。

  - **vsphereVolume.fsType** (string)

    fsType 是要掛載的文件系統類型。必須是主機操作系統所支持的文件系統類型之一。
    例如 “ext4”、“xfs”、“ntfs”。如果未指定，則隱式推斷爲 “ext4”。

  - **vsphereVolume.storagePolicyID** (string)

    storagePolicyID 是與 StoragePolicyName 關聯的基於存儲策略的管理（SPBM）配置文件 ID。

  - **vsphereVolume.storagePolicyName** (string)

    storagePolicyName 是基於存儲策略的管理（SPBM）配置文件名稱。

## PersistentVolumeStatus {#PersistentVolumeStatus}

<!--
PersistentVolumeStatus is the current status of a persistent volume.
-->
PersistentVolumeStatus 是持久卷的當前狀態。

<hr>

<!--
- **lastPhaseTransitionTime** (Time)

  lastPhaseTransitionTime is the time the phase transitioned from one to another and automatically
  resets to current time everytime a volume phase transitions.

  <a name="Time"></a>
  *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.
  Wrappers are provided for many of the factory methods that the time package offers.*
-->
- **lastPhaseTransitionTime** (Time)

  lastPhaseTransitionTime 是從一個階段轉換到另一個階段的時間，每次卷階段轉換時都會自動重置爲當前時間。

  <a name="Time"></a>
  **Time 是 time.Time 的包裝器，支持正確編組爲 YAML 和 JSON，它爲 time 包提供的許多工廠方法提供了包裝器。**

<!--
- **message** (string)

  message is a human-readable message indicating details about why the volume is in this state.

- **phase** (string)

  phase indicates if a volume is available, bound to a claim, or released by a claim. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#phase

- **reason** (string)

  reason is a brief CamelCase string that describes any failure and is meant for machine parsing and tidy display in the CLI.
-->
- **message** (string)

  message 是一條人類可讀的消息，指明有關卷爲何處於此狀態的詳細信息。

- **phase** (string)

  phase 表示一個卷是否可用，是否綁定到一個 PVC 或是否由某個 PVC 釋放。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes#phase

- **reason** (string)

  reason 是一個描述任何故障的簡短 CamelCase 字符串，用於機器解析並在 CLI 中整齊地顯示。

## PersistentVolumeList {#PersistentVolumeList}

<!--
PersistentVolumeList is a list of PersistentVolume items.
-->
PersistentVolumeList 是 PersistentVolume 各項的列表。

<hr>

- **apiVersion**: v1

- **kind**: PersistentVolumeList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **items** ([]<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>), required

  items is a list of persistent volumes. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  標準的列表元數據。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **items** ([]<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>)，必需

  items 是持久卷的列表。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes

<!--
## Operations {#Operations}
### `get` read the specified PersistentVolume
#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `get` 讀取指定的 PersistentVolume

#### HTTP 請求

GET /api/v1/persistentvolumes/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the PersistentVolume

- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需

  PersistentVolume 的名稱。

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>): OK

401: Unauthorized

<!--
### `get` read status of the specified PersistentVolume
#### HTTP Request
-->
### `get` 讀取指定的 PersistentVolume 的狀態

#### HTTP 請求

GET /api/v1/persistentvolumes/{name}/status

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the PersistentVolume

- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需

  PersistentVolume 的名稱。

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind PersistentVolume
#### HTTP Request
-->
### `list` 列出或觀測類別爲 PersistentVolume 的對象

#### HTTP 請求

GET /api/v1/persistentvolumes

<!--
#### Parameters
- **allowWatchBookmarks** (*in query*): boolean
- **continue** (*in query*): string
- **fieldSelector** (*in query*): string
- **labelSelector** (*in query*): string
- **limit** (*in query*): integer
- **pretty** (*in query*): string
- **resourceVersion** (*in query*): string
- **resourceVersionMatch** (*in query*): string
- **timeoutSeconds** (*in query*): integer
- **watch** (*in query*): boolean
-->
#### 參數

- **allowWatchBookmarks** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolumeList" >}}">PersistentVolumeList</a>): OK

401: Unauthorized

<!--
### `create` create a PersistentVolume
#### HTTP Request
-->
### `create` 創建 PersistentVolume

#### HTTP 請求

POST /api/v1/persistentvolumes

<!--
#### Parameters
- **body**: <a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 參數

- **body**: <a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>，必需

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>): Created

202 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified PersistentVolume
#### HTTP Request
-->
### `update` 替換指定的 PersistentVolume

#### HTTP 請求

PUT /api/v1/persistentvolumes/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the PersistentVolume
- **body**: <a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需

  PersistentVolume 的名稱。

- **body**: <a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>，必需

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>): Created

401: Unauthorized

<!--
### `update` replace status of the specified PersistentVolume
#### HTTP Request
-->
### `update` 替換指定的 PersistentVolume 的狀態

#### HTTP 請求

PUT /api/v1/persistentvolumes/{name}/status

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the PersistentVolume
- **body**: <a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需

  PersistentVolume 的名稱。

- **body**: <a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>，必需

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified PersistentVolume
#### HTTP Request
-->
### `patch` 部分更新指定的 PersistentVolume

#### HTTP 請求

PATCH /api/v1/persistentvolumes/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the PersistentVolume
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **force** (*in query*): boolean
- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需

  PersistentVolume 的名稱。

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified PersistentVolume
#### HTTP Request
-->
### `patch` 部分更新指定的 PersistentVolume 的狀態

#### HTTP 請求

PATCH /api/v1/persistentvolumes/{name}/status

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the PersistentVolume
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **force** (*in query*): boolean
- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需

  PersistentVolume 的名稱。

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>): Created

401: Unauthorized

<!--
### `delete` delete a PersistentVolume
#### HTTP Request
-->
### `delete` 刪除 PersistentVolume

#### HTTP 請求

DELETE /api/v1/persistentvolumes/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the PersistentVolume
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **dryRun** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需

  PersistentVolume 的名稱。

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>): OK

202 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolume" >}}">PersistentVolume</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of PersistentVolume
#### HTTP Request
-->
### `deletecollection` 刪除 PersistentVolume 的集合

#### HTTP 請求

DELETE /api/v1/persistentvolumes

<!--
#### Parameters
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **continue** (*in query*): string
- **dryRun** (*in query*): string
- **fieldSelector** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean
- **labelSelector** (*in query*): string
- **limit** (*in query*): integer
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
- **resourceVersion** (*in query*): string
- **resourceVersionMatch** (*in query*): string
- **timeoutSeconds** (*in query*): integer
-->
#### 參數

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查詢參數**): boolean
  
  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **labelSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
