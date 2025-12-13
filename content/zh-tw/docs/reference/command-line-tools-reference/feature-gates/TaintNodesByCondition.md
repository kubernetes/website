---
# Removed from Kubernetes
title: TaintNodesByCondition
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.8"
    toVersion: "1.11"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.12"
    toVersion: "1.16"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.17"
    toVersion: "1.18"    

removed: true  
---

<!--
Enable automatic tainting nodes based on
[node conditions](/docs/concepts/architecture/nodes/#condition).
-->
根據[節點狀況](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)啓用自動爲節點標記污點。
