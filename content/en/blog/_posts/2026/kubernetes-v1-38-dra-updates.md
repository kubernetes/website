---
layout: blog
title: 'Kubernetes v1.38: DRA Updates'
draft: true
slug: kubernetes-v1-38-dra-updates
author: >
  [Swati Gupta](https://github.com/guptaNswati)
---


Kubernetes v1.38 brings three Dynamic Resource Allocation (DRA) features
to Stable. Drivers can describe how partitions of a device share its
underlying hardware, how much of a device's capacity each allocation
consumes, and when an allocated device is ready for a Pod.

This release also builds on the
[extended resource support that became Stable in v1.37](/blog/2026/09/03/kubernetes-v1-37-dra-updates/).
A Pod can already request a resource such as `example.com/gpu` while DRA
handles the allocation. In v1.38, a new Alpha feature lets cluster operators
define how much device capacity each unit of that extended resource requests.

## What's Stable in v1.38

### Partitionable devices

[Partitionable devices](https://www.kubernetes.dev/resources/keps/4815/) let
a driver advertise overlapping device configurations in ResourceSlices. For
example, a driver can advertise a whole accelerator and several smaller
partitions backed by the same hardware. Each device declares how much of a
set of shared counters it consumes, and the scheduler uses those counters to
prevent conflicting allocations. While the whole accelerator is allocated,
the scheduler does not allocate any of its partitions. When the whole
accelerator is free, the scheduler can allocate any combination of
partitions whose combined counter consumption fits. The
`DRAPartitionableDevices` feature gate is locked on.

### Device binding conditions

With [device binding conditions](https://www.kubernetes.dev/resources/keps/5007/),
a driver can declare conditions that must be met before the scheduler binds
a Pod to a node. During the `PreBind` phase, the scheduler waits until those
conditions are true in the ResourceClaim status. For example, a controller
that attaches a fabric-connected device to a node can set a condition once
the attachment is complete. If a binding failure condition becomes true, or
the conditions are not met within the scheduler's `bindingTimeout`
(10 minutes by default), the scheduler clears the allocation and tries to
schedule the Pod again. The `DRADeviceBindingConditions` feature gate is
locked on.

### Consumable capacity and fractional capacity ranges

[Consumable capacity](https://www.kubernetes.dev/resources/keps/5075/) lets
multiple independent allocations draw from one device's capacity. A driver
can set `allowMultipleAllocations: true` on an accelerator with 48 GiB of
memory and add a request policy that governs how requests consume that
memory. If one claim consumes 16 GiB and another consumes 24 GiB, the
scheduler accounts for both and has 8 GiB left to allocate.

Fractional capacity ranges also graduate to Stable. They let the minimum,
maximum, and step of a capacity request policy's valid range use fractional
quantities with up to three decimal places, such as half-unit increments.
Both `DRAConsumableCapacity` and `DRAFractionalCapacityRange` are enabled by
default and can still be disabled in v1.38.

## What's Beta in v1.38

### List-valued device attributes

[Lists for device attributes](https://www.kubernetes.dev/resources/keps/5491/)
let a driver describe a device that belongs to more than one group. For
example, a CPU driver can publish every PCIe root that a CPU is adjacent to.
A `matchAttribute` constraint then requires all selected devices to share at
least one root, and a `distinctAttribute` constraint requires that no two
selected devices share a root. A single value is treated as a one-element
list. If a driver changes an attribute from a single value to a list, CEL
selectors that compare that attribute with `==` must be rewritten to use
`.includes()`. `DRAListTypeAttributes` is enabled by default.

### Node allocatable resource requests

[Node allocatable resource requests](https://www.kubernetes.dev/resources/keps/5517/)
let the scheduler and kubelet account for node resources that a DRA
allocation uses. For example, a driver can declare host-memory overhead for
an accelerator. The scheduler takes that memory into account alongside the
Pod's other resource requests when checking whether the Pod fits on a node.
In v1.38, a driver can also account for ephemeral storage, alongside CPU,
memory, and huge pages.

`DRANodeAllocatableResources` is off by default in v1.38. It defaults to on
for components that run with `--min-compatibility-version` set to 1.38 or
later. The kubelet doesn't have that flag, so on nodes you enable the
feature gate explicitly. The scheduler places Pods that use these devices
only on nodes whose kubelet declares the `DRAExtraNodeAllocatableResources`
node feature.

If you enabled the Alpha feature in v1.37, recreate Pods that use devices
with `nodeAllocatableResources` after you upgrade. The Pod status field
changed from `.status.nodeAllocatableResourceClaimStatuses` to
`.status.extraNodeAllocatableResources`.

### Optional node operations

[Optional node operations](https://www.kubernetes.dev/resources/keps/5945/)
let a driver indicate that devices in a ResourceSlice can skip kubelet
calls for node-local preparation and cleanup. Set `spec.skipNodeOperations`
to `["*"]` to skip both calls, or to `["NodeUnprepareResources"]` when the
driver needs preparation but no cleanup. The kubelet skips a call only when
all of the driver's allocated devices in a claim skip it. The scheduler
places Pods that use these devices only on nodes whose kubelet declares the
`DRAOptionalNodeOperations` node feature. `DRAOptionalNodeOperations` is
enabled by default.

### Less scheduler work on ResourceClaim changes

The scheduler's [PreQueueingHint extension point](https://www.kubernetes.dev/resources/keps/6132/)
graduates to Beta. When a ResourceClaim changes, the DRA scheduler plugin
can narrow requeue work to the Pods that reference the claim, instead of
checking every unschedulable Pod. This reduces scheduler work when many Pods
are waiting to be scheduled. `SchedulerPreQueueingHints` is enabled by
default.

## What's Alpha in v1.38

### Shared consumable capacity across devices

[Shared consumable capacity](https://www.kubernetes.dev/resources/keps/5941/)
lets allocations of different devices draw from a common budget. Consider
a network adapter that exposes several virtual interfaces backed by a
100 Gb/s link. The driver can represent the link as a shared counter and
map each virtual interface's bandwidth request to it. If one allocation
consumes 30 Gb/s, the scheduler can allocate up to 70 Gb/s more across
the interfaces sharing the link. The scheduler accounts for capacity.
Actual bandwidth enforcement depends on the driver and hardware.
`DRASharedConsumableCapacity` is off by default.

### Capacity requests for extended resources

With [extended resource capacity](https://www.kubernetes.dev/resources/keps/6406/),
operators can set a capacity request on the DeviceClass that backs an
extended resource. For example, this excerpt from a DeviceClass requests
10 shares per allocation:

```yaml
spec:
  extendedResourceName: example.com/gpu-share
  extendedResourceRequest:
    capacity:
      requests:
        shares: "10"
```

A Pod can request `example.com/gpu-share: 2` in its container resources.
When DRA serves the request, the scheduler creates a ResourceClaim for
two device allocations, each requesting 10 shares. The DeviceClass selects
eligible devices, and those devices must advertise the `shares` capacity.
`DRAExtendedResourceCapacity` is off by default and requires
`DRAConsumableCapacity`.

### Better resource availability reporting

The Alpha [ResourcePoolStatusRequest API](https://www.kubernetes.dev/resources/keps/5677/)
reports a point-in-time view of device availability. In v1.38, a device that
is both allocated and tainted counts only as allocated instead of being
subtracted twice, and allocated devices that are missing from the published
ResourceSlices are no longer counted. When a pool is only partly published,
the controller sets a `WaitingForPools` condition, waits up to 15 seconds,
and then writes a final status that marks the incomplete pool, instead of
leaving the request without a status. New warning events and metrics help
operators diagnose incomplete pools and observe request processing.
`DRAResourcePoolStatus` remains off by default.

### DRA preemption

[DRA preemption](https://www.kubernetes.dev/resources/keps/5690/) lets the
scheduler preempt a lower-priority Pod to free a device for a higher-priority
Pod. For example, if a batch Pod holds the only GPU that matches a
higher-priority inference Pod's claim, the scheduler can evict the batch Pod
and wait for its ResourceClaim to be deallocated. While the inference Pod
is nominated to the node, the scheduler holds the selected GPU in memory
so that Pods of equal or lower priority cannot take it first.

In Alpha, this applies to exclusively allocated, node-local devices in
Pod-owned ResourceClaims, such as claims created from a
ResourceClaimTemplate. To try it, enable the `DRAPreemption` feature gate
on `kube-scheduler`. The gate is off by default.

## Other changes worth checking before you upgrade

- The `DynamicResourceAllocation` feature gate
  [has been removed](https://github.com/kubernetes/kubernetes/pull/141946),
  and DRA is always enabled. Remove the gate from component flags and
  configuration files before you upgrade: setting a feature gate that no
  longer exists is an error.
- The feature gates for device taints and taint rules, partitionable
  devices, and device binding conditions are locked on. Setting a locked
  feature gate to `false` is an error.
- [Device taints and taint rules](https://www.kubernetes.dev/resources/keps/5055/)
  became Stable in v1.37. To deliberately target every device in a
  DeviceTaintRule, set `spec.deviceSelector.all: true`. An empty selector
  still matches all devices, but the API server now returns a warning, so
  `kubectl` with `--warnings-as-errors` exits with a non-zero code. Omitting
  the selector matches no devices. `NoExecute` eviction now honors a
  toleration with an empty effect, as documented. Two related fixes are also
  in v1.37 patch releases: rules without a selector no longer match every
  device (v1.37.1), and `NoExecute` eviction covers Pods that use DRA-backed
  extended resources (v1.37.2).
- Requests with admin access no longer consume device capacity or shared
  counters, and an admin access claim no longer blocks its device for a
  later claim of the same Pod. A capacity request with admin access only
  acts as a filter
  ([#144073](https://github.com/kubernetes/kubernetes/pull/144073),
  [#144115](https://github.com/kubernetes/kubernetes/pull/144115),
  [#144119](https://github.com/kubernetes/kubernetes/pull/144119)).
- The API server rejects some DRA objects that it previously accepted:
  qualified names with more than one slash, per-device node selectors with
  more than one term, negative or invalid capacity requests, and version
  attribute numbers that don't fit into int64. Existing objects can still be
  updated as long as the affected fields are unchanged
  ([#141644](https://github.com/kubernetes/kubernetes/pull/141644),
  [#141213](https://github.com/kubernetes/kubernetes/pull/141213),
  [#143287](https://github.com/kubernetes/kubernetes/pull/143287),
  [#142964](https://github.com/kubernetes/kubernetes/pull/142964)).
- The [ResourceSlice publishing helper](https://github.com/kubernetes/kubernetes/pull/142218)
  in `k8s.io/dynamic-resource-allocation` now rejects attribute and capacity
  names that repeat the driver's own domain, such as `<driver name>/memory`
  instead of `memory`. Drivers can opt out with
  `kubeletplugin.ValidateQualifiedNames(false)`. Capacity requests in a
  ResourceClaim can use
  [either short or fully qualified names](https://github.com/kubernetes/kubernetes/pull/142202).
- A [scheduler fix](https://github.com/kubernetes/kubernetes/pull/143450)
  prevents a device already allocated to a ResourceClaim from appearing free
  after `PreBind` fails, which could result in a double allocation. This was
  a regression in v1.37.0.

## What's next

These changes give driver authors and operators several ways to describe
sharing. Try partitionable devices when a driver can enumerate the
partitions a device supports, or consumable capacity when workloads need
different amounts of a shareable device. If a workload only uses extended
resource requests today, the new Alpha DeviceClass capacity setting lets you
test sharing without changing how the workload requests the resource.

## Getting involved

See the [DRA documentation](/docs/concepts/resource-management/dynamic-resource-allocation/)
for examples and configuration. Join the
[WG Device Management Slack channel](https://kubernetes.slack.com/archives/C0409NGC1TK)
and [meetings](https://www.kubernetes.dev/community/community-groups/wg/device-management/#meetings)
to share your experience with these features or contribute to their
documentation and tests.

## Acknowledgments

The following KEP owners added or promoted a feature in the v1.38 release
(in alphabetical order):

* Bi Ge ([bgee](https://github.com/bgee))
* [geetasg](https://github.com/geetasg)
* Morten Torkildsen ([mortent](https://github.com/mortent))
* Noureldin ([nmn3m](https://github.com/nmn3m))
* Praveen Krishna ([pravk03](https://github.com/pravk03))
* Sebastian Scheinkman ([SchSeba](https://github.com/SchSeba))
* Shingo Omura ([everpeace](https://github.com/everpeace))
* Shiva Krishna Merla ([shivamerla](https://github.com/shivamerla))
* Sunyanan Choochotkaew ([sunya-ch](https://github.com/sunya-ch))
* Troy Chiu ([troychiu](https://github.com/troychiu))
* Tsubasa Watanabe ([ttsuuubasa](https://github.com/ttsuuubasa))

This would not have been possible without the reviewers and approvers, and
the release and documentation teams. A huge thanks to everyone else who
helped shape DRA in this release, in ways big and small.
