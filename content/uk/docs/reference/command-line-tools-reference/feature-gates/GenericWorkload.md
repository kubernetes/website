---
title: GenericWorkload
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.35"
---
Увімкнення підтримки [Workload API](/docs/concepts/workloads/workload-api/) для вираження вимог до планування на рівні робочого навантаження.

Коли ця функція увімкнена, Podʼи можуть посилатися на конкретну групу подів і використовувати це для впливу на спосіб їх планування.
