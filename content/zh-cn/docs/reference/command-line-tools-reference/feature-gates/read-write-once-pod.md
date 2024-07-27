---
title: ReadWriteOncePod
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.22"
    toVersion: "1.26"
  - stage: beta
    defaultValue: true
    fromVersion: "1.27"  
    toVersion: "1.28" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.29" 
---

<!--
Enables the usage of `ReadWriteOncePod` PersistentVolume
access mode.
-->
允许使用 `ReadWriteOncePod` 访问模式的 PersistentVolume。
