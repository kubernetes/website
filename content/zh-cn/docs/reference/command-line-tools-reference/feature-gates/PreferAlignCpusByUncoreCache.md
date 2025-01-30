---
title: PreferAlignCpusByUncoreCache
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
---

<!--
When `PreferAlignCpusByUncoreCache` is enabled while the CPU Manager Policy is set to `static`,
containers within a `Guaranteed` pod will individually be aligned to an uncore cache group at
a best-effort policy. This feature can optimize performance for certain cache-sensitive workloads
by minimizing the cpu allocation across uncore caches.
-->
当在 CPU 管理器的策略设为 `static` 时启用 `PreferAlignCpusByUncoreCache`，
`Guaranteed` Pod 中的容器将基于尽力而为策略逐个与某个非核心缓存组对齐。
此特性可以通过最小化跨非核心缓存的 CPU 分配量来优化某些对缓存敏感的负载的性能。
