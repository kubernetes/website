---
title: StableLoadBalancerNodeSet
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.27"
---
Enables less load balancer re-configurations by
the service controller (KCCM) as an effect of changing node state.
