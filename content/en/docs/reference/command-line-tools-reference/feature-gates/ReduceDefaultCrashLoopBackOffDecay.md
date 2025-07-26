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
Enable the reduction of delays accrued between container restarts due to `CrashLoopBackOff`.
When enabled, the initial delay is reduced to `1s` and the maximum delay is reduced to `60s`.
