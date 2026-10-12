---
title: DRANodeAllocatableResources
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
---

<!--
Enables the `kube-scheduler` to incorporate Node Allocatable resources (such as
CPU, memory, and hugepages) managed by Dynamic Resource Allocation (DRA) into
its standard node resource accounting.

When enabled, DRA drivers can use the `nodeAllocatableResources` field on
`ResourceSlice` devices to specify how their devices consume node allocatable
resources. This field supports two different use cases:
- `mapping`: For drivers that directly provide a native node resource (e.g., a CPU
  or Memory DRA driver). It supports scaling capacities or device counts.
- `overhead`: For devices that require auxiliary node dependencies (e.g., an
  accelerator that consumes host memory). It supports per-pod or per-container costs.
-->
使 `kube-scheduler` 能够将动态资源分配（DRA）管理的节点可分配资源
（例如 CPU、内存和巨页）纳入其标准节点资源统计中。

启用后，DRA 驱动程序可以使用 `ResourceSlice` 设备上的
`nodeAllocatableResources` 字段，指定其设备如何消耗节点可分配资源。
此字段支持两种不同的使用场景：
- `mapping`：针对直接提供原生节点资源的驱动（例如 CPU 或
  Memory DRA（动态资源分配）驱动）。支持扩缩容量值或设备数量。
- `overhead`：针对需要辅助节点依赖的设备（例如消耗宿主机内存的加速器）。支持按
  Pod 或按容器的成本。

<!--
This allows the scheduler to combine these DRA allocations with standard Pod requests
to prevent node over-subscription during Pod admission. 

It also exposes the `status.nodeAllocatableResourceClaimStatuses` field on the
Pod API to track the resulting resource allocations. The `kubelet` consumes this to
update Pod and container cgroup settings and adjust OOM scores.
-->
这使得调度程序能够将这些 DRA 分配与标准的 Pod 资源请求结合起来，从而在
Pod 准入阶段防止节点资源超额订阅。

它还在 Pod API 上公开 `status.nodeAllocatableResourceClaimStatuses` 字段，
以跟踪生成的资源分配。
`kubelet` 使用此信息来更新 Pod 和容器的 CGroup 设置，并调整 OOM 分数。

<!--
For more information, see
[Node Allocatable Resources](/docs/concepts/resource-management/dynamic-resource-allocation/how-dra-works/#node-allocatable-resources)
in the Dynamic Resource Allocation documentation.
-->
有关更多信息，请参阅动态资源分配文档中的
[节点可分配资源](/zh-cn/docs/concepts/resource-management/dynamic-resource-allocation/how-dra-works/#node-allocatable-resources)。
