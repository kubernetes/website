---
title: AllowServiceLBStatusOnNonLB
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.29"
    toVersion: "1.34"

removed: true
---
Дозволяє встановлювати `.status.ingress.loadBalancer` для сервісів типів, відмінних від `LoadBalancer`.
