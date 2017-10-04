---
approvers:
title: Device Plugins
description: Use the Kubernetes device plugin framework to implement plugins for GPUs, NICs, FPGAs, InfiniBand, and similar resources that require vendor-specific setup.
---

{% include feature-state-alpha.md %}

{% capture overview %}
Starting in version 1.8, Kubernetes provides a
[device plugin framework](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/resource-management/device-plugin.md)
for vendors to advertise their resources to the kubelet without changing Kubernetes core code.
Instead of writing custom Kubernetes code, vendors can implement a device plugin that can
be deployed manually or as a DaemonSet. The targeted devices include GPUs,
High-performance NICs, FPGAs, InfiniBand, and other similar computing resources
that may require vendor specific initialization and setup.
{% endcapture %}

{% capture body %}

## Device plugin registration

The device plugins feature is gated by the `DevicePlugins` feature gate and is disabled by default.
When the device plugins feature is enabled, the kubelet exports a `Registration` gRPC service:

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
    [extended resource naming scheme](https://github.com/kubernetes/kubernetes/pull/48922)
    as `vendor-domain/resource`.
    For example, an Nvidia GPU is advertised as `nvidia.com/gpu`.

Following a successful registration, the device plugin sends the kubelet the
list of devices it manages, and the kubelet is then in charge of advertising those
resources to the API server as part of the kubelet node status update.
For example, after a device plugin registers `vendor-domain/foo` with the kubelet
and reports two healthy devices on a node, the node status is updated
to advertise 2 `vendor-domain/foo`.

Then, developers can request devices in a
[Container](/docs/api-reference/{{page.version}}/#container-v1-core)
specification by using the same process that is used for
[opaque integer resources](/docs/tasks/configure-pod-container/opaque-integer-resource/).
In version 1.8, extended resources are spported only as integer resources and must have
`limit` equal to `request` in the Container specification.

## Device plugin implementation

The general workflow of a device plugin includes the following steps:

* Initialization. During this phase, the device plugin performs vendor specific
  initialization and setup to make sure the devices are in a ready state.

* The plugin starts a gRPC service, with a Unix socket under host path
  `/var/lib/kubelet/device-plugins/`, that implements the following interfaces:

  ```gRPC
  service DevicePlugin {
        // ListAndWatch returns a stream of List of Devices
        // Whenever a Device state change or a Device disapears, ListAndWatch
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
kubelet instance. In version 1.8, a new kubelet instance cleans up all the existing Unix sockets
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
[Volume](/docs/api-reference/{{page.version}}/#volume-v1-core)
in the plugin's
[PodSpec](/docs/api-reference/{{page.version}}/#podspec-v1-core).

## Examples

For an example device plugin implementation, see
[nvidia GPU device plugin for COS base OS](https://github.com/GoogleCloudPlatform/container-engine-accelerators/tree/master/cmd/nvidia_gpu).

{% endcapture %}

{% include templates/concept.md %}
