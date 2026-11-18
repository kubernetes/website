---
title: HPAOptimizedSelectorStore
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.37"
---
Use an optimized selector store in the HorizontalPodAutoscaler controller
to detect HorizontalPodAutoscalers whose selectors overlap.
