---
title: HPAConfigurableTolerance
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.33"
    toVersion: "1.34"
  - stage: beta
    defaultValue: true
    fromVersion: "1.35"
---
Дозволяє встановити [поріг толерантності](/docs/tasks/run-application/horizontal-pod-autoscale/#tolerance) для метрики HorizontalPodAutoscaleer.
