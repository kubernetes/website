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
پشتیبانی از فیلد ResourceClaim.status.devices و تنظیم این وضعیت از درایورهای DRA را فعال می‌کند. این امر مستلزم فعال بودن ویژگی `DynamicResourceAllocation` است.