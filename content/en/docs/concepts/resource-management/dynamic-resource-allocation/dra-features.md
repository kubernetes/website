---
reviewers:
- klueska
- pohly
title: DRA Features
content_type: concept
weight: 40
---

<!-- overview -->

This page describes optional DRA features for advanced use cases. They are
relevant only with DRA drivers that support them. Each feature notes its
maturity and the feature gate that enables it.

<!-- body -->

## Extended resource allocation by DRA {#extended-resource}

{{< feature-state feature_gate_name="DRAExtendedResource" >}}

You can provide an extended resource name for a DeviceClass. The scheduler will then
select the devices matching the class for the extended resource requests.
This allows users to continue using extended resource requests in a pod to request
either extended resources provided by device plugin, or DRA devices.
The same extended resource can be provided either by device plugin, or DRA on one single cluster node.
The same extended resource can be provided by device plugin on some nodes, and DRA on other nodes in the same cluster.

In the example below, the DeviceClass is given an extendedResourceName `example.com/gpu`.
If a pod requested for the extended resource `example.com/gpu: 2`, it can be scheduled to
a node with two or more devices matching the DeviceClass.

```yaml
apiVersion: resource.k8s.io/v1
kind: DeviceClass
metadata:
  name: gpu.example.com
spec:
  selectors:
  - cel:
      expression: device.driver == 'gpu.example.com' && device.attributes['gpu.example.com'].type
        == 'gpu'
  extendedResourceName: example.com/gpu
```

In addition, users can use a special extended resource to allocate devices without
having to explicitly create a ResourceClaim. Using the extended resource name
prefix `deviceclass.resource.kubernetes.io/` and the DeviceClass name.
This works for any DeviceClass, even if it does not specify an extended resource name.
The resulting ResourceClaim will contain a request for an `ExactCount` of the
specified number of devices of that DeviceClass.

Extended resource allocation by DRA is controlled by the
[`DRAExtendedResource` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DRAExtendedResource)
in the `kube-apiserver`, `kube-scheduler`, `kube-controller-manager`, and `kubelet`.

For a hands-on walkthrough of requesting extended resources, see
[Assign Extended Resources to a Container](/docs/tasks/configure-pod-container/extended-resource/).


## Partitionable devices {#partitionable-devices}

{{< feature-state feature_gate_name="DRAPartitionableDevices" >}}

Devices represented in DRA don't necessarily have to be a single unit connected to a single machine,
but can also be a logical device comprised of multiple devices connected to multiple machines.
These devices might consume overlapping resources of the underlying phyical devices,
meaning that when one logical device is allocated other devices will no longer be available.

In the ResourceSlice API, this is represented as a list of named CounterSets, each of which
contains a set of named counters. The counters represent the resources available on the physical
device that are used by the logical devices advertised through DRA.

Logical devices can specify the ConsumesCounters list. Each entry contains a reference to a CounterSet
and a set of named counters with the amounts they will consume. So for a device to be allocatable,
the referenced counter sets must have sufficient quantity for the counters referenced by the device.

CounterSets must be specified in separate ResourceSlices from devices.
Devices can consume counters from any CounterSet defined in the same resource pool as the device.

Here is an example of two devices, each consuming 6Gi of memory from a shared counter with 8Gi of memory.
Thus, only one of the devices can be allocated at any point in time.
The scheduler handles this and it is transparent to the consumer as the ResourceClaim API is not affected.

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: resourceslice-with-countersets
spec:
  nodeName: worker-1
  pool:
    name: pool
    generation: 1
    resourceSliceCount: 2
  driver: dra.example.com
  sharedCounters:
  - name: gpu-1-counters
    counters:
      memory:
        value: 8Gi
---
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: resourceslice-with-devices
spec:
  nodeName: worker-1
  pool:
    name: pool
    generation: 1
    resourceSliceCount: 2
  driver: dra.example.com
  devices:
  - name: device-1
    consumesCounters:
    - counterSet: gpu-1-counters
      counters:
        memory:
          value: 6Gi
  - name: device-2
    consumesCounters:
    - counterSet: gpu-1-counters
      counters:
        memory:
          value: 6Gi
