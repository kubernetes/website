---
# Removed from Kubernetes
title: EndpointSlice
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.16"
    toVersion: "1.16"
  - stage: beta
    defaultValue: false
    fromVersion: "1.17"
    toVersion: "1.17"
  - stage: beta
    defaultValue: true
    fromVersion: "1.18"
    toVersion: "1.20"
  - stage: stable
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.24"

removed: true
---
Вмикає EndpointSlices для більш масштабованих і розширюваних мережевих точок доступу. Див. статтю [Увімкнення EndpointSlices](/docs/concepts/services-networking/endpoint-slices/).
