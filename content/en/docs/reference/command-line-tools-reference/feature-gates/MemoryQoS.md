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
cgroup v2 memory controller. Sets `memory.high` for throttling on Burstable
pods, and optionally sets `memory.min` / `memory.low` for tiered memory
protection when `memoryReservationPolicy` is set to `TieredReservation`.
