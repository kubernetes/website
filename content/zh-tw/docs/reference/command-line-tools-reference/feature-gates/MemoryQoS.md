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
使用 cgroup v2 內存控制器爲 Pod 或容器啓用內存保護和使用限制。
