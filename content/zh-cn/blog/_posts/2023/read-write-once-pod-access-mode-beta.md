---
layout: blog
title: "Kubernetes 1.27：持久卷的单个 Pod 访问模式升级到 Beta"
date: 2023-04-20
slug: read-write-once-pod-access-mode-beta
---
<!--
layout: blog
title: "Kubernetes 1.27: Single Pod Access Mode for PersistentVolumes Graduates to Beta"
date: 2023-04-20
slug: read-write-once-pod-access-mode-beta
-->

<!--
**Author:** Chris Henzie (Google)
-->
**作者**：Chris Henzie (Google)

**译者**：顾欣 (ICBC)

<!--
With the release of Kubernetes v1.27 the ReadWriteOncePod feature has graduated
to beta. In this blog post, we'll take a closer look at this feature, what it
does, and how it has evolved in the beta release.
-->
随着 Kubernetes v1.27 的发布，ReadWriteOncePod 功能已经升级为 Beta 版。
在这篇博客文章中，我们将更详细地介绍这个功能，作用以及在 Beta 版本中的发展。

<!--
## What is ReadWriteOncePod?
-->
## 什么是 ReadWriteOncePod  {#what-is-readwriteoncepod}

<!--
ReadWriteOncePod is a new access mode for
[PersistentVolumes](/docs/concepts/storage/persistent-volumes/#persistent-volumes) (PVs)
and [PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) (PVCs)
introduced in Kubernetes v1.22. This access mode enables you to restrict volume
access to a single pod in the cluster, ensuring that only one pod can write to
the volume at a time. This can be particularly useful for stateful workloads
that require single-writer access to storage.
-->
ReadWriteOncePod 是 Kubernetes 在 v1.22 中引入的一种新的访问模式，
适用于 [PersistentVolume](/zh-cn/docs/concepts/storage/persistent-volumes/#persistent-volumes)(PVs)
和 [PersistentVolumeClaim](/zh-cn/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)(PVCs)。
此访问模式使你能够将存储卷访问限制在集群中的单个 Pod 上，确保一次只有一个 Pod 可以写入存储卷。
这可能对需要单一写入者访问存储的有状态工作负载特别有用。

<!--
For more context on access modes and how ReadWriteOncePod works read
[What are access modes and why are they important?](/blog/2021/09/13/read-write-once-pod-access-mode-alpha/#what-are-access-modes-and-why-are-they-important)
in the _Introducing Single Pod Access Mode for PersistentVolumes_ article from 2021.
-->
要了解有关访问模式和 ReadWriteOncePod 如何工作的更多背景信息，
请阅读 2021 年介绍 PersistentVolume 的单个 Pod 访问模式的文章中的[什么是访问模式和为什么它们如此重要？](/blog/2021/09/13/read-write-once-pod-access-mode-alpha/#what-are-access-modes-and-why-are-they-important)。

<!--
## Changes in the ReadWriteOncePod beta
-->
## ReadWriteOncePod 的 Beta 版中变化  {#changes-in-the-readwriteoncepod-beta}

<!--
The ReadWriteOncePod beta adds support for
[scheduler preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
of pods using ReadWriteOncePod PVCs.
-->
ReadWriteOncePod Beta 版为使用 ReadWriteOncePod PVC 的 Pod 添加[调度器抢占](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)。

<!--
Scheduler preemption allows higher-priority pods to preempt lower-priority pods,
so that they can start running on the same node. With this release, pods using
ReadWriteOncePod PVCs can also be preempted if a higher-priority pod requires
the same PVC.
-->
调度器抢占允许更高优先级的 Pod 抢占较低优先级的 Pod，以便它们可以在同一节点上运行。
在此版本中，如果更高优先级的 Pod 需要相同的 PVC，使用 ReadWriteOncePod PVCs 的 Pod 也可以被抢占。

<!--
## How can I start using ReadWriteOncePod?
-->
## 如何开始使用 ReadWriteOncePod？  {#how-can-i-start-using-readwriteoncepod}

<!--
With ReadWriteOncePod now in beta, it will be enabled by default in cluster
versions v1.27 and beyond.
-->
随着 ReadWriteOncePod 现已升级为 Beta 版，在 v1.27 及更高版本的集群中将默认启用该功能。

<!--
Note that ReadWriteOncePod is
[only supported for CSI volumes](/docs/concepts/storage/persistent-volumes/#access-modes).
Before using this feature you will need to update the following
[CSI sidecars](https://kubernetes-csi.github.io/docs/sidecar-containers.html)
to these versions or greater:
-->
请注意，ReadWriteOncePod [仅支持 CSI 卷](/zh-cn/docs/concepts/storage/persistent-volumes/#access-modes)。
在使用此功能之前，你需要将以下 [CSI Sidecars](https://kubernetes-csi.github.io/docs/sidecar-containers.html)更新至以下版本或更高版本：

<!--
- [csi-provisioner:v3.0.0+](https://github.com/kubernetes-csi/external-provisioner/releases/tag/v3.0.0)
- [csi-attacher:v3.3.0+](https://github.com/kubernetes-csi/external-attacher/releases/tag/v3.3.0)
- [csi-resizer:v1.3.0+](https://github.com/kubernetes-csi/external-resizer/releases/tag/v1.3.0)
-->
- [csi-provisioner:v3.0.0+](https://github.com/kubernetes-csi/external-provisioner/releases/tag/v3.0.0)
- [csi-attacher:v3.3.0+](https://github.com/kubernetes-csi/external-attacher/releases/tag/v3.3.0)
- [csi-resizer:v1.3.0+](https://github.com/kubernetes-csi/external-resizer/releases/tag/v1.3.0)

<!--
To start using ReadWriteOncePod, create a PVC with the ReadWriteOncePod access mode:
-->
要开始使用 ReadWriteOncePod，请创建具有 ReadWriteOncePod 访问模式的 PVC：

```yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: single-writer-only
spec:
  accessModes:
  - ReadWriteOncePod #仅允许一个容器访问且独占写入权限。
  resources:
    requests:
      storage: 1Gi
```

<!--
If your storage plugin supports
[dynamic provisioning](/docs/concepts/storage/dynamic-provisioning/),
new PersistentVolumes will be created with the ReadWriteOncePod access mode applied.

Read [Migrating existing PersistentVolumes](/blog/2021/09/13/read-write-once-pod-access-mode-alpha/#migrating-existing-persistentvolumes)
for details on migrating existing volumes to use ReadWriteOncePod.
-->
如果你的存储插件支持[动态制备](/zh-cn/docs/concepts/storage/dynamic-provisioning/)，
新创建的持久卷将应用 ReadWriteOncePod 访问模式。

阅读[迁移现有持久卷](/blog/2021/09/13/read-write-once-pod-access-mode-alpha/#migrating-existing-persistentvolumes)
以了解如何迁移现有卷以使用 ReadWriteOncePod。

<!--
## How can I learn more?
-->
## 如何了解更多信息？ {#how-can-i-learn-more}

<!--
Please see the [alpha blog post](/blog/2021/09/13/read-write-once-pod-access-mode-alpha)
and [KEP-2485](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/2485-read-write-once-pod-pv-access-mode/README.md)
for more details on the ReadWriteOncePod access mode and motivations for CSI spec changes.
-->
请查看 [Alpha 版博客](/blog/2021/09/13/read-write-once-pod-access-mode-alpha)和
[KEP-2485](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/2485-read-write-once-pod-pv-access-mode/README.md)
以了解关于 ReadWriteOncePod 访问模式的更多详细信息以及对 CSI 规约作更改的动机。

<!--
## How do I get involved?
-->
## 如何参与？ {#how-do-i-get-involved}

<!--
The [Kubernetes #csi Slack channel](https://kubernetes.slack.com/messages/csi)
and any of the standard
[SIG Storage communication channels](https://github.com/kubernetes/community/blob/master/sig-storage/README.md#contact)
are great mediums to reach out to the SIG Storage and the CSI teams.
-->
[Kubernetes #csi Slack](https://kubernetes.slack.com/messages/csi)频道以及任何常规的
[SIG 存储沟通渠道](https://github.com/kubernetes/community/blob/master/sig-storage/README.md#contact)
都是联系 SIG 存储和 CSI 团队的最佳途径。

<!--
Special thanks to the following people whose thoughtful reviews and feedback helped shape this feature:
-->
特别感谢以下人士的仔细的审查和反馈，帮助完成了这个功能：

<!--
* Abdullah Gharaibeh (ahg-g)
* Aldo Culquicondor (alculquicondor)
* Antonio Ojea (aojea)
* David Eads (deads2k)
* Jan Šafránek (jsafrane)
* Joe Betz (jpbetz)
* Kante Yin (kerthcet)
* Michelle Au (msau42)
* Tim Bannister (sftim)
* Xing Yang (xing-yang)
-->
* Abdullah Gharaibeh (ahg-g)
* Aldo Culquicondor (alculquicondor)
* Antonio Ojea (aojea)
* David Eads (deads2k)
* Jan Šafránek (jsafrane)
* Joe Betz (jpbetz)
* Kante Yin (kerthcet)
* Michelle Au (msau42)
* Tim Bannister (sftim)
* Xing Yang (xing-yang)

<!--
If you’re interested in getting involved with the design and development of CSI
or any part of the Kubernetes storage system, join the
[Kubernetes Storage Special Interest Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG).
We’re rapidly growing and always welcome new contributors.
-->
如果您有兴趣参与 CSI 或 Kubernetes 存储系统的任何部分的设计和开发，
请加入 [Kubernetes 存储特别兴趣小组](https://github.com/kubernetes/community/tree/master/sig-storage)(SIG)。
我们正在迅速发展，始终欢迎新的贡献者。