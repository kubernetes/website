---
title: DRAPreemption
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.38"
---
Enables `kube-scheduler` to preempt lower-priority Pods that use Dynamic Resource
Allocation (DRA) devices, wait for preempted Pods' ResourceClaims to be
deallocated, and hold the freed devices for the nominated preemptor.

For more information, see
[Preemption](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#preemption)
in the Dynamic Resource Allocation documentation.
