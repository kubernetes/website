---
title: 儲存類
api_metadata:
- apiVersion: "storage.k8s.io/v1"
  kind: "StorageClass"
content_type: concept
weight: 40
---
<!--
reviewers:
- jsafrane
- saad-ali
- thockin
- msau42
title: Storage Classes
api_metadata:
- apiVersion: "storage.k8s.io/v1"
  kind: "StorageClass"
content_type: concept
weight: 40
-->

<!-- overview -->

<!--
This document describes the concept of a StorageClass in Kubernetes. Familiarity
with [volumes](/docs/concepts/storage/volumes/) and
[persistent volumes](/docs/concepts/storage/persistent-volumes) is suggested.
-->
本文描述了 Kubernetes 中 StorageClass 的概念。
建議先熟悉[卷](/zh-cn/docs/concepts/storage/volumes/)和[持久卷](/zh-cn/docs/concepts/storage/persistent-volumes)的概念。

<!--
A StorageClass provides a way for administrators to describe the _classes_ of
storage they offer. Different classes might map to quality-of-service levels,
or to backup policies, or to arbitrary policies determined by the cluster
administrators. Kubernetes itself is unopinionated about what classes
represent.

The Kubernetes concept of a storage class is similar to “profiles” in some other
storage system designs.
-->
StorageClass 爲管理員提供了描述儲存**類**的方法。
不同的類型可能會映射到不同的服務質量等級或備份策略，或是由叢集管理員制定的任意策略。
Kubernetes 本身並不清楚各種類代表的什麼。

Kubernetes 儲存類的概念類似於一些其他儲存系統設計中的"設定檔案"。

<!-- body -->

<!--
## StorageClass objects

Each StorageClass contains the fields `provisioner`, `parameters`, and
`reclaimPolicy`, which are used when a PersistentVolume belonging to the
class needs to be dynamically provisioned to satisfy a PersistentVolumeClaim (PVC).
-->
## StorageClass 對象   {#storageclass-objects}

每個 StorageClass 都包含 `provisioner`、`parameters` 和 `reclaimPolicy` 字段，
這些字段會在 StorageClass 需要動態製備 PersistentVolume 以滿足 PersistentVolumeClaim (PVC) 時使用到。

<!--
The name of a StorageClass object is significant, and is how users can
request a particular class. Administrators set the name and other parameters
of a class when first creating StorageClass objects.
-->
StorageClass 對象的命名很重要，使用者使用這個命名來請求生成一個特定的類。
當創建 StorageClass 對象時，管理員設置 StorageClass 對象的命名和其他參數。

<!--
As an administrator, you can specify a default StorageClass that applies to any PVCs that
don't request a specific class. For more details, see the
[PersistentVolumeClaim concept](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims).

Here's an example of a StorageClass:
-->
作爲管理員，你可以爲沒有申請綁定到特定 StorageClass 的 PVC 指定一個預設的儲存類：
更多詳情請參閱
[PersistentVolumeClaim 概念](/zh-cn/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)。

{{% code_sample file="storage/storageclass-low-latency.yaml" %}}

<!--
## Default StorageClass

You can mark a StorageClass as the default for your cluster.
For instructions on setting the default StorageClass, see
[Change the default StorageClass](/docs/tasks/administer-cluster/change-default-storage-class/).

When a PVC does not specify a `storageClassName`, the default StorageClass is
used.
-->
### 預設 StorageClass  {#default-storageclass}

你可以將某個 StorageClass 標記爲叢集的預設儲存類。
關於如何設置預設的 StorageClass，
請參見[更改預設 StorageClass](/zh-cn/docs/tasks/administer-cluster/change-default-storage-class/)。

當一個 PVC 沒有指定 `storageClassName` 時，會使用預設的 StorageClass。

