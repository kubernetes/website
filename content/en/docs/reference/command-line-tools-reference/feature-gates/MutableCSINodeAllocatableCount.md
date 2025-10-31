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
When this feature gate is enabled, the `CSINode.Spec.Drivers[*].Allocatable.Count` field becomes mutable, and a new field, `NodeAllocatableUpdatePeriodSeconds`, is available in the `CSIDriver` object. This allows periodic updates to a node's reported allocatable volume capacity, preventing stateful pods from becoming stuck due to outdated information that `kube-scheduler` relies on.
