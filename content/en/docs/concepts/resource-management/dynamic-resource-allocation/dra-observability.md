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


