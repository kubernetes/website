---
layout: blog
title: "Kubernetes v1.33：可变的 CSI 节点可分配数"
date: 2025-05-02T10:30:00-08:00
slug: kubernetes-1-33-mutable-csi-node-allocatable-count
author: Eddie Torres (Amazon Web Services)
translator: Michael Yao (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes v1.33: Mutable CSI Node Allocatable Count"
date: 2025-05-02T10:30:00-08:00
slug: kubernetes-1-33-mutable-csi-node-allocatable-count
author: Eddie Torres (Amazon Web Services)
-->

<!--
Scheduling stateful applications reliably depends heavily on accurate information about resource availability on nodes.
Kubernetes v1.33 introduces an alpha feature called *mutable CSI node allocatable count*, allowing Container Storage Interface (CSI) drivers to dynamically update the reported maximum number of volumes that a node can handle.
This capability significantly enhances the accuracy of pod scheduling decisions and reduces scheduling failures caused by outdated volume capacity information.
-->
可靠调度有状态应用极度依赖于节点上资源可用性的准确信息。  
Kubernetes v1.33 引入一个名为**可变的 CSI 节点可分配计数**的 Alpha 特性，允许
CSI（容器存储接口）驱动动态更新节点可以处理的最大卷数量。  
这一能力显著提升 Pod 调度决策的准确性，并减少因卷容量信息过时而导致的调度失败。

<!--
## Background

Traditionally, Kubernetes CSI drivers report a static maximum volume attachment limit when initializing. However, actual attachment capacities can change during a node's lifecycle for various reasons, such as:

- Manual or external operations attaching/detaching volumes outside of Kubernetes control.
- Dynamically attached network interfaces or specialized hardware (GPUs, NICs, etc.) consuming available slots.
- Multi-driver scenarios, where one CSI driver’s operations affect available capacity reported by another.
-->

## 背景   {#background}

传统上，Kubernetes 中的 CSI 驱动在初始化时会报告一个静态的最大卷挂接限制。
然而，在节点生命周期内，实际的挂接容量可能会由于多种原因发生变化，例如：

- 在 Kubernetes 控制之外的手动或外部操作挂接/解除挂接卷。
- 动态挂接的网络接口或专用硬件（如 GPU、NIC 等）占用可用的插槽。
- 在多驱动场景中，一个 CSI 驱动的操作会影响另一个驱动所报告的可用容量。

<!--
Static reporting can cause Kubernetes to schedule pods onto nodes that appear to have capacity but don't, leading to pods stuck in a `ContainerCreating` state.

## Dynamically adapting CSI volume limits

With the new feature gate `MutableCSINodeAllocatableCount`, Kubernetes enables CSI drivers to dynamically adjust and report node attachment capacities at runtime. This ensures that the scheduler has the most accurate, up-to-date view of node capacity.
-->
静态报告可能导致 Kubernetes 将 Pod 调度到看似有容量但实际没有的节点上，进而造成
Pod 长时间卡在 `ContainerCreating` 状态。

## 动态适应 CSI 卷限制   {#dynamically-adapting-csi-volume-limits}

借助新的特性门控 `MutableCSINodeAllocatableCount`，Kubernetes 允许 CSI
驱动在运行时动态调整并报告节点的挂接容量。如此确保调度器能获取到最准确、最新的节点容量信息。

<!--
### How it works

When this feature is enabled, Kubernetes supports two mechanisms for updating the reported node volume limits:

- **Periodic Updates:** CSI drivers specify an interval to periodically refresh the node's allocatable capacity.
- **Reactive Updates:** An immediate update triggered when a volume attachment fails due to exhausted resources (`ResourceExhausted` error).
-->
### 工作原理   {#how-it-works}

启用此特性后，Kubernetes 支持通过以下两种机制来更新节点卷限制的报告值：

- **周期性更新：** CSI 驱动指定一个间隔时间，来定期刷新节点的可分配容量。
- **响应式更新：** 当因资源耗尽（`ResourceExhausted` 错误）导致卷挂接失败时，立即触发更新。

<!--
### Enabling the feature

To use this alpha feature, you must enable the `MutableCSINodeAllocatableCount` feature gate in these components:
-->
### 启用此特性   {#enabling-the-feature}

要使用此 Alpha 特性，你必须在以下组件中启用 `MutableCSINodeAllocatableCount` 特性门控：

- `kube-apiserver`
- `kubelet`

<!--
### Example CSI driver configuration

Below is an example of configuring a CSI driver to enable periodic updates every 60 seconds:
-->
### CSI 驱动配置示例   {#example-csi-driver-configuration}

以下是配置 CSI 驱动以每 60 秒进行一次周期性更新的示例：

```yaml
apiVersion: storage.k8s.io/v1
kind: CSIDriver
metadata:
  name: example.csi.k8s.io
spec:
  nodeAllocatableUpdatePeriodSeconds: 60
```

<!--
This configuration directs Kubelet to periodically call the CSI driver's `NodeGetInfo` method every 60 seconds, updating the node’s allocatable volume count. Kubernetes enforces a minimum update interval of 10 seconds to balance accuracy and resource usage.
-->
此配置会指示 Kubelet 每 60 秒调用一次 CSI 驱动的 `NodeGetInfo` 方法，从而更新节点的可分配卷数量。  
Kubernetes 强制要求最小更新间隔时间为 10 秒，以平衡准确性和资源使用量。

<!--
### Immediate updates on attachment failures

In addition to periodic updates, Kubernetes now reacts to attachment failures. Specifically, if a volume attachment fails with a `ResourceExhausted` error (gRPC code `8`), an immediate update is triggered to correct the allocatable count promptly.

This proactive correction prevents repeated scheduling errors and helps maintain cluster health.
-->
### 挂接失败时的即时更新   {#immediate-updates-on-attachment-failures}

除了周期性更新外，Kubernetes 现在也能对挂接失败做出响应。  
具体来说，如果卷挂接由于 `ResourceExhausted` 错误（gRPC 错误码 `8`）而失败，将立即触发更新，以快速纠正可分配数量。

这种主动纠正可以防止重复的调度错误，有助于保持集群的健康状态。

<!--
## Getting started

To experiment with mutable CSI node allocatable count in your Kubernetes v1.33 cluster:

1. Enable the feature gate `MutableCSINodeAllocatableCount` on the `kube-apiserver` and `kubelet` components.
2. Update your CSI driver configuration by setting `nodeAllocatableUpdatePeriodSeconds`.
3. Monitor and observe improvements in scheduling accuracy and pod placement reliability.
-->
## 快速开始    {#getting-started}

要在 Kubernetes v1.33 集群中试用可变的 CSI 节点可分配数：

1. 在 `kube-apiserver` 和 `kubelet` 组件上启用特性门控 `MutableCSINodeAllocatableCount`。
2. 在 CSI 驱动配置中设置 `nodeAllocatableUpdatePeriodSeconds`。
3. 监控并观察调度准确性和 Pod 放置可靠性的提升程度。

<!--
## Next steps

This feature is currently in alpha and the Kubernetes community welcomes your feedback. Test it, share your experiences, and help guide its evolution toward beta and GA stability.

Join discussions in the [Kubernetes Storage Special Interest Group (SIG-Storage)](https://github.com/kubernetes/community/tree/master/sig-storage) to shape the future of Kubernetes storage capabilities.
-->
## 后续计划   {#next-steps}

此特性目前处于 Alpha 阶段，Kubernetes 社区欢迎你的反馈。
无论是参与测试、分享你的经验，都有助于推动此特性向 Beta 和 GA（正式发布）稳定版迈进。

欢迎加入 [Kubernetes SIG-Storage](https://github.com/kubernetes/community/tree/master/sig-storage)
的讨论，共同塑造 Kubernetes 存储能力的未来。
