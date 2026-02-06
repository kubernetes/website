---
title: GangScheduling
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.35"
---
Увімкнення втулка GangScheduling у kube-scheduler, який реалізує алгоритм планування «все або нічого». Для вираження вимог використовується [Workload API](/docs/concepts/workloads/workload-api/).
