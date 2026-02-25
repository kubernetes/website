---
title: StableLoadBalancerNodeSet
content_type: feature_gate
_build:
  list: never
  render: false

stages:
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

Дозволяє зменшити кількість переконфігурацій балансувальника навантаження контролером послуг (KCCM) внаслідок зміни стану вузла.
