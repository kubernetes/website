---
layout: blog
title: "Kubernetes v1.36：卷组快照进入正式发布阶段"
date: 2026-04-22T10:30:00-08:00
draft: true
slug: kubernetes-v1-36-volume-group-snapshot-ga
author: >
   Xing Yang (VMware by Broadcom)
translator: >
   [xiaoyang Zhang](https://github.com/zhangxyjlu) (Huawei)
---
<!--
layout: blog
title: "Kubernetes v1.36: Moving Volume Group Snapshots to GA"
date: 2026-04-22T10:30:00-08:00
draft: true
slug: kubernetes-v1-36-volume-group-snapshot-ga
author: >
   Xing Yang (VMware by Broadcom)
-->

<!--
Volume group snapshots were [introduced](/blog/2023/05/08/kubernetes-1-27-volume-group-snapshot-alpha/) as an Alpha feature with the Kubernetes v1.27 release, moved to [Beta](/blog/2024/12/18/kubernetes-1-32-volume-group-snapshot-beta/) in v1.32, and to a [second Beta](/blog/2025/09/16/kubernetes-v1-34-volume-group-snapshot-beta-2/) in v1.34. We are excited to announce that in the Kubernetes v1.36 release, support for volume group snapshots has reached **General Availability (GA)**.
-->
卷组快照（Volume Group Snapshots）作为 Alpha 功能在 Kubernetes v1.27 版本中[引入](/blog/2023/05/08/kubernetes-1-27-volume-group-snapshot-alpha/)，
在 v1.32 版本中进入 [Beta](blog/2024/12/18/kubernetes-1-32-volume-group-snapshot-beta/) 阶段，
并在 v1.34 版本中进入[二次 Beta](/blog/2025/09/16/kubernetes-v1-34-volume-group-snapshot-beta-2/) 阶段。
我们很高兴地宣布，在 Kubernetes v1.36 版本中，卷组快照已 **正式发布（GA）**。

<!--
The support for volume group snapshots relies on a set of [extension APIs for group snapshots](https://kubernetes-csi.github.io/docs/group-snapshot-restore-feature.html#volume-group-snapshot-apis). These APIs allow users to take crash-consistent snapshots for a set of volumes. Behind the scenes, Kubernetes uses a label selector to group multiple `PersistentVolumeClaim` objects for snapshotting. A key aim is to allow you to restore that set of snapshots to new volumes and recover your workload based on a crash-consistent recovery point.
-->
卷组快照的支持依赖于一组[卷组快照的扩展 API](https://kubernetes-csi.github.io/docs/group-snapshot-restore-feature.html#volume-group-snapshot-apis)。
这些 API 允许用户为一组卷创建崩溃一致性（crash-consistent）快照。
在后台，Kubernetes 使用标签选择器将多个 `PersistentVolumeClaim` 对象分组以进行快照。
其主要目标是允许用户将该组快照恢复到新卷，并基于崩溃一致性恢复点恢复工作负载。

<!--
This feature is only supported for [CSI](https://kubernetes-csi.github.io/docs/) volume drivers.
-->
此功能仅支持 [CSI](https://kubernetes-csi.github.io/docs/) 卷驱动程序。

<!--
## An overview of volume group snapshots
-->
## 卷组快照概述 {#an-overview-of-volume-group-snapshots}

<!--
Some storage systems provide the ability to create a crash-consistent snapshot of multiple volumes. A group snapshot represents _copies_ made from multiple volumes that are taken at the same point-in-time. A group snapshot can be used either to rehydrate new volumes (pre-populated with the snapshot data) or to restore existing volumes to a previous state (represented by the snapshots).
-->
某些存储系统能够创建多个卷的崩溃一致性快照。组快照是指在同一时间点从多个卷创建的**副本**。
组快照可用于重建新卷（预填充快照数据），或将现有卷恢复到之前的状态（由快照表示）。

<!--
### Why add volume group snapshots to Kubernetes?
-->
### 为什么要在 Kubernetes 中添加卷组快照？ {#why-add-volume-group-snapshots-to-kubernetes}

<!--
The Kubernetes volume plugin system already provides a powerful abstraction that automates the provisioning, attaching, mounting, resizing, and snapshotting of block and file storage. Underpinning all these features is the Kubernetes goal of workload portability.
-->
Kubernetes 卷插件系统已经提供了一种强大的抽象机制，能够自动完成块存储和文件存储的配置、挂载、调整大小以及快照操作。
所有这些特性都植根于 Kubernetes 追求的工作负载可移植性这一目标。

<!--
There was already a [VolumeSnapshot](/docs/concepts/storage/volume-snapshots/) API that provides the ability to take a snapshot of a persistent volume to protect against data loss or data corruption. However, some storage systems support consistent group snapshots that allow a snapshot to be taken from multiple volumes at the same point-in-time to achieve write order consistency. This is extremely useful for applications that contain multiple volumes. For example, an application may have data stored in one volume and logs stored in another. If snapshots for these volumes are taken at different times, the application will not be consistent and will not function properly if restored from those snapshots.
-->
现有的 [VolumeSnapshot](/zh-cn/docs/concepts/storage/volume-snapshots/) API
提供了对持久卷进行快照的功能，以防止数据丢失或损坏。
然而，一些存储系统支持一致性组快照，允许在同一时间点从多个卷创建快照，从而实现写入顺序的一致性。
这对于包含多个卷的应用程序非常有用。例如，应用程序的数据可能存储在一个卷中，而日志存储在另一个卷中。
如果这些卷的快照是在不同的时间创建的，则应用程序的数据将不一致，并且如果从这些快照恢复，则应用程序将无法正常运行。

<!--
While you can quiesce the application first and take individual snapshots sequentially, this process can be time-consuming or sometimes impossible. Consistent group support provides crash consistency across all volumes in the group without the need for application quiescence.
-->
虽然你可以先让应用程序进入静默状态，然后按顺序创建各个快照，但这个过程可能非常耗时，有时甚至根本无法实现。
一致的组支持可在无需让应用程序进入静默状态的情况下，确保组内所有卷的崩溃一致性。

<!--
### Kubernetes APIs for volume group snapshots
-->
### Kubernetes 卷组快照 API {#kubernetes-apis-for-volume-group-snapshots}

<!--
Kubernetes' support for volume group snapshots relies on three API kinds that are used for managing snapshots:
-->
Kubernetes 对卷组快照的支持依赖于三种用于管理快照的 API：

<!--
VolumeGroupSnapshot
: Created by a Kubernetes user (or automation) to request creation of a volume group snapshot for multiple persistent volume claims.
-->
VolumeGroupSnapshot
：由 Kubernetes 用户（或自动化）创建，用于请求为多个持久卷声明创建卷组快照。

<!--
VolumeGroupSnapshotContent
: Created by the snapshot controller for a dynamically created VolumeGroupSnapshot. It contains information about the provisioned cluster resource (a group snapshot). The object binds to the VolumeGroupSnapshot for which it was created with a one-to-one mapping.
-->
VolumeGroupSnapshotContent
：由快照控制器为动态创建的 VolumeGroupSnapshot 创建。它包含有关已配置集群资源（组快照）的信息。
该对象与其创建的 VolumeGroupSnapshot 之间存在一对一映射关系。

<!--
VolumeGroupSnapshotClass
: Created by cluster administrators to describe how volume group snapshots should be created, including the driver information, the deletion policy, etc.
-->
VolumeGroupSnapshotClass
：由集群管理员创建，用于描述应如何创建卷组快照，包括驱动程序信息、删除策略等。

<!--
These three API kinds are defined as CustomResourceDefinitions (CRDs). For the GA release, the API version has been promoted to `v1`.
-->
这三种 API 类型被定义为自定义资源定义 (CRD)。在正式版发布中，API 版本已提升至 `v1`。

<!--
## What's new in GA?
-->
## 正式发布中的新内容 {#whats-new-in-ga}

<!--
* The API version for `VolumeGroupSnapshot`, `VolumeGroupSnapshotContent`, and `VolumeGroupSnapshotClass` is promoted to `groupsnapshot.storage.k8s.io/v1`.
* Enhanced stability and bug fixes based on feedback from the beta releases, including the improvements introduced in v1beta2 for accurate `restoreSize` reporting.
-->
* `VolumeGroupSnapshot`、`VolumeGroupSnapshotContent` 和 `VolumeGroupSnapshotClass` 的 API 版本已升级为 `groupsnapshot.storage.k8s.io/v1`。
* 基于对 bete 测试版反馈的改进，增强了稳定性并修复了若干问题，其中包括 v1beta2 中引入的改进，以确保 `restoreSize` 报告的准确性。

<!--
## How do I use Kubernetes volume group snapshots
-->
## 如何使用 Kubernetes 卷组快照 {#how-do-i-use-kubernetes-volume-group-snapshots}

<!--
### Creating a new group snapshot with Kubernetes
-->
### 使用 Kubernetes 创建新的组快照 {#creating-a-new-group-snapshot-with-kubernetes}

<!--
Once a `VolumeGroupSnapshotClass` object is defined and you have volumes you want to snapshot together, you may request a new group snapshot by creating a `VolumeGroupSnapshot` object.
-->
定义好 `VolumeGroupSnapshotClass` 对象并选定要一起创建快照的卷后，你可以通过创建
`VolumeGroupSnapshot` 对象来请求生成新的组快照。

<!--
Label the PVCs you wish to group:
-->
为你想要分组的 PVC 打标签：

```console
% kubectl label pvc pvc-0 group=myGroup
persistentvolumeclaim/pvc-0 labeled

% kubectl label pvc pvc-1 group=myGroup
persistentvolumeclaim/pvc-1 labeled
```

<!--
For dynamic provisioning, a selector must be set so that the snapshot controller can find PVCs with the matching labels to be snapshotted together.
-->
对于动态配置，必须设置选择器，以便快照控制器可以找到具有匹配标签的 PVC，以便一起进行快照。

```yaml
apiVersion: groupsnapshot.storage.k8s.io/v1
kind: VolumeGroupSnapshot
metadata:
  name: snapshot-daily-20260422
  namespace: demo-namespace
spec:
  volumeGroupSnapshotClassName: csi-groupSnapclass
  source:
    selector:
      matchLabels:
        group: myGroup
```

<!--
The `VolumeGroupSnapshotClass` is required for dynamic provisioning:
-->
动态配置需要 `VolumeGroupSnapshotClass`：

```yaml
apiVersion: groupsnapshot.storage.k8s.io/v1
kind: VolumeGroupSnapshotClass
metadata:
  name: csi-groupSnapclass
driver: example.csi.k8s.io
deletionPolicy: Delete
```

<!--
### How to use group snapshot for restore
-->
### 如何使用组快照进行恢复 {#how-to-use-group-snapshot-for-restore}

<!--
At restore time, request a new `PersistentVolumeClaim` to be created from a `VolumeSnapshot` object that is part of a `VolumeGroupSnapshot`. Repeat this for all volumes that are part of the group snapshot.
-->
在恢复时，请求从属于 `VolumeGroupSnapshot` 的 `VolumeSnapshot` 对象创建新的 `PersistentVolumeClaim`。
对属于该组快照的所有卷重复此操作。

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: examplepvc-restored-2026-04-22
  namespace: demo-namespace
spec:
  storageClassName: example-sc
  dataSource:
    name: snapshot-0962a745b2bf930bb385b7b50c9b08af471f1a16780726de19429dd9c94eaca0
    kind: VolumeSnapshot
    apiGroup: snapshot.storage.k8s.io
  accessModes:
    - ReadWriteOncePod
  resources:
    requests:
      storage: 100Mi
```

<!--
## As a storage vendor, how do I add support for group snapshots?
-->
## 作为存储供应商，如何添加组快照支持？ {#as-a-storage-vendor-how-do-i-add-support-for-group-snapshots}

<!--
To implement the volume group snapshot feature, a CSI driver **must**:
-->
要实现卷组快照功能，CSI 驱动程序 **必须**：

<!--
* Implement a new group controller service.
* Implement group controller RPCs: `CreateVolumeGroupSnapshot`, `DeleteVolumeGroupSnapshot`, and `GetVolumeGroupSnapshot`.
* Add group controller capability `CREATE_DELETE_GET_VOLUME_GROUP_SNAPSHOT`.
-->
* 实现新的组控制器服务。
* 实现组控制器远程过程调用 (RPC)：`CreateVolumeGroupSnapshot`、`DeleteVolumeGroupSnapshot` 和 `GetVolumeGroupSnapshot`。
* 添加组控制器能力 `CREATE_DELETE_GET_VOLUME_GROUP_SNAPSHOT`。

<!--
See the [CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md) and the [Kubernetes-CSI Driver Developer Guide](https://kubernetes-csi.github.io/docs/) for more details.
-->
更多细节请参阅 [CSI 规范](https://github.com/container-storage-interface/spec/blob/master/spec.md) 和 [Kubernetes-CSI 驱动开发者指南](https://kubernetes-csi.github.io/docs/)。

<!--
## How can I learn more?
-->
## 如何了解更多信息？ {#how-can-i-learn-more}

<!--
- The [design spec](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/3476-volume-group-snapshot) for the volume group snapshot feature.
- The [code repository](https://github.com/kubernetes-csi/external-snapshotter) for volume group snapshot APIs and controller.
- CSI [documentation](https://kubernetes-csi.github.io/docs/) on the group snapshot feature.
-->
- 卷组快照功能的[设计规范](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/3476-volume-group-snapshot)。
- 卷组快照 API 和控制器的[代码仓库](https://github.com/kubernetes-csi/external-snapshotter)。
- CSI [文档](https://kubernetes-csi.github.io/docs/)中关于组快照功能的介绍。

<!--
## How do I get involved?
-->
## 如何参与？ {#how-do-i-get-involved}

<!--
This project, like all of Kubernetes, is the result of hard work by many contributors from diverse backgrounds working together. On behalf of SIG Storage, I would like to offer a huge thank you to all the contributors who stepped up over the years to help the project reach GA:
-->
与 Kubernetes 的所有项目一样，这个项目也是来自不同背景的众多贡献者共同努力的成果。
向多年来积极参与、助力本项目达到正式发布（GA）阶段的所有贡献者致以诚挚的谢意：

* Ben Swartzlander ([bswartz](https://github.com/bswartz))
* Cici Huang ([cici37](https://github.com/cici37))
* Darshan Murthy ([darshansreenivas](https://github.com/darshansreenivas))
* Hemant Kumar ([gnufied](https://github.com/gnufied))
* James Defelice ([jdef](https://github.com/jdef))
* Jan Šafránek ([jsafrane](https://github.com/jsafrane))
* Madhu Rajanna ([Madhu-1](https://github.com/Madhu-1))
* Manish M Yathnalli ([manishym](https://github.com/manishym))
* Michelle Au ([msau42](https://github.com/msau42))
* Niels de Vos ([nixpanic](https://github.com/nixpanic))
* Leonardo Cecchi ([leonardoce](https://github.com/leonardoce))
* Rakshith R ([Rakshith-R](https://github.com/Rakshith-R))
* Raunak Shah ([RaunakShah](https://github.com/RaunakShah))
* Saad Ali ([saad-ali](https://github.com/saad-ali))
* Wei Duan ([duanwei33](https://github.com/duanwei33))
* Xing Yang ([xing-yang](https://github.com/xing-yang))
* Yati Padia ([yati1998](https://github.com/yati1998))


<!--
For those interested in getting involved with the design and development of CSI or any part of the Kubernetes Storage system, join the [Kubernetes Storage Special Interest Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG). We always welcome new contributors.
-->
如果你有兴趣参与 CSI 或 Kubernetes 存储系统任何部分的设计和开发，请加入
[Kubernetes 存储特别兴趣小组](https://github.com/kubernetes/community/tree/master/sig-storage)（SIG）。
我们始终欢迎新的贡献者。

<!--
We also hold regular [Data Protection Working Group meetings](https://github.com/kubernetes/community/tree/master/wg-data-protection). New attendees are welcome to join our discussions.
-->
我们还定期召开[数据保护工作组会议](https://github.com/kubernetes/community/tree/master/wg-data-protection)。
欢迎新成员加入我们的讨论。