---
layout: blog
title: Kubernetes 中 PersistentVolume 的最后阶段转换时间
date: 2023-10-23
slug: persistent-volume-last-phase-transition-time
---

<!--
layout: blog
title: PersistentVolume Last Phase Transition Time in Kubernetes
date: 2023-10-23
slug: persistent-volume-last-phase-transition-time
-->

<!--
**Author:** Roman Bednář (Red Hat)
-->
**作者：** Roman Bednář (Red Hat)

**译者：** Xin Li (DaoCloud)

<!--
In the recent Kubernetes v1.28 release, we (SIG Storage) introduced a new alpha feature that aims to improve PersistentVolume (PV)
storage management and help cluster administrators gain better insights into the lifecycle of PVs.
With the addition of the `lastPhaseTransitionTime` field into the status of a PV,
cluster administrators are now able to track the last time a PV transitioned to a different
[phase](/docs/concepts/storage/persistent-volumes/#phase), allowing for more efficient
and informed resource management.
-->
在最近的 Kubernetes v1.28 版本中，我们（SIG Storage）引入了一项新的 Alpha 级别特性，
旨在改进 PersistentVolume（PV）存储管理并帮助集群管理员更好地了解 PV 的生命周期。
通过将 `lastPhaseTransitionTime` 字段添加到 PV 的状态中，集群管理员现在可以跟踪
PV 上次转换到不同[阶段](/zh-cn/docs/concepts/storage/persistent-volumes/#phase)的时间，
从而实现更高效、更明智的资源管理。

<!--
## Why do we need new PV field? {#why-new-field}

PersistentVolumes in Kubernetes play a crucial role in providing storage resources to workloads running in the cluster.
However, managing these PVs effectively can be challenging, especially when it comes
to determining the last time a PV transitioned between different phases, such as
`Pending`, `Bound` or `Released`.
Administrators often need to know when a PV was last used or transitioned to certain
phases; for instance, to implement retention policies, perform cleanup, or monitor storage health.
-->
## 我们为什么需要新的 PV 字段？  {#why-new-field}

Kubernetes 中的 PersistentVolume 在为集群中运行的工作负载提供存储资源方面发挥着至关重要的作用。
然而，有效管理这些 PV 可能具有挑战性，特别是在确定 PV 在不同阶段（`Pending`、`Bound` 或 `Released`）之间转换的最后时间时。
管理员通常需要知道 PV 上次使用或转换到某些阶段的时间；例如，实施保留策略、执行清理或监控存储运行状况时。

<!--
In the past, Kubernetes users have faced data loss issues when using the `Delete` retain policy and had to resort to the safer `Retain` policy.
When we planned the work to introduce the new `lastPhaseTransitionTime` field, we
wanted to provide a more generic solution that can be used for various use cases,
including manual cleanup based on the time a volume was last used or producing alerts based on phase transition times.
-->
过去，Kubernetes 用户在使用 `Delete` 保留策略时面临数据丢失问题，不得不使用更安全的 `Retain` 策略。
当我们计划引入新的 `lastPhaseTransitionTime` 字段时，我们希望提供一个更通用的解决方案，
可用于各种用例，包括根据卷上次使用时间进行手动清理或根据状态转变时间生成警报。

<!--
## How lastPhaseTransitionTime helps

Provided you've enabled the feature gate (see [How to use it](#how-to-use-it), the new `.status.lastPhaseTransitionTime` field of a PersistentVolume (PV)
is updated every time that PV transitions from one phase to another.
-->
## lastPhaseTransitionTime 如何提供帮助

如果你已启用特性门控（请参阅[如何使用它](#how-to-use-it)），则每次 PV 从一个阶段转换到另一阶段时，
PersistentVolume（PV）的新字段 `.status.lastPhaseTransitionTime` 都会被更新。

<!--
Whether it's transitioning from `Pending` to `Bound`, `Bound` to `Released`, or any other phase transition, the `lastPhaseTransitionTime` will be recorded.
For newly created PVs the phase will be set to `Pending` and the `lastPhaseTransitionTime` will be recorded as well.
-->
无论是从 `Pending` 转换到 `Bound`、`Bound` 到 `Released`，还是任何其他阶段转换，都会记录 `lastPhaseTransitionTime`。
对于新创建的 PV，将被声明为处于 `Pending` 阶段，并且 `lastPhaseTransitionTime` 也将被记录。

<!--
This feature allows cluster administrators to:
-->
此功能允许集群管理员：

<!--
1. Implement Retention Policies

   With the `lastPhaseTransitionTime`, administrators can now track when a PV was last used or transitioned to the `Released` phase.
   This information can be crucial for implementing retention policies to clean up resources that have been in the `Released` phase for a specific duration.
   For example, it is now trivial to write a script or a policy that deletes all PVs that have been in the `Released` phase for a week.
-->
1. 实施保留政策

   通过 `lastPhaseTransitionTime`，管理员可以跟踪 PV 上次使用或转换到 `Released` 阶段的时间。
   此信息对于实施保留策略以清理在特定时间内处于 `Released` 阶段的资源至关重要。
   例如，现在编写一个脚本或一个策略来删除一周内处于 `Released` 阶段的所有 PV 是很简单的。

<!--
2. Monitor Storage Health

   By analyzing the phase transition times of PVs, administrators can monitor storage health more effectively.
   For example, they can identify PVs that have been in the `Pending` phase for an unusually long time, which may indicate underlying issues with the storage provisioner.
-->
2. 监控存储运行状况

   通过分析 PV 的相变时间，管理员可以更有效地监控存储运行状况。
   例如，他们可以识别处于 `Pending` 阶段时间异常长的 PV，这可能表明存储配置程序存在潜在问题。

<!--
## How to use it

The `lastPhaseTransitionTime` field is alpha starting from Kubernetes v1.28, so it requires
the `PersistentVolumeLastPhaseTransitionTime` feature gate to be enabled.
-->
## 如何使用它

从 Kubernetes v1.28 开始，`lastPhaseTransitionTime` 为 Alpha 特性字段，因此需要启用
`PersistentVolumeLastPhaseTransitionTime` 特性门控。

<!--
If you want to test the feature whilst it's alpha, you need to enable this feature gate on the `kube-controller-manager` and the `kube-apiserver`.

Use the `--feature-gates` command line argument:
-->
如果你想在该特性处于 Alpha 阶段时对其进行测试，则需要在 `kube-controller-manager`
和 `kube-apiserver` 上启用此特性门控。

使用 `--feature-gates` 命令行参数：

```shell
--feature-gates="...,PersistentVolumeLastPhaseTransitionTime=true"
```

<!--
Keep in mind that the feature enablement does not have immediate effect; the new field will be populated whenever a PV is updated and transitions between phases.
Administrators can then access the new field through the PV status, which can be retrieved using standard Kubernetes API calls or through Kubernetes client libraries.
-->
请记住，该特性启用后不会立即生效；而是在 PV 更新以及阶段之间转换时，填充新字段。
然后，管理员可以通过查看 PV 状态访问新字段，此状态可以使用标准 Kubernetes API
调用或通过 Kubernetes 客户端库进行检索。

<!--
Here is an example of how to retrieve the `lastPhaseTransitionTime` for a specific PV using the `kubectl` command-line tool:
-->
以下示例展示了如何使用 `kubectl` 命令行工具检索特定 PV 的 `lastPhaseTransitionTime`：

```shell
kubectl get pv <pv-name> -o jsonpath='{.status.lastPhaseTransitionTime}'
```

<!--
## Going forward

This feature was initially introduced as an alpha feature, behind a feature gate that is disabled by default.
During the alpha phase, we (Kubernetes SIG Storage) will collect feedback from the end user community and address any issues or improvements identified.

Once sufficient feedback has been received, or no complaints are received the feature can move to beta.
The beta phase will allow us to further validate the implementation and ensure its stability.
-->
## 未来发展

此特性最初是作为 Alpha 特性引入的，位于默认情况下禁用的特性门控之下。
在 Alpha 阶段，我们（Kubernetes SIG Storage）将收集最终用户的反馈并解决发现的任何问题或改进。

一旦收到足够的反馈，或者没有收到投诉，该特性就可以进入 Beta 阶段。
Beta 阶段将使我们能够进一步验证实施并确保其稳定性。

<!--
At least two Kubernetes releases will happen between the release where this field graduates
to beta and the release that graduates the field to general availability (GA). That means that
the earliest release where this field could be generally available is Kubernetes 1.32,
likely to be scheduled for early 2025.
-->
在该字段升级到 Beta 级别和将该字段升级为通用版 (GA) 的版本之间，至少会经过两个 Kubernetes 版本。
这意味着该字段 GA 的最早版本是 Kubernetes 1.32，可能计划于 2025 年初发布。

<!--
## Getting involved

We always welcome new contributors so if you would like to get involved you can
join our [Kubernetes Storage Special-Interest-Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG).
-->
## 欢迎参与

我们始终欢迎新的贡献者，因此如果你想参与其中，可以加入我们的
[Kubernetes 存储特殊兴趣小组](https://github.com/kubernetes/community/tree/master/sig-storage)（SIG）。

<!--
If you would like to share feedback, you can do so on our
[public Slack channel](https://app.slack.com/client/T09NY5SBT/C09QZFCE5).
If you're not already part of that Slack workspace, you can visit https://slack.k8s.io/ for an invitation.
-->
如果你想分享反馈，可以在我们的 [公共 Slack 频道](https://app.slack.com/client/T09NY5SBT/C09QZFCE5)上分享。
如果你尚未加入 Slack 工作区，可以访问 https://slack.k8s.io/ 获取邀请。

<!--
Special thanks to all the contributors that provided great reviews, shared valuable insight and helped implement this feature (alphabetical order):
-->
特别感谢所有提供精彩评论、分享宝贵意见并帮助实现此特性的贡献者（按字母顺序排列）：

- Han Kang ([logicalhan](https://github.com/logicalhan))
- Jan Šafránek ([jsafrane](https://github.com/jsafrane))
- Jordan Liggitt ([liggitt](https://github.com/liggitt))
- Kiki ([carlory](https://github.com/carlory))
- Michelle Au ([msau42](https://github.com/msau42))
- Tim Bannister ([sftim](https://github.com/sftim))
- Wojciech Tyczynski ([wojtek-t](https://github.com/wojtek-t))
- Xing Yang ([xing-yang](https://github.com/xing-yang))