```

Partitionable devices is controlled by the
[`DRAPartitionableDevices` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DRAPartitionableDevices)
in the `kube-apiserver` and `kube-scheduler`.


## Device compatibility groups {#device-compatibility-groups}

{{< feature-state feature_gate_name="DRADeviceCompatibilityGroups" >}}

Device compatibility groups let a DRA driver declare which partitioned devices
can be co-allocated on the same physical hardware. Without this feature,
incompatible device combinations are only detected when the kubelet prepares
the Pod on a node — resulting in a failed preparation. With compatibility
groups, the scheduler rejects incompatible combinations at scheduling time,
before any node-side work begins.

This is most useful for hardware that supports mutually exclusive operating
modes. For example, a GPU that can run in either MIG mode or vGPU mode: a
device in MIG mode and a device in vGPU mode cannot be co-allocated because
they consume overlapping physical resources in incompatible ways. By declaring
`compatibilityGroups`, the driver makes this constraint visible to the
scheduler.

This feature builds on [partitionable devices](#partitionable-devices): the
`compatibilityGroups` field lives on `device.consumesCounters[]` entries, which
only exist for partitionable devices. Both the `DRADeviceCompatibilityGroups`
and `DRAPartitionableDevices` feature gates must be enabled in the
kube-apiserver and kube-scheduler.

### How it works {#device-compatibility-groups-how-it-works}

A driver adds a `compatibilityGroups` list to each
`device.consumesCounters[]` entry in a `ResourceSlice`. The list contains
one or two opaque string names that represent the operating mode or partition
type of that device on that particular counter set.

When the scheduler allocates multiple devices that draw from the same counter
set, it computes the intersection of their `compatibilityGroups`. Allocation
succeeds only if that intersection is non-empty — meaning every co-allocated
device shares at least one common group name. Devices drawing from different
counter sets are never compared against each other.

A device that declares no groups (an unset, nil, or empty list) is treated as
a special case: it is only co-allocatable with other no-group devices on the
same counter set. It is never co-allocatable with a device that declares one or
more groups.

The constraint applies across all claims being allocated in a single scheduling
cycle: if two claims each allocate a device from the same counter set, the
cross-claim group intersection is also enforced.

### Example {#device-compatibility-groups-example}

Consider a GPU that can operate in either MIG mode or vGPU mode. The driver
publishes two devices, each consuming 6 GiB from the same shared memory counter.
Each device declares its operating mode as a compatibility group:

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: gpu-counters
spec:
  nodeName: worker-1
  pool:
    name: gpu-pool
    generation: 1
    resourceSliceCount: 2
  driver: gpu.example.com
  sharedCounters:
  - name: gpu-0-memory
    counters:
      memory:
        value: 8Gi
---
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: gpu-devices
spec:
  nodeName: worker-1
  pool:
    name: gpu-pool
    generation: 1
    resourceSliceCount: 2
  driver: gpu.example.com
  devices:
  - name: gpu-0-mig
    consumesCounters:
    - counterSet: gpu-0-memory
      counters:
        memory:
          value: 6Gi
      compatibilityGroups:
      - mig
  - name: gpu-0-vgpu
    consumesCounters:
    - counterSet: gpu-0-memory
      counters:
        memory:
          value: 6Gi
      compatibilityGroups:
      - vgpu
```

In this example:
- `gpu-0-mig` belongs to the `mig` group.
- `gpu-0-vgpu` belongs to the `vgpu` group.

If a Pod or PodGroup requests two devices from this pool, the scheduler checks
whether the two chosen devices share a common compatibility group on the
`gpu-0-memory` counter set. Since `{"mig"} ∩ {"vgpu"} = ∅`, the pair is
rejected. Both requests can only be satisfied by two MIG devices (or two vGPU
devices) from a pool where such pairs exist.

### Constraints {#device-compatibility-groups-constraints}

- Each `consumesCounters[]` entry may declare at most **2** group names.
- Group names must be unique within a single entry.
- Group names are opaque to Kubernetes; they are meaningful only within the
  publishing driver's pool.
- Groups are compared per counter set: groups on one counter set have no effect
  on co-allocation decisions for a different counter set.

### Version-skew safety {#device-compatibility-groups-version-skew}

When the `DRADeviceCompatibilityGroups` feature gate is disabled (the default
for alpha), the kube-apiserver strips the `compatibilityGroups` field from any
new or updated `ResourceSlice` — unless the old object already had the field
set. The scheduler then treats devices in any pool that previously had grouped
devices as belonging to an incomplete pool and skips them entirely.

