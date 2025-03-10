---
title: Example Dynamic Resource Allocation Configurations
content_type: tutorial
weight: 10
---

<!-- overview -->

{{< feature-state feature_gate_name="DynamicResourceAllocation" >}}

This tutorial walks through several examples showing how Dynamic Resource
Allocation (DRA) can provide containers access to devices covering a variety of
use cases.


## {{% heading "objectives" %}}

* Learn when to prefer using device plugins or DRA when configuring containers'
  requests for devices.


## {{% heading "prerequisites" %}}

- A cluster with DRA enabled
- `kubectl`
- `helm`


<!-- lessoncontent -->

## Deploy an example DRA driver

- Reproduce the steps from https://github.com/kubernetes-sigs/dra-example-driver?tab=readme-ov-file#demo to build and install the driver

- Show DeviceClass
- Show ResourceSlice for a Node


## Allocate one device for a container

- Create a ResourceClaim requesting one device
- Create a Pod with one container referencing the ResourceClaim
- Show that the ResourceClaim is allocated


## Allocate one device to be shared among multiple Pods

- Same as first example, with multiple Pods referencing the same
  ResourceClaim


## Allocate one device per replica of a Deployment

- Same as first example, using a Deployment with several replicas and the Pod
  template references a ResourceClaimTemplate.

- Show how several ResourceClaims are generated based on the one
  ResourceClaimTemplate

- Scale the Deployment beyond the number of available devices
  - Show the unallocatable ResourceClaims


## Clean up


## Conclusion


## {{% heading "whatsnext" %}}

* Learn more about [Device Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
* Learn more about [Dynamic Resource Allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
* Learn how to [Administer Workloads using Dynamic Resource Allocation](/docs/tasks/configure-pod-container/administer-dra-workloads/)