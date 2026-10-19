---
layout: blog
title: "Kubernetes v1.34: 将卷组快照推进至 v1beta2 阶段"
date: 2025-09-16T10:30:00-08:00
slug: kubernetes-v1-34-volume-group-snapshot-beta-2
author: >
   Xing Yang (VMware by Broadcom)
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes v1.34: Moving Volume Group Snapshots to v1beta2"
date: 2025-09-16T10:30:00-08:00
slug: kubernetes-v1-34-volume-group-snapshot-beta-2
author: >
   Xing Yang (VMware by Broadcom)
-->

<!--
Volume group snapshots were [introduced](/blog/2023/05/08/kubernetes-1-27-volume-group-snapshot-alpha/)
as an Alpha feature with the Kubernetes 1.27 release and moved to [Beta](/blog/2024/12/18/kubernetes-1-32-volume-group-snapshot-beta/) in the Kubernetes 1.32 release.
The recent release of Kubernetes v1.34 moved that support to a second beta.
The support for volume group snapshots relies on a set of
[extension APIs for group snapshots](https://kubernetes-csi.github.io/docs/group-snapshot-restore-feature.html#volume-group-snapshot-apis).
These APIs allow users to take crash consistent snapshots for a set of volumes.
Behind the scenes, Kubernetes uses a label selector to group multiple PersistentVolumeClaims
for snapshotting.
A key aim is to allow you restore that set of snapshots to new volumes and
recover your workload based on a crash consistent recovery point.

This new feature is only supported for [CSI](https://kubernetes-csi.github.io/docs/) volume drivers.
-->
卷组快照在 Kubernetes 1.27 版本中作为 Alpha 特性被引入，
并在 Kubernetes 1.32 版本中移至 [Beta](/zh-cn/blog/2024/12/18/kubernetes-1-32-volume-group-snapshot-beta/) 阶段。
Kubernetes v1.34 的最近一次发布将该支持移至第二个 Beta 阶段。
对卷组快照的支持依赖于一组[用于组快照的扩展 API](https://kubernetes-csi.github.io/docs/group-snapshot-restore-feature.html#volume-group-snapshot-apis)。
这些 API 允许用户为一组卷获取崩溃一致性快照。在后台，Kubernetes 根据标签选择器对多个
PersistentVolumeClaim 分组，并进行快照操作。关键目标是允许你将这组快照恢复到新卷上，
并基于崩溃一致性恢复点恢复工作负载。

此新特性仅支持 [CSI](https://kubernetes-csi.github.io/docs/) 卷驱动。

<!--
## What's new in Beta 2?

While testing the beta version, we encountered an [issue](https://github.com/kubernetes-csi/external-snapshotter/issues/1271) where the `restoreSize` field is not set for individual VolumeSnapshotContents and VolumeSnapshots if CSI driver does not implement the ListSnapshots RPC call.
We evaluated various options [here](https://docs.google.com/document/d/1LLBSHcnlLTaP6ZKjugtSGQHH2LGZPndyfnNqR1YvzS4/edit?tab=t.0) and decided to make this change releasing a new beta for the API.
-->
## Beta 2 的新内容

在测试 Beta 版本时，我们遇到了一个问题：如果 CSI 驱动未实现 ListSnapshots RPC 调用，
则对于单独的 VolumeSnapshotContent 和 VolumeSnapshot 来说，`restoreSize` 字段不会被设置。
我们在这里评估了不同的选项[此处](https://docs.google.com/document/d/1LLBSHcnlLTaP6ZKjugtSGQHH2LGZPndyfnNqR1YvzS4/edit?tab=t.0)，
并决定为此发布一个新的 Beta 版本 API。

<!--
Specifically, a VolumeSnapshotInfo struct is added in v1beta2, it contains information for an individual volume snapshot that is a member of a volume group snapshot.
VolumeSnapshotInfoList, a list of VolumeSnapshotInfo, is added to VolumeGroupSnapshotContentStatus, replacing VolumeSnapshotHandlePairList.
VolumeSnapshotInfoList is a list of snapshot information returned by the CSI driver to identify snapshots on the storage system.
VolumeSnapshotInfoList is populated by the csi-snapshotter sidecar based on the CSI CreateVolumeGroupSnapshotResponse returned by the CSI driver's CreateVolumeGroupSnapshot call.

The existing v1beta1 API objects will be converted to the new v1beta2 API objects by a conversion webhook.
-->
具体来说，在 v1beta2 中添加了一个 VolumeSnapshotInfo 结构，它包含了属于卷组快照成员的单个卷快照的信息。

VolumeSnapshotInfoList，即 VolumeSnapshotInfo 的列表，被添加到 VolumeGroupSnapshotContentStatus
中，取代了 VolumeSnapshotHandlePairList。

VolumeSnapshotInfoList 是 CSI 驱动通过 ListSnapshots 调用返回的快照信息列表，用于识别存储系统上的快照。

VolumeSnapshotInfoList 由 csi-snapshotter 边车根据 CSI 驱动的 CreateVolumeGroupSnapshot
调用返回的 CSI CreateVolumeGroupSnapshotResponse 填充。

现有的 v1beta1 API 对象将通过转换 Webhook 转换为新的 v1beta2 API 对象。

<!--
## What’s next?

Depending on feedback and adoption, the Kubernetes project plans to push the volume
group snapshot implementation to general availability (GA) in a future release.
-->
## 接下来？

根据反馈和采用情况，Kubernetes 项目计划在未来的版本中将卷组快照实现推进到正式发布版本（GA）。

<!--
## How can I learn more?

- The [design spec](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/3476-volume-group-snapshot)
  for the volume group snapshot feature.
- The [code repository](https://github.com/kubernetes-csi/external-snapshotter) for volume group
  snapshot APIs and controller.
- CSI [documentation](https://kubernetes-csi.github.io/docs/) on the group snapshot feature.
-->
## 如何了解更多？

- 卷组快照特性的[设计规范](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/3476-volume-group-snapshot)。
- 卷组快照 API 和控制器的[代码仓库](https://github.com/kubernetes-csi/external-snapshotter)。
- CSI 关于组快照特性的[文档](https://kubernetes-csi.github.io/docs/)。

<!--
## How do I get involved?

This project, like all of Kubernetes, is the result of hard work by many contributors
from diverse backgrounds working together. On behalf of SIG Storage, I would like to
offer a huge thank you to the contributors who stepped up these last few quarters
to help the project reach beta:
-->
## 如何参与？

这个项目，如同所有的 Kubernetes 项目一样，是许多来自不同背景的贡献者共同努力的结果。
代表 SIG Storage，我想对过去几个季度中挺身而出帮助项目达到 Beta 阶段的贡献者们表示巨大的感谢：


* Ben Swartzlander ([bswartz](https://github.com/bswartz))
* Hemant Kumar ([gnufied](https://github.com/gnufied))
* Jan Šafránek ([jsafrane](https://github.com/jsafrane))
* Madhu Rajanna ([Madhu-1](https://github.com/Madhu-1))
* Michelle Au ([msau42](https://github.com/msau42))
* Niels de Vos ([nixpanic](https://github.com/nixpanic))
* Leonardo Cecchi ([leonardoce](https://github.com/leonardoce))
* Saad Ali ([saad-ali](https://github.com/saad-ali))
* Xing Yang ([xing-yang](https://github.com/xing-yang))
* Yati Padia ([yati1998](https://github.com/yati1998))

<!--
For those interested in getting involved with the design and development of CSI or
any part of the Kubernetes Storage system, join the
[Kubernetes Storage Special Interest Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG).
We always welcome new contributors.

We also hold regular [Data Protection Working Group meetings](https://github.com/kubernetes/community/tree/master/wg-data-protection).
New attendees are welcome to join our discussions.
-->
对于那些有兴趣参与 CSI 或 Kubernetes 存储系统任何部分的设计和开发的人，可以加入
[Kubernetes 存储特别兴趣小组](https://github.com/kubernetes/community/tree/master/sig-storage)（SIG）。
我们始终欢迎新的贡献者。

我们还定期举行[数据保护工作组会议](https://github.com/kubernetes/community/tree/master/wg-data-protection)。
新参会者可以加入我们的讨论。
