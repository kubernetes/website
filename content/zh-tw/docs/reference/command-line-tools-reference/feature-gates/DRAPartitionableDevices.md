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
啓用在動態資源分配（DRA）中請求[可分區設備](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#partitionable-devices)的支持。
這允許驅動將多個設備廣播爲映射到某個物理設備的相同資源。

想要此特性門控生效，你還需啓用 `DynamicResourceAllocation` 特性門控。
