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
Enables the `kube-scheduler` to incorporate node allocatable resources (such as
CPU, memory, and hugepages) managed by Dynamic Resource Allocation (DRA) into
its standard node resource accounting.

When enabled, DRA drivers can use the `nodeAllocatableResources` field on
`ResourceSlice` devices to specify how their devices consume node allocatable
resources. This field supports two different use cases:
- `mapping`: For drivers that directly provide a native node resource (e.g., a CPU
  or Memory DRA driver). It supports scaling capacities or device counts.
- `overhead`: For devices that require auxiliary node dependencies (e.g., an
  accelerator that consumes host memory). It supports per-pod or per-container costs.

This allows the scheduler to combine these DRA allocations with standard Pod requests
to prevent node over-subscription during Pod admission. 

It also exposes the `status.nodeAllocatableResourceClaimStatuses` field on the
Pod API to track the resulting resource allocations. The `kubelet` consumes this to
update Pod and container cgroup settings and adjust OOM scores.

For more information, see
[Node Allocatable Resources](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#node-allocatable-resources)
in the Dynamic Resource Allocation documentation.