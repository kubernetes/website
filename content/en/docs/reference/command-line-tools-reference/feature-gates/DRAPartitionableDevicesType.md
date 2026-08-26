---
title: DRAPartitionableDevicesType
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---
Enables the `PartitionTypeAttribute` field on ResourceSlices, which opts a
[partitionable](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#partitionable-devices)
resource pool into the typed partition summary view of
[ResourcePoolStatusRequest](/docs/concepts/resource-management/dynamic-resource-allocation/dra-observability/#resource-pool-partition-summary).
The field names a device attribute (such as a MIG profile) whose value groups
each partition type, so that a ResourcePoolStatusRequest can report how many
devices of each partition type are still allocatable. This builds on the
[`DRAPartitionableDevices`](/docs/reference/command-line-tools-reference/feature-gates/#DRAPartitionableDevices)
and
[`DRAResourcePoolStatus`](/docs/reference/command-line-tools-reference/feature-gates/#DRAResourcePoolStatus)
feature gates, both of which must also be enabled.
