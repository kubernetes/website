---
reviewers:
- klueska
- pohly
title: DRA Features
content_type: concept
weight: 40
---

<!-- overview -->

This page describes optional DRA features for advanced use cases. Some of
these features require support from the DRA driver. Each feature notes its
maturity and the feature gate that enables it.

<!-- body -->

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
`kube-apiserver` and `kube-scheduler`.

### How it works {#device-compatibility-groups-how-it-works}

A driver defines a `compatibilityGroups` list for each
`device.consumesCounters[]` entry in a ResourceSlice. The list contains
at most 2 opaque string names that represent the operating mode or partition
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
publishes two devices, each consuming 4 GiB from the same shared memory counter
of 8 GiB. Based on counter capacity alone, both devices could be allocated
together. Each device declares its operating mode as a compatibility group,
making the two modes mutually exclusive:

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
          value: 4Gi
      compatibilityGroups:
      - mig
  - name: gpu-0-vgpu
    consumesCounters:
    - counterSet: gpu-0-memory
      counters:
        memory:
          value: 4Gi
      compatibilityGroups:
      - vgpu
```

In this example:
- `gpu-0-mig` belongs to the `mig` group.
- `gpu-0-vgpu` belongs to the `vgpu` group.

If a Pod or PodGroup requests two devices from this pool, the scheduler checks
whether the two chosen devices share a common compatibility group on the
`gpu-0-memory` counter set. Since `{"mig"} ∩ {"vgpu"} = ∅`, the pair is
rejected — even though the counter set has enough memory for both. Both
requests can only be satisfied by two MIG devices (or two vGPU devices) from a
pool where such pairs exist.

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
new or updated ResourceSlice — unless the old object already had the field
set. The scheduler then treats devices in any pool that previously had grouped
devices as belonging to an incomplete pool and skips them entirely.

Only a non-empty list counts as the field being set: `compatibilityGroups: null`
and `compatibilityGroups: []` are treated identically to omitting the field.
Devices with them behave exactly like devices with no groups — they do not
cause the scheduler to treat the pool as incomplete.

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


## Optional node operations {#optional-node-operations}

{{< feature-state feature_gate_name="DRAOptionalNodeOperations" >}}

In Dynamic Resource Allocation (DRA), the `kubelet` coordinates with a node-local
driver via gRPC to prepare allocated devices before container start
(`NodePrepareResources`) and to unprepare them upon Pod termination
(`NodeUnprepareResources`). While this setup is critical for node-local hardware
such as GPUs or FPGAs, some resources are managed entirely in the control plane
and require no node-local setup.

The optional node operations feature allows resource drivers to declare that
specific node-local gRPC operations can be skipped. When configured, the `kubelet`
bypasses driver lookup and gRPC calls for those devices, eliminating the need to
deploy and maintain empty node-local drivers on every worker node.

### Driver configuration

Driver authors can specify the `skipNodeOperations` field in
`.spec.skipNodeOperations` of a ResourceSlice. This field is a list of unique
strings specifying the node-local operations to bypass for all devices in that
slice.

Valid values are:

* `"NodePrepareResources"`: Skips `NodePrepareResources` gRPC calls. This value
  cannot be specified unless `"NodeUnprepareResources"` is also listed (or `"*"`
  is specified). This limitation avoids Pods getting stuck in Terminating if a
  node-local plugin is missing, since the plugin is not checked during Pod
  startup when preparation is skipped.
* `"NodeUnprepareResources"`: Skips `NodeUnprepareResources` gRPC calls.
* `"*"`: Skips all node-local resource operations.

Here is an example of a ResourceSlice for a control-plane resource that skips
all node-local operations:

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: control-plane-resources
spec:
  nodeName: worker-1
  pool:
    name: central-pool
    generation: 1
    resourceSliceCount: 1
  driver: control-plane.example.com
  skipNodeOperations:
  - "*"
  devices:
  - name: virtual-device-1
```

### Allocation result and execution

When the Kubernetes scheduler allocates a device to a ResourceClaim, it copies
the `skipNodeOperations` list from the ResourceSlice into the allocation
result:

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceClaim
...
status:
  allocation:
    devices:
      results:
      - device: virtual-device-1
        driver: control-plane.example.com
        pool: central-pool
        skipNodeOperations:
        - "*"
