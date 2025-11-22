---
title: DRAPartitionableDevices
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.33"
---
پشتیبانی از درخواست [Partitionable Devices](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#partitionable-devices)
برای DRA را فعال می‌کند. این به درایورها اجازه می‌دهد چندین دستگاه را که به منابع یکسانی از یک دستگاه فیزیکی نگاشت می‌شوند، تبلیغ کنند.

این ویژگی تا زمانی که ویژگی `DynamicResourceAllocation` را نیز فعال نکنید، هیچ تاثیری ندارد.