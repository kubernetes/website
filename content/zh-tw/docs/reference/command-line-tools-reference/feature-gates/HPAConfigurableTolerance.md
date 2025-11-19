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

<!--
Enables setting a [tolerance threshold](/docs/tasks/run-application/horizontal-pod-autoscale.md#tolerance)
for HorizontalPodAutoscaler metrics.
-->
允許爲 HorizontalPodAutoscaler
指標設置[容忍閾值](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale.md#tolerance)。
