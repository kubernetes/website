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

<!--
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
-->
启用 ResourceSlice 上的 `PartitionTypeAttribute` 字段，
该字段使[可分区](/zh-cn/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#partitionable-devices)资源池进入
[ResourcePoolStatusRequest](/zh-cn/docs/concepts/resource-management/dynamic-resource-allocation/dra-observability/#resource-pool-partition-summary)
的类型化分区摘要视图。该字段指定一个设备属性（例如 MIG 配置），其值用于对每个分区类型分组，
从而让 ResourcePoolStatusRequest 能够报告每个分区类型还有多少设备可以分配。此特性建立在
[`DRAPartitionableDevices`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#DRAPartitionableDevices)
和
[`DRAResourcePoolStatus`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#DRAResourcePoolStatus)
特性门控之上，这两个门控也必须一并启用。
