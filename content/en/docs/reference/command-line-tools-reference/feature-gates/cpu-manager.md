---
title: CPUManager
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.8"
    toVersion: "1.9"
  - stage: beta
    defaultValue: true
    fromVersion: "1.10"  
    toVersion: "1.25" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.26"  
---
Enable container level CPU affinity support, see
[CPU Management Policies](/docs/tasks/administer-cluster/cpu-management-policies/).
