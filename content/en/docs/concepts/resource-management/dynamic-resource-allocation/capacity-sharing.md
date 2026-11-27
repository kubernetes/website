---
reviewers:
- pohly
- sunya-ch
title: Device Capacity Sharing and Partitioning
content_type: concept
weight: 45
---

<!-- overview -->

Dynamic Resource Allocation (DRA) tracks capacity at two scopes:

* **Device capacity** is advertised in an individual device's `capacity`
  field. With [consumable capacity](#consumable-capacity), multiple
  ResourceClaims can allocate portions of that device's capacity.
* **Pool counter sets** are advertised in `sharedCounters` and track resources
  that multiple devices in the same resource pool can draw from.
  * With [partitionable devices](#partitionable-devices), each logical device
    draws a fixed amount set by the driver in a ResourceSlice.
  * With [shared consumable capacity](#consumable-capacity-shared), each
    allocation draws an amount based on its ResourceClaim request.
    `valueFrom.capacityName` maps the request to a counter, which can have
    a `consumptionPolicy`.

The Kubernetes scheduler tracks consumption and prevents allocations from
exceeding the available capacity.

<!-- body -->

## Consumable capacity {#consumable-capacity}

{{< feature-state feature_gate_name="DRAConsumableCapacity" >}}

Consumable capacity lets multiple independent ResourceClaims share one device.
The Kubernetes scheduler tracks how much capacity each claim uses, much as it
tracks the resources that Pods consume on a Node.

### Request consumable capacity

When requesting exactly one kind of device in a `ResourceClaim`, set
`spec.devices.requests[].exactly.capacity` to specify the device resource
requirements for each allocation. For a prioritized list of different alternatives, set `capacity` within
the relevant `spec.devices.requests[].firstAvailable[]` entries.

The following ResourceClaimTemplate requests 1G of bandwidth from a device
matching the `resource.example.com` DeviceClass.

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

The DRA driver that provides a device matching the `resource.example.com`
DeviceClass defines what `bandwidth` means for that device.

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
To force the use of only multiply-allocatable devices, you can use the CEL criteria `device.allowMultipleAllocations == true`.

#### DistinctAttribute constraint

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

### How consumable capacity works

The device driver can set the `allowMultipleAllocations` field in `.spec.devices` of `ResourceSlice`
to allow allocating that device to multiple independent ResourceClaims or to multiple requests within a ResourceClaim.

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

## Partitionable devices {#partitionable-devices}

{{< feature-state feature_gate_name="DRAPartitionableDevices" >}}

Partitionable devices let drivers advertise logical devices that draw fixed
amounts from shared physical resources.

### Request a partitionable device

Use a DeviceClass that matches the logical devices you want and reference it in
a [ResourceClaim or ResourceClaimTemplate](/docs/concepts/resource-management/dynamic-resource-allocation/dra-api/#resourceclaims-templates).
The claim uses the standard device request fields. The scheduler checks that the
shared counters have enough capacity for the device.

### How partitionable devices work

Devices represented in DRA don't necessarily have to be a single unit connected to a single machine,
but can also be a logical device comprised of multiple devices connected to multiple machines.
These devices might consume overlapping resources of the underlying physical devices,
meaning that when one logical device is allocated other devices will no longer be available.

In the ResourceSlice API, this is represented as a list of named CounterSets, each of which
contains a set of named counters. The counters represent the resources available on the physical
device that are used by the logical devices advertised through DRA.

Logical devices can specify the ConsumesCounters list. Each entry contains a reference to a CounterSet
and a set of named counters with the amounts they will consume. So for a device to be allocatable,
the referenced counter sets must have sufficient quantity for the counters referenced by the device.

CounterSets must be specified in separate ResourceSlices from devices.
Devices can consume counters from any CounterSet defined in the same resource pool as the device.

In this example, three logical devices draw from a shared 8Gi GPU memory
counter. The scheduler can allocate both 4Gi devices together or allocate
the full 8Gi device on its own.

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
  - name: partial-device-1
    consumesCounters:
    - counterSet: gpu-1-counters
      counters:
        memory:
          value: 4Gi
  - name: partial-device-2
    consumesCounters:
    - counterSet: gpu-1-counters
      counters:
        memory:
          value: 4Gi
  - name: full-device
    consumesCounters:
    - counterSet: gpu-1-counters
      counters:
        memory:
          value: 8Gi
```

Partitionable devices is controlled by the
[`DRAPartitionableDevices` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DRAPartitionableDevices)
in the `kube-apiserver` and `kube-scheduler`.

## Shared consumable capacity {#consumable-capacity-shared}

{{< feature-state feature_gate_name="DRASharedConsumableCapacity" >}}

Shared consumable capacity lets allocations of related devices draw
request-driven amounts from shared counters in a resource pool. The scheduler
checks the aggregate usage across devices that draw from the same counters.

### Request shared consumable capacity

Set `capacity.requests` in the ResourceClaim using the capacity name that
the DRA driver provides. For example, an SR-IOV Physical Function (PF) has a
link bandwidth budget shared by all its Virtual Functions (VFs).

If the `sriov-vfs` DeviceClass selects devices from `sriov-driver.example.com`,
the following ResourceClaim requests a VF with 10G of bandwidth:

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceClaim
metadata:
  name: my-vf-claim
spec:
  devices:
    requests:
    - name: vf-request
      exactly:
        deviceClassName: sriov-vfs
        capacity:
          requests:
            sriov-driver.example.com/bandwidth: "10G"
```

In `capacity.requests`, you can use either `bandwidth` or
`sriov-driver.example.com/bandwidth` for this example. With the short name, the
scheduler uses the driver name of each device it considers as the domain. The
fully qualified name keeps the domain fixed if the DeviceClass matches devices
from several drivers.

#### Allocation status {#shared-consumable-capacity-allocation-status}

For non-admin allocations, the scheduler records resolved request-driven counter
consumption in the `consumedCounters` list in the ResourceClaim's allocation status.

Each list entry identifies a counter set in the allocated device's pool and records
that allocation's resolved `valueFrom` amounts, including defaults, rounding, and
zero amounts. Fixed consumption from `value` is not recorded in this list.

For the SR-IOV claim above, the allocation status includes the resolved 10G
bandwidth consumption:

```yaml
status:
  allocation:
    devices:
      results:
      - request: vf-request
        driver: sriov-driver.example.com
        pool: sriov-pool
        device: vf-0
        consumedCounters:
        - counterSet: pf-0-counter-set
          counters:
            bandwidth: "10G"
```

### How shared consumable capacity works

This feature builds on [partitionable devices](#partitionable-devices)
and [consumable capacity](#consumable-capacity).

Enable the
[`DRAPartitionableDevices` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DRAPartitionableDevices)
and the
[`DRAConsumableCapacity` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DRAConsumableCapacity)
in the `kube-apiserver` and `kube-scheduler`. Then enable the alpha
[`DRASharedConsumableCapacity` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DRASharedConsumableCapacity)
in both components.

1. The driver publishes `sharedCounters` with counters that can include a `consumptionPolicy`
   defining defaults and permitted consumption amounts.
2. Each allocatable device references the shared counter set it draws from via
   `consumesCounters`, using `valueFrom.capacityName` to map a `capacity.requests`
   name to the shared counter. The counter set must be in the same resource pool
   as the device.
3. During allocation, the scheduler resolves the `valueFrom` mappings, applies
   defaults and rounds requests up according to the `consumptionPolicy`, and reserves
   the resolved amounts. The scheduler skips candidates whose consumption violates
   the policy or exceeds the remaining shared counter capacity.

The `consumptionPolicy` is optional. If a mapped capacity request is omitted, the
scheduler uses the policy's default, or the full counter value if no default is
defined. Without a policy, an explicit request can consume any amount up to the
available counter value.

In `valueFrom.capacityName`, drivers can omit the domain for capacities
they define. Kubernetes then uses the ResourceSlice's driver name as the
domain. Include the domain for capacities defined by a third party.

Devices can map requests to shared counters without also advertising those
capacities in their own `capacity` field. If a device defines the same capacity
name in both places, each capacity must satisfy the request independently.

#### Example: SR-IOV bandwidth as a shared parent resource

The following ResourceSlice publishes the PF's 100Gbps bandwidth budget as a
shared counter:

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: pf-0-counters
spec:
  nodeName: "worker-1"
  driver: "sriov-driver.example.com"
  pool:
    generation: 1
    name: "sriov-pool"
    resourceSliceCount: 2
  sharedCounters:
  - name: pf-0-counter-set
    counters:
      bandwidth:
        value: "100G"
        consumptionPolicy:
          default: "1G"
          validRange:
            min: "1M"
            max: "100G"
            step: "1M"
```

The `consumptionPolicy` specifies that if a claim does not explicitly request bandwidth,
1G is consumed by default. Valid requests range from 1M to 100G in increments of 1M.

The following ResourceSlice defines the VF devices, each referencing the shared
counter set through `valueFrom`:

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: pf-0-vfs
spec:
  driver: "sriov-driver.example.com"
  pool:
    generation: 1
    name: "sriov-pool"
    resourceSliceCount: 2
  nodeName: "worker-1"
  devices:
  - name: vf-0
    consumesCounters:
    - counterSet: pf-0-counter-set
      counters:
        bandwidth:
          valueFrom:
            # A ResourceClaim can request bandwidth or
            # sriov-driver.example.com/bandwidth.
            capacityName: "bandwidth"
  - name: vf-1
    consumesCounters:
    - counterSet: pf-0-counter-set
      counters:
        bandwidth:
          valueFrom:
            capacityName: "bandwidth"
```

The scheduler uses the ResourceSlice's driver name as the domain for
`valueFrom.capacityName`. This maps the claim's request for
`sriov-driver.example.com/bandwidth` to the shared `bandwidth` counter.

When the scheduler allocates `vf-0` or `vf-1` for the preceding claim, it resolves the
`valueFrom` mapping and subtracts 10G from the shared `pf-0-counter-set` bandwidth
counter (100G total). If the remaining capacity in the shared counter set is not
sufficient for a subsequent claim, the scheduler rejects those VF candidates,
preventing aggregate over-allocation of PF bandwidth.

#### Mixing static and request-driven consumption

Devices can combine static `value` consumption (existing partitionable devices behavior)
and request-driven `valueFrom` consumption within the same `consumesCounters` entry.
For example, a device might statically consume a fixed amount of one shared counter
while allowing the user to request a variable amount of another. Each counter must
specify exactly one of `value` or `valueFrom`.

If a device has `allowMultipleAllocations: true`, its static consumption is
counted once per driver, pool, and device while any non-admin allocation of that
device remains. The scheduler resolves this fixed consumption from current
ResourceSlices, including `consumptionPolicy` rounding.

The scheduler sums the amounts recorded in `consumedCounters` across non-admin
allocations, including multiple shares of the same device. Releasing one allocation
releases its recorded amounts without changing those of surviving allocations.

Building on the SR-IOV example above, suppose a VF also allows multiple allocations
and consumes a fixed 6Gi from a separate 10Gi memory counter.
If two claims allocate that VF, 4Gi remains available. Releasing either
claim still leaves only 4Gi available because the other claim continues to use
the device. The static 6Gi reservation is released when the last allocation ends.
Any request-driven consumption is released independently when its allocation ends.

#### ResourceSlice updates

ResourceSlice updates do not resize or revoke existing allocations. DRA drivers
must ensure that updated definitions remain compatible with existing allocations,
or arrange for affected allocations to be released first.

The scheduler uses the recorded amounts to account for existing allocations,
including after a restart. If `consumedCounters` is absent or an empty list, the
scheduler counts that allocation's request-driven counter consumption as zero.
It does not reconstruct that consumption from current `valueFrom` mappings.
This also applies to allocations made before the feature was enabled.

The scheduler accounts for existing allocations using two sources:

* Recorded request-driven amounts and counter set references remain authoritative
  when mappings, defaults, or policies change. A mapping change does not move an
  existing allocation's consumption to another counter set. Recorded amounts still
  count if the allocated device disappears from current ResourceSlices; amounts
  referring to a missing counter set or counter are ignored.
* Fixed consumption is derived from current ResourceSlices, including current
  `consumptionPolicy` rounding, and counted once per device with at least one
  non-admin allocation. It is counted even if it violates the current policy's
  limits. If the device definition is missing, its fixed consumption is not counted.
  Current fixed consumption is added to the recorded request-driven consumption:
  changing a counter requirement from `valueFrom` to `value` does not replace the
  recorded amounts.

Current shared counter values define the total budget. Reducing a counter below
its recorded consumption prevents further consumption without changing existing
allocation results. For example, reducing the PF bandwidth counter from 100G to 5G
does not resize or revoke the existing 10G allocation above.
