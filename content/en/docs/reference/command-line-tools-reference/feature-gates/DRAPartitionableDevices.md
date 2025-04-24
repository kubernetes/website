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
Enables support for requesting [Partitionable Devices](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#partitionable-devices)
for DRA. This lets drivers advertise multiple devices that maps to the same resources
of a physical device.

This feature gate has no effect unless you also enable the `DynamicResourceAllocation` feature gate.
