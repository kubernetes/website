---
# Removed from Kubernetes
title: CSIVolumeFSGroupPolicy
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.19"
    toVersion: "1.19"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.20"
    toVersion: "1.22"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.23"
    toVersion: "1.25"

removed: true  
---
<!--
Allows CSIDrivers to use the `fsGroupPolicy` field.
This field controls whether volumes created by a CSIDriver support volume ownership
and permission modifications when these volumes are mounted.
-->
允许 CSIDriver 使用 `fsGroupPolicy` 字段。
该字段能控制由 CSIDriver 创建的卷在挂载这些卷时是否支持卷所有权和权限修改。
