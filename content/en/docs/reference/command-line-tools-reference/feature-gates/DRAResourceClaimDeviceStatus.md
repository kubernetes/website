---
title: DRAResourceClaimDeviceStatus
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.33"
---
Enables support the ResourceClaim.status.devices field and for setting this 
status from DRA drivers. It requires the `DynamicResourceAllocation` feature
gate to be enabled.