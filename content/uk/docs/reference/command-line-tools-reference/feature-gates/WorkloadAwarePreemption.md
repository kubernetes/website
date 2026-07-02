---
title: WorkloadAwarePreemption
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
---

Дозволяє підтримку [випередження з урахуванням навантаження](/docs/concepts/scheduling-eviction/workload-aware-preemption/).

Коли увімкнено, якщо PodGroup не вдається запланувати, планувальник використовуватиме алгоритм випередження з урахуванням навантаження для вибору жертв для випередження замість стандартного алгоритму випередження Pod.
