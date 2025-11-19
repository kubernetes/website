---
layout: blog
title: "Kubernetes 1.27：介紹用於磁盤卷組快照的新 API"
date: 2023-05-08
slug: kubernetes-1-27-volume-group-snapshot-alpha
---
<!--
layout: blog
title: "Kubernetes 1.27: Introducing An API For Volume Group Snapshots"
date: 2023-05-08
slug: kubernetes-1-27-volume-group-snapshot-alpha
-->

**Author:** Xing Yang (VMware)

**譯者**: [顧欣](https://github.com/asa3311) 

<!--
Volume group snapshot is introduced as an Alpha feature in Kubernetes v1.27.
This feature introduces a Kubernetes API that allows users to take crash consistent
snapshots for multiple volumes together. It uses a label selector to group multiple
`PersistentVolumeClaims` for snapshotting.
This new feature is only supported for [CSI](https://kubernetes-csi.github.io/docs/) volume drivers.
-->
磁盤卷組快照在 Kubernetes v1.27 中作爲 Alpha 特性被引入。
此特性引入了一個 Kubernetes API，允許使用者對多個捲進行快照，以保證在發生故障時數據的一致性。
它使用標籤選擇器來將多個 `PersistentVolumeClaims` （持久卷申領）分組以進行快照。
這個新特性僅支持 CSI 卷驅動器。


<!--
## An overview of volume group snapshots

Some storage systems provide the ability to create a crash consistent snapshot of
multiple volumes. A group snapshot represents “copies” from multiple volumes that
are taken at the same point-in-time. A group snapshot can be used either to rehydrate
new volumes (pre-populated with the snapshot data) or to restore existing volumes to
a previous state (represented by the snapshots).
-->
## 磁盤卷組快照概述

一些存儲系統提供了創建多個卷的崩潰一致性快照的能力。
卷組快照表示在同一時間點從多個卷中生成的“副本”。
卷組快照可以用來重新填充新的卷（預先填充快照數據）或者將現有卷恢復到以前的狀態（由快照代表）。

<!--
## Why add volume group snapshots to Kubernetes?

The Kubernetes volume plugin system already provides a powerful abstraction that
automates the provisioning, attaching, mounting, resizing, and snapshotting of block
and file storage.
-->
## 爲什麼要在 Kubernetes 中添加捲組快照？

Kubernetes 的卷插件系統已經提供了一個強大的抽象層，
可以自動化塊存儲和文件存儲的製備、掛接、掛載、調整大小和快照等操作。

<!--
Underpinning all these features is the Kubernetes goal of workload portability:
Kubernetes aims to create an abstraction layer between distributed applications and
underlying clusters so that applications can be agnostic to the specifics of the
cluster they run on and application deployment requires no cluster specific knowledge.
-->
所有這些特性的出發點是 Kubernetes 對工作負載可移植性的目標：
Kubernetes 致力於在分佈式應用和底層叢集之間創建一個抽象層，
使應用可以對承載它們的叢集的特殊屬性無感，應用部署不需要特定於某叢集的知識。

<!--
There is already a [VolumeSnapshot](/docs/concepts/storage/volume-snapshots/) API
that provides the ability to take a snapshot of a persistent volume to protect against
data loss or data corruption. However, there are other snapshotting functionalities
not covered by the VolumeSnapshot API.
-->
Kubernetes 已經提供了一個 [VolumeSnapshot](/zh-cn/docs/concepts/storage/volume-snapshots/) API，
這個 API 提供對持久性捲進行快照的能力，可用於防止數據丟失或數據損壞。然而，
還有一些其他的快照功能並未被 VolumeSnapshot API 所覆蓋。

<!--
Some storage systems support consistent group snapshots that allow a snapshot to be
taken from multiple volumes at the same point-in-time to achieve write order consistency.
This can be useful for applications that contain multiple volumes. For example,
an application may have data stored in one volume and logs stored in another volume.
If snapshots for the data volume and the logs volume are taken at different times,
the application will not be consistent and will not function properly if it is restored
from those snapshots when a disaster strikes.
-->
一些存儲系統支持一致性的卷組快照，允許在同一時間點在多個捲上生成快照，以實現寫入順序的一致性。
這對於包含多個卷的應用非常有用。例如，應用可能在一個卷中存儲數據，在另一個卷中存儲日誌。
如果數據卷和日誌卷的快照在不同的時間點進行，應用將不會保持一致，
當災難發生時從這些快照中恢復，應用將無法正常工作。

<!--
It is true that you can quiesce the application first, take an individual snapshot from
each volume that is part of the application one after the other, and then unquiesce the
application after all the individual snapshots are taken. This way, you would get
application consistent snapshots.
-->
確實，你可以首先使應用靜默，然後依次爲構成應用的每個卷中生成一個獨立的快照，
等所有的快照都已逐個生成後，再取消應用的靜止狀態。這樣你就可以得到應用一致性的快照。

<!--
However, sometimes it may not be possible to quiesce an application or the application
quiesce can be too expensive so you want to do it less frequently. Taking individual
snapshots one after another may also take longer time compared to taking a consistent
group snapshot. Some users may not want to do application quiesce very often for these
reasons. For example, a user may want to run weekly backups with application quiesce
and nightly backups without application quiesce but with consistent group support which
provides crash consistency across all volumes in the group.
-->
然而，有時可能無法使應用靜默，或者使應用靜默的代價過高，因此你希望較少地進行這個操作。
相較於生成一致性的卷組快照，依次生成單個快照可能需要更長的時間。
由於這些原因，有些使用者可能不希望經常使應用靜默。例如，
使用者可能希望每週進行一次需要應用靜默的備份，而在每晚進行不需應用靜默但帶有卷組一致性支持的備份，
這種一致性支持將確保組中所有卷的崩潰一致性。

<!--
## Kubernetes Volume Group Snapshots API

Kubernetes Volume Group Snapshots introduce [three new API
objects](https://github.com/kubernetes-csi/external-snapshotter/blob/master/client/apis/volumegroupsnapshot/v1alpha1/types.go)
for managing snapshots:
-->
## Kubernetes 卷組快照 API

Kubernetes 卷組快照引入了
[三個新的 API 對象](https://github.com/kubernetes-csi/external-snapshotter/blob/master/client/apis/volumegroupsnapshot/v1alpha1/types.go)
用於管理快照：

<!--
`VolumeGroupSnapshot`
: Created by a Kubernetes user (or perhaps by your own automation) to request
creation of a volume group snapshot for multiple persistent volume claims.
It contains information about the volume group snapshot operation such as the
timestamp when the volume group snapshot was taken and whether it is ready to use.
The creation and deletion of this object represents a desire to create or delete a
cluster resource (a group snapshot).
-->
`VolumeGroupSnapshot`：由 Kubernetes 使用者（或由你的自動化系統）創建，
以請求爲多個持久卷申領創建卷組快照。它包含了關於卷組快照操作的信息，
如卷組快照的生成時間戳以及是否可直接使用。
此對象的創建和刪除代表了創建或刪除叢集資源（一個卷組快照）的意願。

<!--
`VolumeGroupSnapshotContent`
: Created by the snapshot controller for a dynamically created VolumeGroupSnapshot.
It contains information about the volume group snapshot including the volume group
snapshot ID.
This object represents a provisioned resource on the cluster (a group snapshot).
The VolumeGroupSnapshotContent object binds to the VolumeGroupSnapshot for which it
was created with a one-to-one mapping.
-->
`VolumeGroupSnapshotContent`：由快照控制器動態生成的 VolumeGroupSnapshot 所創建。
它包含了關於卷組快照的信息，包括卷組快照 ID。此對象代表了叢集上製備的一個資源（一個卷組快照）。 
VolumeGroupSnapshotContent 對象與其創建時所對應的 VolumeGroupSnapshot 之間存在一對一的映射。

<!--
`VolumeGroupSnapshotClass`
: Created by cluster administrators to describe how volume group snapshots should be
created. including the driver information, the deletion policy, etc.

These three API kinds are defined as CustomResourceDefinitions (CRDs).
These CRDs must be installed in a Kubernetes cluster for a CSI Driver to support
volume group snapshots.
-->
`VolumeGroupSnapshotClass`：由叢集管理員創建，用來描述如何創建卷組快照，
包括驅動程序信息、刪除策略等。

這三種 API 類型被定義爲自定義資源（CRD）。
這些 CRD 必須在 Kubernetes 叢集中安裝，以便 CSI 驅動程序支持卷組快照。

<!--
## How do I use Kubernetes Volume Group Snapshots

Volume group snapshots are implemented in the
[external-snapshotter](https://github.com/kubernetes-csi/external-snapshotter) repository. Implementing volume
group snapshots meant adding or changing several components:
-->
## 如何使用 Kubernetes 卷組快照

卷組快照是在 [external-snapshotter](https://github.com/kubernetes-csi/external-snapshotter)
倉庫中實現的。實現卷組快照意味着添加或更改幾個組件：

<!--
* Added new CustomResourceDefinitions for VolumeGroupSnapshot and two supporting APIs.
* Volume group snapshot controller logic is added to the common snapshot controller.
* Volume group snapshot validation webhook logic is added to the common snapshot validation webhook.
* Adding logic to make CSI calls into the snapshotter sidecar controller.
-->
* 添加了新的 CustomResourceDefinition 用於 VolumeGroupSnapshot 和兩個輔助性 API。
* 向通用快照控制器中添加捲組快照控制器的邏輯。
* 向通用快照驗證 webhook 中添加捲組快照驗證 webhook 的邏輯。
* 添加邏輯以便在快照 sidecar 控制器中進行 CSI 調用。

<!--
The volume snapshot controller, CRDs, and validation webhook are deployed once per
cluster, while the sidecar is bundled with each CSI driver.

Therefore, it makes sense to deploy the volume snapshot controller, CRDs, and validation
webhook as a cluster addon. I strongly recommend that Kubernetes distributors
bundle and deploy the volume snapshot controller, CRDs, and validation webhook as part
of their Kubernetes cluster management process (independent of any CSI Driver).
-->
每個叢集只部署一次卷快照控制器、CRD 和驗證 webhook，
而 sidecar 則與每個 CSI 驅動程序一起打包。

因此，將卷快照控制器、CRD 和驗證 webhook 作爲叢集插件部署是合理的。
我強烈建議 Kubernetes 發行版的廠商將卷快照控制器、
CRD 和驗證 webhook 打包並作爲他們的 Kubernetes 叢集管理過程的一部分（獨立於所有 CSI 驅動）。

<!--
### Creating a new group snapshot with Kubernetes

Once a VolumeGroupSnapshotClass object is defined and you have volumes you want to
snapshot together, you may request a new group snapshot by creating a VolumeGroupSnapshot
object.
-->
### 使用 Kubernetes 創建新的卷組快照

一旦定義了一個 VolumeGroupSnapshotClass 對象，並且你有想要一起生成快照的卷，
就可以通過創建一個 VolumeGroupSnapshot 對象來請求一個新的卷組快照。

<!--
The source of the group snapshot specifies whether the underlying group snapshot
should be dynamically created or if a pre-existing VolumeGroupSnapshotContent
should be used.

A pre-existing VolumeGroupSnapshotContent is created by a cluster administrator.
It contains the details of the real volume group snapshot on the storage system which
is available for use by cluster users.
-->
卷組快照的源指定了底層的卷組快照是應該動態創建，
還是應該使用預先存在的 VolumeGroupSnapshotContent。

預先存在的 VolumeGroupSnapshotContent 由叢集管理員創建。
其中包含了在存儲系統上實際卷組快照的細節，這些卷組快照可供叢集使用者使用。

<!--
One of the following members in the source of the group snapshot must be set.

* `selector` - a label query over PersistentVolumeClaims that are to be grouped
  together for snapshotting. This labelSelector will be used to match the label
  added to a PVC.
* `volumeGroupSnapshotContentName` - specifies the name of a pre-existing
  VolumeGroupSnapshotContent object representing an existing volume group snapshot.

In the following example, there are two PVCs.
-->
在卷組快照源中，必須設置以下成員之一。

* `selector` - 針對要一起生成快照的 PersistentVolumeClaims 的標籤查詢。
  該 labelSelector 將用於匹配添加到 PVC 上的標籤。
* `volumeGroupSnapshotContentName` - 指定一個現有的 VolumeGroupSnapshotContent 
  對象的名稱，該對象代表着一個已存在的卷組快照。 

在以下示例中，有兩個 PVC。

```console
NAME        STATUS    VOLUME                                     CAPACITY   ACCESSMODES   AGE
pvc-0       Bound     pvc-a42d7ea2-e3df-11ed-b5ea-0242ac120002   1Gi        RWO           48s
pvc-1       Bound     pvc-a42d81b8-e3df-11ed-b5ea-0242ac120002   1Gi        RWO           48s
```

<!--
Label the PVCs.
-->
標記 PVC。

```console
% kubectl label pvc pvc-0 group=myGroup
persistentvolumeclaim/pvc-0 labeled

% kubectl label pvc pvc-1 group=myGroup
persistentvolumeclaim/pvc-1 labeled
```

<!--
For dynamic provisioning, a selector must be set so that the snapshot controller can
find PVCs with the matching labels to be snapshotted together.
-->
對於動態製備，必須設置一個選擇算符，以便快照控制器可以找到帶有匹配標籤的 PVC，一起進行快照。

```yaml
apiVersion: groupsnapshot.storage.k8s.io/v1alpha1
kind: VolumeGroupSnapshot
metadata:
  name: new-group-snapshot-demo
  namespace: demo-namespace
spec:
  volumeGroupSnapshotClassName: csi-groupSnapclass
  source:
    selector:
      matchLabels:
        group: myGroup
```

<!--
In the VolumeGroupSnapshot spec, a user can specify the VolumeGroupSnapshotClass which
has the information about which CSI driver should be used for creating the group snapshot.

Two individual volume snapshots will be created as part of the volume group snapshot creation.
-->
在 VolumeGroupSnapshot 的規約中，使用者可以指定 VolumeGroupSnapshotClass，
其中包含應使用哪個 CSI 驅動程序來創建卷組快照的信息。

作爲創建卷組快照的一部分，將創建兩個單獨的卷快照。

```console
snapshot-62abb5db7204ac6e4c1198629fec533f2a5d9d60ea1a25f594de0bf8866c7947-2023-04-26-2.20.4
snapshot-2026811eb9f0787466171fe189c805a22cdb61a326235cd067dc3a1ac0104900-2023-04-26-2.20.4
```

<!--
### How to use group snapshot for restore in Kubernetes

At restore time, the user can request a new PersistentVolumeClaim to be created from
a VolumeSnapshot object that is part of a VolumeGroupSnapshot. This will trigger
provisioning of a new volume that is pre-populated with data from the specified
snapshot. The user should repeat this until all volumes are created from all the
snapshots that are part of a group snapshot.
-->
### 如何在 Kubernetes 中使用卷組快照進行恢復

在恢復時，使用者可以請求某 VolumeGroupSnapshot 的一部分，即某個 VolumeSnapshot 對象，
創建一個新的 PersistentVolumeClaim。這將觸發新卷的製備過程，
並使用指定快照中的數據進行預填充。使用者應該重複此步驟，直到爲卷組快照的所有部分創建了所有卷。

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc0-restore
  namespace: demo-namespace
spec:
  storageClassName: csi-hostpath-sc
  dataSource:
    name: snapshot-62abb5db7204ac6e4c1198629fec533f2a5d9d60ea1a25f594de0bf8866c7947-2023-04-26-2.20.4
    kind: VolumeSnapshot
    apiGroup: snapshot.storage.k8s.io
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```

<!--
## As a storage vendor, how do I add support for group snapshots to my CSI driver?

To implement the volume group snapshot feature, a CSI driver **must**:

* Implement a new group controller service.
* Implement group controller RPCs: `CreateVolumeGroupSnapshot`, `DeleteVolumeGroupSnapshot`, and `GetVolumeGroupSnapshot`.
* Add group controller capability `CREATE_DELETE_GET_VOLUME_GROUP_SNAPSHOT`.
-->
## 作爲一個存儲供應商，我應該如何爲我的 CSI 驅動程序添加對卷組快照的支持？

要實現卷組快照功能，CSI 驅動**必須**：

* 實現一個新的組控制器服務。
* 實現組控制器的 RPC：`CreateVolumeGroupSnapshot`，`DeleteVolumeGroupSnapshot` 和 `GetVolumeGroupSnapshot`。
* 添加組控制器的特性 `CREATE_DELETE_GET_VOLUME_GROUP_SNAPSHOT`。

<!--
See the [CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md)
and the [Kubernetes-CSI Driver Developer Guide](https://kubernetes-csi.github.io/docs/)
for more details.

a CSI Volume Driver as possible, it provides a suggested mechanism to deploy a
containerized CSI driver to simplify the process.
-->
更多詳情請參閱 
[CSI規範](https://github.com/container-storage-interface/spec/blob/master/spec.md) 
和 [Kubernetes-CSI驅動程序開發指南](https://kubernetes-csi.github.io/docs/)。

對於 CSI 卷驅動程序，它提供了一種建議採用的機制來部署容器化的 CSI 驅動程序以簡化流程。

<!--
As part of this recommended deployment process, the Kubernetes team provides a number of
sidecar (helper) containers, including the
[external-snapshotter sidecar container](https://kubernetes-csi.github.io/docs/external-snapshotter.html)
which has been updated to support volume group snapshot.
-->
作爲所推薦的部署過程的一部分，Kubernetes 團隊提供了許多 sidecar（輔助）容器，
包括已經更新以支持卷組快照的 
[external-snapshotter](https://kubernetes-csi.github.io/docs/external-snapshotter.html) 
sidecar 容器。

<!--
The external-snapshotter watches the Kubernetes API server for the
`VolumeGroupSnapshotContent` object and triggers `CreateVolumeGroupSnapshot` and
`DeleteVolumeGroupSnapshot` operations against a CSI endpoint.
-->
external-snapshotter 會監聽 Kubernetes API 伺服器上的 `VolumeGroupSnapshotContent` 對象，
並對 CSI 端點觸發 `CreateVolumeGroupSnapshot` 和 `DeleteVolumeGroupSnapshot` 操作。

<!--
## What are the limitations?

The alpha implementation of volume group snapshots for Kubernetes has the following
limitations:

* Does not support reverting an existing PVC to an earlier state represented by
  a snapshot (only supports provisioning a new volume from a snapshot).
* No application consistency guarantees beyond any guarantees provided by the storage system
  (e.g. crash consistency). See this [doc](https://github.com/kubernetes/community/blob/master/wg-data-protection/data-protection-workflows-white-paper.md#quiesce-and-unquiesce-hooks)
  for more discussions on application consistency.
-->
## 有哪些限制？

Kubernetes 的卷組快照的 Alpha 版本具有以下限制：

* 不支持將現有的 PVC 還原到由快照表示的較早狀態（僅支持從快照創建新的卷）。
* 除了存儲系統提供的保證（例如崩潰一致性）之外，不提供應用一致性保證。
  請參閱此[文檔](https://github.com/kubernetes/community/blob/master/wg-data-protection/data-protection-workflows-white-paper.md#quiesce-and-unquiesce-hooks)，
  瞭解有關應用一致性的更多討論。

<!--
## What’s next?

Depending on feedback and adoption, the Kubernetes team plans to push the CSI
Group Snapshot implementation to Beta in either 1.28 or 1.29.
Some of the features we are interested in supporting include volume replication,
replication group, volume placement, application quiescing, changed block tracking, and more.
-->
## 下一步是什麼？

根據反饋和採用情況，Kubernetes 團隊計劃在 1.28 或 1.29 版本中將 CSI 卷組快照實現推進到 Beta 階段。
我們有興趣支持的一些功能包括卷複製、複製組、卷位置選擇、應用靜默、變更塊跟蹤等等。

<!--
## How can I learn more?

- The [design spec](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/3476-volume-group-snapshot)
  for the volume group snapshot feature.
- The [code repository](https://github.com/kubernetes-csi/external-snapshotter) for volume group
  snapshot APIs and controller.
- CSI [documentation](https://kubernetes-csi.github.io/docs/) on the group snapshot feature.
-->
## 如何獲取更多信息？

- 有關卷組快照功能的[設計規約](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/3476-volume-group-snapshot)。
- 卷組快照 API 和控制器的[代碼倉庫](https://github.com/kubernetes-csi/external-snapshotter)。
- CSI 關於卷組快照功能的[文檔](https://kubernetes-csi.github.io/docs/)。

<!--
## How do I get involved?

This project, like all of Kubernetes, is the result of hard work by many contributors
from diverse backgrounds working together. On behalf of SIG Storage, I would like to
offer a huge thank you to the contributors who stepped up these last few quarters
to help the project reach alpha:
-->
## 如何參與其中？

這個項目，就像 Kubernetes 的所有項目一樣，是許多不同背景的貢獻者共同努力的結果。
我代表 SIG Storage，
向在過去幾個季度中積極參與項目並幫助項目達到 Alpha 版本的貢獻者們表示衷心的感謝：

<!--
* Alex Meade ([ameade](https://github.com/ameade))
* Ben Swartzlander ([bswartz](https://github.com/bswartz))
* Humble Devassy Chirammal ([humblec](https://github.com/humblec))
* James Defelice ([jdef](https://github.com/jdef))
* Jan Šafránek ([jsafrane](https://github.com/jsafrane))
* Jing Xu ([jingxu97](https://github.com/jingxu97))
* Michelle Au ([msau42](https://github.com/msau42))
* Niels de Vos ([nixpanic](https://github.com/nixpanic))
* Rakshith R ([Rakshith-R](https://github.com/Rakshith-R))
* Raunak Shah ([RaunakShah](https://github.com/RaunakShah))
* Saad Ali ([saad-ali](https://github.com/saad-ali))
* Thomas Watson ([rbo54](https://github.com/rbo54))
* Xing Yang ([xing-yang](https://github.com/xing-yang))
* Yati Padia ([yati1998](https://github.com/yati1998))
-->
* Alex Meade ([ameade](https://github.com/ameade))
* Ben Swartzlander ([bswartz](https://github.com/bswartz))
* Humble Devassy Chirammal ([humblec](https://github.com/humblec))
* James Defelice ([jdef](https://github.com/jdef))
* Jan Šafránek ([jsafrane](https://github.com/jsafrane))
* Jing Xu ([jingxu97](https://github.com/jingxu97))
* Michelle Au ([msau42](https://github.com/msau42))
* Niels de Vos ([nixpanic](https://github.com/nixpanic))
* Rakshith R ([Rakshith-R](https://github.com/Rakshith-R))
* Raunak Shah ([RaunakShah](https://github.com/RaunakShah))
* Saad Ali ([saad-ali](https://github.com/saad-ali))
* Thomas Watson ([rbo54](https://github.com/rbo54))
* Xing Yang ([xing-yang](https://github.com/xing-yang))
* Yati Padia ([yati1998](https://github.com/yati1998))

<!--
We also want to thank everyone else who has contributed to the project, including others 
who helped review the [KEP](https://github.com/kubernetes/enhancements/pull/1551)
and the [CSI spec PR](https://github.com/container-storage-interface/spec/pull/519).

For those interested in getting involved with the design and development of CSI or
any part of the Kubernetes Storage system, join the
[Kubernetes Storage Special Interest Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG).
We always welcome new contributors.

We also hold regular [Data Protection Working Group meetings](https://docs.google.com/document/d/15tLCV3csvjHbKb16DVk-mfUmFry_Rlwo-2uG6KNGsfw/edit#).
New attendees are welcome to join our discussions.
-->
我們還要感謝其他爲該項目做出貢獻的人，
包括幫助審覈 [KEP](https://github.com/kubernetes/enhancements/pull/1551)和 
[CSI 規約 PR](https://github.com/container-storage-interface/spec/pull/519)的其他人員。

對於那些對參與 CSI 設計和開發或 Kubernetes 存儲系統感興趣的人，
歡迎加入 [Kubernetes存儲特別興趣小組](https://github.com/kubernetes/community/tree/master/sig-storage)（SIG）。
我們隨時歡迎新的貢獻者。

我們還定期舉行[數據保護工作組會議](https://docs.google.com/document/d/15tLCV3csvjHbKb16DVk-mfUmFry_Rlwo-2uG6KNGsfw/edit#)。
歡迎新的與會者加入我們的討論。
