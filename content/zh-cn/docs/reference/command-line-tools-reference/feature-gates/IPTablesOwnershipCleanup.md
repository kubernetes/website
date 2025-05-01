---
title: IPTablesOwnershipCleanup
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.25"
    toVersion: "1.26"
  - stage: beta
    defaultValue: true
    fromVersion: "1.27"  
    toVersion: "1.27" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.28" 
    toVersion: "1.29" 
removed: true
---

<!--
This causes kubelet to no longer create legacy iptables rules.
-->
这使得 kubelet 不再创建传统的 iptables 规则。
