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
    toVersion: "1.35"
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"
---
Enables support for requesting [Partitionable Devices](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#partitionable-devices)
for DRA. This lets drivers advertise multiple devices that maps to the same resources
of a physical device.
