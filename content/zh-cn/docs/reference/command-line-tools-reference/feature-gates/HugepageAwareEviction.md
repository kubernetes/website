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
从 `memory.available` 中减去 HugePage 容量，使 kubelet
的驱逐信号反映实际可用的常规内存。如果未启用此特性门控，HugePage 预留会使
`AvailableBytes` 虚增，从而延迟驱逐，并在配置了 HugePage 的节点上导致 OOM 终止。
