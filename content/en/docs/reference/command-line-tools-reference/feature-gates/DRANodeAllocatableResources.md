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
    toVersion: "1.37"
  - stage: beta
    defaultValue: false
    fromVersion: "1.38"
---
Enables the `kube-scheduler` to incorporate node allocatable resources (such as
CPU, memory, hugepages, and ephemeral storage) managed by Dynamic Resource Allocation (DRA) into
its standard node resource accounting. In v1.38, this feature gate is disabled by default
under the default `--min-compatibility-version` (`1.37`) and enabled by default when
`--min-compatibility-version` is `1.38` or later.

When enabled, DRA drivers can use the `nodeAllocatableResources` field on
`ResourceSlice` devices to specify how their devices consume node allocatable
resources. This field supports two different use cases:
- `mapping`: For drivers that directly provide a native node resource (e.g., a CPU
  or Memory DRA driver). It supports scaling capacities or device counts.
- `overhead`: For devices that require auxiliary node dependencies (e.g., an
  accelerator that consumes host memory). It supports per-pod or per-container costs.

This allows the scheduler to combine these DRA allocations with standard Pod requests
to prevent node over-subscription during Pod admission and include them in scoring and preemption.

It also exposes the `status.extraNodeAllocatableResources` field on the
Pod API (replacing the alpha `status.nodeAllocatableResourceClaimStatuses` field)
to track the resulting pod-level and per-container resource increments. The `kubelet`
consumes this field to update Pod and container cgroup settings, adjust OOM scores,
and account for DRA resources during eviction and preemption. `ResourceQuota`,
HorizontalPodAutoscaler (HPA), and `kubectl describe node` also account for
`status.extraNodeAllocatableResources`.

For more information, see
[Node Allocatable Resources](/docs/concepts/resource-management/dynamic-resource-allocation/how-dra-works/#node-allocatable-resources)
in the Dynamic Resource Allocation documentation.
