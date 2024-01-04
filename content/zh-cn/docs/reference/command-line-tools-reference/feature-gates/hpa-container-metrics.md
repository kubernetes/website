---
title: HPAContainerMetrics
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.20"
    toVersion: "1.26"
  - stage: beta
    defaultValue: true
    fromVersion: "1.27"
---

<!--
Enable the `HorizontalPodAutoscaler` to scale based on
metrics from individual containers in target pods.
-->
启用 `HorizontalPodAutoscaler` 基于目标 Pod 中单个容器的指标进行扩缩。
