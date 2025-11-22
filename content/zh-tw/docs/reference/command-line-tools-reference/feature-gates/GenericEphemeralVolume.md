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
啓用支持臨時的內聯卷，這些卷支持普通卷的所有特性
（可以由第三方儲存供應商提供，支持儲存容量跟蹤、從快照還原等等）。
請參見[臨時卷](/zh-cn/docs/concepts/storage/ephemeral-volumes/)。
