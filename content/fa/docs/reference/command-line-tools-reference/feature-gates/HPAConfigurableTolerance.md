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
تنظیم یک [tolerance threshold](/docs/tasks/run-application/horizontal-pod-autoscale.md#tolerance) را برای معیارهای HorizontalPodAutoscaler فعال می‌کند.