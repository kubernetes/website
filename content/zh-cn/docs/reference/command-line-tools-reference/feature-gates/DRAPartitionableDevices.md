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

<!--
Enables support for requesting [Partitionable Devices](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#partitionable-devices)
for DRA. This lets drivers advertise multiple devices that maps to the same resources
of a physical device.

This feature gate has no effect unless you also enable the `DynamicResourceAllocation` feature gate.
-->
启用在动态资源分配（DRA）中请求[可分区设备](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#partitionable-devices)的支持。
这允许驱动将多个设备广播为映射到某个物理设备的相同资源。

想要此特性门控生效，你还需启用 `DynamicResourceAllocation` 特性门控。
