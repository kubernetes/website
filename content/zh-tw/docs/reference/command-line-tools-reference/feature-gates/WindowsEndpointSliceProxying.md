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

<!--
When enabled, kube-proxy running on Windows will use
EndpointSlices as the primary data source instead of Endpoints, enabling scalability and
performance improvements. See
[Enabling Endpoint Slices](/docs/concepts/services-networking/endpoint-slices/).
-->
啓用後，運行在 Windows 上的 kube-proxy
將使用 EndpointSlice 而不是 Endpoints 作爲主要數據源，從而實現可伸縮性和性能改進。
詳情請參見[啓用端點切片](/zh-cn/docs/concepts/services-networking/endpoint-slices/)。
