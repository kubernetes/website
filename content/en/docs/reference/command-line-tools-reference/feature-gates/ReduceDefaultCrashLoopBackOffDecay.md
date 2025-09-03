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
Enabled reduction of both the initial delay and the maximum delay accrued
between container restarts for a node for containers in `CrashLoopBackOff`
across the cluster to `1s` initial delay and `60s` maximum delay.