---
# Removed from Kubernetes
title: GenericEphemeralVolume
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.19"
    toVersion: "1.20"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.22"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.23"
    toVersion: "1.24"    

removed: true
---
<!--
Enables ephemeral, inline volumes that support all features
of normal volumes (can be provided by third-party storage vendors, storage capacity tracking,
restore from snapshot, etc.).
See [Ephemeral Volumes](/docs/concepts/storage/ephemeral-volumes/).
-->
启用支持临时的内联卷，这些卷支持普通卷的所有特性
（可以由第三方存储供应商提供，支持存储容量跟踪、从快照还原等等）。
请参见[临时卷](/zh-cn/docs/concepts/storage/ephemeral-volumes/)。
