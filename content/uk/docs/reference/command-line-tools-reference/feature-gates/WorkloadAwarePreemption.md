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
    toVersion: "1.36"

removed: true
---

Дозволяє підтримку [витіснення з урахуванням навантаження](/docs/concepts/scheduling-eviction/workload-aware-preemption/). Цю функціональну можливість було вилучено у версії 1.37 та обʼєднано з функціональною можливістю `GenericWorkload`.

Коли увімкнено, якщо PodGroup не вдається запланувати, планувальник використовуватиме алгоритм витіснення з урахуванням навантаження для вибору жертв для витіснення замість стандартного алгоритму витіснення Pod.
