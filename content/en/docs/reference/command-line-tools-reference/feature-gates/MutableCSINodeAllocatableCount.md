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
    toVersion: "1.35"
  - stage: stable
    defaultValue: true
    fromVersion: "1.36"
---
Make the `.spec.drivers[*].allocatable.count` field of a CSINode mutable.
Also, enable a CSIDriver field, `nodeAllocatableUpdatePeriodSeconds`.

This allows periodic updates to a node's reported allocatable volume capacity,
preventing stateful pods from becoming stuck due to outdated information
that the kube-scheduler would otherwise rely upon.
