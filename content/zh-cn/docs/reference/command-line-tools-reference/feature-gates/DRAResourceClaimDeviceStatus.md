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
---

<!--
Enables support the ResourceClaim.status.devices field and for setting this 
status from DRA drivers.
-->
启用对 ResourceClaim.status.devices 字段的支持，并允许从 DRA 驱动中设置此状态。
