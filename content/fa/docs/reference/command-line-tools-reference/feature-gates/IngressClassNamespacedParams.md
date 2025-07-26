---
# Removed from Kubernetes
title: IngressClassNamespacedParams
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.21"
    toVersion: "1.21"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.22"
    toVersion: "1.22"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.23"
    toVersion: "1.24"    

removed: true
---
اجازه دهید پارامترهای دارای محدوده فضای نام در منبع `IngressClass` ارجاع داده شوند. این ویژگی دو فیلد - `Scope` و `Namespace` - را به `IngressClass.spec.parameters` اضافه می‌کند.
