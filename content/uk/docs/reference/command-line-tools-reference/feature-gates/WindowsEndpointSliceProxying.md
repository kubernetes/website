---
# Removed from Kubernetes
title: WindowsEndpointSliceProxying
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.19"
    toVersion: "1.20"
  - stage: beta
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.21"
  - stage: stable
    defaultValue: true
    fromVersion: "1.22"
    toVersion: "1.24"

removed: true
---
Якщо увімкнено, kube-proxy, що працює на Windows, використовуватиме EndpointSlices як основне джерело даних замість Endpoints, що забезпечує масштабованість і покращення продуктивності. Див. статтю [Увімкнення Endpoint Slices](/docs/concepts/services-networking/endpoint-slices/).
