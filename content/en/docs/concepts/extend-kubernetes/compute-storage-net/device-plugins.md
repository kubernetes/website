---
title: Device Plugins
description: >
  Device plugins let you configure your cluster with support for devices or resources that require
  vendor-specific setup, such as GPUs, NICs, FPGAs, or non-volatile main memory.
content_type: concept
weight: 20
---

<!-- overview -->
{{< feature-state for_k8s_version="v1.26" state="stable" >}}

Kubernetes provides a device plugin framework that you can use to advertise system hardware
resources to the {{< glossary_tooltip term_id="kubelet" >}}.

Instead of customizing the code for Kubernetes itself, vendors can implement a
device plugin that you deploy either manually or as a {{< glossary_tooltip term_id="daemonset" >}}.
The targeted devices include GPUs, high-performance NICs, FPGAs, InfiniBand adapters,
and other similar computing resources that may require vendor specific initialization
and setup.

<!-- body -->

## Device plugin registration

The kubelet exports a `Registration` gRPC service:

```gRPC
service Registration {
	rpc Register(RegisterRequest) returns (Empty) {}
}
```

A device plugin can register itself with the kubelet through this gRPC service.
During the registration, the device plugin needs to send:

* The name of its Unix socket.
* The Device Plugin API version against which it was built.
* The `ResourceName` it wants to advertise. Here `ResourceName` needs to follow the
  [extended resource naming scheme](/docs/concepts/configuration/manage-resources-containers/#extended-resources)
  as `vendor-domain/resourcetype`.
  (For example, an NVIDIA GPU is advertised as `nvidia.com/gpu`.)

Following a successful registration, the device plugin sends the kubelet the
list of devices it manages, and the kubelet is then in charge of advertising those
resources to the API server as part of the kubelet node status update.
For example, after a device plugin registers `hardware-vendor.example/foo` with the kubelet
and reports two healthy devices on a node, the node status is updated
to advertise that the node has 2 "Foo" devices installed and available.

Then, users can request devices as part of a Pod specification
(see [`container`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)).
Requesting extended resources is similar to how you manage requests and limits for
other resources, with the following differences:
* Extended resources are only supported as integer resources and cannot be overcommitted.
* Devices cannot be shared between containers.

### Example {#example-pod}

Suppose a Kubernetes cluster is running a device plugin that advertises resource `hardware-vendor.example/foo`
on certain nodes. Here is an example of a pod requesting this resource to run a demo workload:

```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: demo-pod
spec:
  containers:
    - name: demo-container-1
      image: registry.k8s.io/pause:2.0
      resources:
        limits:
          hardware-vendor.example/foo: 2
#
# This Pod needs 2 of the hardware-vendor.example/foo devices
# and can only schedule onto a Node that's able to satisfy
# that need.
#
# If the Node has more than 2 of those devices available, the
# remainder would be available for other Pods to use.
```

## Device plugin implementation

The general workflow of a device plugin includes the following steps:

1. Initialization. During this phase, the device plugin performs vendor-specific
   initialization and setup to make sure the devices are in a ready state.

1. The plugin starts a gRPC service, with a Unix socket under the host path
   `/var/lib/kubelet/device-plugins/`, that implements the following interfaces:

   ```gRPC
   service DevicePlugin {
         // GetDevicePluginOptions returns options to be communicated with Device Manager.
         rpc GetDevicePluginOptions(Empty) returns (DevicePluginOptions) {}

         // ListAndWatch returns a stream of List of Devices
         // Whenever a Device state change or a Device disappears, ListAndWatch
         // returns the new list
         rpc ListAndWatch(Empty) returns (stream ListAndWatchResponse) {}

         // Allocate is called during container creation so that the Device
         // Plugin can run device specific operations and instruct Kubelet
         // of the steps to make the Device available in the container
         rpc Allocate(AllocateRequest) returns (AllocateResponse) {}

         // GetPreferredAllocation returns a preferred set of devices to allocate
         // from a list of available ones. The resulting preferred allocation is not
         // guaranteed to be the allocation ultimately performed by the
         // devicemanager. It is only designed to help the devicemanager make a more
         // informed allocation decision when possible.
         rpc GetPreferredAllocation(PreferredAllocationRequest) returns (PreferredAllocationResponse) {}

         // PreStartContainer is called, if indicated by Device Plugin during registration phase,
         // before each container start. Device plugin can run device specific operations
         // such as resetting the device before making devices available to the container.
         rpc PreStartContainer(PreStartContainerRequest) returns (PreStartContainerResponse) {}
   }
   ```

   {{< note >}}
   Plugins are not required to provide useful implementations for
   `GetPreferredAllocation()` or `PreStartContainer()`. Flags indicating
   the availability of these calls, if any, should be set in the `DevicePluginOptions`
   message sent back by a call to `GetDevicePluginOptions()`. The `kubelet` will
   always call `GetDevicePluginOptions()` to see which optional functions are
   available, before calling any of them directly.
   {{< /note >}}

1. The plugin registers itself with the kubelet through the Unix socket at host
   path `/var/lib/kubelet/device-plugins/kubelet.sock`.

   {{< note >}}
   The ordering of the workflow is important. A plugin MUST start serving gRPC
   service before registering itself with kubelet for successful registration.
   {{< /note >}}

1. After successfully registering itself, the device plugin runs in serving mode, during which it keeps
   monitoring device health and reports back to the kubelet upon any device state changes.
   It is also responsible for serving `Allocate` gRPC requests. During `Allocate`, the device plugin may
   do device-specific preparation; for example, GPU cleanup or QRNG initialization.
   If the operations succeed, the device plugin returns an `AllocateResponse` that contains container
   runtime configurations for accessing the allocated devices. The kubelet passes this information
   to the container runtime.

   An `AllocateResponse` contains zero or more `ContainerAllocateResponse` objects. In these, the
   device plugin defines modifications that must be made to a container's definition to provide
   access to the device. These modifications include:

   * [Annotations](/docs/concepts/overview/working-with-objects/annotations/)
   * device nodes
   * environment variables
   * mounts
   * fully-qualified CDI device names

   {{< note >}}
   The processing of the fully-qualified CDI device names by the Device Manager requires
   that the `DevicePluginCDIDevices` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
   is enabled for both the kubelet and the kube-apiserver. This was added as an alpha feature in Kubernetes
   v1.28, graduated to beta in v1.29 and to GA in v1.31.
   {{< /note >}}

### Handling kubelet restarts

A device plugin is expected to detect kubelet restarts and re-register itself with the new
kubelet instance. A new kubelet instance deletes all the existing Unix sockets under
`/var/lib/kubelet/device-plugins` when it starts. A device plugin can monitor the deletion
of its Unix socket and re-register itself upon such an event.

### Device plugin and unhealthy devices

There are cases when devices fail or are shut down. The responsibility of the Device Plugin
in this case is to notify the kubelet about the situation using the `ListAndWatchResponse` API.

Once a device is marked as unhealthy, the kubelet will decrease the allocatable count
for this resource on the Node to reflect how many devices can be used for scheduling new pods.
Capacity count for the resource will not change.

Pods that were assigned to the failed devices will continue be assigned to this device.
It is typical that code relying on the device will start failing and Pod may get
into Failed phase if `restartPolicy` for the Pod was not `Always` or enter the crash loop
otherwise.

Before Kubernetes v1.31, the way to know whether or not a Pod is associated with the
failed device is to use the [PodResources API](#monitoring-device-plugin-resources).

{{< feature-state feature_gate_name="ResourceHealthStatus" >}}

By enabling the feature gate `ResourceHealthStatus`, the field `allocatedResourcesStatus`
will be added to each container status, within the `.status` for each Pod. The `allocatedResourcesStatus`
field
reports health information for each device assigned to the container.

For a failed Pod, or or where you suspect a fault, you can use this status to understand whether
the Pod behavior may be associated with device failure. For example, if an accelerator is reporting
an over-temperature event, the `allocatedResourcesStatus` field may be able to report this.


## Device plugin deployment

You can deploy a device plugin as a DaemonSet, as a package for your node's operating system,
or manually.

The canonical directory `/var/lib/kubelet/device-plugins` requires privileged access,
so a device plugin must run in a privileged security context.
If you're deploying a device plugin as a DaemonSet, `/var/lib/kubelet/device-plugins`
must be mounted as a {{< glossary_tooltip term_id="volume" >}}
in the plugin's [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core).

If you choose the DaemonSet approach you can rely on Kubernetes to: place the device plugin's
Pod onto Nodes, to restart the daemon Pod after failure, and to help automate upgrades.

## API compatibility

Previously, the versioning scheme required the Device Plugin's API version to match
exactly the Kubelet's version. Since the graduation of this feature to Beta in v1.12
this is no longer a hard requirement. The API is versioned and has been stable since
Beta graduation of this feature. Because of this, kubelet upgrades should be seamless
but there still may be changes in the API before stabilization making upgrades not
guaranteed to be non-breaking.

{{< note >}}
Although the Device Manager component of Kubernetes is a generally available feature,
the _device plugin API_ is not stable. For information on the device plugin API and
version compatibility, read [Device Plugin API versions](/docs/reference/node/device-plugin-api-versions/).
{{< /note >}}

As a project, Kubernetes recommends that device plugin developers:

* Watch for Device Plugin API changes in the future releases.
* Support multiple versions of the device plugin API for backward/forward compatibility.

To run device plugins on nodes that need to be upgraded to a Kubernetes release with
a newer device plugin API version, upgrade your device plugins to support both versions
before upgrading these nodes. Taking that approach will ensure the continuous functioning
of the device allocations during the upgrade.

## Monitoring device plugin resources

{{< feature-state for_k8s_version="v1.28" state="stable" >}}

In order to monitor resources provided by device plugins, monitoring agents need to be able to
discover the set of devices that are in-use on the node and obtain metadata to describe which
container the metric should be associated with. [Prometheus](https://prometheus.io/) metrics
exposed by device monitoring agents should follow the
[Kubernetes Instrumentation Guidelines](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/instrumentation.md),
identifying containers using `pod`, `namespace`, and `container` prometheus labels.

The kubelet provides a gRPC service to enable discovery of in-use devices, and to provide metadata
for these devices:

```gRPC
// PodResourcesLister is a service provided by the kubelet that provides information about the
// node resources consumed by pods and containers on the node
service PodResourcesLister {
    rpc List(ListPodResourcesRequest) returns (ListPodResourcesResponse) {}
    rpc GetAllocatableResources(AllocatableResourcesRequest) returns (AllocatableResourcesResponse) {}
    rpc Get(GetPodResourcesRequest) returns (GetPodResourcesResponse) {}
}
```

### `List` gRPC endpoint {#grpc-endpoint-list}

The `List` endpoint provides information on resources of running pods, with details such as the
id of exclusively allocated CPUs, device id as it was reported by device plugins and id of
the NUMA node where these devices are allocated. Also, for NUMA-based machines, it contains the
information about memory and hugepages reserved for a container.

Starting from Kubernetes v1.27, the `List` endpoint can provide information on resources
of running pods allocated in `ResourceClaims` by the `DynamicResourceAllocation` API. To enable
this feature `kubelet` must be started with the following flags:

```
--feature-gates=DynamicResourceAllocation=true,KubeletPodResourcesDynamicResources=true
```

```gRPC
// ListPodResourcesResponse is the response returned by List function
message ListPodResourcesResponse {
    repeated PodResources pod_resources = 1;
}

// PodResources contains information about the node resources assigned to a pod
message PodResources {
    string name = 1;
    string namespace = 2;
    repeated ContainerResources containers = 3;
}

// ContainerResources contains information about the resources assigned to a container
message ContainerResources {
    string name = 1;
    repeated ContainerDevices devices = 2;
    repeated int64 cpu_ids = 3;
    repeated ContainerMemory memory = 4;
    repeated DynamicResource dynamic_resources = 5;
}

// ContainerMemory contains information about memory and hugepages assigned to a container
message ContainerMemory {
    string memory_type = 1;
    uint64 size = 2;
    TopologyInfo topology = 3;
}

// Topology describes hardware topology of the resource
message TopologyInfo {
        repeated NUMANode nodes = 1;
}

// NUMA representation of NUMA node
message NUMANode {
        int64 ID = 1;
}

// ContainerDevices contains information about the devices assigned to a container
message ContainerDevices {
    string resource_name = 1;
    repeated string device_ids = 2;
    TopologyInfo topology = 3;
}

// DynamicResource contains information about the devices assigned to a container by Dynamic Resource Allocation
message DynamicResource {
    string class_name = 1;
    string claim_name = 2;
    string claim_namespace = 3;
    repeated ClaimResource claim_resources = 4;
}

// ClaimResource contains per-plugin resource information
message ClaimResource {
    repeated CDIDevice cdi_devices = 1 [(gogoproto.customname) = "CDIDevices"];
}

// CDIDevice specifies a CDI device information
message CDIDevice {
    // Fully qualified CDI device name
    // for example: vendor.com/gpu=gpudevice1
    // see more details in the CDI specification:
    // https://github.com/container-orchestrated-devices/container-device-interface/blob/main/SPEC.md
    string name = 1;
}
```
{{< note >}}
cpu_ids in the `ContainerResources` in the `List` endpoint correspond to exclusive CPUs allocated
to a particular container. If the goal is to evaluate CPUs that belong to the shared pool, the `List`
endpoint needs to be used in conjunction with the `GetAllocatableResources` endpoint as explained
below:
1. Call `GetAllocatableResources` to get a list of all the allocatable CPUs
2. Call `GetCpuIds` on all `ContainerResources` in the system
3. Subtract out all of the CPUs from the `GetCpuIds` calls from the `GetAllocatableResources` call
{{< /note >}}

### `GetAllocatableResources` gRPC endpoint {#grpc-endpoint-getallocatableresources}

{{< feature-state state="stable" for_k8s_version="v1.28" >}}

GetAllocatableResources provides information on resources initially available on the worker node.
It provides more information than kubelet exports to APIServer.

{{< note >}}
`GetAllocatableResources` should only be used to evaluate [allocatable](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)
resources on a node. If the goal is to evaluate free/unallocated resources it should be used in
conjunction with the List() endpoint. The result obtained by `GetAllocatableResources` would remain
the same unless the underlying resources exposed to kubelet change. This happens rarely but when
it does (for example: hotplug/hotunplug, device health changes), client is expected to call
`GetAlloctableResources` endpoint.

However, calling `GetAllocatableResources` endpoint is not sufficient in case of cpu and/or memory
update and Kubelet needs to be restarted to reflect the correct resource capacity and allocatable.
{{< /note >}}

```gRPC
// AllocatableResourcesResponses contains information about all the devices known by the kubelet
message AllocatableResourcesResponse {
    repeated ContainerDevices devices = 1;
    repeated int64 cpu_ids = 2;
    repeated ContainerMemory memory = 3;
}
```

`ContainerDevices` do expose the topology information declaring to which NUMA cells the device is
affine. The NUMA cells are identified using a opaque integer ID, which value is consistent to
what device plugins report
[when they register themselves to the kubelet](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-integration-with-the-topology-manager).

The gRPC service is served over a unix socket at `/var/lib/kubelet/pod-resources/kubelet.sock`.
Monitoring agents for device plugin resources can be deployed as a daemon, or as a DaemonSet.
The canonical directory `/var/lib/kubelet/pod-resources` requires privileged access, so monitoring
agents must run in a privileged security context. If a device monitoring agent is running as a
DaemonSet, `/var/lib/kubelet/pod-resources` must be mounted as a
{{< glossary_tooltip term_id="volume" >}} in the device monitoring agent's
[PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core).

{{< note >}}

When accessing the `/var/lib/kubelet/pod-resources/kubelet.sock` from DaemonSet
or any other app deployed as a container on the host, which is mounting socket as
a volume, it is a good practice to mount directory `/var/lib/kubelet/pod-resources/`
instead of the `/var/lib/kubelet/pod-resources/kubelet.sock`. This will ensure
that after kubelet restart, container will be able to re-connect to this socket.

Container mounts are managed by inode referencing the socket or directory,
depending on what was mounted. When kubelet restarts, socket is deleted
and a new socket is created, while directory stays untouched.
So the original inode for the socket become unusable. Inode to directory
will continue working.

{{< /note >}}

### `Get` gRPC endpoint {#grpc-endpoint-get}

{{< feature-state state="alpha" for_k8s_version="v1.27" >}}

The `Get` endpoint provides information on resources of a running Pod. It exposes information
similar to those described in the `List` endpoint. The `Get` endpoint requires `PodName`
and `PodNamespace` of the running Pod.

```gRPC
// GetPodResourcesRequest contains information about the pod
message GetPodResourcesRequest {
    string pod_name = 1;
    string pod_namespace = 2;
}
```

To enable this feature, you must start your kubelet services with the following flag:

```
--feature-gates=KubeletPodResourcesGet=true
```

The `Get` endpoint can provide Pod information related to dynamic resources
allocated by the dynamic resource allocation API. To enable this feature, you must
ensure your kubelet services are started with the following flags:

```
--feature-gates=KubeletPodResourcesGet=true,DynamicResourceAllocation=true,KubeletPodResourcesDynamicResources=true
```

## Device plugin integration with the Topology Manager

{{< feature-state for_k8s_version="v1.27" state="stable" >}}

The Topology Manager is a Kubelet component that allows resources to be co-ordinated in a Topology
aligned manner. In order to do this, the Device Plugin API was extended to include a
`TopologyInfo` struct.

```gRPC
message TopologyInfo {
    repeated NUMANode nodes = 1;
}

message NUMANode {
    int64 ID = 1;
}
```

Device Plugins that wish to leverage the Topology Manager can send back a populated TopologyInfo
struct as part of the device registration, along with the device IDs and the health of the device.
The device manager will then use this information to consult with the Topology Manager and make
resource assignment decisions.

`TopologyInfo` supports setting a `nodes` field to either `nil` or a list of NUMA nodes. This
allows the Device Plugin to advertise a device that spans multiple NUMA nodes.

Setting `TopologyInfo` to `nil` or providing an empty list of NUMA nodes for a given device
indicates that the Device Plugin does not have a NUMA affinity preference for that device.

An example `TopologyInfo` struct populated for a device by a Device Plugin:

```
pluginapi.Device{ID: "25102017", Health: pluginapi.Healthy, Topology:&pluginapi.TopologyInfo{Nodes: []*pluginapi.NUMANode{&pluginapi.NUMANode{ID: 0,},}}}
```

## Device plugin examples {#examples}

{{% thirdparty-content %}}

Here are some examples of device plugin implementations:

* [Akri](https://github.com/project-akri/akri), which lets you easily expose heterogeneous leaf devices (such as IP cameras and USB devices).
* The [AMD GPU device plugin](https://github.com/ROCm/k8s-device-plugin)
* The [generic device plugin](https://github.com/squat/generic-device-plugin) for generic Linux devices and USB devices
* The [Intel device plugins](https://github.com/intel/intel-device-plugins-for-kubernetes) for
  Intel GPU, FPGA, QAT, VPU, SGX, DSA, DLB and IAA devices
* The [KubeVirt device plugins](https://github.com/kubevirt/kubernetes-device-plugins) for
  hardware-assisted virtualization
* The [NVIDIA GPU device plugin for Container-Optimized OS](https://github.com/GoogleCloudPlatform/container-engine-accelerators/tree/master/cmd/nvidia_gpu)
* The [RDMA device plugin](https://github.com/hustcat/k8s-rdma-device-plugin)
* The [SocketCAN device plugin](https://github.com/collabora/k8s-socketcan)
* The [Solarflare device plugin](https://github.com/vikaschoudhary16/sfc-device-plugin)
* The [SR-IOV Network device plugin](https://github.com/intel/sriov-network-device-plugin)
* The [Xilinx FPGA device plugins](https://github.com/Xilinx/FPGA_as_a_Service/tree/master/k8s-device-plugin) for Xilinx FPGA devices

## {{% heading "whatsnext" %}}

* Learn about [scheduling GPU resources](/docs/tasks/manage-gpus/scheduling-gpus/) using device
  plugins
* Learn about [advertising extended resources](/docs/tasks/administer-cluster/extended-resource-node/)
  on a node
* Learn about the [Topology Manager](/docs/tasks/administer-cluster/topology-manager/)
* Read about using [hardware acceleration for TLS ingress](/blog/2019/04/24/hardware-accelerated-ssl/tls-termination-in-ingress-controllers-using-kubernetes-device-plugins-and-runtimeclass/)
  with Kubernetes
