---
approvers:
title: Device Plugins
---

* TOC
{:toc}

__Disclaimer__: Device plugins are in alpha. Its contents may change rapidly.

Starting from 1.8 release, Kubernetes provides a [device plugin framework](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/device-plugin.md)
for vendors to advertise their resources to Kubelet without changing Kubernetes core code.
Instead of writing custom Kubernetes code, vendors can implement a device plugin that can
be deployed as a DaemonSet or in bare metal mode. The targeted devices include GPUs,
High-performance NICs, FPGAs, InfiniBand, and other similar computing resources
that may require vendor specific initialization and setup.

## Overview
The 1.8 Kubernetes release supports device plugin as an alpha feature that
is gated by DevicePlugins feature gate and is disabled by default.
When the DevicePlugins feature is enabled, Kubelet will export a `Registration` gRPC service:
```gRPC
service Registration {
	rpc Register(RegisterRequest) returns (Empty) {}
}
```
A device plugin can register itself to Kubelet through this gRPC service
During the registration, the device plugin needs to send
  * The name of their unix socket
  * The API version against which they were built
  * The `ResourceName` they want to advertise. Here `ResourceName` needs to follow
    the [extended resource naming scheme](https://github.com/kubernetes/kubernetes/pull/48922) as `vendor-domain/resource`.
    E.g., Nvidia GPUs are advertised as `nvidia.com/gpu`

Following a successful registration, the device plugin will send Kubelet the
list of devices it manages, and Kubelet will be in charge of advertising those
resources to the API server as part of the Kubelet node status update.
E.g., after a device plugin registers `vendor-domain/foo` with Kubelet
and reports two healthy devices on a node, the node status will be updated
to advertise 2 `vendor-domain/foo`.
Devices can then be selected using the same process as for OIRs in the pod spec.
Currently, extended resources are only uspported as integer resources and expect
to always have limits == requests in container resource Spec.

## Device Plugin Implementation

The general workflow of a device plugin includes the following parts:
* Initialization. During this phase, a device plugin performs vendor specific initialization and setup to make sure their devices are in ready state.
* Starts a gRPC service with a unix socket under host path: `/var/lib/kubelet/device-plugins/` that implements the following interfaces:
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
* Register itself with Kubelet through unix socket at host path `/var/lib/kubelet/device-plugins/kubelet.sock`.
* After successfully registering itself, the device plugin runs in serving mode during which it keeps
monitoring device health and reports back to Kubelet upon any device state changes.
It is also responsible for serving Allocate gRPC request. During Allocate, the device plugin may
perform device specific preparing operations (e.g., gpu cleanup, QRNG initialization, and etc.).
If the operations succeed, the device plugin will return AllocateResponse that contains container
runtime configurations for accessing the allocated devices that Kubelet will pass to container runtime.

A device plugin is expected to detect Kubelet restarts and re-register itself with the new
Kubelet instance. Currently, a new Kubelet instance will clean up all the existing unix sockets
under `/var/lib/kubelet/device-plugins` when it starts. A device plugin can monitor the deletion
of its unix socket and re-register itself upon such event.

## Device Plugin Deployment

A device plugin can be deployed as a DaemonSet or in bare metal mode. Being deployed as a DaemonSet has
the benefit that Kubernetes can restart the device plugins when they fail.
Otherwise, extra mechanism is needed to recover from device plugin failures.
The canonical directory `/var/lib/kubelet/device-plugins` requires priveledge access
so device plugin needs to run in privileged security context. It also needs to be mounted
as a volume in device plugin pod spec when running as a DaemonSet.

## Examples

For an example device plugin implementation, please check
[nvidia GPU device plugin for COS base OS](https://github.com/GoogleCloudPlatform/container-engine-accelerators/tree/master/nvidia_gpu).
