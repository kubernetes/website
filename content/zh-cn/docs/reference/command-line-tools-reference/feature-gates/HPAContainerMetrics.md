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
    toVersion: "1.29"
  - stage: stable
    defaultValue: true
    fromVersion: "1.30"
---

<!--
Allow {{< glossary_tooltip text="HorizontalPodAutoscalers" term_id="horizontal-pod-autoscaler" >}}
to scale based on metrics from individual containers within target pods.
-->
允许 {{< glossary_tooltip text="HorizontalPodAutoscalers" term_id="horizontal-pod-autoscaler" >}}
基于目标 Pod 中单个容器的指标进行扩缩。
