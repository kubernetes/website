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
    toVersion: "1.29"
  - stage: stable
    defaultValue: true
    fromVersion: "1.30"
    toVersion: "1.31"

removed: true
---

<!--
Enables less load balancer re-configurations by
the service controller (KCCM) as an effect of changing node state.
-->
允許服務控制器（KCCM）減少根據節點狀態變化來對負載均衡器作重新配置的操作。
