---
title: ReduceDefaultCrashLoopBackOffDecay
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.33"
---

<!--
Enabled reduction of both the initial delay and the maximum delay accrued
between container restarts for a node for containers in `CrashLoopBackOff`
across the cluster to `1s` initial delay and `60s` maximum delay.
-->
允許減少節點上容器在 `CrashLoopBackOff` 狀態下重啓時出現的初始延遲和最大延遲，
可以在整個叢集將初始延遲設置爲 `1s`，最大延遲設置爲 `60s`。
