---
title: GangScheduling
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.35"
    toVersion: "1.36"

removed: true
---
Увімкнення втулка GangScheduling у kube-scheduler, який реалізує алгоритм планування «все або нічого». Для вираження вимог використовується [Workload API](/docs/concepts/workloads/workload-api/).

Цю функціональну можливість було вилучено у версії 1.37 та обʼєднано з функціональною можливістю `GenericWorkload`.
