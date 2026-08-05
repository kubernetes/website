---
title: DRADeviceBindingConditions
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.34"
---
Enables support for DeviceBindingConditions in the DRA related fields. 
This allows for thorough device readiness checks and attachment processes before Bind phase.