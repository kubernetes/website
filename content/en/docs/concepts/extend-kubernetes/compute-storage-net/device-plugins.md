---
reviewers:
title: Device Plugins
description: Use the Kubernetes device plugin framework to implement plugins for GPUs, NICs, FPGAs, InfiniBand, and similar resources that require vendor-specific setup.
content_template: templates/concept
weight: 20
---

{{< feature-state state="beta" >}}

{{% capture overview %}}
Starting in version 1.8, Kubernetes provides a
[device plugin framework](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/resource-management/device-plugin.md)
for vendors to advertise their resources to the kubelet without changing Kubernetes core code.
Instead of writing custom Kubernetes code, vendors can implement a device plugin that can
be deployed manually or as a DaemonSet. The targeted devices include GPUs,
High-performance NICs, FPGAs, InfiniBand, and other similar computing resources
that may require vendor specific initialization and setup.
{{% /capture %}}

{{% capture body %}}

## Device plugin registration

The device plugins feature is gated by the `DevicePlugins` feature gate which
is disabled by default before 1.10.  When the device plugins feature is enabled,
the kubelet exports a `Registration` gRPC service:

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
    [extended resource naming scheme](/docs/concepts/configuration/manage-compute-resources-container/#extended-resources)
    as `vendor-domain/resource`.
    For example, an Nvidia GPU is advertised as `nvidia.com/gpu`.

Following a successful registration, the device plugin sends the kubelet the
list of devices it manages, and the kubelet is then in charge of advertising those
resources to the API server as part of the kubelet node status update.
For example, after a device plugin registers `vendor-domain/foo` with the kubelet
and reports two healthy devices on a node, the node status is updated
to advertise 2 `vendor-domain/foo`.

Then, users can request devices in a
[Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
specification as they request other types of resources, with the following limitations:

* Extended resources are only supported as integer resources and cannot be overcommitted.
* Devices cannot be shared among Containers.

Suppose a Kubernetes cluster is running a device plugin that advertises resource `vendor-domain/resource`
on certain nodes, here is an example user pod requesting this resource:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: demo-pod
spec:
  containers:
    - name: demo-container-1
      image: k8s.gcr.io/pause:2.0
      resources:
        limits:
          vendor-domain/resource: 2 # requesting 2 vendor-domain/resource
```

## Device plugin implementation

The general workflow of a device plugin includes the following steps:

* Initialization. During this phase, the device plugin performs vendor specific
  initialization and setup to make sure the devices are in a ready state.

* The plugin starts a gRPC service, with a Unix socket under host path
  `/var/lib/kubelet/device-plugins/`, that implements the following interfaces:

  ```gRPC
  service DevicePlugin {
        // ListAndWatch returns a stream of List of Devices
        // Whenever a Device state change or a Device disappears, ListAndWatch
        // returns the new list
        rpc ListAndWatch(Empty) returns (stream ListAndWatchResponse) {}

        // Allocate is called during container creation so that the Device
        // Plugin can run device specific operations and instruct Kubelet
        // of the steps to make the Device available in the container
        rpc Allocate(AllocateRequest) returns (AllocateResponse) {}
  }
  ```

* The plugin registers itself with the kubelet through the Unix socket at host
  path `/var/lib/kubelet/device-plugins/kubelet.sock`.

* After successfully registering itself, the device plugin runs in serving mode, during which it keeps
monitoring device health and reports back to the kubelet upon any device state changes.
It is also responsible for serving `Allocate` gRPC requests. During `Allocate`, the device plugin may
do device-specific preparation; for example, GPU cleanup or QRNG initialization.
If the operations succeed, the device plugin returns an `AllocateResponse` that contains container
runtime configurations for accessing the allocated devices. The kubelet passes this information
to the container runtime.

A device plugin is expected to detect kubelet restarts and re-register itself with the new
kubelet instance. In the current implementation, a new kubelet instance deletes all the existing Unix sockets
under `/var/lib/kubelet/device-plugins` when it starts. A device plugin can monitor the deletion
of its Unix socket and re-register itself upon such an event.

## Device plugin deployment

A device plugin can be deployed manually or as a DaemonSet. Being deployed as a DaemonSet has
the benefit that Kubernetes can restart the device plugin if it fails.
Otherwise, an extra mechanism is needed to recover from device plugin failures.
The canonical directory `/var/lib/kubelet/device-plugins` requires privileged access,
so a device plugin must run in a privileged security context.
If a device plugin is running as a DaemonSet, `/var/lib/kubelet/device-plugins`
must be mounted as a
[Volume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core)
in the plugin's
[PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core).

Kubernetes device plugin support is in beta. As development continues, its API version can
change. We recommend that device plugin developers do the following:

* Watch for changes in future releases.
* Support multiple versions of the device plugin API for backward/forward compatibility.

If you enable the DevicePlugins feature and run device plugins on nodes that need to be upgraded to
a Kubernetes release with a newer device plugin API version, upgrade your device plugins
to support both versions before upgrading these nodes to
ensure the continuous functioning of the device allocations during the upgrade.

## Monitoring Device Plugin Resources

In order to monitor resources provided by device plugins, monitoring agents need to be able to 
discover the set of devices that are in-use on the node and obtain metadata to describe which 
container the metric should be associated with.  Prometheus metrics exposed by device monitoring 
agents should follow the 
[Kubernetes Instrumentation Guidelines](https://github.com/kubernetes/community/blob/master/contributors/devel/instrumentation.md), 
which requires identifying containers using `pod`, `namespace`, and `container` prometheus labels.  
The kubelet provides a gRPC service to enable discovery of in-use devices, and to provide metadata 
for these devices:

```gRPC
// PodResourcesLister is a service provided by the kubelet that provides information about the
// node resources consumed by pods and containers on the node
service PodResourcesLister {
    rpc List(ListPodResourcesRequest) returns (ListPodResourcesResponse) {}
}
```

The gRPC service is served over a unix socket at `/var/lib/kubelet/pod-resources/kubelet.sock`. 
Monitoring agents for device plugin resources can be deployed as a daemon, or as a DaemonSet. 
The canonical directory `/var/lib/kubelet/pod-resources` requires privileged access, so monitoring 
agents must run in a privileged security context.  If a device monitoring agent is running as a 
DaemonSet, `/var/lib/kubelet/pod-resources` must be mounted as a 
[Volume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core)
in the plugin's
[PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core).

Support for the "PodResources service" is in beta, and is enabled by default.

## Examples

For examples of device plugin implementations, see:

* The official [NVIDIA GPU device plugin](https://github.com/NVIDIA/k8s-device-plugin)
    * Requires [nvidia-docker 2.0](https://github.com/NVIDIA/nvidia-docker) which allows you to run GPU enabled docker containers.
    * A detailed guide on how to [schedule NVIDIA GPUs](/docs/tasks/manage-gpus/scheduling-gpus) on k8s.
* The [NVIDIA GPU device plugin for COS base OS](https://github.com/GoogleCloudPlatform/container-engine-accelerators/tree/master/cmd/nvidia_gpu)
* The [RDMA device plugin](https://github.com/hustcat/k8s-rdma-device-plugin)
* The [Solarflare device plugin](https://github.com/vikaschoudhary16/sfc-device-plugin)
* The [AMD GPU device plugin](https://github.com/RadeonOpenCompute/k8s-device-plugin)
* The [SRIOV Network device plugin](https://github.com/intel/sriov-network-device-plugin)
* The [Intel device plugins](https://github.com/intel/intel-device-plugins-for-kubernetes) for GPU, FPGA and QuickAssist devices
* The [Xilinx FPGA device plugins](https://github.com/Xilinx/FPGA_as_a_Service/tree/master/k8s-fpga-device-plugin/trunk) for Xilinx FPGA devices

{{% /capture %}}

