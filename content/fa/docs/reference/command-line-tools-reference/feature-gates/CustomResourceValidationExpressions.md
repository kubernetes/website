---
title: CustomResourceValidationExpressions
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.23"
    toVersion: "1.24"
  - stage: beta
    defaultValue: true
    fromVersion: "1.25"  
    toVersion: "1.28" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.29"
    toVersion: "1.30"
    
removed: true 
---
اexpression language validation  را در CRD فعال کنید که منابع مشتری را بر اساس قوانین اعتبارسنجی نوشته شده در افزونه `x-kubernetes-validations` اعتبارسنجی می‌کند.