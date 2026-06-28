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
   apiVersion: resource.k8s.io/v1beta2
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

