---
title: 卷快照
content_template: templates/concept
weight: 20
---

<!--
---
reviewers:
- jsafrane
- saad-ali
- thockin
- msau42
title: Volume Snapshots
content_template: templates/concept
weight: 20
---
-->

{{% capture overview %}}

{{< feature-state for_k8s_version="v1.12" state="alpha" >}}
<!--
This document describes the current state of `VolumeSnapshots` in Kubernetes. Familiarity with [persistent volumes](/docs/concepts/storage/persistent-volumes/) is suggested.
-->

本文档描述 Kubernetes 中 `VolumeSnapshots` 的当前状态。建议先熟悉[持久卷](/docs/concepts/storage/persistent-volumes/)。

{{% /capture %}}


{{% capture body %}}

<!--
## Introduction
-->

## 介绍

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
While `VolumeSnapshots` allow a user to consume abstract storage resources, cluster administrators
need to be able to offer a variety of `VolumeSnapshotContents` without exposing
users to the details of how those volume snapshots should be provisioned. For these needs
there is the `VolumeSnapshotClass` resource.
-->
`VolumeSnapshots` 允许用户消费抽象的存储资源，集群管理员需要能够提供多种 `VolumeSnapshotContents`，又不会向用户暴露这些应该供应的卷快照的细节。为了实现这些需求，就需要 `VolumeSnapshotClass` 资源。

<!--
Users need to be aware of the following when using this feature:
-->
当使用该功能时，用户需要注意以下几点：

<!--
* API Objects `VolumeSnapshot`, `VolumeSnapshotContent`, and `VolumeSnapshotClass` are CRDs, not part of the core API.
* `VolumeSnapshot` support is only available for CSI drivers.
* As part of the deployment process, the Kubernetes team provides a sidecar helper container for the snapshot controller called `external-snapshotter`. It watches `VolumeSnapshot` objects and triggers `CreateSnapshot` and `DeleteSnapshot` operations against a CSI endpoint.
* CSI drivers may or may not have implemented the volume snapshot functionality. The CSI drivers that have provided support for volume snapshot will likely use `external-snapshotter`.
* The CSI drivers that support volume snapshot will automatically install CRDs defined for the volume snapshots.
-->
* API 对象 `VolumeSnapshot`，`VolumeSnapshotContent` 和 `VolumeSnapshotClass` 是 CRD，不是核心 API 的部分。
* `VolumeSnapshot` 支持仅可用于 CSI 驱动。
* 作为部署过程的一部分，Kubernetes 团队为快照控制器提供了一个名为 `external-snapshotter` 的 sidecar 帮助容器。它监视 `VolumeSnapshot` 对象然后向 CSI 端点触发 `CreateSnapshot` 和 `DeleteSnapshot` 操作。
* CSI 驱动可能实现，也可能没有实现卷快照功能。CSI 驱动可能会使用 `external-snapshotter` 来提供对卷快照的支持。
* 支持卷快照的 CSI 驱动将自动安装 用于定义卷快照定义的 CRD。

<!--
## Lifecycle of a volume snapshot and volume snapshot content
-->
## 卷快照和卷快照内容的生命周期

<!--
`VolumeSnapshotContents` are resources in the cluster. `VolumeSnapshots` are requests for those resources. The interaction between `VolumeSnapshotContents` and `VolumeSnapshots` follow this lifecycle:
-->
`VolumeSnapshotContents` 是集群中的资源。`VolumeSnapshots` 是对于这些资源的请求。`VolumeSnapshotContents` 和 `VolumeSnapshots` 之间的交互遵循以下生命周期：

<!--
### Provisioning Volume Snapshot
-->
### 供应卷快照

<!--
There are two ways snapshots may be provisioned: statically or dynamically.
-->
快照可以通过两种方式进行供应：静态或动态。

<!--
#### Static
-->
#### 静态的
<!--
A cluster administrator creates a number of `VolumeSnapshotContents`. They carry the details of the real storage which is available for use by cluster users. They exist in the Kubernetes API and are available for consumption.
-->
集群管理员创建多个 `VolumeSnapshotContents`。它们带有实际存储的详细信息，可以供集群用户使用。它们存在于 Kubernetes API 中，并且能够被使用。

<!--
#### Dynamic
-->
#### 动态的
<!--
When none of the static `VolumeSnapshotContents` the administrator created matches a user's `VolumeSnapshot`,
the cluster may try to dynamically provision a volume snapshot specially for the `VolumeSnapshot` object.
This provisioning is based on `VolumeSnapshotClasses`: the `VolumeSnapshot` must request a
[volume snapshot class](/docs/concepts/storage/volume-snapshot-classes/) and
the administrator must have created and configured that class in order for dynamic
provisioning to occur.
-->
当管理员创建的静态 `VolumeSnapshotContents` 都不能匹配用户的 `VolumeSnapshot`，集群可能会尝试专门为 `VolumeSnapshot` 对象供应一个卷快照。此供应基于 `VolumeSnapshotClasses`：`VolumeSnapshot` 必须请求[卷快照类](/docs/concepts/storage/volume-snapshot-classes/)并且管理员必须已经创建并配置了该类，才能进行动态供应。

<!--
### Binding
-->
### 绑定

<!--
A user creates, or has already created in the case of dynamic provisioning, a `VolumeSnapshot` with a specific amount of storage requested and with certain access modes. A control loop watches for new VolumeSnapshots, finds a matching VolumeSnapshotContent (if possible), and binds them together. If a VolumeSnapshotContent was dynamically provisioned for a new VolumeSnapshot, the loop will always bind that VolumeSnapshotContent to the VolumeSnapshot. Once bound, `VolumeSnapshot` binds are exclusive, regardless of how they were bound. A VolumeSnapshot to VolumeSnapshotContent binding is a one-to-one mapping.
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
