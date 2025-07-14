---
title: Advanced auditing
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: apgha 
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
فعال کردن [advanced auditing](/docs/tasks/debug/debug-cluster/audit/#advanced-audit)