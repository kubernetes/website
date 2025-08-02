---
title: SchedulerAsyncPreemption
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
    toVersion: "1.32"
  - stage: beta
    defaultValue: true
    fromVersion: "1.33"
---
Дозволяє запуск деяких вибагливих операцій в межах планувальника, повʼязаних з [випередженням](/docs/concepts/scheduling-eviction/pod-priority-preemption/), асинхронно. Асинхронна обробка випередження покращує загальну продуктивність планування Pod.
