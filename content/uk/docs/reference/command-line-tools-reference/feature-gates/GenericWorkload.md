---
title: GenericWorkload
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.35"
    toVersion: "1.36"
  - stage: beta
    defaultValue: false
    fromVersion: "1.37"
---
Увімкнення підтримки [Workload API](/docs/concepts/workloads/workload-api/) та [PodGroup API](/docs/concepts/workloads/podgroup-api/) для вираження вимог до планування на рівні робочого навантаження.

Коли ця функція увімкнена, Podʼи можуть посилатися на конкретну PodGroup, щоб впливати на спосіб їх планування. Починаючи з Kubernetes v1.37, ця функціональна можливість також охоплює [групове планування](/docs/concepts/scheduling-eviction/gang-scheduling/) та [витіснення з урахуванням навантаження](/docs/concepts/scheduling-eviction/workload-aware-preemption/).
