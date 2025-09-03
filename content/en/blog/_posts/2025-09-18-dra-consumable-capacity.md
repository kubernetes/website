---
layout: blog
title: "Kubernetes v1.34: DRA Consumable Capacity"
date: 2025-09-18T10:30:00-08:00
slug: kubernetes-v1-34-dra-consumable-capacity
author: >
  Sunyanan Choochotkaew (IBM),
  Lionel Jouin (Ericsson Software Technology)
  John Belamaric (Google)
---

Dynamic Resource Allocation (DRA) is a Kubernetes API for managing scarce resources across Pods and containers.
It enables flexible resource requests, going beyond simply allocating *N* number of devices to support more granular usage scenarios.
With DRA, users can request specific types of devices based on their attributes, define custom configurations tailored to their workloads, and even share the same resource among multiple containers or Pods.

In this blog, we focus on the device sharing feature and dive into a new capability introduced in Kubernetes 1.34: _DRA consumable capacity_,
which extends DRA to support finer-grained device sharing.

## Background: device sharing via ResourceClaims

From the beginning, DRA introduced the ability for multiple Pods to share a device by referencing the same ResourceClaim.
This design decouples resource allocation from specific hardware, allowing for more dynamic and reusable provisioning of devices.

In Kubernetes 1.33, the new support for _partitionable devices_ allowed resource drivers to advertise slices of a device that are available, rather than exposing the entire device as an all-or-nothing resource.
This enabled Kubernetes to model shareable hardware more accurately.

But there was still a missing piece: it didn't yet support scenarios
where the device driver manages fine-grained, dynamic portions of a device resource — like network bandwidth — based on user demand,
or to share those resources independently of ResourceClaims, which are restricted by their spec and namespace.

That’s where _consumable capacity_ for DRA comes in.

## Benefits of DRA consumable capacity support

Here's a taste of what you get in a cluster with the `DRAConsumableCapacity`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) enabled.

### Device sharing across multiple ResourceClaims or DeviceRequests

Resource drivers can now support sharing the same device — or even a slice of a device — across multiple ResourceClaims or across multiple DeviceRequests.

This means that Pods from different namespaces can simultaneously share the same device,
if permitted and supported by the specific DRA driver.

### Device resource allocation

Kubernetes extends the allocation algorithm in the scheduler to support allocating a portion of a device's resources, as defined in the `capacity` field.
The scheduler ensures that the total allocated capacity across all consumers never exceeds the device’s total capacity, even when shared across multiple ResourceClaims or DeviceRequests.
This is very similar to the way the scheduler allows Pods and containers to share allocatable resources on Nodes;
in this case, it allows them to share allocatable (consumable) resources on Devices.

This feature expands support for scenarios where the device driver is able to manage resources **within** a device and on a per-process basis — for example,
allocating a specific amount of memory (e.g., 8 GiB) from a virtual GPU,
or setting bandwidth limits on virtual network interfaces allocated to specific Pods. This aims to provide safe and efficient resource sharing.

### DistinctAttribute constraint

This feature also introduces a new constraint: `DistinctAttribute`, which is the complement of the existing  `MatchAttribute` constraint.

The primary goal of `DistinctAttribute` is to prevent the same underlying device from being allocated multiple times within a single ResourceClaim, which could happen since we are allocating shares (or subsets) of devices.
This constraint ensures that each allocation refers to a distinct resource, even if they belong to the same device class.

It is useful for use cases such as allocating network devices connecting to different subnets to expand coverage or provide redundancy across failure domains.

## How to use consumable capacity?

