---
title: HPAScaleToZero
content_type: feature_gate
_build:
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
Enables setting `minReplicas` to 0 for `HorizontalPodAutoscaler`
resources when using custom or external metrics.
