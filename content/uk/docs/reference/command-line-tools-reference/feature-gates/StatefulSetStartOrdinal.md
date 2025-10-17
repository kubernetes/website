---
title: StatefulSetStartOrdinal
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.26"
    toVersion: "1.26"
  - stage: beta
    defaultValue: true
    fromVersion: "1.27"
    toVersion: "1.30"
  - stage: stable
    defaultValue: true
    fromVersion: "1.31"
---
Дозволити налаштування порядкового номера старту у StatefulSet. Дивіться [Початковий порядковий номер](/docs/concepts/workloads/controllers/statefulset/#start-ordinal) для більш детальної інформації.
