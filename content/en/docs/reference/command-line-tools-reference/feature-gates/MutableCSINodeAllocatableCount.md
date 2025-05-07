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
When this feature gate is enabled, the `spec.drivers[*].allocatable.count` field for a CSINode object becomes mutable,
and a new field, `nodeAllocatableUpdatePeriodSeconds`, is available in the CSIDriver object.
This allows periodic updates to a node's reported allocatable volume capacity,
preventing stateful Pods from becoming stuck due to outdated information that `kube-scheduler` relies on.
