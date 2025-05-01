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
---

<!--
Enables setting `minReplicas` to 0 for `HorizontalPodAutoscaler`
resources when using custom or external metrics.
-->
使用自定义指标或外部指标时，可将 `HorizontalPodAutoscaler`
资源的 `minReplicas` 设置为 0。
