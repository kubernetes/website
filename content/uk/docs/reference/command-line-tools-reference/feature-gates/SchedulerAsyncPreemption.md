---
title: SchedulerAsyncPreemption
content_type: feature_gate
build:
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
Дозволяє запуск деяких вибагливих операцій в межах планувальника, повʼязаних з [витісненням](/docs/concepts/scheduling-eviction/pod-priority-preemption/), асинхронно. Асинхронна обробка витіснення покращує загальну продуктивність планування Pod.
