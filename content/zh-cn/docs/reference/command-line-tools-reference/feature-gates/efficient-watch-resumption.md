---
title: EfficientWatchResumption
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.20"
    toVersion: "1.20"
  - stage: beta
    defaultValue: true
    fromVersion: "1.21"  
    toVersion: "1.23" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.24"  
---
<!--
Allows for storage-originated bookmark (progress
notify) events to be delivered to the users. This is only applied to watch operations.
-->
允许将存储发起的书签（进度通知）事件传递给用户。这仅适用于 watch（监视）操作。
