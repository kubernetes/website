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
cgroup v2 memory controller.
-->
使用 cgroup v2 内存控制器为 Pod 或容器启用内存保护和使用限制。
