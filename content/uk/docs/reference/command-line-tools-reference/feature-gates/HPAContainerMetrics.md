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
    toVersion: "1.31"

removed: true
---

Дозволяє {{< glossary_tooltip text="HorizontalPodAutoscalers" term_id="horizontal-pod-autoscaler" >}} виконувати масштабування на основі метрик з окремих контейнерів у межах цільових Podʼів.
