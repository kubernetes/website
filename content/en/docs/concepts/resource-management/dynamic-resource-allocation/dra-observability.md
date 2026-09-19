---
reviewers:
- klueska
- pohly
title: Observability of Dynamic Resources
content_type: concept
weight: 30
api_metadata:
- apiVersion: "resource.k8s.io/v1alpha3"
  kind: "ResourcePoolStatusRequest"
---

<!-- overview -->

This page describes how to observe the status and health of resources that are
dynamically allocated with DRA.

<!-- body -->

## Observability of dynamic resources {#observability-dynamic-resources}

You can check the status of dynamically allocated resources by using any of the
following methods:

* [kubelet device metrics](#monitoring-resources)
* [ResourceClaim status](#resourceclaim-device-status)
* [Device health monitoring](#device-health-monitoring)

### kubelet device metrics {#monitoring-resources}

The `PodResourcesLister` kubelet gRPC service lets you monitor in-use devices.
The `DynamicResource` message provides information that's specific to dynamic
resource allocation, such as the device name and the claim name. For details,
see
[Monitoring device plugin resources](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources).

### ResourceClaim device status {#resourceclaim-device-status}

{{< feature-state feature_gate_name="DRAResourceClaimDeviceStatus" >}}

DRA drivers can report driver-specific
[device status](/docs/concepts/overview/working-with-objects/#object-spec-and-status)
data for each allocated device in the `status.devices` field of a ResourceClaim.
For example, the driver might list the IP addresses that are assigned to a
network interface device. Updating this field requires specific synthetic RBAC permissions,
see
[Hardening Guide - Dynamic Resource Allocation](/docs/concepts/security/hardening-guide/dynamic-resource-allocation/)
and
[Harden Dynamic Resource Allocation in Your Cluster](/docs/tasks/administer-cluster/hardening-dra/).

The accuracy of the information that a driver adds to a ResourceClaim
`status.devices` field depends on the driver. Evaluate drivers to decide whether
you can rely on this field as the only source of device information.

If you disable the
[`DRAResourceClaimDeviceStatus` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DRAResourceClaimDeviceStatus), the
`status.devices` field automatically gets cleared when storing the ResourceClaim.
A ResourceClaim device status is supported when it is possible, from a DRA
driver, to update an existing ResourceClaim where the `status.devices` field is
set.

In the following example, the `status.devices` field of a ResourceClaim has been
populated by the driver (`resource-driver.example.com`) responsible for managing
the allocated device:

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceClaim
metadata:
  name: macvlan-eth0
spec:
...
status:
  allocation:
    devices:
      results:
      - device: eth0
        driver: resource-driver.example.com
        pool: nic-worker-a
        request: macvlan-eth0
        shareID: 8e7acdf9-0290-4ecd-a801-a654b021d2b7
        consumedCapacity:
          resource-driver.example.com/bandwidth: 1G
  devices:
  - conditions:
    - lastTransitionTime: "2025-10-21T08:38:17Z"
      message: Device successfully allocated and assigned to the pod
      reason: NetworkReady
      status: "True"
      type: NetworkReady
    device: eth0
    driver: resource-driver.example.com
    networkData:
      hardwareAddress: 00:01:ec:84:fb:51
      interfaceName: net1
      ips:
      - 10.10.1.2/24
      - 2001:db8::1/64
    pool: nic-worker-a
    shareID: 8e7acdf9-0290-4ecd-a801-a654b021d2b7
```

If a device has not been allocated, a driver's request to update the `status.devices`
field of the ResourceClaim with that device is rejected. When a device is
deallocated (removed from `status.allocation.devices`), the corresponding entry in
`status.devices` is automatically removed.

For details about the `status.devices` field, see the
{{< api-reference page="resource/resource-claim-v1" anchor="ResourceClaimStatus" text="ResourceClaim" >}} API reference.

### Device Health Monitoring {#device-health-monitoring}

{{< feature-state feature_gate_name="ResourceHealthStatus" >}}

Kubernetes provides a mechanism for monitoring and reporting the health of dynamically allocated infrastructure resources.
For stateful applications running on specialized hardware, it is critical to know when a device has failed or become unhealthy. It is also helpful to find out if the device recovers.

To use this functionality, the `ResourceHealthStatus` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/resource-health-status/) must be enabled (beta and enabled by default since v1.36), and the DRA driver must implement the `DRAResourceHealth` gRPC service.

When a DRA driver detects that an allocated device has become unhealthy, it reports this status back to the kubelet. This health information is then exposed directly in the Pod's status. The kubelet populates the `allocatedResourcesStatus` field in the status of each container, detailing the health of each device assigned to that container. Each resource health entry can include an optional `message` field with additional human-readable context about the health status, such as error details or failure reasons.

If the kubelet does not receive a health update from a DRA driver within a timeout period, the device's health status is marked as "Unknown". DRA drivers can configure this timeout on a per-device basis by setting the `health_check_timeout_seconds` field in the `DeviceHealth` gRPC message. If not specified, the kubelet uses a default timeout of 30 seconds. This allows different hardware types (for example, GPUs, FPGAs, or storage devices) to use appropriate timeout values based on their health-reporting characteristics.

This provides crucial visibility for users and controllers to react to hardware failures.
For a Pod that is failing, you can inspect this status to determine if the failure was related to an unhealthy device.

{{< note >}}
Device health status is not updated in the Pod status after a Pod has terminated (for example, in Failed state).
{{< /note >}}

## Resource pool status {#resource-pool-status}

{{< feature-state feature_gate_name="DRAResourcePoolStatus" >}}

You can query the availability of devices in resource pools using the
ResourcePoolStatusRequest API. This provides visibility into how many devices
are available, allocated, or unavailable across your cluster's DRA resource pools.

To check resource pool status:

1. Create a ResourcePoolStatusRequest specifying the driver name (required) and
   optionally a limit on the number of pools returned. You can also limit it to a single pool by specifying a pool name:

   ```yaml
   apiVersion: resource.k8s.io/v1alpha3
   kind: ResourcePoolStatusRequest
   metadata:
     name: check-gpus
   spec:
     driver: example.com/gpu
     # Optional: filter to a specific pool
     # poolName: my-pool
     # Optional: limit number of pools returned (default: 100, max: 1000)
     # limit: 10
   ```

1. Wait for the controller to process the request:

   ```shell
   kubectl wait --for=condition=Complete resourcepoolstatusrequest/check-gpus --timeout=30s
   ```

1. Read the status to see pool availability:

   ```shell
   kubectl get resourcepoolstatusrequest/check-gpus -o yaml
   ```

   The status includes:
   - `poolCount`: total number of pools matching the filter (may exceed the number
     of pools listed if truncated by the limit).
   - `pools`: a list of pool details, each containing:
     - `driver` and `poolName`: identify the pool.
     - `generation`: the latest pool generation observed across ResourceSlices.
     - `resourceSliceCount`: the number of ResourceSlices making up the pool.
     - `totalDevices`: total devices in the pool.
     - `allocatedDevices`: devices currently allocated to claims.
     - `availableDevices`: devices available for allocation
       (totalDevices - allocatedDevices - unavailableDevices).
     - `unavailableDevices`: devices not available due to taints or other conditions.
     - `nodeName`: the node associated with the pool, if any.
     - `validationError`: set when the pool's data could not be fully validated
       (for example, during a generation rollout). When set, device count fields
       may be unset.
     - `partitionSummary`: for [partitionable](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#partitionable-devices)
       pools, per-partition-type allocatability (see
       [Partition summary](#resource-pool-partition-summary)).
     - `shareableSummary`: for pools with [shareable devices](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#consumable-capacity),
       aggregate capacity usage (see
       [Shareable summary](#resource-pool-shareable-summary)).
   - `conditions`: includes `Complete` (success) or `Failed` (error) condition types.

1. Delete the request when done:

   ```shell
   kubectl delete resourcepoolstatusrequest/check-gpus
   ```

ResourcePoolStatusRequest objects are processed once by a controller in
kube-controller-manager. The spec is immutable once created, and the entire
object becomes immutable once the status is populated. To get updated
availability data, delete and recreate the request. Completed requests are
automatically cleaned up after 1 hour.

This feature requires explicit RBAC permissions on the ResourcePoolStatusRequest
resource. No default ClusterRoles include this permission.

Resource pool status is controlled by the
[`DRAResourcePoolStatus` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DRAResourcePoolStatus)
in the `kube-apiserver` and `kube-controller-manager`.

### Partition summary {#resource-pool-partition-summary}

{{< feature-state feature_gate_name="DRAPartitionableDevicesType" >}}

A single physical device such as a GPU may be advertised as several partition
types (for example, a full GPU versus a half-sized MIG slice) that draw from the
same shared counters. Because these partitions compete for the same underlying
capacity, a plain device count does not tell you how many of each type can still
be allocated. For [partitionable](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#partitionable-devices)
pools, the `partitionSummary` view answers that question. For each partition type
it reports:

- `attribute`: the fully qualified name of the device attribute whose value
  groups this entry. It is the ResourceSlice's `spec.partitionTypeAttribute`, or
  the request's `spec.defaultPartitionTypeAttribute` when the slice declares none.
- `type`: the value of that attribute on the device (for example, `Full` or
  `Half`).
- `total`: the number of devices of this partition type in the pool.
- `allocatable`: how many *additional* devices of this partition type could still
  be allocated given current shared-counter consumption.

The named attribute must be a string attribute. If a partitionable device's
partition-type attribute is missing or is not a string (for example, an integer,
boolean, or version value), the pool reports a validation error instead of a
partition summary. There is no special handling for
[list-type attributes](/docs/reference/command-line-tools-reference/feature-gates/#DRAListTypeAttributes);
a non-string attribute is simply not a valid partition-type attribute.

To produce this view, the driver labels each partitionable device with a string
attribute whose value names the partition type, and names that attribute in the
ResourceSlice's `partitionTypeAttribute` field:

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
# ...
spec:
  # Every partitionable device in this slice carries this attribute; devices
  # that share a value share the same shared-counter cost.
  partitionTypeAttribute: gpu.example.com/profile
```

If a driver has not yet been updated to declare `partitionTypeAttribute`, a
request can still obtain a partition summary by naming a fallback attribute in
its spec. A slice's own `partitionTypeAttribute` always takes precedence; the
request-level default applies only to devices whose slice does not declare one:

```yaml
apiVersion: resource.k8s.io/v1alpha3
kind: ResourcePoolStatusRequest
metadata:
  name: check-gpu-partitions
spec:
  driver: gpu.example.com
  # Fallback grouping attribute for slices that don't declare one themselves.
  defaultPartitionTypeAttribute: gpu.example.com/profile
```

When neither the slice nor the request names an attribute, a partitionable pool
reports no `partitionSummary`.

The `partitionSummary` view is controlled by the
[`DRAPartitionableDevicesType` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DRAPartitionableDevicesType)
in the `kube-apiserver` and `kube-controller-manager`, which in turn requires the
[`DRAResourcePoolStatus`](/docs/reference/command-line-tools-reference/feature-gates/#DRAResourcePoolStatus)
and
[`DRAPartitionableDevices`](/docs/reference/command-line-tools-reference/feature-gates/#DRAPartitionableDevices)
feature gates to be enabled.

### Shareable summary {#resource-pool-shareable-summary}

For pools that contain [shareable devices](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#consumable-capacity)
(devices that set `allowMultipleAllocations` and can be consumed by multiple
claims), `shareableSummary` reports aggregate capacity usage across the pool:

- `fullyAvailableDevices`: shareable devices with no capacity consumed.
- `partiallyAvailableDevices`: shareable devices with some, but not all, capacity
  consumed.
- `capacity`: per capacity name, the aggregate `total`, `consumed`, and
  `available` (`total` minus `consumed`, never negative) amounts across the pool.

The `shareableSummary` is populated only when at least one device in the pool is
shareable. It is part of the [resource pool status](#resource-pool-status)
feature (the
[`DRAResourcePoolStatus`](/docs/reference/command-line-tools-reference/feature-gates/#DRAResourcePoolStatus)
feature gate) and does not require `DRAPartitionableDevicesType`; the shareable
devices it summarizes come from the
[consumable capacity](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#consumable-capacity)
feature.


## DRA device metadata in containers {#device-metadata}

{{< feature-state state="beta" for_k8s_version="v1.37" >}}

DRA drivers can expose device metadata such as device attributes (PCI bus
addresses or mediated device UUIDs) and network configuration directly to
containers as JSON files.
This lets applications discover information about allocated devices without
querying the Kubernetes API or using custom controllers.

KEP-5304 defines a
[device metadata protocol](#device-metadata-protocol) that drivers must follow
so that applications see a consistent layout across drivers and clusters. The
[DRA kubelet plugin library](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin)
implements this protocol.

Device metadata follows the same rules as device access: it is available inside
a container only when that container requests the device. For details, see
[Request devices in workloads using DRA](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/#request-devices-workloads).

### Device metadata protocol {#device-metadata-protocol}

The protocol consists of four rules:

1. **File paths.** Metadata files live inside containers under
   `/var/run/kubernetes.io/dra-device-attributes`. For a directly referenced
   ResourceClaim, the path is
   `resourceclaims/<claimName>/<requestName>/<driverName>-metadata.json`. For a
   claim created from a ResourceClaimTemplate, the path is
   `resourceclaimtemplates/<podClaimName>/<requestName>/<driverName>-metadata.json`,
   where `podClaimName` is `pod.spec.resourceClaims[].name`.

   When a request uses a [prioritized list](/docs/concepts/resource-management/dynamic-resource-allocation/dra-api/#prioritized-list), only the
   top-level request name is used for the `<requestName>` path segment. The
   `requests[].name` field in the file contains the full
   `<request>/<subrequest>` reference, such as `gpu/high-memory`.

   The path constants are defined in
   [`k8s.io/dynamic-resource-allocation/api/metadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/api/metadata).

1. **JSON API.** Each file is a stream of one or more
   [`DeviceMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/api/metadata/v1beta1#DeviceMetadata)
   objects. Each object has `apiVersion` and `kind`, following Kubernetes API
   conventions. The same metadata is encoded once per configured API version
   in the order selected by the driver. Consumers use the first version that
   they can decode and skip unknown versions. A malformed object in a known
   version is an error.

1. **Generation.** The initial file has `metadata.generation` set to `1`.
   Each update increments the generation so that consumers can detect changes.

1. **Container exposure.** The DRA kubelet plugin library uses
   {{< glossary_tooltip text="CDI" term_id="cdi" >}} to bind-mount each file
   read-only. Other implementations can use a different mechanism as long as
   the file appears at the required path and is read-only.

### Enable device metadata in a driver {#device-metadata-enable}

Device metadata is a driver-side feature. It has no Kubernetes feature gate and
is disabled by default in the DRA kubelet plugin library. A driver must enable
the feature and explicitly select the versions that it writes:

```go
kubeletplugin.EnableDeviceMetadata(true, []schema.GroupVersion{
	metadatav1beta1.SchemeGroupVersion,
	metadatav1alpha1.SchemeGroupVersion,
})
```

The `v1beta1` version is required. A driver can also write `v1alpha1` for
compatibility with older consumers. The order in the slice is the order in the
metadata stream; the framework does not sort the versions. Drivers should put
the newest version first. Enabling device metadata with no versions, without
`v1beta1`, or with an unknown version causes the plugin to fail during startup.

For each prepared device, the driver can populate
[`Device.Metadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin#Device)
with
[`kubeletplugin.DeviceMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin#DeviceMetadata).
Drivers should include the attributes that they publish for that device in its
ResourceSlice, so workloads see the same information at runtime. Drivers can
also include attributes that are only relevant at runtime. For network devices,
drivers can add interface names, IP addresses, and hardware addresses after CNI
configuration by calling
[`UpdateRequestMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin#Helper.UpdateRequestMetadata).

The kubelet plugin API links above describe integration for driver authors.
The DRA framework does not define a universal command-line flag, so cluster
operators enable the feature through the deployment configuration provided by
their driver.

When enabled, the DRA kubelet plugin library writes metadata files while
preparing allocated devices. It also writes CDI specifications to `/var/run/cdi`
by default. The container runtime must be configured to discover CDI
specifications from that directory. The library determines the minimum CDI
specification version required for each generated specification.

When one request allocates devices from multiple DRA drivers, each driver writes
its own metadata file. Consumers that know the driver name should construct the
exact path from the claim, request, and driver names. Go consumers can use
[`ReadResourceClaimMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/devicemetadata#ReadResourceClaimMetadata)
or
[`ReadResourceClaimTemplateMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/devicemetadata#ReadResourceClaimTemplateMetadata)
to read and merge all per-driver files for a request.

### Metadata schema {#device-metadata-schema}

Each object in a metadata file conforms to the
[`DeviceMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/api/metadata/v1beta1#DeviceMetadata)
API (`metadata.resource.k8s.io/v1beta1`).

The schema contains:

- Standard object metadata for the ResourceClaim, including its name,
  namespace, UID, and metadata generation.
- The optional `podClaimName` for a claim generated from a
  ResourceClaimTemplate.
- A list of requests. Each request has a required name and a list of allocated
  devices.
- The driver, pool, and name for each device.
- Optional device attributes and network data.

Attribute values use the same representation as ResourceSlice device
attributes. Each attribute has exactly one scalar value (`int`, `bool`,
`string`, or `version`) or list value (`ints`, `bools`, `strings`, or
`versions`). Device capacity values are not included in device metadata.

Network data can contain `interfaceName`, `ips`, and `hardwareAddress`.
For field constraints, see the
[`DeviceMetadata` API documentation](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/api/metadata/v1beta1#DeviceMetadata).

The following example shows one object in a metadata stream for a GPU device
allocated through a ResourceClaimTemplate:

```json
{
  "kind": "DeviceMetadata",
  "apiVersion": "metadata.resource.k8s.io/v1beta1",
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

The DRA kubelet plugin does not validate metadata before writing it. Go
consumers can opt in to generated validation when decoding a stream. Decoding
and validation have separate results: a validation error does not prevent a
successfully decoded object from being returned. For usage, see
[Access DRA device metadata](/docs/tasks/configure-pod-container/assign-resources/access-dra-device-metadata/#read-metadata-application).

### Immediate and deferred metadata {#device-metadata-lifecycle}

For immediate metadata, the driver supplies attributes or network data while it
prepares the claim. The DRA kubelet plugin writes the file with generation `1`
before the consuming container starts.

For deferred metadata, the driver can prepare a device without attributes or
network data. The initial generation `1` file contains the device identity. The
driver later calls `UpdateRequestMetadata` to replace the complete stream
atomically and increment the generation. An update requires the initial file to
exist. If device preparation returns no devices for a request, the framework
creates neither a metadata file nor a metadata CDI device for that request.

Metadata remains available to each consuming container for the lifetime of that
container. The framework removes the metadata files and CDI specifications
after the claim is unprepared.

To learn how to use device metadata in your workloads, see
[Access DRA device metadata](/docs/tasks/configure-pod-container/assign-resources/access-dra-device-metadata/).

### Custom drivers {#device-metadata-custom-drivers}

Custom drivers that do not use the DRA kubelet plugin library must implement the
[device metadata protocol](#device-metadata-protocol) themselves. This includes
writing the versioned `DeviceMetadata` stream at the correct paths, incrementing
`metadata.generation` on every update, and exposing files read-only through CDI
or an equivalent mechanism.
