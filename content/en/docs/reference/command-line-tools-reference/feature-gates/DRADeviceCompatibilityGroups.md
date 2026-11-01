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
Enables support for [device compatibility groups](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#device-compatibility-groups)
in DRA. Drivers can declare opaque compatibility groups on each
`consumesCounters` entry of a device in a ResourceSlice, and the scheduler
only co-allocates devices drawing from the same counter set when their
declared groups intersect. Requires `DRAPartitionableDevices` to be enabled.
