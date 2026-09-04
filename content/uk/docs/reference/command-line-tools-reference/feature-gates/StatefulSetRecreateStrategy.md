---
title: StatefulSetRecreateStrategy
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---
Вмикає стратегію оновлення `Recreate` для StatefulSets, яка видаляє всі Podʼи StatefulSet перед створенням нових Podʼів, що відображають зміни, внесені до `.spec.template` StatefulSet. Див. [Recreate](/docs/concepts/workloads/controllers/statefulset/#recreate) для отримання докладних відомостей.
