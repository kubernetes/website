---
title: DRAExtendedResourceCapacity
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.38"
---
Enables capacity requests for
[extended resources allocated by DRA](/docs/concepts/resource-management/dynamic-resource-allocation/dra-api/#extended-resource).
A DeviceClass can set `extendedResourceCapacityRequests`, which the scheduler
copies into the capacity requests of each device request it creates for the
DeviceClass's extended resource name. A Pod that requests the extended resource
then receives a fixed share of a device that supports
[consumable capacity](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#consumable-capacity).
