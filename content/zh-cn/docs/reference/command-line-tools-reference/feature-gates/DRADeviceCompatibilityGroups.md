---
title: DRADeviceCompatibilityGroups
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---

<!--
Enables support for [device compatibility groups](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#device-compatibility-groups)
in DRA. Drivers can declare opaque compatibility groups on each
`consumesCounters` entry of a device in a ResourceSlice, and the scheduler
only co-allocates devices drawing from the same counter set when their
declared groups intersect. Requires `DRAPartitionableDevices` to be enabled.
-->
在 DRA 中启用对[设备兼容性组](/zh-cn/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#device-compatibility-groups)的支持。
驱动可以在 ResourceSlice 中设备的每个
`consumesCounters` 条目上声明不透明的兼容性组，
调度器只有当从同一计数器集获取资源的设备所声明的组存在交集时，
才会共同分配这些设备。需要启用 `DRAPartitionableDevices`。
