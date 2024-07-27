---
title: AdvancedAuditing
content_type: feature_gate
_build:
  list: never
  render: false
  
stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.7"
    toVersion: "1.7"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.8"
    toVersion: "1.11"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.12"
    toVersion: "1.27"    

removed: true
---

<!--
Enable [advanced auditing](/docs/tasks/debug/debug-cluster/audit/#advanced-audit)
-->
启用[高级审计](/zh-cn/docs/tasks/debug/debug-cluster/audit/#advanced-audit)。
