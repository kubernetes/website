---
title: 卷快照
content_type: concept
weight: 40
---

<!--
title: Volume Snapshots
content_type: concept
weight: 40
-->

<!-- overview -->

{{< feature-state for_k8s_version="1.17" state="beta" >}}

<!--
In Kubernetes, a _VolumeSnapshot_ represents a snapshot of a volume on a storage system. This document assumes that you are already familiar with Kubernetes [persistent volumes](/docs/concepts/storage/persistent-volumes/).
-->
在 Kubernetes 中，卷快照是一個儲存系統上卷的快照，本文假設你已經熟悉了 Kubernetes
的 [持久卷](/zh-cn/docs/concepts/storage/persistent-volumes/)。

<!-- body -->

<!--
## Introduction
-->

## 介紹 {#introduction}

<!--
Similar to how API resources `PersistentVolume` and `PersistentVolumeClaim` are used to provision volumes for users and administrators, `VolumeSnapshotContent` and `VolumeSnapshot` API resources are provided to create volume snapshots for users and administrators.
-->
與 `PersistentVolume` 和 `PersistentVolumeClaim` 兩個 API 資源用於給使用者和管理員提供卷類似，`VolumeSnapshotContent` 和 `VolumeSnapshot` 兩個 API 資源用於給使用者和管理員建立卷快照。

<!--
A `VolumeSnapshotContent` is a snapshot taken from a volume in the cluster that has been provisioned by an administrator. It is a resource in the cluster just like a PersistentVolume is a cluster resource.
-->
`VolumeSnapshotContent` 是一種快照，從管理員已提供的叢集中的卷獲取。就像持久卷是叢集的資源一樣，它也是叢集中的資源。

<!--
A `VolumeSnapshot` is a request for snapshot of a volume by a user. It is similar to a PersistentVolumeClaim.
-->
`VolumeSnapshot` 是使用者對於卷的快照的請求。它類似於持久卷宣告。

<!--
`VolumeSnapshotClass` allows you to specify different attributes belonging to a `VolumeSnapshot`. These attributes may differ among snapshots taken from the same volume on the storage system and therefore cannot be expressed by using the same `StorageClass` of a `PersistentVolumeClaim`.
-->
`VolumeSnapshotClass` 允許指定屬於 `VolumeSnapshot` 的不同屬性。在從儲存系統的相同捲上獲取的快照之間，這些屬性可能有所不同，因此不能透過使用與 `PersistentVolumeClaim` 相同的 `StorageClass` 來表示。

<!--
Volume snapshots provide Kubernetes users with a standardized way to copy a volume's contents at a particular point in time without creating an entirely new volume. This functionality enables, for example, database administrators to backup databases before performing edit or delete modifications.
-->
卷快照能力為 Kubernetes 使用者提供了一種標準的方式來在指定時間點
複製卷的內容，並且不需要建立全新的卷。例如，這一功能使得資料庫管理員
能夠在執行編輯或刪除之類的修改之前對資料庫執行備份。

<!--
Users need to be aware of the following when using this feature:
-->
當使用該功能時，使用者需要注意以下幾點：

