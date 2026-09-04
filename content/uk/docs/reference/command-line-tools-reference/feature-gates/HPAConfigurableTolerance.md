---
title: HPAConfigurableTolerance
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.33"
    toVersion: "1.34"
  - stage: beta
    defaultValue: false
    fromVersion: "1.35"
    toVersion: "1.36"
  - stage: stable
    defaultValue: true
    locked: true
    fromVersion: "1.37"
---
Дозволяє встановити [поріг толерантності](/docs/tasks/run-application/horizontal-pod-autoscale/#tolerance) для метрики HorizontalPodAutoscaler.
