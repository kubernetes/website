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
When `PreferAlignCpusByUncoreCache` is enabled while the CPU Manager Policy is set to `static`, containers within a `Guaranteed` pod will individually be aligned to an uncore cache group at a best-effort policy. This feature can optimize performance for certain cache-sensitive workloads by minimizing the cpu allocation across uncore caches.
