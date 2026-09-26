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

<!--
Enable memory protection and usage throttle on pod / container using
cgroup v2 memory controller. Sets `memory.high` for throttling on Burstable
pods, and optionally sets `memory.min` / `memory.low` for tiered memory
protection when `memoryReservationPolicy` is set to `TieredReservation`.
-->
使用 cgroup v2 内存控制器为 Pod 或容器启用内存保护和使用限制。
在 Burstable Pod 上设置 `memory.high` 以实现内存使用限流；当
`memoryReservationPolicy` 设置为 `TieredReservation`（分层预留）时，
还可选择性地设置 `memory.min` / `memory.low`，用于分层内存保护。
