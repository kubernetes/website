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
    toVersion: ""
---

When enabled, the CSINode.Spec.Drivers[*].Allocatable.Count field becomes mutable. CSI drivers can define update intervals through the CSIDriver.Spec.NodeAllocatableUpdatePeriodSeconds field.
