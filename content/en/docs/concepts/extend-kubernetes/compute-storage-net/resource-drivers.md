---
title: DRA Resource Drivers
description: Resource drivers provide non-trivial allocation logic and management for devices or resources that require vendor-specific or just complex setup, such as GPUs, NICs, FPGAs, etc.
content_type: concept
weight: 10
---

<!-- overview -->
{{< feature-state for_k8s_version="v1.27" state="alpha" >}}

Kubernetes provides a
[Dynamic Resource Allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) (DRA)
mechanism, that can be leveraged to provide more complex hardware resources to workloads with custom
resource accounting.

Similarly to {{< glossary_tooltip term_id="device-plugin" text="device plugins">}}, instead of
customizing the code for Kubernetes itself, vendors can implement a _resource driver_ that you deploy
into the cluster to account for and control the allocation of GPUs, high-performance NICs, FPGAs,
InfiniBand adapters, and other similar computing resources that may require vendor specific
initialization and setup.

With device plugins, the scheduler was given a trivial, numerical representation of the resources
available on a node for consideration during scheduling as an extended resource.

With DRA, the scheduler is offloading the task of allocating and accounting for non-native resources
to the resource driver, which manages such resources in the cluster.

A resource driver consists of two main components:

- a _controller_ (one per cluster), manages hardware resources allocation for
  {{< glossary_tooltip term_id="ResourceClaim" text="ResourceClaims">}}
- _kubelet plugin_ (one per node that has or can access the associated resource), that:
  - discovers the supported hardware
  - announces the discovered hardware to the resource driver controller
  - prepares the hardware allocated to a ResourceClaim when the Kubelet prepares to create the Pod
  - unprepares the hardware allocated for a Pod when the Pod has reached final state or is being deleted.

There are two common ways of communication between the controller and a kubelet plugin:

