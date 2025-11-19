---
title: DRAResourceClaimDeviceStatus
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
    toVersion: "1.32"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.33"
---

<!--
Enables support the ResourceClaim.status.devices field and for setting this 
status from DRA drivers. It requires the `DynamicResourceAllocation` feature
gate to be enabled.
-->
啓用對 ResourceClaim.status.devices 字段的支持，並允許從 DRA 驅動中設置此狀態。
此特性要求啓用 `DynamicResourceAllocation` 特性門控。
