---
title: MemoryQoS
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.22"
    toVersion: "1.36"
  - stage: beta
    defaultValue: true
    fromVersion: "1.37"
---
Enable memory protection and usage throttling for Pods and containers using
the cgroup v2 memory controller. When `memoryThrottlingFactor` is set, the
`kubelet` sets `memory.high` for throttling on Burstable and BestEffort
containers. The `kubelet` optionally sets `memory.min` and `memory.low` for
tiered memory protection when `memoryReservationPolicy` is set to
`TieredReservation`. Feature requires both - feature gate enablement and
`kubelet` configuration setting.