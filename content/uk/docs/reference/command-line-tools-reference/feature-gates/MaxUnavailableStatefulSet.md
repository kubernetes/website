---
title: MaxUnavailableStatefulSet
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.24"
    toVersion: "1.34"
  - stage: beta
    defaultValue: true
    fromVersion: "1.35.0"
    toVersion: "1.35.3"
  - stage: beta
    defaultValue: false
    fromVersion: "1.35.4"
    toVersion: "1.36"
  - stage: beta
    defaultValue: true
    fromVersion: "1.37"
---
Дозволяє встановити поле `maxUnavailable` для [стратегії поступового оновлення](/docs/concepts/workloads/controllers/statefulset/#rolling-updates) набору StatefulSet. Поле визначає максимальну кількість Podʼів, які можуть бути недоступні під час оновлення.
