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
在 DRA 相关字段中启用对 DeviceBindingConditions 的支持。  
这允许在 Bind 阶段之前执行彻底的设备就绪检查和挂接过程。
