---
layout: blog
title: 'Kubernetes 1.26: Device Manager graduates to GA'
date: 2022-12-19
slug: devicemanager-ga
author: >
  Swati Sehgal (Red Hat)
---

The Device Plugin framework was introduced in the Kubernetes v1.8 release as a vendor
independent framework to enable discovery, advertisement and allocation of external
devices without modifying core Kubernetes. The feature graduated to Beta in v1.10.
With the recent release of Kubernetes v1.26, Device Manager is now generally
available (GA).

Within the kubelet, the Device Manager facilitates communication with device plugins
using gRPC through Unix sockets. Device Manager and Device plugins both act as gRPC
servers and clients by serving and connecting to the exposed gRPC services respectively.
Device plugins serve a gRPC service that kubelet connects to for device discovery,
advertisement (as extended resources) and allocation. Device Manager connects to
the `Registration` gRPC service served by kubelet to register itself with kubelet.

Please refer to the documentation for an [example](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#example-pod) on how a pod can request a device exposed to the cluster by a device plugin.

Here are some example implementations of device plugins:
- [AMD GPU device plugin](https://github.com/RadeonOpenCompute/k8s-device-plugin)
- [Collection of Intel device plugins for Kubernetes](https://github.com/intel/intel-device-plugins-for-kubernetes)
- [NVIDIA device plugin for Kubernetes](https://github.com/NVIDIA/k8s-device-plugin)
- [SRIOV network device plugin for Kubernetes](https://github.com/k8snetworkplumbingwg/sriov-network-device-plugin)

## Noteworthy developments since Device Plugin framework introduction

### Kubelet APIs moved to kubelet staging repo
External facing `deviceplugin` API packages moved from `k8s.io/kubernetes/pkg/kubelet/apis/`
to `k8s.io/kubelet/pkg/apis/` in v1.17. Refer to [Move external facing kubelet apis to staging](https://github.com/kubernetes/kubernetes/pull/83551) for more details on the rationale behind this change.

### Device Plugin API updates
Additional gRPC endpoints introduced:
  1. `GetDevicePluginOptions` is used by device plugins to communicate
     options to the `DeviceManager` in order to indicate if `PreStartContainer`,
     `GetPreferredAllocation` or other future optional calls are supported and
     can be called before making devices available to the container.
  1. `GetPreferredAllocation` allows a device plugin to forward allocation
     preferrence to the `DeviceManager` so it can incorporate this information
     into its allocation decisions. The `DeviceManager` will call out to a
     plugin at pod admission time asking for a preferred device allocation
     of a given size from a list of available devices to make a more informed
     decision. E.g. Specifying inter-device constraints to indicate preferrence
     on best-connected set of devices when allocating devices to a container.
  1. `PreStartContainer` is called before each container start if indicated by
     device plugins during registration phase. It allows Device Plugins to run device
     specific operations on the Devices requested. E.g. reconfiguring or
     reprogramming FPGAs before the container starts running. 

Pull Requests that introduced these changes are here:
1. [Invoke preStart RPC call before container start, if desired by plugin](https://github.com/kubernetes/kubernetes/pull/58282)
1. [Add GetPreferredAllocation() call to the v1beta1 device plugin API](https://github.com/kubernetes/kubernetes/pull/92665)

With introduction of the above endpoints the interaction between Device Manager in
kubelet and Device Manager can be shown as below:

{{< figure src="deviceplugin-framework-overview.svg" alt="Representation of the Device Plugin framework showing the relationship between the kubelet and a device plugin" class="diagram-large" caption="Device Plugin framework Overview" >}}

### Change in semantics of device plugin registration process 
Device plugin code was refactored to separate 'plugin' package under the `devicemanager`
package to lay the groundwork for introducing a `v1beta2` device plugin API. This would
allow adding support in `devicemanager` to service multiple device plugin APIs at the
same time.

With this refactoring work, it is now mandatory for a device plugin to start serving its gRPC
service before registering itself with kubelet. Previously, these two operations were asynchronous
and device plugin could register itself before starting its gRPC server which is no longer the
case. For more details, refer to [PR #109016](https://github.com/kubernetes/kubernetes/pull/109016) and [Issue #112395](https://github.com/kubernetes/kubernetes/issues/112395).

### Dynamic resource allocation
In Kubernetes 1.26, inspired by how [Persistent Volumes](/docs/concepts/storage/persistent-volumes)
are handled in Kubernetes, [Dynamic Resource Allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
has been introduced to cater to devices that have more sophisticated resource requirements like:

1. Decouple device initialization and allocation from the pod lifecycle.
1. Facilitate dynamic sharing of devices between containers and pods.
1. Support custom resource-specific parameters
1. Enable resource-specific setup and cleanup actions
1. Enable support for Network-attached resources, not just node-local resources

## Is the Device Plugin API stable now?
No, the Device Plugin API is still not stable; the latest Device Plugin API version
available is `v1beta1`. There are plans in the community to introduce `v1beta2` API
to service multiple plugin APIs at once. A per-API call with request/response types
would allow adding support for newer API versions without explicitly bumping the API.

In addition to that, there are existing proposals in the community to introduce additional
endpoints [KEP-3162: Add Deallocate and PostStopContainer to Device Manager API](https://github.com/kubernetes/enhancements/issues/3162).
