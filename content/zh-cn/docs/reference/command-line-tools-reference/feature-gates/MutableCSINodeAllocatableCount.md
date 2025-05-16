---
title: MutableCSINodeAllocatableCount
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.33"
---

<!--
When this feature gate is enabled, the `CSINode.Spec.Drivers[*].Allocatable.Count` field becomes mutable, and a new field, `NodeAllocatableUpdatePeriodSeconds`, is available in the `CSIDriver` object. This allows periodic updates to a node's reported allocatable volume capacity, preventing stateful pods from becoming stuck due to outdated information that `kube-scheduler` relies on.
-->
启用此特性门控时，`CSINode.Spec.Drivers[*].Allocatable.Count` 字段成为可变更的，
并且 `CSIDriver` 对象中将新增一个字段 `NodeAllocatableUpdatePeriodSeconds`。
这允许定期更新节点上可分配卷容量的信息，从而避免由于 `kube-scheduler` 依赖的过时信息而导致有状态 Pod 卡滞的问题。
