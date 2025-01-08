---
# Removed from Kubernetes
title: CustomResourceValidation
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.8"
    toVersion: "1.8"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.9"
    toVersion: "1.15"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.16"
    toVersion: "1.18"

removed: true  
---
<!--
Enable schema based validation on resources created from
[CustomResourceDefinition](/docs/concepts/extend-kubernetes/api-extension/custom-resources/).
-->
对于用
[CustomResourceDefinition](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
创建的资源启用基于模式的验证。
