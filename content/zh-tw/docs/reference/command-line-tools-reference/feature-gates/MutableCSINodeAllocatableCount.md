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
啓用此特性門控時，CSINode 的 `.spec.drivers[*].allocatable.count` 字段成爲可變更的，
並且 `CSIDriver` 對象中將新增一個字段 `NodeAllocatableUpdatePeriodSeconds`。
這允許定期更新節點上可分配卷容量的信息，從而避免由於 `kube-scheduler` 依賴的過時信息而導致有狀態 Pod 卡滯的問題。
