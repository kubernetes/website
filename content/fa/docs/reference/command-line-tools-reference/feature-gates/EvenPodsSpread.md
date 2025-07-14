---
# Removed from Kubernetes
title: EvenPodsSpread
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.16"
    toVersion: "1.17"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.18"
    toVersion: "1.18"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.19"
    toVersion: "1.21"    

removed: true  
---
فعال کردن زمان‌بندی یکنواخت پادها در دامنه‌های توپولوژی. به [Pod Topology Spread Constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/). مراجعه کنید.