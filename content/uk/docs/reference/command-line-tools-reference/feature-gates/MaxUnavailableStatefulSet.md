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
---
Дозволяє встановити поле `maxUnavailable` для [rolling update strategy](/docs/concepts/workloads/controllers/statefulset/#rolling-updates) набору StatefulSet. Поле визначає максимальну кількість Podʼів, які можуть бути недоступні під час оновлення.
