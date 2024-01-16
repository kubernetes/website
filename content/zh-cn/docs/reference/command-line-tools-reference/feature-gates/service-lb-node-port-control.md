---
# Removed from Kubernetes
title: ServiceLBNodePortControl
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.20"
    toVersion: "1.21"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.22"
    toVersion: "1.23"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.24"
    toVersion: "1.25"    

removed: true
---
<!--
Enables the `allocateLoadBalancerNodePorts` field on Services.
-->
为 Service 启用 `allocateLoadBalancerNodePorts` 字段。
