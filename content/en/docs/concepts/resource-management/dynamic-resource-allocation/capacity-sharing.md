---
reviewers:
- klueska
- pohly
title: Capacity sharing
content_type: concept
weight: 45
---

<!-- overview -->

Dynamic Resource Allocation (DRA) supports two ways to share capacity:

* With consumable capacity, multiple ResourceClaims share the capacity of a single device.
* With shared consumable capacity, allocations of related devices draw request-driven
  amounts from shared counters in a resource pool.

In both cases, the Kubernetes scheduler tracks consumption and prevents allocations
from exceeding the available capacity.

<!-- body -->

## Consumable capacity {#consumable-capacity}

{{< feature-state feature_gate_name="DRAConsumableCapacity" >}}

The consumable capacity feature allows the same devices to be consumed by multiple independent ResourceClaims,
with the Kubernetes scheduler managing how much of the device's capacity is used up by each claim.
This is analogous to how Pods can share the resources on a Node; ResourceClaims can share the resources on a Device.

The device driver can set `allowMultipleAllocations` field added in `.spec.devices` of `ResourceSlice`
to allow allocating that device to multiple independent ResourceClaims or to multiple requests within a ResourceClaim.

When requesting exactly one kind of device in a `ResourceClaim`, set
`spec.devices.requests[].exactly.capacity` to specify the device resource
requirements for each allocation. For a prioritized list of different alternatives, set `capacity` within
the relevant `spec.devices.requests[].firstAvailable[]` entries.

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


### Shared consumable capacity {#consumable-capacity-shared}

{{< feature-state feature_gate_name="DRASharedConsumableCapacity" >}}

Shared consumable capacity extends [partitionable devices](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#partitionable-devices)
and [consumable capacity](#consumable-capacity) so that multiple related child devices
can consume request-driven amounts from a shared parent-scoped counter set. The
scheduler tracks aggregate consumption across all devices that reference the same
shared counters and prevents over-allocation.

This is useful when a physical resource budget is shared across multiple allocatable
child devices. For example, an SR-IOV Physical Function (PF) has a fixed link bandwidth
that all its Virtual Functions (VFs) share. Without this feature, drivers would need to
either statically partition the bandwidth across VFs, or model the PF as a separate
allocatable device with complex multi-request claims, both of which reduce flexibility
or increase user complexity.

With shared consumable capacity, the driver publishes the total capacity as a shared
counter with a `requestPolicy`, and each child device maps an inbound capacity request
name to that shared counter through `valueFrom.capacityName`. Users request capacity
amounts in their ResourceClaims using the existing `capacity.requests` field, and
the scheduler resolves the mappings and enforces the aggregate budget automatically.

To use this alpha feature, enable the
[`DRASharedConsumableCapacity` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DRASharedConsumableCapacity)
in the `kube-apiserver` and `kube-scheduler`. The `DRAPartitionableDevices` and
`DRAConsumableCapacity` feature gates must also be enabled.

#### How shared consumable capacity works

1. The driver publishes `sharedCounters` with counters that include a `requestPolicy`
   defining defaults and permitted consumption amounts.
2. Each allocatable device references the shared counter set it draws from via
   `consumesCounters`, using `valueFrom.capacityName` to map a `capacity.requests`
   name to the shared counter. The counter set must be in the same resource pool
   as the device.
3. A ResourceClaim requests capacity using the existing `capacity.requests` field.
4. During allocation, the scheduler resolves the `valueFrom` mappings, applies
   defaults and rounds requests up according to the `requestPolicy`, and reserves
   the resolved amounts. The scheduler skips candidates whose consumption violates
   the policy or exceeds the remaining shared counter capacity.

A counter referenced through `valueFrom` must have a `requestPolicy`. A capacity
name without a domain prefix is matched using the ResourceSlice's driver name
as its domain. Devices can map requests to shared counters without also
advertising those capacities in their own `capacity` field.

#### Example: SR-IOV bandwidth as a shared parent resource

Consider an SR-IOV NIC with a PF that has 100Gbps of total bandwidth shared across all
its VFs. The driver publishes the PF bandwidth as a shared counter with a request policy,
and each VF device maps the bandwidth capacity request to that shared counter.

The following ResourceSlice defines the shared counter set with the PF bandwidth budget:

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
        requestPolicy:
          default: "1G"
          validRange:
            min: "1M"
            max: "100G"
            step: "1M"
```

The `requestPolicy` specifies that if a claim does not explicitly request bandwidth,
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
            capacityName: "sriov-driver.example.com/bandwidth"
  - name: vf-1
    consumesCounters:
    - counterSet: pf-0-counter-set
      counters:
        bandwidth:
          valueFrom:
            capacityName: "sriov-driver.example.com/bandwidth"
```

The `valueFrom.capacityName` field maps the `sriov-driver.example.com/bandwidth` name
from a ResourceClaim's `capacity.requests` to the shared `bandwidth` counter.

Assuming a DeviceClass named `sriov-vfs` selects devices from
`sriov-driver.example.com`, a workload operator requests bandwidth by specifying
the capacity in a ResourceClaim:

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

When the scheduler allocates `vf-0` or `vf-1` for this claim, it resolves the
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
reserved once while any non-admin allocation of that device remains.
Request-driven consumption is reserved separately for each allocation.

For example, a shared device consumes a static 6Gi from a 10Gi memory counter.
Two claims allocate that same device, leaving 4Gi available. Releasing either
claim still leaves only 4Gi available because the other claim continues to use
the device. The static 6Gi reservation is released when the last allocation ends.
Any request-driven consumption is released independently when its allocation ends.

#### Allocation status {#shared-consumable-capacity-allocation-status}

The scheduler records resolved counter consumption in each
`status.allocation.devices.results[].consumedCounters` entry of a ResourceClaim.
Users specify requests in the claim's `spec`; the scheduler populates this status.

The snapshot separates two kinds of consumption:

* `perDevice` records static consumption from `value`. Every allocation of the
  same device records the same snapshot, and the scheduler counts it once per
  driver, pool, and device while at least one non-admin allocation remains.
* `perAllocation` records resolved request-driven consumption from `valueFrom`,
  including defaults and rounding. The scheduler counts it for each allocation.

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
          perAllocation:
          - counterSet: pf-0-counter-set
            counters:
              bandwidth: "10G"
```

The scheduler uses these snapshots to account for existing allocations, including
after a restart. Updating a ResourceSlice does not rewrite existing allocation
snapshots, and releasing one share does not change the surviving shares' status.
An empty `consumedCounters: {}` records known zero counter consumption. An absent
field means no snapshot was recorded and must not be interpreted as zero consumption.
