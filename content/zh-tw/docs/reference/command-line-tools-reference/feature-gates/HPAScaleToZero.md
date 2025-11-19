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
使用自定義指標或外部指標時，可將 `HorizontalPodAutoscaler`
資源的 `minReplicas` 設置爲 0。
