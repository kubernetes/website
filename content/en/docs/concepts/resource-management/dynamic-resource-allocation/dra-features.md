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

