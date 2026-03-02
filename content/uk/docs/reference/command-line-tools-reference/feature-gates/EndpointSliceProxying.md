---
# Removed from Kubernetes
title: EndpointSliceProxying
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.18"
    toVersion: "1.18"
  - stage: beta
    defaultValue: true
    fromVersion: "1.19"
    toVersion: "1.21"
  - stage: stable
    defaultValue: true
    fromVersion: "1.22"
    toVersion: "1.24"

removed: true
---
Якщо цю опцію увімкнено, kube-proxy на Linux використовуватиме EndpointSlices як основне джерело даних замість точок доступу, що дає змогу підвищити масштабованість і продуктивність. Див. статтю [Увімкнення Endpoint Slices](/docs/concepts/services-networking/endpoint-slices/).