```

When a Pod runs on a node, the `kubelet` reads the allocation results. If all
allocated devices for a given driver within a ResourceClaim skip a specific
operation, the `kubelet` completely bypasses calling that gRPC hook for that
driver.

### Operational considerations

#### In-place driver updates

Because the `skipNodeOperations` setting is copied from the ResourceSlice into
the ResourceClaim at allocation time, running Pods and active allocations
retain whatever setting was in place when they were scheduled.

If a driver's node operation requirements are updated in place (for example,
changing from requiring node operations to skipping them), existing claims will
still use the previous configuration. To avoid issues—such as terminating Pods
hanging while waiting for a decommissioned node plugin—cluster administrators
should ensure no active claims exist for a driver before altering its node
operation requirements or removing node-local driver DaemonSets.

#### Node declared features integration

To prevent Pods from being scheduled onto nodes where the `kubelet` does not
support skipping DRA operations (which would cause the `kubelet` to fail while
waiting for a missing node plugin), this feature integrates with [Node Declared
Features](/docs/concepts/scheduling-eviction/node-declared-features/). When a
Pod uses a ResourceClaim with `skipNodeOperations` configured, the Kubernetes
scheduler verifies that the target node declares support for the
`DRAOptionalNodeOperations` feature in its `.status.declaredFeatures` before
scheduling the Pod.

Optional node operations is controlled by the
[`DRAOptionalNodeOperations`](/docs/reference/command-line-tools-reference/feature-gates/#DRAOptionalNodeOperations)
feature gate in the `kube-apiserver`, `kube-scheduler`, and `kubelet`.
## DRA device metadata in containers {#device-metadata}

{{< feature-state state="alpha" for_k8s_version="v1.36" >}}

DRA drivers can expose device metadata such as device attributes (PCI bus
addresses or mdevUUID for mediated devices) or network configuration directly
to containers as JSON files.
This lets applications inside the container discover information about allocated
devices without querying the Kubernetes API or building custom controllers.

KEP-5304 defines a
[device metadata protocol](#device-metadata-protocol) that drivers must
follow so applications inside the container see a consistent layout across
drivers and clusters. The
[DRA kubelet plugin library](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin)
implements this protocol for you; the rest of this section describes how to
use it.

Device metadata follows the same rules as device access: it is available inside
a container only when that container requests the device in its container
specification, and not otherwise. For how to request DRA devices in Pods and
containers, see
[Request devices in workloads using DRA](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/#request-devices-workloads).

### Device metadata protocol {#device-metadata-protocol}

The protocol consists of four rules:

1. **File paths.** Metadata files live inside containers under
   `/var/run/kubernetes.io/dra-device-attributes`. For a directly referenced
   ResourceClaim the path is
   `resourceclaims/<claimName>/<requestName>/<driverName>-metadata.json`; for a
   claim created from a ResourceClaimTemplate the path is
   `resourceclaimtemplates/<podClaimName>/<requestName>/<driverName>-metadata.json`
   (where `podClaimName` is `pod.spec.resourceClaims[].name`).

   In cases where the ResourceClaim request uses the
   [prioritized list](#prioritized-list) feature, only the top-level request
   name is used for the `<requestName>` segment in the file path (that is,
   the `/<subrequest>` portion is dropped). Inside the
   JSON file, the `requests[].name` field carries the full
   `<request>/<subrequest>` reference (for example, `gpu/high-memory`) so
   that consumers can identify which alternative was allocated.

   The path constants are defined in
   [`k8s.io/dynamic-resource-allocation/api/metadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/api/metadata).

