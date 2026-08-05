---
# Removed from Kubernetes
title: CustomResourceDefaulting
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.15"
    toVersion: "1.15"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.16"
    toVersion: "1.16"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.17"
    toVersion: "1.18"

removed: true  
---
<!--
Enable CRD support for default values in OpenAPI v3 validation schemas.
-->
为 CRD 启用在其 OpenAPI v3 验证模式中提供默认值的支持。
