---
title: AllowServiceLBStatusOnNonLB
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.29"    
---
Enables `.status.ingress.loadBalancer` to be set on Services of types other than `LoadBalancer`.
