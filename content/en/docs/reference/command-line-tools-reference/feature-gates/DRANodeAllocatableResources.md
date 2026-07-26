---
title: DRANodeAllocatableResources
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
---
Enables the kube-scheduler to incorporate Node Allocatable resources (such as
CPU, memory, and hugepages) managed by Dynamic Resource Allocation (DRA) into
its standard node resource accounting.

When enabled, DRA drivers can use the `nodeAllocatableResourceMappings` field on
`ResourceSlice` devices to specify how their devices consume node allocatable
resources. This allows the scheduler to combine these DRA allocations with
standard Pod requests.
It also exposes the `status.nodeAllocatableResourceClaimStatuses` field on the
Pod API to track the resulting resource allocations.

For more information, see
[Node Allocatable Resources](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#node-allocatable-resources)
in the Dynamic Resource Allocation documentation.