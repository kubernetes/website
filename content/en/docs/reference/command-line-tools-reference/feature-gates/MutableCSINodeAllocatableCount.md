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
    toVersion: "1.34"
  - stage: beta
    defaultValue: true
    fromVersion: "1.35"
---
When this feature gate is enabled, the `.spec.drivers[*].allocatable.count` field of a CSINode becomes mutable, and a new field, `nodeAllocatableUpdatePeriodSeconds`, is available in the CSIDriver object. This allows periodic updates to a node's reported allocatable volume capacity, preventing stateful pods from becoming stuck due to outdated information that the kube-scheduler relies on.