<!--
If you set the
[`storageclass.kubernetes.io/is-default-class`](/docs/reference/labels-annotations-taints/#storageclass-kubernetes-io-is-default-class)
annotation to true on more than one StorageClass in your cluster, and you then
create a PersistentVolumeClaim with no `storageClassName` set, Kubernetes
uses the most recently created default StorageClass.
-->
如果你在叢集中的多個 StorageClass 上將
[`storageclass.kubernetes.io/is-default-class`](/zh-cn/docs/reference/labels-annotations-taints/#storageclass-kubernetes-io-is-default-class)
註解設置爲 true，然後創建一個未設置 `storageClassName` 的 PersistentVolumeClaim (PVC)，
Kubernetes 將使用最近創建的預設 StorageClass。

{{< note >}}
<!--
You should try to only have one StorageClass in your cluster that is
marked as the default. The reason that Kubernetes allows you to have
multiple default StorageClasses is to allow for seamless migration.
-->
你應該嘗試在叢集中只將一個 StorageClass 標記爲預設的儲存類。
Kubernetes 允許你擁有多個預設 StorageClass 的原因是爲了無縫遷移。
{{< /note >}}

<!--
You can create a PersistentVolumeClaim without specifying a `storageClassName`
for the new PVC, and you can do so even when no default StorageClass exists
in your cluster. In this case, the new PVC creates as you defined it, and the
`storageClassName` of that PVC remains unset until a default becomes available.

You can have a cluster without any default StorageClass. If you don't mark any
StorageClass as default (and one hasn't been set for you by, for example, a cloud provider),
then Kubernetes cannot apply that defaulting for PersistentVolumeClaims that need
it.
-->
你可以在創建新的 PVC 時不指定 `storageClassName`，即使在叢集中沒有預設 StorageClass 的情況下也可以這樣做。
在這種情況下，新的 PVC 會按照你定義的方式進行創建，並且該 PVC 的 `storageClassName` 將保持不設置，
直到有可用的預設 StorageClass 爲止。

你可以擁有一個沒有任何預設 StorageClass 的叢集。
如果你沒有將任何 StorageClass 標記爲預設（例如，雲服務提供商還沒有爲你設置預設值），那麼
Kubernetes 將無法爲需要 StorageClass 的 PersistentVolumeClaim 應用預設值。

<!--
If or when a default StorageClass becomes available, the control plane identifies any
existing PVCs without `storageClassName`. For the PVCs that either have an empty
value for `storageClassName` or do not have this key, the control plane then
updates those PVCs to set `storageClassName` to match the new default StorageClass.
If you have an existing PVC where the `storageClassName` is `""`, and you configure
a default StorageClass, then this PVC will not get updated.
-->
當預設 StorageClass 變得可用時，控制平面會查找所有未設置 `storageClassName` 的現有 PVC。
對於那些 `storageClassName` 值爲空或沒有此鍵的 PVC，控制平面將更新它們，
將 `storageClassName` 設置爲匹配新的預設 StorageClass。如果你有一個現成的 PVC，其 `storageClassName` 爲 `""`，
而你設定了預設的 StorageClass，那麼該 PVC 將不會被更新。

<!--
In order to keep binding to PVs with `storageClassName` set to `""`
(while a default StorageClass is present), you need to set the `storageClassName`
of the associated PVC to `""`.
-->
（當預設的 StorageClass 存在時）爲了繼續綁定到 `storageClassName` 爲 `""` 的 PV，
你需要將關聯 PVC 的 `storageClassName` 設置爲 `""`。

<!--
### Provisioner

Each StorageClass has a provisioner that determines what volume plugin is used
for provisioning PVs. This field must be specified.
-->
### 儲存製備器  {#provisioner}

每個 StorageClass 都有一個製備器（Provisioner），用來決定使用哪個卷插件製備 PV。
該字段必須指定。

<!--
| Volume Plugin        | Internal Provisioner |            Config Example             |
-->

| 卷插件               | 內置製備器 |               設定示例                |
| :------------------- | :--------: | :-----------------------------------: |
| AzureFile            |  &#x2713;  |       [Azure File](#azure-file)       |
| CephFS               |     -      |                   -                   |
| FC                   |     -      |                   -                   |
| FlexVolume           |     -      |                   -                   |
| iSCSI                |     -      |                   -                   |
| Local                |     -      |            [Local](#local)            |
| NFS                  |     -      |              [NFS](#nfs)              |
| PortworxVolume       |  &#x2713;  |  [Portworx Volume](#portworx-volume)  |
| RBD                  |  &#x2713;  |         [Ceph RBD](#ceph-rbd)         |
| VsphereVolume        |  &#x2713;  |          [vSphere](#vsphere)          |

<!--
You are not restricted to specifying the "internal" provisioners
listed here (whose names are prefixed with "kubernetes.io" and shipped
alongside Kubernetes). You can also run and specify external provisioners,
which are independent programs that follow a [specification](https://git.k8s.io/design-proposals-archive/storage/volume-provisioning.md)
defined by Kubernetes. Authors of external provisioners have full discretion
over where their code lives, how the provisioner is shipped, how it needs to be
run, what volume plugin it uses (including Flex), etc. The repository
[kubernetes-sigs/sig-storage-lib-external-provisioner](https://github.com/kubernetes-sigs/sig-storage-lib-external-provisioner)
houses a library for writing external provisioners that implements the bulk of
the specification. Some external provisioners are listed under the repository
[kubernetes-sigs/sig-storage-lib-external-provisioner](https://github.com/kubernetes-sigs/sig-storage-lib-external-provisioner).
-->
你不限於指定此處列出的 "內置" 製備器（其名稱前綴爲 "kubernetes.io" 並打包在 Kubernetes 中）。
你還可以運行和指定外部製備器，這些獨立的程式遵循由 Kubernetes
定義的[規範](https://git.k8s.io/design-proposals-archive/storage/volume-provisioning.md)。
外部供應商的作者完全可以自由決定他們的代碼保存於何處、打包方式、運行方式、使用的插件（包括 Flex）等。
代碼倉庫 [kubernetes-sigs/sig-storage-lib-external-provisioner](https://github.com/kubernetes-sigs/sig-storage-lib-external-provisioner)
包含一個用於爲外部製備器編寫功能實現的類庫。你可以訪問代碼倉庫
[kubernetes-sigs/sig-storage-lib-external-provisioner](https://github.com/kubernetes-sigs/sig-storage-lib-external-provisioner)
瞭解外部驅動列表。

<!--
For example, NFS doesn't provide an internal provisioner, but an external
provisioner can be used. There are also cases when 3rd party storage
vendors provide their own external provisioner.
-->
例如，NFS 沒有內部製備器，但可以使用外部製備器。
也有第三方儲存供應商提供自己的外部製備器。

<!--
## Reclaim policy

PersistentVolumes that are dynamically created by a StorageClass will have the
[reclaim policy](/docs/concepts/storage/persistent-volumes/#reclaiming)
specified in the `reclaimPolicy` field of the class, which can be
either `Delete` or `Retain`. If no `reclaimPolicy` is specified when a
StorageClass object is created, it will default to `Delete`.

PersistentVolumes that are created manually and managed via a StorageClass will have
whatever reclaim policy they were assigned at creation.
-->
## 回收策略 {#reclaim-policy}

由 StorageClass 動態創建的 PersistentVolume 會在類的
[reclaimPolicy](/zh-cn/docs/concepts/storage/persistent-volumes/#reclaiming)
字段中指定回收策略，可以是 `Delete` 或者 `Retain`。
如果 StorageClass 對象被創建時沒有指定 `reclaimPolicy`，它將預設爲 `Delete`。

通過 StorageClass 手動創建並管理的 PersistentVolume 會使用它們被創建時指定的回收策略。

<!--
## Volume expansion {#allow-volume-expansion}

PersistentVolumes can be configured to be expandable. This allows you to resize the
volume by editing the corresponding PVC object, requesting a new larger amount of
storage.

The following types of volumes support volume expansion, when the underlying
StorageClass has the field `allowVolumeExpansion` set to true.
-->
## 卷擴展   {#allow-volume-expansion}

PersistentVolume 可以設定爲可擴展。
這允許你通過編輯相應的 PVC 對象來調整卷大小，申請一個新的、更大的儲存容量。

當下層 StorageClass 的 `allowVolumeExpansion` 字段設置爲 true 時，以下類型的卷支持卷擴展。

<!--
"Table of Volume types and the version of Kubernetes they require"
-->
{{< table caption = "卷類型及其 Kubernetes 版本要求" >}}

<!--
Volume type | Required Kubernetes version for volume expansion
-->
| 卷類型               | 卷擴展的 Kubernetes 版本要求  |
| :------------------- | :------------------------ |
| Azure File           | 1.11                      |
| CSI                  | 1.24                      |
| FlexVolume           | 1.13                      |
| Portworx             | 1.11                      |
| rbd                  | 1.11                      |

{{< /table >}}

{{< note >}}
<!--
You can only use the volume expansion feature to grow a Volume, not to shrink it.
-->
此功能僅可用於擴容卷，不能用於縮小卷。
{{< /note >}}

<!--
## Mount options

PersistentVolumes that are dynamically created by a StorageClass will have the
mount options specified in the `mountOptions` field of the class.

If the volume plugin does not support mount options but mount options are
specified, provisioning will fail. Mount options are **not** validated on either
the class or PV. If a mount option is invalid, the PV mount fails.
-->
## 掛載選項 {#mount-options}

由 StorageClass 動態創建的 PersistentVolume 將使用類中 `mountOptions` 字段指定的掛載選項。

如果卷插件不支持掛載選項，卻指定了掛載選項，則製備操作會失敗。
掛載選項在 StorageClass 和 PV 上都**不**會做驗證。如果其中一個掛載選項無效，
那麼這個 PV 掛載操作就會失敗。

<!--
## Volume binding mode
-->
## 卷綁定模式 {#volume-binding-mode}

<!--
The `volumeBindingMode` field controls when
[volume binding and dynamic provisioning](/docs/concepts/storage/persistent-volumes/#provisioning)
should occur. When unset, `Immediate` mode is used by default.
-->
`volumeBindingMode`
字段控制了[卷綁定和動態製備](/zh-cn/docs/concepts/storage/persistent-volumes/#provisioning)應該發生在什麼時候。
當未設置時，預設使用 `Immediate` 模式。

<!--
The `Immediate` mode indicates that volume binding and dynamic
provisioning occurs once the PersistentVolumeClaim is created. For storage
backends that are topology-constrained and not globally accessible from all Nodes
in the cluster, PersistentVolumes will be bound or provisioned without knowledge of the Pod's scheduling
requirements. This may result in unschedulable Pods.
-->
`Immediate` 模式表示一旦創建了 PersistentVolumeClaim 也就完成了卷綁定和動態製備。
對於由於拓撲限制而非叢集所有節點可達的儲存後端，PersistentVolume
會在不知道 Pod 調度要求的情況下綁定或者製備。

<!--
A cluster administrator can address this issue by specifying the `WaitForFirstConsumer` mode which
will delay the binding and provisioning of a PersistentVolume until a Pod using the PersistentVolumeClaim is created.
PersistentVolumes will be selected or provisioned conforming to the topology that is
specified by the Pod's scheduling constraints. These include, but are not limited to, [resource
requirements](/docs/concepts/configuration/manage-resources-containers/),
[node selectors](/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector),
[pod affinity and
anti-affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity),
and [taints and tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration).
-->
叢集管理員可以通過指定 `WaitForFirstConsumer` 模式來解決此問題。
該模式將延遲 PersistentVolume 的綁定和製備，直到使用該 PersistentVolumeClaim 的 Pod 被創建。
PersistentVolume 會根據 Pod 調度約束指定的拓撲來選擇或製備。
這些包括但不限於[資源需求](/zh-cn/docs/concepts/configuration/manage-resources-containers/)、
[節點篩選器](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)、
[Pod 親和性和互斥性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity/)、
以及[污點和容忍度](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration)。

<!--
The following plugins support `WaitForFirstConsumer` with dynamic provisioning:

- CSI volumes, provided that the specific CSI driver supports this

The following plugins support `WaitForFirstConsumer` with pre-created PersistentVolume binding:

- CSI volumes, provided that the specific CSI driver supports this
- [`local`](#local)
-->
以下插件支持使用動態製備的 `WaitForFirstConsumer`：

- CSI 卷，前提是特定的 CSI 驅動程式支持此卷

以下插件支持預創建綁定 PersistentVolume 的 `WaitForFirstConsumer` 模式：

- CSI 卷，前提是特定的 CSI 驅動程式支持此卷
- [`local`](#local)

{{< note >}}
<!--
If you choose to use `WaitForFirstConsumer`, do not use `nodeName` in the Pod spec
to specify node affinity.
If `nodeName` is used in this case, the scheduler will be bypassed and PVC will remain in `pending` state.

Instead, you can use node selector for `kubernetes.io/hostname`:
-->
如果你選擇使用 `WaitForFirstConsumer`，請不要在 Pod 規約中使用 `nodeName` 來指定節點親和性。
如果在這種情況下使用 `nodeName`，Pod 將會繞過調度程式，PVC 將停留在 `pending` 狀態。

相反，你可以爲 `kubernetes.io/hostname` 使用節點選擇器：

{{< /note >}}

{{% code_sample language="yaml" file="storage/storageclass/pod-volume-binding.yaml" %}}

<!--
## Allowed topologies
-->
## 允許的拓撲結構  {#allowed-topologies}

<!--
When a cluster operator specifies the `WaitForFirstConsumer` volume binding mode, it is no longer necessary
to restrict provisioning to specific topologies in most situations. However,
if still required, `allowedTopologies` can be specified.
-->
當叢集操作人員使用了 `WaitForFirstConsumer` 的卷綁定模式，
在大部分情況下就沒有必要將製備限制爲特定的拓撲結構。
然而，如果還有需要的話，可以使用 `allowedTopologies`。

<!--
This example demonstrates how to restrict the topology of provisioned volumes to specific
zones and should be used as a replacement for the `zone` and `zones` parameters for the
supported plugins.
-->
這個例子描述瞭如何將製備卷的拓撲限制在特定的區域，
在使用時應該根據插件支持情況替換 `zone` 和 `zones` 參數。

{{% code_sample language="yaml" file="storage/storageclass/storageclass-topology.yaml" %}}

<!--
`tagSpecification`: Tags with this prefix are applied to dynamically provisioned EBS volumes.
-->
`tagSpecification`：具有此前綴的標籤適用於動態設定的 EBS 卷。

<!--
## Parameters

StorageClasses have parameters that describe volumes belonging to the storage
class. Different parameters may be accepted depending on the `provisioner`.
When a parameter is omitted, some default is used.

There can be at most 512 parameters defined for a StorageClass.
The total length of the parameters object including its keys and values cannot
exceed 256 KiB.
-->
## 參數 {#parameters}

StorageClass 的參數描述了儲存類的卷。取決於製備器，可以接受不同的參數。
當參數被省略時，會使用預設值。

一個 StorageClass 最多可以定義 512 個參數。這些參數對象的總長度不能超過 256 KiB，包括參數的鍵和值。

### AWS EBS

<!-- maintenance note: OK to remove all mention of awsElasticBlockStore once the v1.27 release of
Kubernetes has gone out of support -->

<!--
Kubernetes {{< skew currentVersion >}} does not include a `awsElasticBlockStore` volume type.

The AWSElasticBlockStore in-tree storage driver was deprecated in the Kubernetes v1.19 release
and then removed entirely in the v1.27 release.
-->
Kubernetes {{< skew currentVersion >}} 不包含 `awsElasticBlockStore` 卷類型。

AWSElasticBlockStore 樹內儲存驅動程式在 Kubernetes v1.19 版本中被棄用，並在 v1.27 版本中被完全移除。

<!--
The Kubernetes project suggests that you use the [AWS EBS](https://github.com/kubernetes-sigs/aws-ebs-csi-driver)
out-of-tree storage driver instead.

Here is an example StorageClass for the AWS EBS CSI driver:
-->
Kubernetes 項目建議你轉爲使用 [AWS EBS](https://github.com/kubernetes-sigs/aws-ebs-csi-driver) 樹外儲存驅動程式。

以下是一個針對 AWS EBS CSI 驅動程式的 StorageClass 示例：

{{% code_sample language="yaml" file="storage/storageclass/storageclass-aws-ebs.yaml" %}}

### AWS EFS

<!--
To configure AWS EFS storage, you can use the out-of-tree [AWS_EFS_CSI_DRIVER](https://github.com/kubernetes-sigs/aws-efs-csi-driver).
-->
要設定 AWS EFS 儲存，你可以使用樹外
[AWS_EFS_CSI_DRIVER](https://github.com/kubernetes-sigs/aws-efs-csi-driver)。

{{% code_sample language="yaml" file="storage/storageclass/storageclass-aws-efs.yaml" %}}

<!--
- `provisioningMode`: The type of volume to be provisioned by Amazon EFS. Currently, only access point based provisioning is supported (`efs-ap`).
- `fileSystemId`: The file system under which the access point is created.
- `directoryPerms`: The directory permissions of the root directory created by the access point.
-->
- `provisioningMode`：由 Amazon EFS 製備的卷類型。目前，僅支持基於訪問點的製備（`efs-ap`）。
- `fileSystemId`：在此檔案系統下創建訪問點。
- `directoryPerms`：由訪問點所創建的根目錄的目錄權限。

<!--
For more details, refer to the [AWS_EFS_CSI_Driver Dynamic Provisioning](https://github.com/kubernetes-sigs/aws-efs-csi-driver/blob/master/examples/kubernetes/dynamic_provisioning/README.md) documentation.
-->
有關細節參閱
[AWS_EFS_CSI_Driver 動態製備](https://github.com/kubernetes-sigs/aws-efs-csi-driver/blob/master/examples/kubernetes/dynamic_provisioning/README.md)文檔。

### NFS

<!--
To configure NFS storage, you can use the in-tree driver or the
[NFS CSI driver for Kubernetes](https://github.com/kubernetes-csi/csi-driver-nfs#readme)
(recommended).
-->
要設定 NFS 儲存，
你可以使用樹內驅動程式或[針對 Kubernetes 的 NFS CSI 驅動程式](https://github.com/kubernetes-csi/csi-driver-nfs#readme)（推薦）。

{{% code_sample language="yaml" file="storage/storageclass/storageclass-nfs.yaml" %}}

<!--
- `server`: Server is the hostname or IP address of the NFS server.
- `path`: Path that is exported by the NFS server.
- `readOnly`: A flag indicating whether the storage will be mounted as read only (default false).
-->
- `server`：NFS 伺服器的主機名或 IP 地址。
- `path`：NFS 伺服器導出的路徑。
- `readOnly`：是否將儲存掛載爲只讀的標誌（預設爲 false）。

<!--
Kubernetes doesn't include an internal NFS provisioner.
You need to use an external provisioner to create a StorageClass for NFS.
Here are some examples:

- [NFS Ganesha server and external provisioner](https://github.com/kubernetes-sigs/nfs-ganesha-server-and-external-provisioner)
- [NFS subdir external provisioner](https://github.com/kubernetes-sigs/nfs-subdir-external-provisioner)
-->
Kubernetes 不包含內部 NFS 驅動。你需要使用外部驅動爲 NFS 創建 StorageClass。
這裏有些例子：

- [NFS Ganesha 伺服器和外部驅動](https://github.com/kubernetes-sigs/nfs-ganesha-server-and-external-provisioner)
- [NFS subdir 外部驅動](https://github.com/kubernetes-sigs/nfs-subdir-external-provisioner)

### vSphere

<!--
There are two types of provisioners for vSphere storage classes:

- [CSI provisioner](#vsphere-provisioner-csi): `csi.vsphere.vmware.com`
- [vCP provisioner](#vcp-provisioner): `kubernetes.io/vsphere-volume`

In-tree provisioners are [deprecated](/blog/2019/12/09/kubernetes-1-17-feature-csi-migration-beta/#why-are-we-migrating-in-tree-plugins-to-csi).
For more information on the CSI provisioner, see
[Kubernetes vSphere CSI Driver](https://vsphere-csi-driver.sigs.k8s.io/) and
[vSphereVolume CSI migration](/docs/concepts/storage/volumes/#vsphere-csi-migration).
-->
vSphere 儲存類有兩種製備器：

- [CSI 製備器](#vsphere-provisioner-csi)：`csi.vsphere.vmware.com`
- [vCP 製備器](#vcp-provisioner)：`kubernetes.io/vsphere-volume`

樹內製備器已經被
[棄用](/blog/2019/12/09/kubernetes-1-17-feature-csi-migration-beta/#why-are-we-migrating-in-tree-plugins-to-csi)。
更多關於 CSI 製備器的詳情，請參閱
[Kubernetes vSphere CSI 驅動](https://vsphere-csi-driver.sigs.k8s.io/)
和 [vSphereVolume CSI 遷移](/zh-cn/docs/concepts/storage/volumes/#vsphere-csi-migration)。

<!--
#### CSI Provisioner {#vsphere-provisioner-csi}

The vSphere CSI StorageClass provisioner works with Tanzu Kubernetes clusters.
For an example, refer to the [vSphere CSI repository](https://github.com/kubernetes-sigs/vsphere-csi-driver/blob/master/example/vanilla-k8s-RWM-filesystem-volumes/example-sc.yaml).
-->
#### CSI 製備器 {#vsphere-provisioner-csi}

vSphere CSI StorageClass 製備器在 Tanzu Kubernetes 叢集下運行。示例請參閱
[vSphere CSI 倉庫](https://github.com/kubernetes-sigs/vsphere-csi-driver/blob/master/example/vanilla-k8s-RWM-filesystem-volumes/example-sc.yaml)。

<!--
#### vCP Provisioner

The following examples use the VMware Cloud Provider (vCP) StorageClass provisioner.
-->
#### vCP 製備器 {#vcp-provisioner}

以下示例使用 VMware Cloud Provider（vCP）StorageClass 製備器。

<!--
1. Create a StorageClass with a user specified disk format.
-->
1. 使用使用者指定的磁盤格式創建一個 StorageClass。

   ```yaml
   apiVersion: storage.k8s.io/v1
   kind: StorageClass
   metadata:
     name: fast
   provisioner: kubernetes.io/vsphere-volume
   parameters:
     diskformat: zeroedthick
   ```

   <!--
   `diskformat`: `thin`, `zeroedthick` and `eagerzeroedthick`. Default: `"thin"`.
   -->
   `diskformat`：`thin`、`zeroedthick` 和 `eagerzeroedthick`。預設值：`"thin"`。

<!--
2. Create a StorageClass with a disk format on a user specified datastore.
-->
2. 在使用者指定的資料儲存上創建磁盤格式的 StorageClass。

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

   <!--
   `datastore`: The user can also specify the datastore in the StorageClass.
   The volume will be created on the datastore specified in the StorageClass,
   which in this case is `VSANDatastore`. This field is optional. If the
   datastore is not specified, then the volume will be created on the datastore
   specified in the vSphere config file used to initialize the vSphere Cloud
   Provider.
   -->

   `datastore`：使用者也可以在 StorageClass 中指定資料儲存。
   卷將在 StorageClass 中指定的資料儲存上創建，在這種情況下是 `VSANDatastore`。
   該字段是可選的。
   如果未指定資料儲存，則將在用於初始化 vSphere Cloud Provider 的 vSphere
   設定檔案中指定的資料儲存上創建該卷。

<!--
3. Storage Policy Management inside kubernetes
-->
3. Kubernetes 中的儲存策略管理

   <!--
   - Using existing vCenter SPBM policy

     One of the most important features of vSphere for Storage Management is
     policy based Management. Storage Policy Based Management (SPBM) is a
     storage policy framework that provides a single unified control plane
     across a broad range of data services and storage solutions. SPBM enables
     vSphere administrators to overcome upfront storage provisioning challenges,
     such as capacity planning, differentiated service levels and managing
     capacity headroom.

     The SPBM policies can be specified in the StorageClass using the
     `storagePolicyName` parameter.
    -->

   - 使用現有的 vCenter SPBM 策略

     vSphere 用於儲存管理的最重要特性之一是基於策略的管理。
     基於儲存策略的管理（SPBM）是一個儲存策略框架，提供單一的統一控制平面的跨越廣泛的資料服務和儲存解決方案。
     SPBM 使得 vSphere 管理員能夠克服先期的儲存設定挑戰，如容量規劃、差異化服務等級和管理容量空間。

     SPBM 策略可以在 StorageClass 中使用 `storagePolicyName` 參數聲明。

    <!--
   - Virtual SAN policy support inside Kubernetes

     Vsphere Infrastructure (VI) Admins will have the ability to specify custom
     Virtual SAN Storage Capabilities during dynamic volume provisioning. You
     can now define storage requirements, such as performance and availability,
     in the form of storage capabilities during dynamic volume provisioning.
     The storage capability requirements are converted into a Virtual SAN
     policy which are then pushed down to the Virtual SAN layer when a
     persistent volume (virtual disk) is being created. The virtual disk is
     distributed across the Virtual SAN datastore to meet the requirements.

     You can see [Storage Policy Based Management for dynamic provisioning of volumes](https://github.com/vmware-archive/vsphere-storage-for-kubernetes/blob/fa4c8b8ad46a85b6555d715dd9d27ff69839df53/documentation/policy-based-mgmt.md)
     for more details on how to use storage policies for persistent volumes
     management.
    -->

   - Kubernetes 內的 Virtual SAN 策略支持

     Vsphere Infrastructure（VI）管理員將能夠在動態卷設定期間指定自定義 Virtual SAN
     儲存功能。你現在可以在動態製備卷期間以儲存能力的形式定義儲存需求，例如性能和可用性。
     儲存能力需求會轉換爲 Virtual SAN 策略，之後當持久卷（虛擬磁盤）被創建時，
     會將其推送到 Virtual SAN 層。虛擬磁盤分佈在 Virtual SAN 資料儲存中以滿足要求。

     你可以參考[基於儲存策略的動態製備卷管理](https://github.com/vmware-archive/vsphere-storage-for-kubernetes/blob/fa4c8b8ad46a85b6555d715dd9d27ff69839df53/documentation/policy-based-mgmt.md)，
     進一步瞭解有關持久卷管理的儲存策略的詳細資訊。

<!--
### Ceph RBD (deprecated) {#ceph-rbd}
-->
### Ceph RBD（已棄用）  {#ceph-rbd}

{{< note >}}
{{< feature-state state="deprecated" for_k8s_version="v1.28" >}}
<!--
This internal provisioner of Ceph RBD is deprecated. Please use
[CephFS RBD CSI driver](https://github.com/ceph/ceph-csi).
-->
Ceph RBD 的內部驅動程式已被棄用。請使用 [CephFS RBD CSI驅動程式](https://github.com/ceph/ceph-csi)。
{{< /note >}}

{{% code_sample language="yaml" file="storage/storageclass/storageclass-ceph-rbd.yaml" %}}

<!--
- `monitors`: Ceph monitors, comma delimited. This parameter is required.
- `adminId`: Ceph client ID that is capable of creating images in the pool.
  Default is "admin".
- `adminSecretName`: Secret Name for `adminId`. This parameter is required.
  The provided secret must have type "kubernetes.io/rbd".
- `adminSecretNamespace`: The namespace for `adminSecretName`. Default is "default".
- `pool`: Ceph RBD pool. Default is "rbd".
- `userId`: Ceph client ID that is used to map the RBD image. Default is the
  same as `adminId`.
-->
- `monitors`：Ceph monitor，逗號分隔。該參數是必需的。
- `adminId`：Ceph 客戶端 ID，用於在池 ceph 池中創建映像。預設是 "admin"。
- `adminSecret`：`adminId` 的 Secret 名稱。該參數是必需的。
  提供的 secret 必須有值爲 "kubernetes.io/rbd" 的 type 參數。
- `adminSecretNamespace`：`adminSecret` 的命名空間。預設是 "default"。
- `pool`：Ceph RBD 池。預設是 "rbd"。
- `userId`：Ceph 客戶端 ID，用於映射 RBD 映像檔。預設與 `adminId` 相同。

<!--
- `userSecretName`: The name of Ceph Secret for `userId` to map RBD image. It
  must exist in the same namespace as PVCs. This parameter is required.
  The provided secret must have type "kubernetes.io/rbd", for example created in this
  way:
-->
- `userSecretName`：用於映射 RBD 映像檔的 `userId` 的 Ceph Secret 的名字。
  它必須與 PVC 存在於相同的 namespace 中。該參數是必需的。
  提供的 secret 必須具有值爲 "kubernetes.io/rbd" 的 type 參數，例如以這樣的方式創建：

  ```shell
  kubectl create secret generic ceph-secret --type="kubernetes.io/rbd" \
    --from-literal=key='QVFEQ1pMdFhPUnQrSmhBQUFYaERWNHJsZ3BsMmNjcDR6RFZST0E9PQ==' \
    --namespace=kube-system
  ```

<!--
- `userSecretNamespace`: The namespace for `userSecretName`.
- `fsType`: fsType that is supported by kubernetes. Default: `"ext4"`.
- `imageFormat`: Ceph RBD image format, "1" or "2". Default is "2".
- `imageFeatures`: This parameter is optional and should only be used if you
  set `imageFormat` to "2". Currently supported features are `layering` only.
  Default is "", and no features are turned on.
-->
- `userSecretNamespace`：`userSecretName` 的命名空間。
- `fsType`：Kubernetes 支持的 fsType。預設：`"ext4"`。
- `imageFormat`：Ceph RBD 映像檔格式，"1" 或者 "2"。預設值是 "1"。
- `imageFeatures`：這個參數是可選的，只能在你將 `imageFormat` 設置爲 "2" 才使用。
  目前支持的功能只是 `layering`。預設是 ""，沒有功能打開。

<!--
### Azure Disk
-->
### Azure 磁盤 {#azure-disk}

<!-- maintenance note: OK to remove all mention of azureDisk once the v1.27 release of
Kubernetes has gone out of support -->

<!--
Kubernetes {{< skew currentVersion >}} does not include a `azureDisk` volume type.

The `azureDisk` in-tree storage driver was deprecated in the Kubernetes v1.19 release
and then removed entirely in the v1.27 release.
-->
Kubernetes {{< skew currentVersion >}} 不包含 `azureDisk` 卷類型。

`azureDisk` 樹內儲存驅動程式在 Kubernetes v1.19 版本中被棄用，並在 v1.27 版本中被完全移除。

<!--
The Kubernetes project suggests that you use the [Azure Disk](https://github.com/kubernetes-sigs/azuredisk-csi-driver) third party
storage driver instead.
-->
Kubernetes 項目建議你轉爲使用
[Azure Disk](https://github.com/kubernetes-sigs/azuredisk-csi-driver) 第三方儲存驅動程式。

<!--
### Azure File (deprecated) {#azure-file}
-->
### Azure 檔案（已棄用）  {#azure-file}

{{% code_sample language="yaml" file="storage/storageclass/storageclass-azure-file.yaml" %}}

<!--
- `skuName`: Azure storage account SKU tier. Default is empty.
- `location`: Azure storage account location. Default is empty.
- `storageAccount`: Azure storage account name. Default is empty. If a storage
  account is not provided, all storage accounts associated with the resource
  group are searched to find one that matches `skuName` and `location`. If a
  storage account is provided, it must reside in the same resource group as the
  cluster, and `skuName` and `location` are ignored.
- `secretNamespace`: the namespace of the secret that contains the Azure Storage
  Account Name and Key. Default is the same as the Pod.
- `secretName`: the name of the secret that contains the Azure Storage Account Name and
  Key. Default is `azure-storage-account-<accountName>-secret`
- `readOnly`: a flag indicating whether the storage will be mounted as read only.
  Defaults to false which means a read/write mount. This setting will impact the
  `ReadOnly` setting in VolumeMounts as well.
-->
- `skuName`：Azure 儲存帳戶 SKU 層。預設爲空。
- `location`：Azure 儲存帳戶位置。預設爲空。
- `storageAccount`：Azure 儲存帳戶名稱。預設爲空。
  如果不提供儲存帳戶，會搜索所有與資源相關的儲存帳戶，以找到一個匹配
  `skuName` 和 `location` 的賬號。
  如果提供儲存帳戶，它必須存在於與叢集相同的資源組中，`skuName` 和 `location` 會被忽略。
- `secretNamespace`：包含 Azure 儲存帳戶名稱和密鑰的密鑰的名字空間。
  預設值與 Pod 相同。
- `secretName`：包含 Azure 儲存帳戶名稱和密鑰的密鑰的名稱。
  預設值爲 `azure-storage-account-<accountName>-secret`
- `readOnly`：指示是否將儲存安裝爲只讀的標誌。預設爲 false，表示"讀/寫"掛載。
  該設置也會影響 VolumeMounts 中的 `ReadOnly` 設置。

<!--
During storage provisioning, a secret named by `secretName` is created for the
mounting credentials. If the cluster has enabled both
[RBAC](/docs/reference/access-authn-authz/rbac/) and
[Controller Roles](/docs/reference/access-authn-authz/rbac/#controller-roles),
add the `create` permission of resource `secret` for clusterrole
`system:controller:persistent-volume-binder`.
-->
在儲存製備期間，爲掛載憑證創建一個名爲 `secretName` 的 Secret。如果叢集同時啓用了
[RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/)
和[控制器角色](/zh-cn/docs/reference/access-authn-authz/rbac/#controller-roles)，
爲 `system:controller:persistent-volume-binder` 的 clusterrole 添加
`Secret` 資源的 `create` 權限。

<!--
In a multi-tenancy context, it is strongly recommended to set the value for
`secretNamespace` explicitly, otherwise the storage account credentials may
be read by other users.
-->
在多租戶上下文中，強烈建議顯式設置 `secretNamespace` 的值，否則其他使用者可能會讀取儲存帳戶憑據。

<!--
### Portworx volume (deprecated) {#portworx-volume}
-->
### Portworx 卷（已棄用）    {#portworx-volume}

{{% code_sample language="yaml" file="storage/storageclass/storageclass-portworx-volume.yaml" %}}

<!--
- `fs`: filesystem to be laid out: `none/xfs/ext4` (default: `ext4`).
- `block_size`: block size in Kbytes (default: `32`).
- `repl`: number of synchronous replicas to be provided in the form of
  replication factor `1..3` (default: `1`) A string is expected here i.e.
  `"1"` and not `1`.
- `priority_io`: determines whether the volume will be created from higher
  performance or a lower priority storage `high/medium/low` (default: `low`).
- `snap_interval`: clock/time interval in minutes for when to trigger snapshots.
  Snapshots are incremental based on difference with the prior snapshot, 0
  disables snaps (default: `0`). A string is expected here i.e.
  `"70"` and not `70`.
- `aggregation_level`: specifies the number of chunks the volume would be
  distributed into, 0 indicates a non-aggregated volume (default: `0`). A string
  is expected here i.e. `"0"` and not `0`
- `ephemeral`: specifies whether the volume should be cleaned-up after unmount
  or should be persistent. `emptyDir` use case can set this value to true and
  `persistent volumes` use case such as for databases like Cassandra should set
  to false, `true/false` (default `false`). A string is expected here i.e.
  `"true"` and not `true`.
-->
- `fs`：選擇的檔案系統：`none/xfs/ext4`（預設：`ext4`）。
- `block_size`：以 Kbytes 爲單位的塊大小（預設值：`32`）。
- `repl`：同步副本數量，以複製因子 `1..3`（預設值：`1`）的形式提供。
  這裏需要填寫字符串，即，`"1"` 而不是 `1`。
- `io_priority`：決定是否從更高性能或者較低優先級儲存創建卷
  `high/medium/low`（預設值：`low`）。
- `snap_interval`：觸發快照的時鐘/時間間隔（分鐘）。
  快照是基於與先前快照的增量變化，0 是禁用快照（預設：`0`）。
  這裏需要填寫字符串，即，是 `"70"` 而不是 `70`。
- `aggregation_level`：指定卷分配到的塊數量，0 表示一個非聚合卷（預設：`0`）。
  這裏需要填寫字符串，即，是 `"0"` 而不是 `0`。
- `ephemeral`：指定卷在卸載後進行清理還是持久化。
  `emptyDir` 的使用場景可以將這個值設置爲 true，
  `persistent volumes` 的使用場景可以將這個值設置爲 false
  （例如 Cassandra 這樣的資料庫）
  `true/false`（預設爲 `false`）。這裏需要填寫字符串，即，
  是 `"true"` 而不是 `true`。

<!--
### Local
-->
### 本地 {#local}

{{% code_sample language="yaml" file="storage/storageclass/storageclass-local.yaml" %}}

<!--
Local volumes do not support dynamic provisioning in Kubernetes {{< skew currentVersion >}};
however a StorageClass should still be created to delay volume binding until a Pod is actually
scheduled to the appropriate node. This is specified by the `WaitForFirstConsumer` volume
binding mode.
-->
在 Kubernetes {{< skew currentVersion >}} 中，本地卷還不支持動態製備；
然而還是需要創建 StorageClass 以延遲卷綁定，直到 Pod 被實際調度到合適的節點。
這是由 `WaitForFirstConsumer` 卷綁定模式指定的。

<!--
Delaying volume binding allows the scheduler to consider all of a Pod's
scheduling constraints when choosing an appropriate PersistentVolume for a
PersistentVolumeClaim.
-->
延遲卷綁定使得調度器在爲 PersistentVolumeClaim 選擇一個合適的
PersistentVolume 時能考慮到所有 Pod 的調度限制。
