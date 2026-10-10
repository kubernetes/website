---
content_type: "reference"
title: Linux 节点的交换（Swap）行为
weight: 110
---

<!--
content_type: "reference"
title: Linux Node Swap Behaviors
weight: 110
-->

<!--
To allow Kubernetes workloads to use swap, on a Linux node,
you must disable the kubelet's default behavior of failing when swap is detected,
and specify memory-swap behavior as `LimitedSwap`:
-->
要允许 Kubernetes 工作负载在 Linux 节点上使用交换分区，
你必须禁用 kubelet 在检测到交换分区时失败的默认行为，
并指定内存交换行为为 `LimitedSwap`：

<!--
The available choices for swap behavior are:
-->
可用的交换行为选项有：

<!--
`NoSwap`
: (default) Workloads running as Pods on this node do not and cannot use swap. However, processes
  outside of Kubernetes' scope, such as system daemons (including the kubelet itself!) **can** utilize swap.
  This behavior is beneficial for protecting the node from system-level memory spikes,
  but it does not safeguard the workloads themselves from such spikes.
-->
`NoSwap`
: （默认）在此节点上作为 Pod 运行的工作负载不会也不能使用交换分区。
   然而，系统守护进程（包括 kubelet 本身！）等这类 Kubernetes 范围之外的进程**可以**利用交换分区。
   这种行为有助于保护节点免受系统级别的内存峰值影响，
   但这不能保护工作负载本身不受此类峰值的影响。

<!--
`LimitedSwap`
: Kubernetes workloads can utilize swap memory. The amount of swap available to a Pod is determined automatically.

To learn more, read [swap memory management](/docs/concepts/cluster-administration/swap-memory-management/).
-->
`LimitedSwap`
: Kubernetes 工作负载可以使用交换内存，Pod 可用的交换量是自动确定的。

要了解更多，请阅读[交换内存管理](/zh-cn/docs/concepts/cluster-administration/swap-memory-management/)。
