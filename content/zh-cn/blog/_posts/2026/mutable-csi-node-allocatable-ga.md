---
layout: blog
title: "Kubernetes v1.36：可变 CSI 节点可分配特性正式发布（GA）"
date: 2026-01-14T10:30:00-08:00
slug: kubernetes-v1-36-mutable-csi-node-allocatable-ga
draft: true
author: Eddie Torres (Amazon Web Services)
translator: >
  [Xin Li](https://github.com/my-git9)
---
<!--
layout: blog
title: "Kubernetes v1.36: Mutable CSI Node Allocatable Graduates to GA"
date: 2026-01-14T10:30:00-08:00
slug: kubernetes-v1-36-mutable-csi-node-allocatable-ga
draft: true
author: Eddie Torres (Amazon Web Services)
-->

<!--
On behalf of Kubernetes SIG Storage, I am pleased to announce that the
_mutable CSI node allocatable count_ feature has graduated to General
Availability (GA) in Kubernetes v1.36!

This feature, first introduced as alpha in Kubernetes v1.33 and promoted to beta in
v1.34, allows [Container Storage Interface (CSI)](https://kubernetes-csi.github.io/docs/introduction.html)
drivers to dynamically update the reported maximum number of volumes that a node can handle.
This capability significantly enhances the accuracy of pod scheduling decisions
and reduces scheduling failures caused by outdated volume capacity information.
-->
我很高兴地代表 Kubernetes SIG Storage 社区宣布**可变 CSI 节点可分配计数**特性已在
Kubernetes v1.36 中毕业为正式可用（GA）！

该特性最早在 Kubernetes v1.33 中作为 Alpha 版本引入，并在 v1.34 中提升为 Beta 版本，
它允许[容器存储接口（CSI）](https://kubernetes-csi.github.io/docs/introduction.html)
驱动动态更新报告的节点能够处理的最大卷数量。
此特性显著提高了 Pod 调度决策的准确性，并减少了由于过时的卷容量信息导致的调度失败。

<!--
## Background

Traditionally, Kubernetes CSI drivers report a static maximum volume attachment
limit when initializing. However, actual attachment capacities can change during
a node's lifecycle for various reasons, such as:

- Manual or external operations attaching/detaching volumes outside of Kubernetes control.
- Dynamically attached network interfaces or specialized hardware (GPUs, NICs,
  etc.) consuming available slots.
- Multi-driver scenarios, where one CSI driver's operations affect available
  capacity reported by another.
-->
## 背景

传统上，Kubernetes CSI 驱动在初始化时报告一个静态的最大卷挂载限制。
然而，由于各种原因，在节点的生命周期中实际的挂载容量可能会发生变化，例如：

- 手动或外部操作在 Kubernetes 控制之外附加/分离卷。
- 动态附加网络接口或专用硬件（GPU、NIC 等）消耗可用插槽。
- 多驱动场景下，一个 CSI 驱动的操作影响另一个驱动报告的可用容量。

<!--
Static reporting can cause Kubernetes to schedule pods onto nodes that appear to
have capacity but don't, leading to pods stuck in a `ContainerCreating` state.
-->
静态报告可能导致 Kubernetes 将 Pod 调度到那些看起来有容量但实际上没有的节点上，
导致 Pod 卡在 `ContainerCreating` 状态。

<!--
## Dynamically adapting CSI volume limits

With this feature now GA, Kubernetes enables CSI drivers to dynamically adjust
and report node attachment capacities at runtime. This ensures that the
scheduler, as well as other components relying on this information, have the
most accurate, up-to-date view of node capacity.
-->
## 动态适应 CSI 卷限制

随着此特性现已 GA，Kubernetes 使 CSI 驱动能够在运行时动态调整和报告节点附加容量。
这确保了调度器以及其他依赖此信息的组件能够获得最准确、最新的节点容量视图。

<!--
### How it works

Kubernetes supports two mechanisms for updating the reported node volume limits:

- **Periodic Updates:** CSI drivers specify an interval to periodically refresh
  the node's allocatable capacity.
- **Reactive Updates:** An immediate update triggered when a volume attachment
  fails due to exhausted resources (`ResourceExhausted` error).
-->
### 工作原理

Kubernetes 支持两种更新报告的节点卷限制的机制：

- **定期更新：** CSI 驱动指定一个间隔，以定期刷新节点的可分配容量。
- **反应性更新：** 当卷附加由于资源耗尽（`ResourceExhausted` 错误）失败时触发的立即更新。

<!--
### Example CSI driver configuration

Below is an example of configuring a CSI driver to enable periodic updates every 60 seconds:
-->
### CSI 驱动配置示例

下面是一个配置 CSI 驱动以启用每 60 秒进行一次定期更新的示例：

```yaml
apiVersion: storage.k8s.io/v1
kind: CSIDriver
metadata:
  name: example.csi.k8s.io
spec:
  nodeAllocatableUpdatePeriodSeconds: 60
```

<!--
This configuration directs kubelet to periodically call the CSI driver's
`NodeGetInfo` method every 60 seconds, updating the node's allocatable volume
count. Kubernetes enforces a minimum update interval of 10 seconds to balance
accuracy and resource usage.
-->
此配置指示 kubelet 每 60 秒调用一次 CSI 驱动的 `NodeGetInfo` 方法，
更新节点的可分配卷数量。Kubernetes 强制执行至少 10 秒的更新间隔，以平衡准确性和资源使用。

<!--
### Immediate updates on attachment failures

When a volume attachment operation fails due to a `ResourceExhausted` error
(gRPC code `8`), Kubernetes immediately updates the allocatable count instead of
waiting for the next periodic update. The kubelet then marks the affected pods
as Failed, enabling their controllers to recreate them. This prevents pods from
getting permanently stuck in the `ContainerCreating` state.
-->
### 附件失败时立即更新

当卷附件操作因 `ResourceExhausted` 错误（gRPC 代码 `8`）失败时，Kubernetes
会立即更新可分配计数，而不是等待下一次周期性更新。
然后，kubelet 将受影响的 Pod 标记为 Failed，从而使它们的控制器可以重新创建这些 Pod。
这防止了 Pod 永久卡在 `ContainerCreating` 状态。

<!--
## What's new in GA

With the graduation to GA in Kubernetes v1.36, the
`MutableCSINodeAllocatableCount` feature gate is unconditionally enabled
and cannot be disabled. For any cluster running Kubernetes v1.36 or
later:

- The `.spec.drivers[*].allocatable.count` field of a CSINode is
  mutable.
- The `nodeAllocatableUpdatePeriodSeconds` field is available in the
  CSIDriver spec.
-->
## GA 中的新特性

随着在 Kubernetes v1.36 中升级为 GA，`MutableCSINodeAllocatableCount`
特性门控无条件启用且无法禁用。对于运行 Kubernetes v1.36 或更高版本的所有集群：

- CSINode 的 `.spec.drivers[*].allocatable.count` 字段是可变的。
- `nodeAllocatableUpdatePeriodSeconds` 字段在 CSIDriver 规格中可用。

<!--
## Getting started

To take advantage of this feature in your Kubernetes v1.36 cluster:

1. Update your CSI driver configuration by setting
   `nodeAllocatableUpdatePeriodSeconds` to your desired update interval.
2. Monitor and observe improvements in scheduling accuracy and pod placement reliability.
-->
## 开始使用

要在你的 Kubernetes v1.36 集群中利用此特性：

1. 通过设置 `nodeAllocatableUpdatePeriodSeconds` 为你希望的更新间隔来更新你的
   CSI 驱动配置。
2. 监控并观察调度准确性和 Pod 放置可靠性方面的改进。

<!--
## References

- [KEP-4876: Mutable CSI Node Allocatable Count](https://kep.k8s.io/4876)
- [Alpha Release Blog (v1.33)](/blog/2025/05/02/kubernetes-1-33-mutable-csi-node-allocatable-count/)
- [Beta Release Blog (v1.34)](/blog/2025/09/11/kubernetes-v1-34-mutable-csi-node-allocatable-count/)
-->
## 参考资料

- [KEP-4876：可变 CSI 节点可分配数量](https://kep.k8s.io/4876)
- [Alpha 版本博客（v1.33）](/zh-cn/blog/2025/05/02/kubernetes-1-33-mutable-csi-node-allocatable-count/)
- [Beta 版本博客（v1.34）](/zh-cn/blog/2025/09/11/kubernetes-v1-34-mutable-csi-node-allocatable-count/)

<!--
## Getting involved

This feature was driven by the [SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage)
community. Please join us to connect with the community and share your ideas
and feedback around the above feature and beyond. We look forward to hearing
from you!
-->
## 参与其中

此特性由 [SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage) 
社区推动。请加入我们，与社区联系，分享你对上述特性的想法和反馈。我们期待听到你的声音！
