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
Enables setting a [tolerance threshold](/docs/tasks/run-application/horizontal-pod-autoscale#tolerance)
for HorizontalPodAutoscaler metrics.
