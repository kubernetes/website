---
title: DRADeviceTaints
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.33"
---
پشتیبانی از [tainting devices and selectively tolerating those taints](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-taints-and-tolerations) را هنگام استفاده از تخصیص منابع پویا برای مدیریت دستگاه‌ها فعال می‌کند.

این دروازه ویژگی هیچ تاثیری ندارد مگر اینکه دروازه ویژگی `DynamicResourceAllocation` را نیز فعال کنید.