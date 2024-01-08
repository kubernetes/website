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
<!--
Enables EndpointSlices for more scalable and extensible
 network endpoints. See [Enabling EndpointSlices](/docs/concepts/services-networking/endpoint-slices/).
-->
启用 EndpointSlice 以实现可扩缩性和可扩展性更好的网络端点。
参阅[启用 EndpointSlice](/zh-cn/docs/concepts/services-networking/endpoint-slices/)。
