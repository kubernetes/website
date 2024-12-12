---
title: Assign Resources to Containers and Pods with Dynamic Resource Allocation
content_type: task
weight: 270
---

<!-- overview -->

{{< feature-state feature_gate_name="DynamicResourceAllocation" >}}

This page shows how to assign resources defined with the Dynamic Resource
Allocation (DRA) APIs to containers.


## {{% heading "prerequisites" %}}

- `kind`
- `kubectl`
- `helm`


<!-- steps -->

## Deploy an example DRA driver

- Reproduce the steps from https://github.com/kubernetes-sigs/dra-example-driver?tab=readme-ov-file#demo to create a cluster and install the driver

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

- Delete the kind cluster


## {{% heading "whatsnext" %}}

### For workload administrators

* [Schedule GPUs](/docs/tasks/manage-gpus/scheduling-gpus/)

### For device driver authors

* [Example Resource Driver for Dynamic Resource Allocation](https://github.com/kubernetes-sigs/dra-example-driver)
