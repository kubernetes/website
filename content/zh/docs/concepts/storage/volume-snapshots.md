---
title: 卷快照
content_template: templates/concept
weight: 20
---

<!--
---
reviewers:
- saad-ali
- thockin
- msau42
- jingxu97
- xing-yang
- yuxiangqian
title: Volume Snapshots
content_template: templates/concept
weight: 20
---
-->

{{% capture overview %}}

{{< feature-state for_k8s_version="1.17" state="beta" >}}

<!--
In Kubernetes, a _VolumeSnapshot_ represents a snapshot of a volume on a storage system. This document assumes that you are already familiar with Kubernetes [persistent volumes](/docs/concepts/storage/persistent-volumes/).
-->
在 Kubernetes 中，卷快照是一个存储系统上卷的快照，本文假设你已经熟悉了 Kubernetes 的 [持久卷](/docs/concepts/storage/persistent-volumes/)。

{{% /capture %}}

{{% capture body %}}

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
`VolumeSnapshotContent` 是从管理员已提供的集群中的卷获取的快照。就像持久卷是集群的资源一样，它也是集群中的资源。

<!--
A `VolumeSnapshot` is a request for snapshot of a volume by a user. It is similar to a PersistentVolumeClaim.
-->
`VolumeSnapshot` 是用户对于卷的快照的请求。它类似于持久卷声明。

<!--
`VolumeSnapshotClass` allows you to specify different attributes belonging to a `VolumeSnapshot`. These attibutes may differ among snapshots taken from the same volume on the storage system and therefore cannot be expressed by using the same `StorageClass` of a `PersistentVolumeClaim`.
-->
`VolumeSnapshotClass` 允许指定属于 `VolumeSnapshot` 的不同属性。从存储系统上相同卷上获取的不同快照，这些参数可能会不一样，因此不能用一个 `PersistentVolumeClaim` 的相同 `StorageClass` 来指卷快照。

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

快照可以通过两种方式进行供应：预配置或动态配置。

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

当管理员创建的静态 `VolumeSnapshotContents` 都不能匹配用户的 `VolumeSnapshot`，集群可能会尝试专门为 `VolumeSnapshot` 对象供应一个卷快照。此供应基于 `VolumeSnapshotClasses`：`VolumeSnapshot` 必须请求[卷快照类](/docs/concepts/storage/volume-snapshot-classes/)并且管理员必须已经创建并配置了该类，才能进行动态供应。

<!--
### Binding
-->
### 绑定 {#binding}

<!--
The snapshot controller handles the binding of a `VolumeSnapshot` object with an appropriate `VolumeSnapshotContent` object, in both pre-provisioned and dynamically provisioned scenarios. The binding is a one-to-one mapping.
-->
用户创建，或在动态供应场景下已经创建了的 `VolumeSnapshot` 具有特定数量的存储请求和特定的访问模式。一个控制循环监视新的 VolumeSnapshots，找到匹配的 VolumeSnapshotContent（如果可能），并把它们绑定到一起。如果 VolumeSnapshotContent 是给动态供应给一个新的VolumeSnapshot，循环将依然绑定 VolumeSnapshotContent 到 VolumeSnapshot。一旦绑定，无论是如何绑定的，`VolumeSnapshot` 绑定都是排他的。VolumeSnapshot 到 VolumeSnapshotContent 的绑定是一对一的映射。

<!--
VolumeSnapshots will remain unbound indefinitely if a matching VolumeSnapshotContent does not exist. VolumeSnapshots will be bound as matching VolumeSnapshotContents become available.
-->
如果不存在匹配的 VolumeSnapshotContent，VolumeSnapshots 将永远保持未绑定状态。当匹配的 VolumeSnapshotContents 可用时，将绑定 VolumeSnapshots。

<!--
### Persistent Volume Claim in Use Protection
-->
### 使用保护的持久性卷声明

<!--
The purpose of the Persistent Volume Claim Object in Use Protection feature is to ensure that in-use PVC API objects are not removed from the system (as this may result in data loss).
-->
使用保护的持久性卷声明功能的目的是确保使用中的 PVC API 对象不会从系统中被删除（因为这可能会导致数据丢失）。

<!--
If a PVC is in active use by a snapshot as a source to create the snapshot, the PVC is in-use. If a user deletes a PVC API object in active use as a snapshot source, the PVC object is not removed immediately. Instead, removal of the PVC object is postponed until the PVC is no longer actively used by any snapshots. A PVC is no longer used as a snapshot source when `ReadyToUse` of the snapshot `Status` becomes `true`.
-->
如果一个 PVC 正在被快照用来作为源进行快照创建，则该 PVC 是使用中的。如果用户删除正作为快照源的 PVC API 对象，则 PVC 对象不会立即被删除掉。相反，PVC 对象的删除将推迟到任何快照不在主动使用它为止。当快照的 `Status` 中的 `ReadyToUse`值为 `true` 时，PVC 将不再用作快照源。