`DRAConsumableCapacity` is introduced as an alpha feature in Kubernetes 1.34. The [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `DRAConsumableCapacity` must be enabled in kubelet, kube-apiserver, kube-scheduler and kube-controller-manager.

```bash
--feature-gates=...,DRAConsumableCapacity=true
```

### As a DRA driver developer

As a DRA driver developer writing in Golang, you can make a device within a ResourceSlice allocatable to multiple ResourceClaims (or `devices.requests`) by setting `AllowMultipleAllocations` to `true`.

```go
Device {
  ...
  AllowMultipleAllocations: ptr.To(true),
  ...
}
```

Additionally, you can define a policy to restrict how each device's `Capacity` should be consumed by each `DeviceRequest` by defining `RequestPolicy` field in the `DeviceCapacity`.
The example below shows how to define a policy that requires a GPU with 40 GiB of memory to allocate at least 5 GiB per request, with each allocation in multiples of 5 GiB.

```go
DeviceCapacity{
  Value: resource.MustParse("40Gi"),
  RequestPolicy: &CapacityRequestPolicy{
    Default: ptr.To(resource.MustParse("5Gi")),
    ValidRange: &CapacityRequestPolicyRange {
      Min: ptr.To(resource.MustParse("5Gi")),
      Step: ptr.To(resource.MustParse("5Gi")),
    }
  }
}
```

This will be published to the ResourceSlice, as partially shown below:

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
...
spec:
  devices:
  - name: gpu0
    allowMultipleAllocations: true
    capacity:
      memory:
        value: 40Gi
        requestPolicy:
          default: 5Gi
          validRange:
            min: 5Gi
            step: 5Gi
```

An allocated device with a specified portion of consumed capacity will have a `ShareID` field set in the allocation status.

```go
claim.Status.Allocation.Devices.Results[i].ShareID
```

This `ShareID` allows the driver to distinguish between different allocations that refer to the **same device or same statically-partitioned slice** but come from **different `ResourceClaim` requests**.  
It acts as a unique identifier for each shared slice, enabling the driver to manage and enforce resource limits independently across multiple consumers.

### As a consumer

As a consumer (or user), the device resource can be requested with a ResourceClaim like this:

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceClaim
...
spec:
  devices:
    requests: # for devices
    - name: req0
      exactly:
      - deviceClassName: resource.example.com
        capacity:
          requests: # for resources which must be provided by those devices
            memory: 10Gi
```

This configuration ensures that the requested device can provide at least 10GiB of `memory`.

Notably that **any** `resource.example.com` device that has at least 10GiB of memory can be allocated.
If a device that does not support multiple allocations is chosen, the allocation would consume the entire device.
To filter only devices that support multiple allocations, you can define a selector like this:

```yaml
selectors:
  - cel:
      expression: |-
        device.allowMultipleAllocations == true
```

## Integration with DRA device status

In device sharing, general device information is provided through the resource slice.
However, some details are set dynamically after allocation.
These can be conveyed using the [`.status.devices`](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resourceclaim-device-status) field of a ResourceClaim.
That field is only published in clusters where the `DRAResourceClaimDeviceStatus`
feature gate is enabled.

If you do have _device status_ support available, a driver can expose additional device-specific information beyond the `ShareID`.
One particularly useful use case is for virtual networks, where a driver can include the assigned IP address(es) in the status.
This is valuable for both network service operations and troubleshooting.

You can find more information by watching our recording at: [KubeCon Japan 2025 - Reimagining Cloud Native Networks: The Critical Role of DRA](https://sched.co/1x71v).

## What can you do next?
* **Check out the [CNI DRA Driver project](https://github.com/kubernetes-sigs/cni-dra-driver)** for an example of DRA integration in Kubernetes networking. Try integrating with network resources like `macvlan`, `ipvlan`, or smart NICs.
* Start enabling the `DRAConsumableCapacity` feature gate and experimenting with virtualized or partitionable devices. Specify your workloads with *consumable capacity* (for example: fractional bandwidth or memory).
* Let us know your feedback:
  * ✅ What worked well?
  * ⚠️ What didn’t?

  If you encountered issues to fix or opportunities to enhance,
  please [file a new issue](https://github.com/kubernetes/enhancements/issues)
  and reference [KEP-5075](https://github.com/kubernetes/enhancements/issues/5075) there,
  or reach out via [Slack (#wg-device-management)](https://kubernetes.slack.com/archives/C0409NGC1TK).

### Conclusion

Consumable capacity support enhances the device sharing capability of DRA by allowing effective device sharing across namespaces, across claims, and tailored to each Pod’s actual needs.
It also empowers drivers to enforce capacity limits, improves scheduling accuracy, and unlocks new use cases like bandwidth-aware networking and multi-tenant device sharing.

Try it out, experiment with consumable resources, and help shape the future of dynamic resource allocation in Kubernetes!

### Further Reading
* [DRA in the Kubernetes documentation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
* [KEP for DRA Partitionable Devices](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/4815-dra-partitionable-devices)
* [KEP for DRA Device Status](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/4817-resource-claim-device-status)
* [KEP for DRA Consumable Capacity](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/5075-dra-consumable-capacity)
* [Kubernetes 1.34 Release Notes](https://www.kubernetes.dev/resources/release/#kubernetes-v134)
