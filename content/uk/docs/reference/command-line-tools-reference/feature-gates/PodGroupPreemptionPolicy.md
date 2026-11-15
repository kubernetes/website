---
title: PodGroupPreemptionPolicy
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---

Вмикає підтримку поля `PreemptionPolicy` в [API PodGroup](/docs/concepts/workloads/podgroup-api/) та [API Workload](/docs/concepts/workloads/workload-api/).

Коли увімкнено, якщо PodGroup має `PreemptionPolicy: Never`, він не виконуватиме витіснення з урахуванням робочого навантаження.
