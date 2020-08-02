---
title: 卷快照
content_type: concept
weight: 20
---

<!--
title: Volume Snapshots
content_type: concept
weight: 20
-->

<!-- overview -->

{{< feature-state for_k8s_version="1.17" state="beta" >}}

<!--
In Kubernetes, a _VolumeSnapshot_ represents a snapshot of a volume on a storage system. This document assumes that you are already familiar with Kubernetes [persistent volumes](/docs/concepts/storage/persistent-volumes/).
-->
在 Kubernetes 中，卷快照是一个存储系统上卷的快照，本文假设你已经熟悉了 Kubernetes
的 [持久卷](/zh/docs/concepts/storage/persistent-volumes/)。

<!-- body -->

<!--
## Introduction
-->

## 介绍 {#introduction}

<!--
Similar to how API resources `PersistentVolume` and `PersistentVolumeClaim` are used to provision volumes for users and administrators, `VolumeSnapshotContent` and `VolumeSnapshot` API resources are provided to create volume snapshots for users and administrators.
-->
与 `PersistentVolume` 和 `PersistentVolumeClaim` 两个 API 资源用于给用户和管理员提供卷类似，`VolumeSnapshotContent` 和 `VolumeSnapshot` 两个 API 资源用于给用户和管理员创建卷快照。

<!--
A `VolumeSnapshotContent` is a snapshot taken from a volume in the cluster that has been provisioned by an administrator. It is a resource in the cluster just like a PersistentVolume is a cluster resource.
-->
`VolumeSnapshotContent` 是一种快照，从管理员已提供的集群中的卷获取。就像持久卷是集群的资源一样，它也是集群中的资源。

<!--
A `VolumeSnapshot` is a request for snapshot of a volume by a user. It is similar to a PersistentVolumeClaim.
-->
`VolumeSnapshot` 是用户对于卷的快照的请求。它类似于持久卷声明。

<!--
`VolumeSnapshotClass` allows you to specify different attributes belonging to a `VolumeSnapshot`. These attibutes may differ among snapshots taken from the same volume on the storage system and therefore cannot be expressed by using the same `StorageClass` of a `PersistentVolumeClaim`.
-->
`VolumeSnapshotClass` 允许指定属于 `VolumeSnapshot` 的不同属性。在从存储系统的相同卷上获取的快照之间，这些属性可能有所不同，因此不能通过使用与 `PersistentVolumeClaim` 相同的 `StorageClass` 来表示。

<!--
Users need to be aware of the following when using this feature:
-->
当使用该功能时，用户需要注意以下几点：

