---
title: HugepageAwareEviction
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.37"
---
  
<!--
Subtracts hugepage capacity from `memory.available` so the kubelet's eviction
signal reflects actual regular-memory availability. Without this gate, hugepage
reservations inflate `AvailableBytes`, delaying eviction and causing OOM kills
on nodes with hugepages configured.
-->
从 `memory.available` 中减去巨页（HugePage）容量，使
kubelet 的驱逐信号能够反映真实的常规内存可用量。
如果不启用此特性门控，巨页预留会抬高 `AvailableBytes`，
从而延迟驱逐，并导致在配置了巨页的节点上发生 OOM 终止。
