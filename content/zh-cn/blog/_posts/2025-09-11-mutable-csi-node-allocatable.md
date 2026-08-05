---
layout: blog
title: "Kubernetes v1.34：可变 CSI 节点可分配数进阶至 Beta"
date: 2025-09-11T10:30:00-08:00
slug: kubernetes-v1-34-mutable-csi-node-allocatable-count
author: Eddie Torres (Amazon Web Services)
translator: Michael Yao (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes v1.34: Mutable CSI Node Allocatable Graduates to Beta"
date: 2025-09-11T10:30:00-08:00
slug: kubernetes-v1-34-mutable-csi-node-allocatable-count
author: Eddie Torres (Amazon Web Services)
-->

<!--
The [functionality for CSI drivers to update information about attachable volume count on the nodes](https://kep.k8s.io/4876), first introduced as Alpha in Kubernetes v1.33, has graduated to **Beta** in the Kubernetes v1.34 release! This marks a significant milestone in enhancing the accuracy of stateful pod scheduling by reducing failures due to outdated attachable volume capacity information.
-->
[CSI 驱动更新节点上可挂接卷数量信息的这一功能](https://kep.k8s.io/4876)在 Kubernetes v1.33
中首次以 Alpha 引入，如今在 Kubernetes v1.34 中进阶为 **Beta**！
这是提升有状态 Pod 调度准确性的重要里程碑，可减少因可挂接卷容量信息过时所导致的调度失败问题。

<!--
## Background

Traditionally, Kubernetes [CSI drivers](https://kubernetes-csi.github.io/docs/introduction.html) report a static maximum volume attachment limit when initializing. However, actual attachment capacities can change during a node's lifecycle for various reasons, such as:
-->
## 背景 {#background}

传统上，Kubernetes 的
[CSI 驱动](https://kubernetes-csi.github.io/docs/introduction.html)在初始化时会报告一个静态的最大卷挂接限制。
然而，在节点的生命周期中，实际的挂接数量可能因各种原因发生变化，例如：

<!--
- Manual or external operations attaching/detaching volumes outside of Kubernetes control.
- Dynamically attached network interfaces or specialized hardware (GPUs, NICs, etc.) consuming available slots.
- Multi-driver scenarios, where one CSI driver’s operations affect available capacity reported by another.

Static reporting can cause Kubernetes to schedule pods onto nodes that appear to have capacity but don't, leading to pods stuck in a `ContainerCreating` state.
-->
- 在 Kubernetes 控制之外的手动或外部卷挂接/解除挂接操作。
- 动态挂接的网络接口或专用硬件（GPU、NIC 等）消耗可用的插槽。
- 在多驱动场景中，一个 CSI 驱动的操作影响另一个驱动所报告的可用容量。

静态报告可能导致 Kubernetes 将 Pod 调度到看似有容量但实际上没有容量的节点上，
从而导致 Pod 卡在 `ContainerCreating` 状态。

<!--
## Dynamically adapting CSI volume limits

With this new feature, Kubernetes enables CSI drivers to dynamically adjust and report node attachment capacities at runtime. This ensures that the scheduler, as well as other components relying on this information, have the most accurate, up-to-date view of node capacity.
-->
## 动态调整 CSI 卷限制 {#dynamically-adapting-csi-volume-limits}

借助这一新特性，Kubernetes 允许 CSI 驱动在运行时动态调整并报告节点的卷挂接数量。
这一特性可确保调度器以及依赖此信息的其他组件能够获得最准确、最新的节点容量信息。

<!--
### How it works

Kubernetes supports two mechanisms for updating the reported node volume limits:

- **Periodic Updates:** CSI drivers specify an interval to periodically refresh the node's allocatable capacity.
- **Reactive Updates:** An immediate update triggered when a volume attachment fails due to exhausted resources (`ResourceExhausted` error).
-->
### 工作原理 {#how-it-works}

Kubernetes 支持两种机制来更新所报告的节点卷限制：

- **周期性更新：** CSI 驱动指定一个时间间隔，定期刷新节点的可分配容量。
- **触发式更新：** 当卷挂接因资源耗尽（`ResourceExhausted` 错误）而失败时触发立即更新。

<!--
### Enabling the feature

To use this beta feature, the `MutableCSINodeAllocatableCount` feature gate must be enabled in these components:
-->
### 启用特性 {#enabling-the-feature}

要使用此 Beta 特性，必须在以下组件中启用 `MutableCSINodeAllocatableCount` 特性门控：

- `kube-apiserver`
- `kubelet`

<!--
### Example CSI driver configuration

Below is an example of configuring a CSI driver to enable periodic updates every 60 seconds:
-->
### 示例 CSI 驱动配置

以下是配置 CSI 驱动以启用每 60 秒周期性更新一次的示例：

```yaml
apiVersion: storage.k8s.io/v1
kind: CSIDriver
metadata:
  name: example.csi.k8s.io
spec:
  nodeAllocatableUpdatePeriodSeconds: 60
```

<!--
This configuration directs kubelet to periodically call the CSI driver's `NodeGetInfo` method every 60 seconds, updating the node’s allocatable volume count. Kubernetes enforces a minimum update interval of 10 seconds to balance accuracy and resource usage.

### Immediate updates on attachment failures

When a volume attachment operation fails due to a `ResourceExhausted` error (gRPC code `8`), Kubernetes immediately updates the allocatable count instead of waiting for the next periodic update. The Kubelet then marks the affected pods as Failed, enabling their controllers to recreate them. This prevents pods from getting permanently stuck in the `ContainerCreating` state.
-->
此配置指示 kubelet 每隔 60 秒调用一次 CSI 驱动的 `NodeGetInfo` 方法，以更新节点的可分配卷数。
Kubernetes 强制要求更新时间间隔最小为 10 秒，目的是在准确性与资源消耗间达成平衡。

### 挂接失败时立即更新

当卷挂接操作因 `ResourceExhausted` 错误（gRPC 代码 `8`）而失败时，Kubernetes 会立即更新可分配数量，
而不是等待下一次周期性更新。随后 kubelet 会将受影响的 Pod 标记为 Failed，使其控制器能够重新创建这些 Pod。
这样可以防止 Pod 永久卡在 `ContainerCreating` 状态。

<!--
## Getting started

To enable this feature in your Kubernetes v1.34 cluster:

1. Enable the feature gate `MutableCSINodeAllocatableCount` on the `kube-apiserver` and `kubelet` components.
2. Update your CSI driver configuration by setting `nodeAllocatableUpdatePeriodSeconds`.
3. Monitor and observe improvements in scheduling accuracy and pod placement reliability.
-->
## 快速入门 {#getting-started}

要在 Kubernetes v1.34 集群中启用此特性：

1. 在 `kube-apiserver` 和 `kubelet` 组件上启用特性门控 `MutableCSINodeAllocatableCount`。
2. 通过设置 `nodeAllocatableUpdatePeriodSeconds`，更新你的 CSI 驱动配置。
3. 监控并观察调度准确性和 Pod 调度可靠性的提升。

<!--
## Next steps

This feature is currently in beta and the Kubernetes community welcomes your feedback. Test it, share your experiences, and help guide its evolution to GA stability.

Join discussions in the [Kubernetes Storage Special Interest Group (SIG-Storage)](https://github.com/kubernetes/community/tree/master/sig-storage) to shape the future of Kubernetes storage capabilities.
-->
## 下一步 {#next-steps}

此特性目前处于 Beta，Kubernetes 社区欢迎你的反馈。请测试、分享你的经验，并帮助推动其发展至 GA（正式发布）稳定版。

欢迎加入 [Kubernetes SIG-Storage](https://github.com/kubernetes/community/tree/master/sig-storage)
参与讨论，共同塑造 Kubernetes 存储能力的未来。
