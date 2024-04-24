---
# Removed from Kubernetes
title: IPv6DualStack
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.15"
    toVersion: "1.20"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.22"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.23"
    toVersion: "1.24"    

removed: true 
---

<!--
Enable [dual stack](/docs/concepts/services-networking/dual-stack/)
support for IPv6.
-->
启用[双协议栈](/zh-cn/docs/concepts/services-networking/dual-stack/)以支持 IPv6。