1. **JSON API.** Each file is a stream of one or more
   [`DeviceMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/api/metadata/v1alpha1#DeviceMetadata)
   objects serialized as versioned JSON with `apiVersion` and `kind`, following
   Kubernetes API conventions. The same metadata is encoded once per supported
   API version (newest first). All objects in the stream are semantically
   equivalent; consumers should use the first object they can decode.

1. **Generation.** When a driver updates a metadata file the embedded
   `metadata.generation` field must increase so consumers can detect changes.

1. **Container exposure.** Files are typically exposed via
   {{< glossary_tooltip text="CDI" term_id="cdi" >}} bind-mounts, but other
   mechanisms are permitted as long as the file appears at the correct path and
   is read-only inside the container.

### How device metadata works {#device-metadata-how-it-works}

Device metadata is a driver-side feature that does not require any Kubernetes
API changes or feature gates. Using the DRA kubelet plugin library is a common
way to implement a driver, but drivers can be built in other ways as well.
Drivers that use the kubelet plugin enable this feature by passing the
`EnableDeviceMetadata` and `MetadataVersions`
[options](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin#Option)
when starting the plugin. `MetadataVersions` specifies which API versions are
serialized into the metadata file and must be set explicitly by the driver.
Check the documentation of your DRA driver to learn whether device metadata is
supported and how to enable it.

When device metadata is enabled, the driver generates metadata files and CDI
bind-mount specifications while preparing the allocated devices for the pod,
before the consuming containers start. The metadata appears inside containers at
the well-known paths as [defined above](#device-metadata-protocol).

When a single request allocates devices from multiple DRA drivers, each driver
writes its own metadata file. Containers enumerate `*-metadata.json` files in
the request directory to discover all devices.

The Go package
[`k8s.io/dynamic-resource-allocation/devicemetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/devicemetadata)
provides utilities for reading and decoding these metadata files by applications
inside the container.

### Metadata schema {#device-metadata-schema}

Each metadata file conforms to the
[`DeviceMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/api/metadata/v1alpha1#DeviceMetadata)
API (`metadata.resource.k8s.io/v1alpha1`).
The following example shows a metadata file for a GPU device allocated through
a ResourceClaimTemplate:

```json
{
  "kind": "DeviceMetadata",
  "apiVersion": "metadata.resource.k8s.io/v1alpha1",
  "metadata": {
    "name": "pod0-gpu-2kqrd",
    "namespace": "gpu-test1",
    "uid": "c7e7b22e-239b-4498-b27c-7f1344481e14",
    "generation": 1
  },
  "podClaimName": "gpu",
  "requests": [
    {
      "name": "gpu",
      "devices": [
        {
          "driver": "gpu.example.com",
          "pool": "worker-0",
          "name": "gpu-0",
          "attributes": {
            "driverVersion": {
              "version": "1.0.0"
            },
            "index": {
              "int": 0
            },
            "model": {
              "string": "LATEST-GPU-MODEL"
            },
            "uuid": {
              "string": "gpu-18db0e85-99e9-c746-8531-ffeb86328b39"
            }
          }
        }
      ]
    }
  ]
}
```

### Immediate and deferred metadata {#device-metadata-lifecycle}

Drivers provide metadata in one of two ways:

Immediate
: The driver populates metadata while preparing the claim on the
  node and writes the metadata file before the container starts. This is
  typical for GPU drivers where device information is known at preparation time.

Deferred
: In some cases, for example a network driver, the device information is
  not available during device allocation time but becomes available after the
  pod sandbox is created. In those cases the driver creates the CDI mount with
  an empty metadata file and writes the actual metadata later via an NRI hook
  that runs before the container starts. This ensures applications never see a
  missing or partially written file. Each update must increment
  `metadata.generation` so consumers can detect changes. The `MetadataUpdater`
  API in the DRA kubelet plugin library handles generation bookkeeping
  automatically for driver authors.

In both cases, metadata remains available to each consuming container for the
lifetime of that container. Metadata files are cleaned up after all containers
in the Pod have terminated.

To learn how to use device metadata in your workloads, see
[Access DRA device metadata](/docs/tasks/configure-pod-container/assign-resources/access-dra-device-metadata/).

### Custom drivers {#device-metadata-custom-drivers}

Custom, hand-crafted drivers that do not use the DRA kubelet plugin library
must implement the [device metadata protocol](#device-metadata-protocol)
themselves. That means writing `DeviceMetadata` JSON at the correct file paths,
incrementing `metadata.generation` on every update, and exposing the files
read-only inside the container through CDI or an equivalent mechanism.
