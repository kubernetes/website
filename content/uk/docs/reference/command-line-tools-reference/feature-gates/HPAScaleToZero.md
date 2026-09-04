---
title: HPAScaleToZero
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.16"
    toVersion: "1.36"
  - stage: beta
    defaultValue: true
    fromVersion: "1.37"
---
Дозволяє встановлювати `minReplicas` у 0 для ресурсів `HorizontalPodAutoscaler` при використанні власних або зовнішніх метрик.
