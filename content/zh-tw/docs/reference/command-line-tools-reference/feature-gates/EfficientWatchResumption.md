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
    toVersion: "1.32"

removed: true
---

<!--
Allows for storage-originated bookmark (progress
notify) events to be delivered to the users. This is only applied to watch operations.
-->
允許將儲存發起的書籤（進度通知）事件傳遞給使用者。這僅適用於 watch（監視）操作。
