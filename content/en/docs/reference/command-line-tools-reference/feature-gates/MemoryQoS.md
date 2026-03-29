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
---
Enable memory protection and usage throttle on pod / container using
cgroup v2 memory controller. This feature allows kubelet to set `memory.high`
for throttling and configure tiered memory protection, when `memoryReservationPolicy` kubelet
configuration set to `TieredReservation`, `memory.min` / `memory.low` for memory protection are enabled.
Requires cgroup v2; kubelet warns on kernels older
than 5.9 because `memory.high` throttling can trigger a livelock bug.
