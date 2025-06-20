---
# Removed from Kubernetes
title: HugePageStorageMediumSize
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.18"
    toVersion: "1.18"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.19"
    toVersion: "1.21"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.22"
    toVersion: "1.24"    

removed: true  
---

<!--
Enable support for multiple sizes pre-allocated
[huge pages](/docs/tasks/manage-hugepages/scheduling-hugepages/).
-->
启用对多种大小的预分配[巨页资源](/zh-cn/docs/tasks/manage-hugepages/scheduling-hugepages/)的支持。
