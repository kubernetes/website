---
reviewers:
- klueska
- pohly
title: Dynamic Resource Allocation
content_type: concept
weight: 65
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.27" state="alpha" >}}

Dynamic resource allocation is an API for requesting and sharing resources
between pods and containers inside a pod. It is a generalization of the
persistent volumes API for generic resources. Third-party resource drivers are
responsible for tracking and allocating resources. Different kinds of
resources support arbitrary parameters for defining requirements and
initialization.

## {{% heading "prerequisites" %}}

Kubernetes v{{< skew currentVersion >}} includes cluster-level API support for
dynamic resource allocation, but it [needs to be
enabled](#enabling-dynamic-resource-allocation) explicitly.  You also must
install a resource driver for specific resources that are meant to be managed
using this API.  If you are not running Kubernetes v{{< skew currentVersion>}},
check the documentation for that version of Kubernetes.

<!-- body -->

## API

The `resource.k8s.io/v1alpha2` {{< glossary_tooltip text="API group"
term_id="api-group" >}} provides four types:

ResourceClass
: Defines which resource driver handles a certain kind of
  resource and provides common parameters for it. ResourceClasses
  are created by a cluster administrator when installing a resource
  driver.

ResourceClaim
: Defines a particular resource instances that is required by a
  workload. Created by a user (lifecycle managed manually, can be shared
  between different Pods) or for individual Pods by the control plane based on
  a ResourceClaimTemplate (automatic lifecycle, typically used by just one
  Pod).

ResourceClaimTemplate
: Defines the spec and some meta data for creating
  ResourceClaims. Created by a user when deploying a workload.

PodSchedulingContext
: Used internally by the control plane and resource drivers
  to coordinate pod scheduling when ResourceClaims need to be allocated
  for a Pod.

Parameters for ResourceClass and ResourceClaim are stored in separate objects,
typically using the type defined by a {{< glossary_tooltip
term_id="CustomResourceDefinition" text="CRD" >}} that was created when
installing a resource driver.

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
apiVersion: resource.k8s.io/v1alpha2
kind: ResourceClass
name: resource.example.com
driverName: resource-driver.example.com
---
apiVersion: cats.resource.example.com/v1
kind: ClaimParameters
name: large-black-cat-claim-parameters
spec:
  color: black
  size: large
---
apiVersion: resource.k8s.io/v1alpha2
kind: ResourceClaimTemplate
metadata:
  name: large-black-cat-claim-template
spec:
  spec:
    resourceClassName: resource.example.com
    parametersRef:
      apiGroup: cats.resource.example.com
      kind: ClaimParameters
      name: large-black-cat-claim-parameters
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
    source:
      resourceClaimTemplateName: large-black-cat-claim-template
  - name: cat-1
    source:
      resourceClaimTemplateName: large-black-cat-claim-template
```

## Scheduling

In contrast to native resources (CPU, RAM) and extended resources (managed by a
device plugin, advertised by kubelet), the scheduler has no knowledge of what
dynamic resources are available in a cluster or how they could be split up to
satisfy the requirements of a specific ResourceClaim. Resource drivers are
responsible for that. They mark ResourceClaims as "allocated" once resources
for it are reserved. This also then tells the scheduler where in the cluster a
ResourceClaim is available.

ResourceClaims can get allocated as soon as they are created ("immediate
allocation"), without considering which Pods will use them. The default is to
delay allocation until a Pod gets scheduled which needs the ResourceClaim
(i.e. "wait for first consumer").

In that mode, the scheduler checks all ResourceClaims needed by a Pod and
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

However, it is better to avoid this because a Pod that is assigned to a node
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
`DynamicResourceAllocation` [feature
gate](/docs/reference/command-line-tools-reference/feature-gates/) and the
`resource.k8s.io/v1alpha2` {{< glossary_tooltip text="API group"
term_id="api-group" >}} are enabled. For details on that, see the
`--feature-gates` and `--runtime-config` [kube-apiserver
parameters](/docs/reference/command-line-tools-reference/kube-apiserver/).
kube-scheduler, kube-controller-manager and kubelet also need the feature gate.

A quick check whether a Kubernetes cluster supports the feature is to list
ResourceClass objects with:

```shell
kubectl get resourceclasses
```

If your cluster supports dynamic resource allocation, the response is either a
list of ResourceClass objects or:

```
No resources found
```

If not supported, this error is printed instead:

```
error: the server doesn't have a resource type "resourceclasses"
```

The default configuration of kube-scheduler enables the "DynamicResources"
plugin if and only if the feature gate is enabled and when using
the v1 configuration API. Custom configurations may have to be modified to
include it.

In addition to enabling the feature in the cluster, a resource driver also has to
be installed. Please refer to the driver's documentation for details.

## {{% heading "whatsnext" %}}

 - For more information on the design, see the
[Dynamic Resource Allocation KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/3063-dynamic-resource-allocation/README.md).
