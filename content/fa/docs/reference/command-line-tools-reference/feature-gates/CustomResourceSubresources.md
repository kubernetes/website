---
# Removed from Kubernetes
title: CustomResourceSubresources
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.10"
    toVersion: "1.10"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.11"
    toVersion: "1.15"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.16"
    toVersion: "1.18"

removed: true  
---
زیرمنابع `/status` و `/scale` را برای منابع ایجاد شده از [CustomResourceDefinition](/docs/concepts/extend-kubernetes/api-extension/custom-resources/) فعال کنید.