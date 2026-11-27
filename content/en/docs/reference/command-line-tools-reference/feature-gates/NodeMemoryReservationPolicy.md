---
title: NodeMemoryReservationPolicy
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.38"
---
Enable the `Soft` and `Hard` values for the kubelet configuration field
`memoryReservationPolicy`. The `Soft` policy protects memory requests with
`memory.low`, and the `Hard` policy protects memory requests with `memory.min`.
This feature gate requires the `MemoryQoS` feature gate. For details, see
[Memory QoS with cgroup v2](/docs/concepts/workloads/pods/pod-qos/#memory-qos-with-cgroup-v2).
