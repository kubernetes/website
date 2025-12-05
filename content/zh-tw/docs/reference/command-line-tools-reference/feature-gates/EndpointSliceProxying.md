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

<!--
When enabled, kube-proxy running
 on Linux will use EndpointSlices as the primary data source instead of
 Endpoints, enabling scalability and performance improvements. See
 [Enabling Endpoint Slices](/docs/concepts/services-networking/endpoint-slices/).
-->
啓用此特性門控時，Linux 上運行的 kube-proxy 會使用
EndpointSlice 而不是 Endpoints 作爲其主要資料源，
從而使得可擴縮性和性能提升成爲可能。
參閱[啓用 EndpointSlice](/zh-cn/docs/concepts/services-networking/endpoint-slices/)。