- through custom resource objects that use
  {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinitions">}}
 provided by the vendor or project behind the resource driver
- through a ResourceHandle which is a part of an `AllocationResult` provided by the controller in case of
  successful allocation

General recommendations:

- resource driver name pattern: `<HW type>.resource.<companyname>.<companydomain>`. For example,
  gpu.resource.example.com

<!-- body -->

## Resource driver controller

A resource driver controller's main responsibility is to allocate and deallocate resources for
{{< glossary_tooltip term_id="ResourceClaim" text="ResourceClaims">}}.

There are two modes of allocation the ResourceClaim can have:

- `WaitForFirstConsumer` (default), which you could think of as meaning _delayed_.
  In this mode the cluster only requests resource(s) for ResourceClaim when a Pod that needs it is being scheduled.
- `Immediate`: the resource has to be allocated to the ResourceClaim as soon as possible, and
  retained until the ResourceClaim is deleted.

### Delayed allocation

Controller helper code will first call _UnsuitableNodes_ for driver to report which of candidate Nodes
chosen by the scheduler are not suitable for allocating all needed ResourceClaims of this resource driver.
If no nodes were suitable, scheduler selects another batch of Node names, and _UnsuitableNodes_ is
called again until suitable node is found.

When at least one Node is found to be suitable for all ResourceClaims, the scheduler
considers the suitable nodes for the other Pod scheduling constraints (native resources
requests, affinity, selectors, etc.), and picks up exactly one Node name.

After the Node was selected, the controller helper code will invoke _Allocate_ call of the Driver
to do the actual resource allocation for needed ResourceClaims on selected Node.

If Allocate call returns error for any number of ResourceClaims, the helper code will repeat the
same call with interval until it succeeds.

### Immediate allocation

Immediate allocation does not have selected node, and it is up to the resource driver controller
to select the best suitable node based on the ResourceClaim, ResourceClass and their parameters.
Therefore in this scenario only `Allocate` is called by the helper library, without `UnsupportedNodes`
being called first.

### Common calls for both allocation modes

In both modes the allocation is preceded by getting parameters objects for ResourceClaims and
ResourceClasses to ensure the resource driver is able to get these objects and understand them.

## Sharing resources

There are two main ways of sharing resources between Pods:
- by using the same ResourceClaim in multiple Pods
- by using the same underlying resource for different ResourceClaims

### Shared ResourceClaims

If the `Shareable` field is set to `true` in AllocationResult for ResourceClaim, scheduler will
allow the same ResourceClaim to be used by up to 32 Pods by automatically updating
`Claim.Status.ReservedFor` field without consulting the resource driver that allocated resource
for this ResourceClaim.

### Internal accounting in resource driver

The other way of sharing same resource is by implementing the sharing logic in the resource driver.
This can be based on, for instance, ResourceClass parameters field that would specify whether the
resource driver should exclusively allocate the resource to the ResourceClaim, or same resource
can be allocated to other ResourceClaims.

### Example {#example-pod}

Suppose a Kubernetes cluster is running a resource driver gpu.resource.example.com with Resource
Class `example.example.com`. Here is an example of a pod requesting this resource to run a demo
workload:

```yaml
# gpu.resource.example.com GpuClaimParameters is an example extension API for parameters
apiVersion: gpu.resource.example.com/v1alpha1
kind: GpuClaimParameters
metadata:
  name: single-gpu
spec:
  count: 1
---
apiVersion: resource.k8s.io/v1alpha2
kind: ResourceClaim
metadata:
  name: gpu-test
spec:
  resourceClassName: gpu.example.com
  parametersRef:
    apiGroup: gpu.resource.example.com/v1alpha1
    kind: GpuClaimParameters
    name: single-gpu
---
apiVersion: v1
kind: Pod
metadata:
  namespace: gpu-test4
  name: pod0
  labels:
    app: pod
spec:
  containers:
  - name: container1
    image: ubuntu:22.04
    command: ["bash", "-c"]
    args: ["export; sleep 9999"]
    resources:
      claims:
      - name: gpus
  resourceClaims:
  - name: gpus
    source:
      resourceClaimTemplateName: gpu-test
# This Pod wants to use ResourceClaim gpu-test that needs 1 device of ResourceClass
# gpu.example.com, handled by the gpu.resource.example.com resource driver.
#
# The resource driver allocates the resources required for that ResourceClaim and ensures that these are
# ready to use, only then the Pod will start.
```

## Good practice for resource driver deployment {#resource-driver-deploy-tips}

The recommended way to deploy a resource driver is a Deployment for controller part and a DaemonSet
for the kubelet plugin part. It is also possible to deploy it as a package for your node's
operating system, or manually.

The kubelet uses a gRPC interface to interact with a resource driver's kubelet plugin. On the Kubernetes side,
no special permissions are required for resource drivers.

When you deploy a resource driver, you typically also define at least one ResourceClass using that driver.

## API compatibility

Kubernetes dynamic resource allocation support is in alpha. The API may change before stabilization,
in incompatible ways. As a project, Kubernetes recommends that resource driver developers:

* Watch for changes in future releases.
* Support multiple versions of the resource driver API for backward/forward compatibility.

If you enable the `DynamicResourceAllocation` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) and run associated kubelet plugins on nodes
that need to be upgraded to a Kubernetes release with a newer DRA API version, upgrade your
resource drivers to support both versions before upgrading these nodes. Taking that approach will
ensure the continuous functioning of the device allocations during the upgrade.

## DRA resource driver examples {#examples}

{{% thirdparty-content %}}

Here are some examples of resource driver implementations:

* The [example resource driver](https://github.com/kubernetes-sigs/dra-example-driver)
* The [Intel GPU resource driver](https://github.com/intel/intel-resource-drivers-for-kubernetes)
* The [NVIDIA GPU resource driver](https://github.com/NVIDIA/k8s-dra-driver)


## {{% heading "whatsnext" %}}

* Learn about [creating your own DRA resource driver](https://www.youtube.com/watch?v=_fi9asserLE)
* Discover the [example DRA resource driver](https://github.com/kubernetes-sigs/dra-example-driver)
