---
title: ProxyTerminatingEndpoints
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.22"
    toVersion: "1.25"
  - stage: beta
    defaultValue: true
    fromVersion: "1.26"  
    toVersion: "1.27" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.28"  
    toVersion: "1.29" 
removed: true
---

<!--
Enable the kube-proxy to handle terminating
endpoints when `ExternalTrafficPolicy=Local`.
-->
当 `ExternalTrafficPolicy=Local` 时，允许 kube-proxy 处理终止过程中的端点。
