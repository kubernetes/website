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
Enables the kube-scheduler to incorporate Node Allocatable resources (such as
CPU, memory, and hugepages) managed by Dynamic Resource Allocation (DRA) into
its standard node resource accounting.

When enabled, DRA drivers can use the `nodeAllocatableResourceMappings` field on
`ResourceSlice` devices to specify how their devices consume node allocatable
resources. This allows the scheduler to combine these DRA allocations with
standard Pod requests.
It also exposes the `status.nodeAllocatableResourceClaimStatuses` field on the
Pod API to track the resulting resource allocations.
-->
使 kube-scheduler 能够将动态资源分配（DRA）管理的节点可分配资源
（例如 CPU、内存和巨页）纳入其标准节点资源统计中。

启用后，DRA 驱动程序可以使用 `ResourceSlice` 设备上的 `nodeAllocatableResourceMappings` 字段，
指定其设备如何消耗节点可分配资源。
这允许调度器将这些 DRA 分配与标准 Pod 请求结合起来。
它还在 Pod API 上公开 `status.nodeAllocatableResourceClaimStatuses` 字段，
以跟踪生成的资源分配。

<!--
For more information, see
[Node Allocatable Resources](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#node-allocatable-resources)
in the Dynamic Resource Allocation documentation.
-->
有关更多信息，请参阅动态资源分配文档中的
[节点可分配资源](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#node-allocatable-resources)。
