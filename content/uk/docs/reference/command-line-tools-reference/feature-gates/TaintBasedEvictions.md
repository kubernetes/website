---
# Removed from Kubernetes
title: TaintBasedEvictions
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.6"
    toVersion: "1.12"
  - stage: beta
    defaultValue: true
    fromVersion: "1.13"
    toVersion: "1.17"
  - stage: stable
    defaultValue: true
    fromVersion: "1.18"
    toVersion: "1.20"

removed: true
---
Дозволяє виселяти Podʼи з вузлів на основі taints на вузлах і толерантностей на Podʼах. Детальніше дивіться у статті [taint та tolerances](/docs/concepts/scheduling-eviction/taint-and-toleration/).
