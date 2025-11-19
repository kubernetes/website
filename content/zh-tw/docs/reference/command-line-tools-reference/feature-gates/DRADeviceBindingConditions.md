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

<!--
Enables support for DeviceBindingConditions in the DRA related fields. 
This allows for thorough device readiness checks and attachment processes before Bind phase.
-->
在 DRA 相關字段中啓用對 DeviceBindingConditions 的支持。  
這允許在 Bind 階段之前執行徹底的設備就緒檢查和掛接過程。
