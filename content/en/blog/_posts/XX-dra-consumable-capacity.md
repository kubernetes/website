---
layout: blog
title: "DRA Consumable Capacity"
draft: true # will be changed to date: YYYY-MM-DD before publication
slug: dra-consumable-capacity # optional
author: >
  Sunyanan Choochotkaew (IBM),
  Lionel Jouin (Ericsson Software Technology)
  John Belamaric (Google)
---

# 🔓 Unlock Device Sharing with the New DRA Feature – Consumable Capacity

Dynamic Resource Allocation (DRA) is Kubernetes’ modern API for managing scarce resources across Pods and containers. It enables flexible resource requests and sharing, going beyond *N* number of device allocation to more granular usage scenarios. Central to this capability is the ResourceClaim API, which allows Pods to request and bind to abstract resource types managed by external resource drivers.

In this blog, we’ll deep dive into a new feature introduced in Kubernetes 1.34 that further extends the capabilities of DRA for fine-grained device sharing: `DRAConsumableCapacity`.

## Background: Device Sharing via ResourceClaims

From the beginning, DRA introduced the ability for multiple Pods to share a device by referring to the same ResourceClaim. This design decouples resource allocation from specific hardware, allowing more dynamic and reusable provisioning of devices.

In Kubernetes 1.33, the Partitionable Devices feature added support for resource drivers to advertise the slices of a device that are available—rather than exposing the whole device as an all-or-nothing resource. This enabled Kubernetes to model shareable hardware more accurately.

But there was still a missing piece: it doesn't yet support scenarios where the device driver manages fine-grained, dynamic portions of a device resource—like network bandwidth—based on user-specified requests, or to share those resources independently of ResourceClaims, which are restricted by their spec and namespace.

That’s where the DRAConsumableCapacity feature comes in.

## 🎯 What Does the DRAConsumableCapacity Feature Unlock?

### Device sharing across multiple ResourceClaims or requests

With the DRAConsumableCapacity feature, resource drivers can now support sharing the same device or device slice across multiple distinct ResourceClaims or requests. This means:

* Pods from different namespaces can share the same device simultaneously.
* Pods can have overlapping—but not necessarily identical—device requests and still share portions of the same device.

### Device resource allocation

For some devices, tools exist to manage resource capacity on a per-process basis—for example, setting bandwidth limits on virtual network interfaces allocated to specific Pods. This feature enables device-level capacity allocation, ensuring that the total allocated capacity across all consumers **never exceeds the device’s total capacity**, thereby guaranteeing safe and efficient resource sharing.

### DistinctAttribute constraint

In addition to the existing `MatchAttribute` constraint, this feature introduces a new constraint: `DistinctAttribute`.

The primary goal of `DistinctAttribute` is to **prevent the allocation of the same device multiple times within a single `ResourceClaim`**. This ensures that each allocation refers to a distinct resource, even if they belong to the same device class.

However, it can also support other use cases—such as allocating **network devices connecting to different subnets** to expand coverage or provide redundancy across failure domains.

## 🌟 How to use?

`DRAConsumableCapacity` is introduced as an alpha feature in Kubernetes 1.34. The [feature gate](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/) `DRAConsumableCapacity` must be enabled in kubelet, kube-apiserver, and kube-scheduler.

```bash
--feature-gates=...,DRAConsumableCapacity=true
```

### As a DRA driver

A DRA driver can define a `sample-device` with 100 of consumable capacity *cap-0* as below. The sharing policy is to set default value to 1x*cap-0* if the capacity requirement is not defined in the `ResourceClaim`.

```go
// define a consumable capacity with a sharing policy
deviceCapacity := resourceapi.DeviceCapacity{
                    Value: resource.MustParse("100"),
                    RequestPolicy: &resourceapi.CapacityRequestPolicy{
                        Default: ptr.To(resource.MustParse("1")),
                   }
// define a device allowing multiple allocations and with a consumable capacity.
device := resourceapi.Device{
		Name: "sample-device",
		AllowMultipleAllocations: ptr.To(true),
		Capacity: map[resourceapi.QualifiedName]resourceapi.DeviceCapacity{
				resourceapi.QualifiedName("cap0"): deviceCapacity,
			},
		},
	    }
```

An allocated device with a specified portion of consumed capacity will have a `ShareID` field set in the allocation status.

```go
claim.Status.Allocation.Devices.Results[i].ShareID
```

This `ShareID` allows the driver to distinguish between different allocations that refer to the **same device or same statically-partitioned slice** but come from **different `ResourceClaim` requests**.  
It acts as a unique identifier for each shared slice, enabling the driver to manage and enforce resource limits independently across multiple consumers.

### As a consumer

To filter only devices that support multiple allocations, users can define a selector like this:

```yaml
selectors:
  - cel:
      expression: |-
        device.allowMultipleAllocations == true
```

Then, the device resource can be requested with a ResourceClaim like this:

```yaml
kind: ResourceClaim
...
spec:
  devices:
    requests: # for devices
    - name: req0
      exactly:
        capacity:
          requests: # for resources which must be provided by those devices
            cap0: 10
```

This configuration ensures that the requested device can provide at least 10 units of `cap0`.

## Integration with Device Status Feature

In device sharing, general device information is provided through the resource slice. However, some details are set dynamically after allocation. These can be conveyed using the [DRAResourceClaimDeviceStatus](https://kubernetes.io/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resourceclaim-device-status) feature. 

Together with the `DRAResourceClaimDeviceStatus` feature, we can expose additional device-specific information beyond the `ShareID`. One particularly useful use case is for virtual networks, where we can include the assigned IP address in the status. This is valuable for both network service operations and troubleshooting.

You can find more information by watching our recording at: [KubeCon Japan 2025 - Reimagining Cloud Native Networks: The Critical Role of DRA](https://sched.co/1x71v).

## 📣 Call to Action
* **Check out the [CNI DRA Driver project](https://github.com/kubernetes-sigs/cni-dra-driver)** for an example of DRA integration in Kubernetes networking. Try integrating with network resources like `macvlan`, `ipvlan`, or smart NICs.
* Start enabling the `DRAConsumableCapacity` feature gate and experimenting with virtualized or partitionable devices. Run your workloads with **consumable capacity** (e.g., fractional bandwidth or memory).
  - Report your findings:
    - ✅ What worked well?
    - ⚠️ What didn’t?

---

## Conclusion

`DRAConsumableCapacity` enhances the device sharing capability of DRA by unlocking the restriction and allowing device sharing across namespaces, across claims, and tailored to each Pod’s actual needs. It also empowers drivers to enforce capacity limits, improves scheduling accuracy, and unlocks new use cases like bandwidth-aware networking and multi-tenant device sharing.

Try it out, experiment with consumable resources, and help shape the future of dynamic resource allocation in Kubernetes!

### Further Reading
* [Kubernetes DRA Documentation](https://kubernetes.io/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
* [KEP for DRA Partitionable Devices](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/4815-dra-partitionable-devices)
* [KEP for DRA Device Status](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/4817-resource-claim-device-status)
* [KEP for DRA Consumable Capacity](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/5075-dra-consumable-capacity)
* [Kubernetes 1.34 Release Notes](https://www.kubernetes.dev/resources/release/#kubernetes-v134)
