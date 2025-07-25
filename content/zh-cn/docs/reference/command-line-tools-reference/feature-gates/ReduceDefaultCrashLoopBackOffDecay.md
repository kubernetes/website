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
允许减少节点上容器在 `CrashLoopBackOff` 状态下重启时出现的初始延迟和最大延迟，
可以在整个集群将初始延迟设置为 `1s`，最大延迟设置为 `60s`。