<!--
* API Objects `VolumeSnapshot`, `VolumeSnapshotContent`, and `VolumeSnapshotClass` are {{< glossary_tooltip term_id="CustomResourceDefinition" text="CRDs" >}}, not part of the core API.
* `VolumeSnapshot` support is only available for CSI drivers.
* As part of the deployment process of `VolumeSnapshot`, the Kubernetes team provides a snapshot controller to be deployed into the control plane, and a sidecar helper container called csi-snapshotter to be deployed together with the CSI driver.  The snapshot controller watches `VolumeSnapshot` and `VolumeSnapshotContent` objects and is responsible for the creation and deletion of `VolumeSnapshotContent` object.  The sidecar csi-snapshotter watches `VolumeSnapshotContent` objects and triggers `CreateSnapshot` and `DeleteSnapshot` operations against a CSI endpoint.
* There is also a validating webhook server which provides tightened validation on snapshot objects. This should be installed by the Kubernetes distros along with the snapshot controller and CRDs, not CSI drivers. It should be installed in all Kubernetes clusters that has the snapshot feature enabled.
* CSI drivers may or may not have implemented the volume snapshot functionality. The CSI drivers that have provided support for volume snapshot will likely use the csi-snapshotter. See [CSI Driver documentation](https://kubernetes-csi.github.io/docs/) for details.
* The CRDs and snapshot controller installations are the responsibility of the Kubernetes distribution.
-->
* API 物件 `VolumeSnapshot`，`VolumeSnapshotContent` 和 `VolumeSnapshotClass` 
  是 {{< glossary_tooltip term_id="CustomResourceDefinition" text="CRDs" >}}，
  不屬於核心 API。
* `VolumeSnapshot` 支援僅可用於 CSI 驅動。
* 作為 `VolumeSnapshot` 部署過程的一部分，Kubernetes 團隊提供了一個部署於控制平面的快照控制器，
  並且提供了一個叫做 `csi-snapshotter` 的邊車（Sidecar）輔助容器，和 CSI 驅動程式一起部署。
  快照控制器監視 `VolumeSnapshot` 和 `VolumeSnapshotContent` 物件，
  並且負責建立和刪除 `VolumeSnapshotContent` 物件。
  邊車 csi-snapshotter 監視 `VolumeSnapshotContent` 物件，
  並且觸發針對 CSI 端點的 `CreateSnapshot` 和 `DeleteSnapshot` 的操作。
* 還有一個驗證性質的 Webhook 伺服器，可以對快照物件進行更嚴格的驗證。 
  Kubernetes 發行版應將其與快照控制器和 CRD（而非 CSI 驅動程式）一起安裝。 
  此伺服器應該安裝在所有啟用了快照功能的 Kubernetes 叢集中。
* CSI 驅動可能實現，也可能沒有實現卷快照功能。CSI 驅動可能會使用 csi-snapshotter 
  來提供對卷快照的支援。詳見 [CSI 驅動程式文件](https://kubernetes-csi.github.io/docs/)
* Kubernetes 負責 CRDs 和快照控制器的安裝。

<!--
## Lifecycle of a volume snapshot and volume snapshot content

`VolumeSnapshotContents` are resources in the cluster. `VolumeSnapshots` are requests for those resources. The interaction between `VolumeSnapshotContents` and `VolumeSnapshots` follow this lifecycle:
-->
## 卷快照和卷快照內容的生命週期 {#lifecycle-of-a-volume-snapshot-and-volume-snapshot-content}

`VolumeSnapshotContents` 是叢集中的資源。`VolumeSnapshots` 是對於這些資源的請求。`VolumeSnapshotContents` 和 `VolumeSnapshots` 之間的互動遵循以下生命週期：

<!--
### Provisioning Volume Snapshot

There are two ways snapshots may be provisioned: pre-provisioned or dynamically provisioned.
-->
### 供應卷快照 {#provisioning-volume-snapshot}

快照可以透過兩種方式進行配置：預配置或動態配置。

<!--
#### Pre-provisioned {#static}
A cluster administrator creates a number of `VolumeSnapshotContents`. They carry the details of the real volume snapshot on the storage system which is available for use by cluster users. They exist in the Kubernetes API and are available for consumption.
-->
#### 預配置 {#static}
叢集管理員建立多個 `VolumeSnapshotContents`。它們帶有儲存系統上實際卷快照的詳細資訊，可以供叢集使用者使用。它們存在於 Kubernetes API 中，並且能夠被使用。

<!--
#### Dynamic

Instead of using a pre-existing snapshot, you can request that a snapshot to be dynamically taken from a PersistentVolumeClaim. The [VolumeSnapshotClass](/docs/concepts/storage/volume-snapshot-classes/) specifies storage provider-specific parameters to use when taking a snapshot.
-->
#### 動態的 {#dynamic}

可以從 `PersistentVolumeClaim` 中動態獲取快照，而不用使用已經存在的快照。
在獲取快照時，[卷快照類](/zh-cn/docs/concepts/storage/volume-snapshot-classes/)
指定要用的特定於儲存提供程式的引數。

<!--
### Binding

The snapshot controller handles the binding of a `VolumeSnapshot` object with an appropriate `VolumeSnapshotContent` object, in both pre-provisioned and dynamically provisioned scenarios. The binding is a one-to-one mapping.
-->
### 繫結 {#binding}

在預配置和動態配置場景下，快照控制器處理繫結 `VolumeSnapshot` 物件和其合適的 `VolumeSnapshotContent` 物件。繫結關係是一對一的。

<!--
In the case of pre-provisioned binding, the VolumeSnapshot will remain unbound until the requested VolumeSnapshotContent object is created.
-->
在預配置快照繫結場景下，`VolumeSnapshotContent` 物件建立之後，才會和 `VolumeSnapshot` 進行繫結。

<!--
### Persistent Volume Claim as Snapshot Source Protection

The purpose of this protection is to ensure that in-use
{{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}}
API objects are not removed from the system while a snapshot is being taken from it (as this may result in data loss).

-->
### 快照源的永續性卷宣告保護

這種保護的目的是確保在從系統中獲取快照時，不會將正在使用的
 {{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}} 
 API 物件從系統中刪除（因為這可能會導致資料丟失）。

<!--

While a snapshot is being taken of a PersistentVolumeClaim, that PersistentVolumeClaim is in-use. If you delete a PersistentVolumeClaim API object in active use as a snapshot source, the PersistentVolumeClaim object is not removed immediately. Instead, removal of the PersistentVolumeClaim object is postponed until the snapshot is readyToUse or aborted.
-->
如果一個 PVC 正在被快照用來作為源進行快照建立，則該 PVC 是使用中的。如果使用者刪除正作為快照源的 PVC API 物件，則 PVC 物件不會立即被刪除掉。相反，PVC 物件的刪除將推遲到任何快照不在主動使用它為止。當快照的 `Status` 中的 `ReadyToUse`值為 `true` 時，PVC 將不再用作快照源。

當從 `PersistentVolumeClaim` 中生成快照時，`PersistentVolumeClaim` 就在被使用了。如果刪除一個作為快照源的 `PersistentVolumeClaim` 物件，這個 `PersistentVolumeClaim` 物件不會立即被刪除的。相反，刪除 `PersistentVolumeClaim` 物件的動作會被放棄，或者推遲到快照的 Status 為 ReadyToUse時再執行。

<!--
### Delete

Deletion is triggered by deleting the `VolumeSnapshot` object, and the `DeletionPolicy` will be followed. If the `DeletionPolicy` is `Delete`, then the underlying storage snapshot will be deleted along with the `VolumeSnapshotContent` object. If the `DeletionPolicy` is `Retain`, then both the underlying snapshot and `VolumeSnapshotContent` remain.
-->
### 刪除 {#delete}

刪除 `VolumeSnapshot` 物件觸發刪除 `VolumeSnapshotContent` 操作，並且 `DeletionPolicy` 會緊跟著執行。如果 `DeletionPolicy` 是 `Delete`，那麼底層儲存快照會和 `VolumeSnapshotContent` 一起被刪除。如果 `DeletionPolicy` 是 `Retain`，那麼底層快照和 `VolumeSnapshotContent` 都會被保留。

<!--
## VolumeSnapshots

Each VolumeSnapshot contains a spec and a status.
-->
## 卷快照 {#volume-snapshots}

每個 `VolumeSnapshot` 包含一個 spec 和一個狀態。

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: new-snapshot-test
spec:
  volumeSnapshotClassName: csi-hostpath-snapclass
  source:
    persistentVolumeClaimName: pvc-test
```

<!--
`persistentVolumeClaimName` is the name of the PersistentVolumeClaim data source for the snapshot. This field is required for dynamically provisioning a snapshot.

A volume snapshot can request a particular class by specifying the name of a
[VolumeSnapshotClass](/docs/concepts/storage/volume-snapshot-classes/)
using the attribute `volumeSnapshotClassName`. If nothing is set, then the default class is used if available.
-->
`persistentVolumeClaimName` 是 `PersistentVolumeClaim` 資料來源對快照的名稱。
這個欄位是動態配置快照中的必填欄位。

卷快照可以透過指定 [VolumeSnapshotClass](/zh-cn/docs/concepts/storage/volume-snapshot-classes/)
使用 `volumeSnapshotClassName` 屬性來請求特定類。如果沒有設定，那麼使用預設類（如果有）。

<!--
For pre-provisioned snapshots, you need to specify a `volumeSnapshotContentName` as the source for the snapshot as shown in the following example. The `volumeSnapshotContentName` source field is required for pre-provisioned snapshots.
-->
如下面例子所示，對於預配置的快照，需要給快照指定 `volumeSnapshotContentName` 來作為源。
對於預配置的快照 `source` 中的`volumeSnapshotContentName` 欄位是必填的。

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: test-snapshot
spec:
  source:
    volumeSnapshotContentName: test-content
```

<!--
## Volume Snapshot Contents

Each VolumeSnapshot contains a spec and a status, which is the specification and status of the volume snapshot.
Each VolumeSnapshotContent contains a spec and status. In dynamic provisioning, the snapshot common controller creates `VolumeSnapshotContent` objects. Here is an example:
-->
每個 VolumeSnapshotContent 物件包含 spec 和 status。在動態配置時，快照通用控制器建立 `VolumeSnapshotContent` 物件。下面是例子：

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotContent
metadata:
  name: snapcontent-72d9a349-aacd-42d2-a240-d775650d2455
spec:
  deletionPolicy: Delete
  driver: hostpath.csi.k8s.io
  source:
    volumeHandle: ee0cfb94-f8d4-11e9-b2d8-0242ac110002
  sourceVolumeMode: Filesystem
  volumeSnapshotClassName: csi-hostpath-snapclass
  volumeSnapshotRef:
    name: new-snapshot-test
    namespace: default
    uid: 72d9a349-aacd-42d2-a240-d775650d2455
```

<!--
`volumeHandle` is the unique identifier of the volume created on the storage backend and returned by the CSI driver during the volume creation. This field is required for dynamically provisioning a snapshot. It specifies the volume source of the snapshot.

For pre-provisioned snapshots, you (as cluster administrator) are responsible for creating the `VolumeSnapshotContent` object as follows.
-->
`volumeHandle` 是儲存後端建立卷的唯一識別符號，在卷建立期間由 CSI 驅動程式返回。動態設定快照需要此欄位。它指出了快照的卷源。

對於預配置快照，你（作為叢集管理員）要按如下命令來建立 `VolumeSnapshotContent` 物件。

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotContent
metadata:
  name: new-snapshot-content-test
spec:
  deletionPolicy: Delete
  driver: hostpath.csi.k8s.io
  source:
    snapshotHandle: 7bdd0de3-aaeb-11e8-9aae-0242ac110002
  sourceVolumeMode: Filesystem
  volumeSnapshotRef:
    name: new-snapshot-test
    namespace: default
```
<!--
`snapshotHandle` is the unique identifier of the volume snapshot created on the storage backend. This field is required for the pre-provisioned snapshots. It specifies the CSI snapshot id on the storage system that this `VolumeSnapshotContent` represents.
-->
`snapshotHandle` 是儲存後端建立卷的唯一識別符號。對於預設定快照，這個欄位是必須的。它指定此 `VolumeSnapshotContent` 表示的儲存系統上的 CSI 快照 id。

<!--
`sourceVolumeMode` is the mode of the volume whose snapshot is taken. The value 
of the `sourceVolumeMode` field can be either `Filesystem` or `Block`. If the 
source volume mode is not specified, Kubernetes treats the snapshot as if the 
source volume's mode is unknown.
-->
`sourceVolumeMode` 是建立快照的卷的模式。`sourceVolumeMode` 欄位的值可以是
`Filesystem` 或 `Block`。如果沒有指定源卷模式，Kubernetes 會將快照視為未知的源卷模式。

<!--
## Converting the volume mode of a Snapshot {#convert-volume-mode}

If the `VolumeSnapshots` API installed on your cluster supports the `sourceVolumeMode`
field, then the API has the capability to prevent unauthorized users from converting
the mode of a volume.

To check if your cluster has capability for this feature, run the following command:
-->
## 轉換快照的卷模式 {#convert-volume-mode}

如果在你的叢集上安裝的 `VolumeSnapshots` API 支援 `sourceVolumeMode`
欄位，則該 API 可以防止未經授權的使用者轉換卷的模式。

要檢查你的叢集是否具有此特性的能力，可以執行如下命令：

```yaml
$ kubectl get crd volumesnapshotcontent -o yaml
```

<!--
If you want to allow users to create a `PersistentVolumeClaim` from an existing
`VolumeSnapshot`, but with a different volume mode than the source, the annotation
`snapshot.storage.kubernetes.io/allowVolumeModeChange: "true"`needs to be added to
the `VolumeSnapshotContent` that corresponds to the `VolumeSnapshot`.
-->
如果你希望允許使用者從現有的 `VolumeSnapshot` 建立 `PersistentVolumeClaim`，
但是使用與源卷不同的卷模式，則需要添加註解
`snapshot.storage.kubernetes.io/allowVolumeModeChange: "true"`
到對應 `VolumeSnapshot` 的 `VolumeSnapshotContent` 中。
<!--
For pre-provisioned snapshots, `Spec.SourceVolumeMode` needs to be populated
by the cluster administrator.

An example `VolumeSnapshotContent` resource with this feature enabled would look like:
-->
對於預配置的快照，`Spec.SourceVolumeMode` 需要由叢集管理員填充。

啟用此特性的 `VolumeSnapshotContent` 資源示例如下所示：

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotContent
metadata:
  name: new-snapshot-content-test
  annotations:
    - snapshot.storage.kubernetes.io/allowVolumeModeChange: "true"
spec:
  deletionPolicy: Delete
  driver: hostpath.csi.k8s.io
  source:
    snapshotHandle: 7bdd0de3-aaeb-11e8-9aae-0242ac110002
  sourceVolumeMode: Filesystem
  volumeSnapshotRef:
    name: new-snapshot-test
    namespace: default
```

<!--
## Provisioning Volumes from Snapshots
-->
## 從快照供應卷

<!--
You can provision a new volume, pre-populated with data from a snapshot, by using
the *dataSource* field in the `PersistentVolumeClaim` object.
-->
你可以配置一個新卷，該卷預填充了快照中的資料，在 `持久卷宣告` 物件中使用 *dataSource* 欄位。

<!--
For more details, see
[Volume Snapshot and Restore Volume from Snapshot](/docs/concepts/storage/persistent-volumes/#volume-snapshot-and-restore-volume-from-snapshot-support).
-->
更多詳細資訊，請參閱
[卷快照和從快照還原卷](/zh-cn/docs/concepts/storage/persistent-volumes/#volume-snapshot-and-restore-volume-from-snapshot-support)。
