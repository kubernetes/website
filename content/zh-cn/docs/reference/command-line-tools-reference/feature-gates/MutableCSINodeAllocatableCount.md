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
    toVersion: "1.33"
  - stage: beta
    defaultValue: false
    fromVersion: "1.34"
---

<!--
When this feature gate is enabled, the `.spec.drivers[*].allocatable.count` field of a CSINode becomes mutable, and a new field, `nodeAllocatableUpdatePeriodSeconds`, is available in the CSIDriver object. This allows periodic updates to a node's reported allocatable volume capacity, preventing stateful pods from becoming stuck due to outdated information that the kube-scheduler relies on.
-->
启用此特性门控时，CSINode 的 `.spec.drivers[*].allocatable.count` 字段成为可变更的，
并且 `CSIDriver` 对象中将新增一个字段 `NodeAllocatableUpdatePeriodSeconds`。
这允许定期更新节点上可分配卷容量的信息，从而避免由于 `kube-scheduler` 依赖的过时信息而导致有状态 Pod 卡滞的问题。