<!--
### Delete
-->
### 删除

<!--
Deletion removes both the `VolumeSnapshotContent` object from the Kubernetes API, as well as the associated storage asset in the external infrastructure.
-->
删除操作会从 Kubernetes API 中删除 `VolumeSnapshotContent` 对象，同时删除它在外部基础架构中关联存储资产。

<!--
## Volume Snapshot Contents
-->
## 卷快照内容

<!--
Each VolumeSnapshotContent contains a spec, which is the specification of the volume snapshot.
-->
每个 VolumeSnapshotContent 包含一个 spec，用来表示卷快照的规格。

```yaml
apiVersion: snapshot.storage.k8s.io/v1alpha1
kind: VolumeSnapshotContent
metadata:
  name: new-snapshot-content-test
spec:
  snapshotClassName: csi-hostpath-snapclass
  source:
    name: pvc-test
    kind: PersistentVolumeClaim
  volumeSnapshotSource:
    csiVolumeSnapshotSource:
      creationTime:    1535478900692119403
      driver:          csi-hostpath
      restoreSize:     10Gi
      snapshotHandle:  7bdd0de3-aaeb-11e8-9aae-0242ac110002
```

<!--
### Class
-->
### 类

<!--
A VolumeSnapshotContent can have a class, which is specified by setting the
`snapshotClassName` attribute to the name of a
[VolumeSnapshotClass](/docs/concepts/storage/volume-snapshot-classes/).
A VolumeSnapshotContent of a particular class can only be bound to VolumeSnapshots requesting
that class. A VolumeSnapshotContent with no `snapshotClassName` has no class and can only be bound
to VolumeSnapshots that request no particular class.
-->
VolumeSnapshotContent 可以具有一个类，该类通过设置 `snapshotClassName` 属性为 [VolumeSnapshotClass](/docs/concepts/storage/volume-snapshot-classes/) 的名称来指定。一个特定类的 VolumeSnapshotContent 只能够绑定到请求该类的 VolumeSnapshots。没有 `snapshotClassName` 的 VolumeSnapshotContent 没有类，并且只能绑定到不要求特定类的 VolumeSnapshots。


## VolumeSnapshots

<!--
Each VolumeSnapshot contains a spec and a status, which is the specification and status of the volume snapshot.
-->
每个 VolumeSnapshot 对象包含 spec 和 status，用来表示卷快照的规格和状态。

```yaml
apiVersion: snapshot.storage.k8s.io/v1alpha1
kind: VolumeSnapshot
metadata:
  name: new-snapshot-test
spec:
  snapshotClassName: csi-hostpath-snapclass
  source:
    name: pvc-test
    kind: PersistentVolumeClaim
```

<!--
### Class
-->
### 类

<!--
A volume snapshot can request a particular class by specifying the name of a
[VolumeSnapshotClass](/docs/concepts/storage/volume-snapshot-classes/)
using the attribute `snapshotClassName`.
Only VolumeSnapshotContents of the requested class, ones with the same `snapshotClassName`
as the VolumeSnapshot, can be bound to the VolumeSnapshot.
-->
通过使用 `snapshotClassName` 属性来指定 [VolumeSnapshotClass](/docs/concepts/storage/volume-snapshot-classes/) 的名称，卷快照可以请求特定的类。
只有所请求类（与 VolumeSnapshot 有相同的 `snapshotClassName`）的 VolumeSnapshotContents 才可以绑定到 VolumeSnapshot。

<!--
## Provisioning Volumes from Snapshots
-->
## 从快照供应卷

<!--
You can provision a new volume, pre-populated with data from a snapshot, by using
the *dataSource* field in the `PersistentVolumeClaim` object.
-->
你可以供应一个新卷，该卷预填充了快照中的数据，在 `持久卷声明` 对象中使用 *dataSource* 字段。

<!--
For more details, see
[Volume Snapshot and Restore Volume from Snapshot](/docs/concepts/storage/persistent-volumes/#volume-snapshot-and-restore-volume-from-snapshot-support).
-->
更多详细信息，请参阅 [卷快照和从快照还原卷](/docs/concepts/storage/persistent-volumes/#volume-snapshot-and-restore-volume-from-snapshot-support)。

{{% /capture %}}
