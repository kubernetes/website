---
# Removed from Kubernetes
title: HugePages
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
    toVersion: "1.13"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.14"
    toVersion: "1.16"    

removed: true  
---
Enable the allocation and consumption of pre-allocated
[huge pages](/docs/tasks/manage-hugepages/scheduling-hugepages/).
