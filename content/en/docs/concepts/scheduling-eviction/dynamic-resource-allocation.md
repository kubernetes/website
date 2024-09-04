---
reviewers:
- klueska
- pohly
title: Dynamic Resource Allocation
content_type: concept
weight: 65
---

<!-- overview -->

Core Dynamic Resource Allocation with structured parameters:

{{< feature-state feature_gate_name="DynamicResourceAllocation" >}}

Dynamic Resource Allocation with control plane controller:

{{< feature-state feature_gate_name="DRAControlPlaneController" >}}

Dynamic resource allocation is an API for requesting and sharing resources
between pods and containers inside a pod. It is a generalization of the
persistent volumes API for generic resources. Typically those resources
are devices like GPUs.

Third-party resource drivers are
responsible for tracking and preparing resources, with allocation of
resources handled by Kubernetes via _structured parameters_ (introduced in Kubernetes 1.30).
Different kinds of resources support arbitrary parameters for defining requirements and
initialization.

When a driver provides a _control plane controller_, the driver itself
handles allocation in cooperation with the Kubernetes scheduler.

## {{% heading "prerequisites" %}}

Kubernetes v{{< skew currentVersion >}} includes cluster-level API support for
dynamic resource allocation, but it [needs to be enabled](#enabling-dynamic-resource-allocation)
explicitly. You also must install a resource driver for specific resources that
are meant to be managed using this API. If you are not running Kubernetes
v{{< skew currentVersion>}}, check the documentation for that version of Kubernetes.

<!-- body -->

## API

The `resource.k8s.io/v1alpha3`
{{< glossary_tooltip text="API group" term_id="api-group" >}} provides these types:

ResourceClaim
: Describes a request for access to resources in the cluster,
  for use by workloads. For example, if a workload needs an accelerator device
  with specific properties, this is how that request is expressed. The status
  stanza tracks whether this claim has been satisfied and what specific
  resources have been allocated.

ResourceClaimTemplate
: Defines the spec and some metadata for creating
  ResourceClaims. Created by a user when deploying a workload.
  The per-Pod ResourceClaims are then created and removed by Kubernetes
  automatically.

DeviceClass
: Contains pre-defined selection criteria for certain devices and
  configuration for them. DeviceClasses are created by a cluster administrator
  when installing a resource driver. Each request to allocate a device
  in a ResourceClaim must reference exactly one DeviceClass.

PodSchedulingContext
: Used internally by the control plane and resource drivers
  to coordinate pod scheduling when ResourceClaims need to be allocated
  for a Pod and those ResourceClaims use a control plane controller.

ResourceSlice
: Used with structured parameters to publish information about resources
  that are available in the cluster.

The developer of a resource driver decides whether they want to handle
allocation themselves with a control plane controller or instead rely on allocation
through Kubernetes with structured parameters. A
custom controller provides more flexibility, but cluster autoscaling is not
going to work reliably for node-local resources. Structured parameters enable
cluster autoscaling, but might not satisfy all use-cases.

When a driver uses structured parameters, all parameters that select devices
are defined in the ResourceClaim and DeviceClass with in-tree types. Configuration
parameters can be embedded there as arbitrary JSON objects.

The `core/v1` `PodSpec` defines ResourceClaims that are needed for a Pod in a
`resourceClaims` field. Entries in that list reference either a ResourceClaim
or a ResourceClaimTemplate. When referencing a ResourceClaim, all Pods using
this PodSpec (for example, inside a Deployment or StatefulSet) share the same
ResourceClaim instance. When referencing a ResourceClaimTemplate, each Pod gets
its own instance.

The `resources.claims` list for container resources defines whether a container gets
access to these resource instances, which makes it possible to share resources
between one or more containers.

Here is an example for a fictional resource driver. Two ResourceClaim objects
will get created for this Pod and each container gets access to one of them.

```yaml
apiVersion: resource.k8s.io/v1alpha3
kind: DeviceClass
name: resource.example.com
spec:
  selectors:
  - cel:
      expression: device.driver == "resource-driver.example.com"
---
apiVersion: resource.k8s.io/v1alpha2
kind: ResourceClaimTemplate
metadata:
  name: large-black-cat-claim-template
spec:
  spec:
    devices:
      requests:
      - name: req-0
        deviceClassName: resource.example.com
        selectors:
        - cel:
           expression: |-
              device.attributes["resource-driver.example.com"].color == "black" &&
              device.attributes["resource-driver.example.com"].size == "large"
–--
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-cats
spec:
  containers:
  - name: container0
    image: ubuntu:20.04
    command: ["sleep", "9999"]
    resources:
      claims:
      - name: cat-0
  - name: container1
    image: ubuntu:20.04
    command: ["sleep", "9999"]
    resources:
      claims:
      - name: cat-1
  resourceClaims:
  - name: cat-0
    resourceClaimTemplateName: large-black-cat-claim-template
  - name: cat-1
    resourceClaimTemplateName: large-black-cat-claim-template
```

## Scheduling

### With control plane controller

In contrast to native resources (CPU, RAM) and extended resources (managed by a
device plugin, advertised by kubelet), without structured parameters
the scheduler has no knowledge of what
dynamic resources are available in a cluster or how they could be split up to
satisfy the requirements of a specific ResourceClaim. Resource drivers are
responsible for that. They mark ResourceClaims as "allocated" once resources
for it are reserved. This also then tells the scheduler where in the cluster a
ResourceClaim is available.

When a pod gets scheduled, the scheduler checks all ResourceClaims needed by a Pod and
creates a PodScheduling object where it informs the resource drivers
responsible for those ResourceClaims about nodes that the scheduler considers
suitable for the Pod. The resource drivers respond by excluding nodes that
don't have enough of the driver's resources left. Once the scheduler has that
information, it selects one node and stores that choice in the PodScheduling
object. The resource drivers then allocate their ResourceClaims so that the
resources will be available on that node. Once that is complete, the Pod
gets scheduled.

As part of this process, ResourceClaims also get reserved for the
Pod. Currently ResourceClaims can either be used exclusively by a single Pod or
an unlimited number of Pods.

One key feature is that Pods do not get scheduled to a node unless all of
their resources are allocated and reserved. This avoids the scenario where a Pod
gets scheduled onto one node and then cannot run there, which is bad because
such a pending Pod also blocks all other resources like RAM or CPU that were
set aside for it.

{{< note >}}

Scheduling of pods which use ResourceClaims is going to be slower because of
the additional communication that is required. Beware that this may also impact
pods that don't use ResourceClaims because only one pod at a time gets
scheduled, blocking API calls are made while handling a pod with
ResourceClaims, and thus scheduling the next pod gets delayed.

{{< /note >}}

### With structured parameters

When a driver uses structured parameters, the scheduler takes over the
responsibility of allocating resources to a ResourceClaim whenever a pod needs
them. It does so by retrieving the full list of available resources from
ResourceSlice objects, tracking which of those resources have already been
allocated to existing ResourceClaims, and then selecting from those resources
that remain.

The only kind of supported resources at the moment are devices. A device
instance has a name and several attributes and capacities. Devices get selected
through CEL expressions which check those attributes and capacities. In
addition, the set of selected devices also can be restricted to sets which meet
certain constraints.

The chosen resource is recorded in the ResourceClaim status together with any
vendor-specific configuration, so when a pod is about to start on a node, the
resource driver on the node has all the information it needs to prepare the
resource.

By using structured parameters, the scheduler is able to reach a decision
without communicating with any DRA resource drivers. It is also able to
schedule multiple pods quickly by keeping information about ResourceClaim
allocations in memory and writing this information to the ResourceClaim objects
in the background while concurrently binding the pod to a node.

## Monitoring resources

The kubelet provides a gRPC service to enable discovery of dynamic resources of
running Pods. For more information on the gRPC endpoints, see the
[resource allocation reporting](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources).

## Pre-scheduled Pods

When you - or another API client - create a Pod with `spec.nodeName` already set, the scheduler gets bypassed.
If some ResourceClaim needed by that Pod does not exist yet, is not allocated
or not reserved for the Pod, then the kubelet will fail to run the Pod and
re-check periodically because those requirements might still get fulfilled
later.

Such a situation can also arise when support for dynamic resource allocation
was not enabled in the scheduler at the time when the Pod got scheduled
(version skew, configuration, feature gate, etc.). kube-controller-manager
detects this and tries to make the Pod runnable by triggering allocation and/or
reserving the required ResourceClaims.

{{< note >}}

This only works with resource drivers that don't use structured parameters.

{{< /note >}}

It is better to avoid bypassing the scheduler because a Pod that is assigned to a node
blocks normal resources (RAM, CPU) that then cannot be used for other Pods
while the Pod is stuck. To make a Pod run on a specific node while still going
through the normal scheduling flow, create the Pod with a node selector that
exactly matches the desired node:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-cats
spec:
  nodeSelector:
    kubernetes.io/hostname: name-of-the-intended-node
  ...
```

You may also be able to mutate the incoming Pod, at admission time, to unset
the `.spec.nodeName` field and to use a node selector instead.

## Enabling dynamic resource allocation

Dynamic resource allocation is an *alpha feature* and only enabled when the
`DynamicResourceAllocation` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
and the `resource.k8s.io/v1alpha3` {{< glossary_tooltip text="API group" term_id="api-group" >}}
are enabled. For details on that, see the `--feature-gates` and `--runtime-config`
[kube-apiserver parameters](/docs/reference/command-line-tools-reference/kube-apiserver/).
kube-scheduler, kube-controller-manager and kubelet also need the feature gate.

When a resource driver uses a control plane controller, then the
`DRAControlPlaneController` feature gate has to be enabled in addition to
`DynamicResourceAllocation`.

A quick check whether a Kubernetes cluster supports the feature is to list
DeviceClass objects with:

```shell
kubectl get deviceclasses
```

If your cluster supports dynamic resource allocation, the response is either a
list of DeviceClass objects or:

```
No resources found
```

If not supported, this error is printed instead:

```
error: the server doesn't have a resource type "deviceclasses"
```

A control plane controller is supported when it is possible to create a
ResourceClaim where the `spec.controller` field is set. When the
`DRAControlPlaneController` feature is disabled, that field automatically
gets cleared when storing the ResourceClaim.

The default configuration of kube-scheduler enables the "DynamicResources"
plugin if and only if the feature gate is enabled and when using
the v1 configuration API. Custom configurations may have to be modified to
include it.

In addition to enabling the feature in the cluster, a resource driver also has to
be installed. Please refer to the driver's documentation for details.

## {{% heading "whatsnext" %}}

- For more information on the design, see the
  [Dynamic Resource Allocation with Structured Parameters](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/4381-dra-structured-parameters)
  and the
  [Dynamic Resource Allocation with Control Plane Controller](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/3063-dynamic-resource-allocation/README.md) KEPs.
