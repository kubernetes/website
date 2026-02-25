---
title: LoadBalancerIPMode
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.29"
    toVersion: "1.30"
  - stage: beta
    defaultValue: true
    fromVersion: "1.30"
    toVersion: "1.31"
  - stage: stable
    defaultValue: true
    fromVersion: "1.32"
    toVersion: "1.34"

removed: true
---
Дозволяє встановити `ipMode` для сервісів, де `type` встановлено у `LoadBalancer`. Докладнішу інформацію наведено у статті [Визначення IPMode статусу балансувальника навантаження](/docs/concepts/services-networking/service/#load-balancer-ip-mode).
