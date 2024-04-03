---
# Removed from Kubernetes
title: CustomResourcePublishOpenAPI
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.14"
    toVersion: "1.14"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.15"
    toVersion: "1.15"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.16"
    toVersion: "1.18"

removed: true  
---
<!--
Enables publishing of CRD OpenAPI specs.
-->
启用 CustomResourceDefinition OpenAPI 规范的发布。
