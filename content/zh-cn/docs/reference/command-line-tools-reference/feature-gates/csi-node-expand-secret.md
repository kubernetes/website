---
title: CSINodeExpandSecret
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.25"
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
Enable passing secret authentication data to a CSI driver for use
 during a `NodeExpandVolume` CSI operation.
-->
允许在 `NodeExpandVolume` CSI 操作期间，
将保密的身份验证数据传递到 CSI 驱动以供后者使用。
