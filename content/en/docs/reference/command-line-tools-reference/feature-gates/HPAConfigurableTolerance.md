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
---
Enables setting a [tolerance threshold](/docs/tasks/run-application/horizontal-pod-autoscale.md#tolerance)
for HorizontalPodAutoscaler metrics.
