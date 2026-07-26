---
layout: blog
title: "Kubernetes v1.31: PersistentVolume 的最后阶段转换时间进阶到 GA"
date: 2024-08-14
slug: last-phase-transition-time-ga
author: >
  Roman Bednář (Red Hat)
translator: >
  [Jin Li](https://github.com/qlijin) (UOS)
---
<!--
layout: blog
title: "Kubernetes v1.31: PersistentVolume Last Phase Transition Time Moves to GA"
date: 2024-08-14
slug: last-phase-transition-time-ga
author: >
  Roman Bednář (Red Hat)
-->

<!--
Announcing the graduation to General Availability (GA) of the PersistentVolume `lastTransitionTime` status
field, in Kubernetes v1.31!

The Kubernetes SIG Storage team is excited to announce that the "PersistentVolumeLastPhaseTransitionTime" feature, introduced
as an alpha in Kubernetes v1.28, has now reached GA status and is officially part of the Kubernetes v1.31 release. This enhancement
helps Kubernetes users understand when a [PersistentVolume](/docs/concepts/storage/persistent-volumes/) transitions between 
different phases, allowing for more efficient and informed resource management.
-->
现在宣布 PersistentVolume 的 `lastTransitionTime` 状态字段在 Kubernetes v1.31
版本进阶至正式发布（GA）！

Kubernetes SIG Storage 团队很高兴地宣布，"PersistentVolumeLastPhaseTransitionTime"
特性自 Kubernetes v1.28 作为 Alpha 版本引入以来，现已进阶至正式发布（GA），并正式成为
Kubernetes v1.31 版本的一部分。该功能帮助 Kubernetes 用户增强对
[PersistentVolume](/zh-cn/docs/concepts/storage/persistent-volumes/)
在不同阶段之间转换的理解，从而实现更高效和更明智的资源管理。

<!--
For a v1.31 cluster, you can now assume that every PersistentVolume object has a
`.status.lastTransitionTime` field, that holds a timestamp of
when the volume last transitioned its phase. This change is not immediate; the new field will be populated whenever a PersistentVolume
is updated and first transitions between phases (`Pending`, `Bound`, or `Released`) after upgrading to Kubernetes v1.31.
-->
在 v1.31 集群中，你可以默认每个 PersistentVolume 对象都包含
`.status.lastTransitionTime` 字段，该字段记录存储卷最近一次发生阶段转换时的时间戳。
该更改不会立刻生效，而是在升级到 Kubernetes v1.31 后，当 PersistentVolume
发生更新并首次在（`Pending`、`Bound` 或 `Released`）这几个阶段之间进行转换时，
才会填充该字段。

<!--
## What changed?

The API strategy for updating PersistentVolume objects has been modified to populate the `.status.lastTransitionTime` field with the
current timestamp whenever a PersistentVolume transitions phases. Users are allowed to set this field manually if needed, but it will
be overwritten when the PersistentVolume transitions phases again.
-->
## 有什么变化？  {#what-changed}

更新 PersistentVolume 对象的 API 策略已经被修改，
当存储卷转换阶段时会自动填充当前时间戳到 `.status.lastTransitionTime` 字段。
如果需要，用户可以手动设置该字段，但当 PersistentVolume
再次转换阶段时，该字段会被新时间戳覆盖。

<!--
For more details, read about
[Phase transition timestamp](/docs/concepts/storage/persistent-volumes/#phase-transition-timestamp) in the Kubernetes documentation.
You can also read the previous [blog post](/blog/2023/10/23/persistent-volume-last-phase-transition-time) announcing the feature as alpha in v1.28.
-->
想了解更多信息，可以查阅 Kubernetes 文档中的
[阶段转换时间戳](/zh-cn/docs/concepts/storage/persistent-volumes/#phase-transition-timestamp)。
你还可以阅读此前的
[博客文章](/zh-cn/blog/2023/10/23/persistent-volume-last-phase-transition-time)，
该文章介绍了此特性在 v1.28 版本中作为 Alpha 版本发布的情况。

<!--
To provide feedback, join our [Kubernetes Storage Special-Interest-Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG)
or participate in discussions on our [public Slack channel](https://app.slack.com/client/T09NY5SBT/C09QZFCE5).
-->
要提供反馈，请加入我们的
[Kubernetes 存储特别兴趣小组](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG)
或参与[公共 Slack 频道](https://app.slack.com/client/T09NY5SBT/C09QZFCE5)上的讨论。
