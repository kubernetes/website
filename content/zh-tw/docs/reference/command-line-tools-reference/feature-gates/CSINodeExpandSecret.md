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
    fromVersion: "1.29"
    toVersion: "1.30"

removed: true
---

<!--
Enable passing secret authentication data to a CSI driver for use
 during a `NodeExpandVolume` CSI operation.
-->
允許在 `NodeExpandVolume` CSI 操作期間，
將保密的身份驗證數據傳遞到 CSI 驅動以供後者使用。