Device compatibility groups is controlled by the
[`DRADeviceCompatibilityGroups` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DRADeviceCompatibilityGroups)
in the kube-apiserver and kube-scheduler. The
[`DRAPartitionableDevices` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DRAPartitionableDevices)
must also be enabled.

## Consumable capacity

{{< feature-state feature_gate_name="DRAConsumableCapacity" >}}

The consumable capacity feature allows the same devices to be consumed by multiple independent ResourceClaims,
with the Kubernetes scheduler managing how much of the device's capacity is used up by each claim.
This is analogous to how Pods can share the resources on a Node; ResourceClaims can share the resources on a Device.

The device driver can set `allowMultipleAllocations` field added in `.spec.devices` of `ResourceSlice`
to allow allocating that device to multiple independent ResourceClaims or to multiple requests within a ResourceClaim.

Users can set `capacity` field added in `spec.devices.requests` of `ResourceClaim` to specify the device resource requirements for each allocation.

For the device that allows multiple allocations, the requested capacity is drawn from — or consumed from — its total capacity,
a concept known as **consumable capacity**.
Then, the scheduler ensures that the aggregate consumed capacity across all claims does not exceed the device’s overall capacity.
Furthermore, driver authors can use the `requestPolicy` constraints on individual device capacities to control
how those capacities are consumed.
For example, the driver author can specify that a given capacity is only consumed in increments of 1Gi.

Here is an example of a network device which allows multiple allocations and contains a consumable bandwidth capacity.

```yaml
kind: ResourceSlice
apiVersion: resource.k8s.io/v1
metadata:
  name: resourceslice
spec:
  nodeName: worker-1
  pool:
    name: pool
    generation: 1
    resourceSliceCount: 1
  driver: dra.example.com
  devices:
  - name: eth1
    allowMultipleAllocations: true
    attributes:
      name:
        string: "eth1"
    capacity:
      bandwidth:
        requestPolicy:
          default: "1M"
          validRange:
            min: "1M"
            step: "8"
        value: "10G"
```

The consumable capacity can be requested as shown in the below example.

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceClaimTemplate
metadata:
  name: bandwidth-claim-template
spec:
  spec:
    devices:
      requests:
      - name: req-0
        exactly:
          deviceClassName: resource.example.com
          capacity:
            requests:
              bandwidth: 1G
```

The allocation result will include the consumed capacity and the identifier of the share.

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceClaim
...
status:
  allocation:
    devices:
      results:
      - consumedCapacity:
          bandwidth: 1G
        device: eth1
        shareID: "a671734a-e8e5-11e4-8fde-42010af09327"
```

In this example, a multiply-allocatable device was chosen. However, any `resource.example.com` device
with at least the requested 1G bandwidth could have met the requirement.
If a non-multiply-allocatable device were chosen, the allocation would have resulted in the entire device.
To force the use of a only multiply-allocatable devices, you can use the CEL criteria `device.allowMultipleAllocations == true`.

### DistinctAttribute constraint

When requesting multiple devices in a ResourceClaim, you can use the DistinctAttribute
constraint to ensure that each allocated device has a different value for a specified
attribute. This constraint was introduced with the consumable capacity feature.

The DistinctAttribute constraint is particularly useful when working with
multiply-allocatable devices. It prevents the scheduler from allocating the same
device multiple times within a single ResourceClaim, even when that device allows
multiple allocations.

Beyond preventing duplicate allocations, this constraint helps optimize performance
by ensuring devices are distributed based on their attributes. For example, you can
use it to distribute devices across different NUMA nodes to optimize memory bandwidth
and reduce contention.


## Granular status authorization {#granular-status-authorization}

{{< feature-state feature_gate_name="DRAResourceClaimGranularStatusAuthorization" >}}

Starting in Kubernetes v1.36, DRA enforces fine-grained authorization checks for updates
to `ResourceClaim` status by using synthetic subresources and node-aware verbs.

For security hardening guidance, including RBAC examples for scheduler and DRA
drivers, see
[Hardening Guide - Dynamic Resource Allocation](/docs/concepts/security/hardening-guide/dynamic-resource-allocation/).

For a step-by-step cluster administrator procedure, see
[Harden Dynamic Resource Allocation in Your Cluster](/docs/tasks/administer-cluster/hardening-dra/).

