---
# Removed from Kubernetes
title: ServiceAppProtocol
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
    toVersion: "1.19"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.20"
    toVersion: "1.22"    

removed: true
---
<!--
Enables the `appProtocol` field on Services and Endpoints.
-->
为 Service 和 Endpoints 启用 `appProtocol` 字段。