<!--
* API Objects `VolumeSnapshot`, `VolumeSnapshotContent`, and `VolumeSnapshotClass` are {{< glossary_tooltip term_id="CustomResourceDefinition" text="CRDs" >}}, not part of the core API.
* `VolumeSnapshot` support is only available for CSI drivers.
* As part of the deployment process in the beta version of `VolumeSnapshot`, the Kubernetes team provides a snapshot controller to be deployed into the control plane, and a sidecar helper container called csi-snapshotter to be deployed together with the CSI driver.  The snapshot controller watches `VolumeSnapshot` and `VolumeSnapshotContent` objects and is responsible for the creation and deletion of `VolumeSnapshotContent` object in dynamic provisioning.  The sidecar csi-snapshotter watches `VolumeSnapshotContent` objects and triggers `CreateSnapshot` and `DeleteSnapshot` operations against a CSI endpoint.
* CSI drivers may or may not have implemented the volume snapshot functionality. The CSI drivers that have provided support for volume snapshot will likely use the csi-snapshotter. See [CSI Driver documentation](https://kubernetes-csi.github.io/docs/) for details.
* The CRDs and snapshot controller installations are the responsibility of the Kubernetes distribution.
-->
* API 对象 `VolumeSnapshot`，`VolumeSnapshotContent` 和 `VolumeSnapshotClass` 是 {{< glossary_tooltip term_id="CustomResourceDefinition" text="CRDs" >}}，不是核心 API 的部分。
* `VolumeSnapshot` 支持仅可用于 CSI 驱动。
* 作为 beta 版本 `VolumeSnapshot` 部署过程的一部分，Kubernetes 团队提供了一个部署于控制平面的快照控制器，并且提供了一个叫做 `csi-snapshotter` 的 sidecar 帮助容器，它和 CSI 驱动程序部署在一起。快照控制器监视 `VolumeSnapshot` 和 `VolumeSnapshotContent` 对象，并且负责动态的创建和删除 `VolumeSnapshotContent` 对象。sidecar csi-snapshotter 监视 `VolumeSnapshotContent` 对象，并且触发针对 CSI 端点的 `CreateSnapshot` 和 `DeleteSnapshot` 的操作。
* CSI 驱动可能实现，也可能没有实现卷快照功能。CSI 驱动可能会使用 csi-snapshotter 来提供对卷快照的支持。详见 [CSI 驱动程序文档](https://kubernetes-csi.github.io/docs/)
* Kubernetes 负责 CRDs 和快照控制器的安装。

<!--
## Lifecycle of a volume snapshot and volume snapshot content

`VolumeSnapshotContents` are resources in the cluster. `VolumeSnapshots` are requests for those resources. The interaction between `VolumeSnapshotContents` and `VolumeSnapshots` follow this lifecycle:
-->
## 卷快照和卷快照内容的生命周期 {#lifecycle-of-a-volume-snapshot-and-volume-snapshot-content}

`VolumeSnapshotContents` 是集群中的资源。`VolumeSnapshots` 是对于这些资源的请求。`VolumeSnapshotContents` 和 `VolumeSnapshots` 之间的交互遵循以下生命周期：

<!--
### Provisioning Volume Snapshot

There are two ways snapshots may be provisioned: pre-provisioned or dynamically provisioned.
-->
### 供应卷快照 {#provisioning-volume-snapshot}

快照可以通过两种方式进行配置：预配置或动态配置。

<!--
#### Pre-provisioned {#static}
A cluster administrator creates a number of `VolumeSnapshotContents`. They carry the details of the real volume snapshot on the storage system which is available for use by cluster users. They exist in the Kubernetes API and are available for consumption.
-->
#### 预配置 {#static}
集群管理员创建多个 `VolumeSnapshotContents`。它们带有存储系统上实际卷快照的详细信息，可以供集群用户使用。它们存在于 Kubernetes API 中，并且能够被使用。

<!--
#### Dynamic

Instead of using a pre-existing snapshot, you can request that a snapshot to be dynamically taken from a PersistentVolumeClaim. The [VolumeSnapshotClass](/docs/concepts/storage/volume-snapshot-classes/) specifies storage provider-specific parameters to use when taking a snapshot.
-->
#### 动态的 {#dynamic}

可以从 `PersistentVolumeClaim` 中动态获取快照，而不用使用已经存在的快照。
在获取快照时，[卷快照类](/zh/docs/concepts/storage/volume-snapshot-classes/)
指定要用的特定于存储提供程序的参数。

<!--
### Binding

The snapshot controller handles the binding of a `VolumeSnapshot` object with an appropriate `VolumeSnapshotContent` object, in both pre-provisioned and dynamically provisioned scenarios. The binding is a one-to-one mapping.
-->
### 绑定 {#binding}

在预配置和动态配置场景下，快照控制器处理绑定 `VolumeSnapshot` 对象和其合适的 `VolumeSnapshotContent` 对象。绑定关系是一对一的。

<!--
In the case of pre-provisioned binding, the VolumeSnapshot will remain unbound until the requested VolumeSnapshotContent object is created.
-->
在预配置快照绑定场景下，`VolumeSnapshotContent` 对象创建之后，才会和 `VolumeSnapshot` 进行绑定。

<!--
### Persistent Volume Claim as Snapshot Source Protection

The purpose of the Persistent Volume Claim Object in Use Protection feature is to ensure that in-use PVC API objects are not removed from the system (as this may result in data loss).

The purpose of this protection is to ensure that in-use PersistentVolumeClaim API objects are not removed from the system while a snapshot is being taken from it (as this may result in data loss).
-->
### 快照源的持久性卷声明保护

这种保护的目的是确保在从系统中获取快照时，不会将正在使用的 `PersistentVolumeClaim` API 对象从系统中删除（因为这可能会导致数据丢失）。

<!--

While a snapshot is being taken of a PersistentVolumeClaim, that PersistentVolumeClaim is in-use. If you delete a PersistentVolumeClaim API object in active use as a snapshot source, the PersistentVolumeClaim object is not removed immediately. Instead, removal of the PersistentVolumeClaim object is postponed until the snapshot is readyToUse or aborted.
-->
如果一个 PVC 正在被快照用来作为源进行快照创建，则该 PVC 是使用中的。如果用户删除正作为快照源的 PVC API 对象，则 PVC 对象不会立即被删除掉。相反，PVC 对象的删除将推迟到任何快照不在主动使用它为止。当快照的 `Status` 中的 `ReadyToUse`值为 `true` 时，PVC 将不再用作快照源。

当从 `PersistentVolumeClaim` 中生成快照时，`PersistentVolumeClaim` 就在被使用了。如果删除一个作为快照源的 `PersistentVolumeClaim` 对象，这个 `PersistentVolumeClaim` 对象不会立即被删除的。相反，删除 `PersistentVolumeClaim` 对象的动作会被放弃，或者推迟到快照的 Status 为 ReadyToUse时再执行。

<!--
### Delete

Deletion is triggered by deleting the `VolumeSnapshot` object, and the `DeletionPolicy` will be followed. If the `DeletionPolicy` is `Delete`, then the underlying storage snapshot will be deleted along with the `VolumeSnapshotContent` object. If the `DeletionPolicy` is `Retain`, then both the underlying snapshot and `VolumeSnapshotContent` remain.
-->
### 删除 {#delete}

删除 `VolumeSnapshot` 对象触发删除 `VolumeSnapshotContent` 操作，并且 `DeletionPolicy` 会紧跟着执行。如果 `DeletionPolicy` 是 `Delete`，那么底层存储快照会和 `VolumeSnapshotContent` 一起被删除。如果 `DeletionPolicy` 是 `Retain`，那么底层快照和 `VolumeSnapshotContent` 都会被保留。

<!--
## VolumeSnapshots

Each VolumeSnapshot contains a spec and a status.
-->
## 卷快照 {#volume-snapshots}

每个 `VolumeSnapshot` 包含一个 spec 和一个状态。

```yaml
apiVersion: snapshot.storage.k8s.io/v1beta1
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
`persistentVolumeClaimName` 是 `PersistentVolumeClaim` 数据源对快照的名称。这个字段是动态配置快照中的必填字段。

卷快照可以通过指定 [VolumeSnapshotClass](/zh/docs/concepts/storage/volume-snapshot-classes/)
使用 `volumeSnapshotClassName` 属性来请求特定类。如果没有设置，那么使用默认类（如果有）。

<!--
For pre-provisioned snapshots, you need to specify a `volumeSnapshotContentName` as the source for the snapshot as shown in the following example. The `volumeSnapshotContentName` source field is required for pre-provisioned snapshots.
-->
如下面例子所示，对于预配置的快照，需要给快照指定 `volumeSnapshotContentName` 来作为源。
对于预配置的快照 `source` 中的`volumeSnapshotContentName` 字段是必填的。

```
apiVersion: snapshot.storage.k8s.io/v1beta1
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
每个 VolumeSnapshotContent 对象包含 spec 和 status。在动态配置时，快照通用控制器创建 `VolumeSnapshotContent` 对象。下面是例子：

```yaml
apiVersion: snapshot.storage.k8s.io/v1beta1
kind: VolumeSnapshotContent
metadata:
  name: snapcontent-72d9a349-aacd-42d2-a240-d775650d2455
spec:
  deletionPolicy: Delete
  driver: hostpath.csi.k8s.io
  source:
    volumeHandle: ee0cfb94-f8d4-11e9-b2d8-0242ac110002
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
`volumeHandle` 是存储后端创建卷的唯一标识符，在卷创建期间由 CSI 驱动程序返回。动态设置快照需要此字段。它指出了快照的卷源。

对于预配置快照，你（作为集群管理员）要按如下命令来创建 `VolumeSnapshotContent` 对象。

```yaml
apiVersion: snapshot.storage.k8s.io/v1beta1
kind: VolumeSnapshotContent
metadata:
  name: new-snapshot-content-test
spec:
  deletionPolicy: Delete
  driver: hostpath.csi.k8s.io
  source:
    snapshotHandle: 7bdd0de3-aaeb-11e8-9aae-0242ac110002
  volumeSnapshotRef:
    name: new-snapshot-test
    namespace: default
```
<!--
`snapshotHandle` is the unique identifier of the volume snapshot created on the storage backend. This field is required for the pre-provisioned snapshots. It specifies the CSI snapshot id on the storage system that this `VolumeSnapshotContent` represents.
-->
`snapshotHandle` 是存储后端创建卷的唯一标识符。对于预设置快照，这个字段是必须的。它指定此 `VolumeSnapshotContent` 表示的存储系统上的 CSI 快照 id。

<!--
## Provisioning Volumes from Snapshots
-->
## 从快照供应卷

<!--
You can provision a new volume, pre-populated with data from a snapshot, by using
the *dataSource* field in the `PersistentVolumeClaim` object.
-->
你可以配置一个新卷，该卷预填充了快照中的数据，在 `持久卷声明` 对象中使用 *dataSource* 字段。

<!--
For more details, see
[Volume Snapshot and Restore Volume from Snapshot](/docs/concepts/storage/persistent-volumes/#volume-snapshot-and-restore-volume-from-snapshot-support).
-->
更多详细信息，请参阅 [卷快照和从快照还原卷](/zh/docs/concepts/storage/persistent-volumes/#volume-snapshot-and-restore-volume-from-snapshot-support)。

