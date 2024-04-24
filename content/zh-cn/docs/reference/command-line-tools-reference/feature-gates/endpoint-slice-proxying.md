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
启用此特性门控时，Linux 上运行的 kube-proxy 会使用
EndpointSlice 而不是 Endpoints 作为其主要数据源，
从而使得可扩缩性和性能提升成为可能。
参阅[启用 EndpointSlice](/zh-cn/docs/concepts/services-networking/endpoint-slices/)。
