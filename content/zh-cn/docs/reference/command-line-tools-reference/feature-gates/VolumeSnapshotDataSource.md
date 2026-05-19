---
# Removed from Kubernetes
title: VolumeSnapshotDataSource
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.12"
    toVersion: "1.16"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.17"
    toVersion: "1.19"
  - stage: stable
    defaultValue: true
    fromVersion: "1.20"
    toVersion: "1.22"

removed: true
---

<!--
Enable volume snapshot data source support.
-->
启用卷快照数据源支持。
