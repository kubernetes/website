---
title: 存储容量
content_type: concept
weight: 45
---

<!-- overview -->
<!--
Storage capacity is limited and may vary depending on the node on
which a pod runs: network-attached storage might not be accessible by
all nodes, or storage is local to a node to begin with.

{{< feature-state for_k8s_version="v1.19" state="alpha" >}}
{{< feature-state for_k8s_version="v1.21" state="beta" >}}

This page describes how Kubernetes keeps track of storage capacity and
how the scheduler uses that information to schedule Pods onto nodes
that have access to enough storage capacity for the remaining missing
volumes. Without storage capacity tracking, the scheduler may choose a
node that doesn't have enough capacity to provision a volume and
multiple scheduling retries will be needed.

Tracking storage capacity is supported for {{< glossary_tooltip
text="Container Storage Interface" term_id="csi" >}} (CSI) drivers and
[needs to be enabled](#enabling-storage-capacity-tracking) when installing a CSI driver.
-->
存储容量是有限的，并且会因为运行 Pod 的节点不同而变化：
网络存储可能并非所有节点都能够访问，或者对于某个节点存储是本地的。

{{< feature-state for_k8s_version="v1.19" state="alpha" >}}
{{< feature-state for_k8s_version="v1.21" state="beta" >}}

本页面描述了 Kubernetes 如何跟踪存储容量以及调度程序如何为了余下的尚未挂载的卷使用该信息将
Pod 调度到能够访问到足够存储容量的节点上。
如果没有跟踪存储容量，调度程序可能会选择一个没有足够容量来提供卷的节点，并且需要多次调度重试。

{{< glossary_tooltip text="容器存储接口" term_id="csi" >}}（CSI）驱动程序支持跟踪存储容量，
并且在安装 CSI 驱动程序时[需要启用](#enabling-storage-capacity-tracking)该功能。

<!-- body -->
<!--
## API

There are two API extensions for this feature:
- CSIStorageCapacity objects:
  these get produced by a CSI driver in the namespace
  where the driver is installed. Each object contains capacity
  information for one storage class and defines which nodes have
  access to that storage.
- [The `CSIDriverSpec.StorageCapacity` field](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#csidriverspec-v1-storage-k8s-io):
  when set to `true`, the Kubernetes scheduler will consider storage
  capacity for volumes that use the CSI driver.
-->
## API

这个特性有两个 API 扩展接口：
- CSIStorageCapacity 对象：这些对象由 CSI 驱动程序在安装驱动程序的命名空间中产生。
  每个对象都包含一个存储类的容量信息，并定义哪些节点可以访问该存储。
- [`CSIDriverSpec.StorageCapacity` 字段](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#csidriverspec-v1-storage-k8s-io)：
  设置为 true 时，Kubernetes 调度程序将考虑使用 CSI 驱动程序的卷的存储容量。

<!--
## Scheduling

Storage capacity information is used by the Kubernetes scheduler if:
- the `CSIStorageCapacity` feature gate is true,
- a Pod uses a volume that has not been created yet,
- that volume uses a {{< glossary_tooltip text="StorageClass" term_id="storage-class" >}} which references a CSI driver and
  uses `WaitForFirstConsumer` [volume binding
  mode](/docs/concepts/storage/storage-classes/#volume-binding-mode),
  and
- the `CSIDriver` object for the driver has `StorageCapacity` set to
  true.

In that case, the scheduler only considers nodes for the Pod which
have enough storage available to them. This check is very
simplistic and only compares the size of the volume against the
capacity listed in `CSIStorageCapacity` objects with a topology that
includes the node.

For volumes with `Immediate` volume binding mode, the storage driver
decides where to create the volume, independently of Pods that will
use the volume. The scheduler then schedules Pods onto nodes where the
volume is available after the volume has been created.

For [CSI ephemeral volumes](/docs/concepts/storage/volumes/#csi),
scheduling always happens without considering storage capacity. This
is based on the assumption that this volume type is only used by
special CSI drivers which are local to a node and do not need
significant resources there.
-->
## 调度

如果有以下情况，存储容量信息将会被 Kubernetes 调度程序使用：
- `CSIStorageCapacity` 特性门控被设置为 true，
- Pod 使用的卷还没有被创建，
- 卷使用引用了 CSI 驱动的 {{< glossary_tooltip text="StorageClass" term_id="storage-class" >}}，
并且使用了 `WaitForFirstConsumer` [卷绑定模式](/zh/docs/concepts/storage/storage-classes/#volume-binding-mode)，
- 驱动程序的 `CSIDriver` 对象的 `StorageCapacity` 被设置为 true。

在这种情况下，调度程序仅考虑将 Pod 调度到有足够存储容量的节点上。这个检测非常简单，
仅将卷的大小与 `CSIStorageCapacity` 对象中列出的容量进行比较，并使用包含该节点的拓扑。

对于具有 `Immediate` 卷绑定模式的卷，存储驱动程序将决定在何处创建该卷，而不取决于将使用该卷的 Pod。
然后，调度程序将 Pod 调度到创建卷后可使用该卷的节点上。

对于 [CSI 临时卷](/zh/docs/concepts/storage/volumes/#csi)，调度总是在不考虑存储容量的情况下进行。
这是基于这样的假设：该卷类型仅由节点本地的特殊 CSI 驱动程序使用，并且不需要大量资源。

<!--
## Rescheduling

When a node has been selected for a Pod with `WaitForFirstConsumer`
volumes, that decision is still tentative. The next step is that the
CSI storage driver gets asked to create the volume with a hint that the
volume is supposed to be available on the selected node.

Because Kubernetes might have chosen a node based on out-dated
capacity information, it is possible that the volume cannot really be
created. The node selection is then reset and the Kubernetes scheduler
tries again to find a node for the Pod.
-->
## 重新调度

当为带有 `WaitForFirstConsumer` 的卷的 Pod 来选择节点时，该决定仍然是暂定的。
下一步是要求 CSI 存储驱动程序创建卷，并提示该卷在被选择的节点上可用。

因为 Kubernetes 可能会根据已经过时的存储容量信息来选择一个节点，因此可能无法真正创建卷。
然后就会重置节点选择，Kubernetes 调度器会再次尝试为 Pod 查找节点。

<!--
## Limitations

Storage capacity tracking increases the chance that scheduling works
on the first try, but cannot guarantee this because the scheduler has
to decide based on potentially out-dated information. Usually, the
same retry mechanism as for scheduling without any storage capacity
information handles scheduling failures.

One situation where scheduling can fail permanently is when a Pod uses
multiple volumes: one volume might have been created already in a
topology segment which then does not have enough capacity left for
another volume. Manual intervention is necessary to recover from this,
for example by increasing capacity or deleting the volume that was
already created. [Further
work](https://github.com/kubernetes/enhancements/pull/1703) is needed
to handle this automatically.
-->
## 限制

存储容量跟踪增加了调度器第一次尝试即成功的机会，但是并不能保证这一点，因为调度器必须根据可能过期的信息来进行决策。
通常，与没有任何存储容量信息的调度相同的重试机制可以处理调度失败。

当 Pod 使用多个卷时，调度可能会永久失败：一个卷可能已经在拓扑段中创建，而该卷又没有足够的容量来创建另一个卷，
要想从中恢复，必须要进行手动干预，比如通过增加存储容量或者删除已经创建的卷。
需要[进一步工作](https://github.com/kubernetes/enhancements/pull/1703)来自动处理此问题。

<!--
## Enabling storage capacity tracking

Storage capacity tracking is a beta feature and enabled by default in
a Kubernetes cluster since Kubernetes 1.21. In addition to having the
feature enabled in the cluster, a CSI driver also has to support
it. Please refer to the driver's documentation for details.
-->
## 开启存储容量跟踪

从 Kubernetes v1.21 开始，存储容量跟踪功能变为 beta 特性，并在 Kubernetes 集群中默认开启。除了在集群中启用该功能外，CSI 驱动程序也必须支持它并实现对应的接口。有关详细信息，请参阅 CSI 驱动程序的文档。

## {{% heading "whatsnext" %}}

<!--
 - For more information on the design, see the
[Storage Capacity Constraints for Pod Scheduling KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/1472-storage-capacity-tracking/README.md).
- For more information on further development of this feature, see the [enhancement tracking issue #1472](https://github.com/kubernetes/enhancements/issues/1472).
- Learn about [Kubernetes Scheduler](/docs/concepts/scheduling-eviction/kube-scheduler/)
-->
- 想要获得更多该设计的信息，查看
  [Storage Capacity Constraints for Pod Scheduling KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/1472-storage-capacity-tracking/README.md)。
- 有关此功能的进一步开发信息，查看
  [enhancement tracking issue #1472](https://github.com/kubernetes/enhancements/issues/1472)。
- 学习 [Kubernetes 调度器](/zh/docs/concepts/scheduling-eviction/kube-scheduler/)。
