---
# Removed from Kubernetes
title: DefaultPodTopologySpread
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.19"
    toVersion: "1.19"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.20"
    toVersion: "1.23"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.24"
    toVersion: "1.25"    

removed: true  
---
استفاده از افزونه زمان‌بندی `PodTopologySpread` را برای انجام [default spread](/docs/concepts/scheduling-eviction/topology-spread-constraints/#internal-default-constraints) فعال می‌کند.
