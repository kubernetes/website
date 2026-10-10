---
layout: blog
title: "Kubernetes v1.34: Pod Level Resources Graduated to Beta"
date: 2025-09-22T10:30:00-08:00
slug: kubernetes-v1-34-pod-level-resources
author: Dixita Narang (Google)
---

On behalf of the Kubernetes community, I am thrilled to announce that the Pod Level Resources feature has graduated to Beta in the Kubernetes v1.34 release and is enabled by default! This significant milestone introduces a new layer of flexibility for defining and managing resource allocation for your Pods. This flexibility stems from the ability to specify CPU and memory resources for the Pod as a whole. Pod level resources can be combined with the container-level specifications to express the exact resource requirements and limits your application needs.

## Pod-level specification for resources

Until recently, resource specifications that applied to Pods were primarily defined
at the individual container level. While effective, this approach sometimes required
duplicating or meticulously calculating resource needs across multiple containers
within a single Pod. As a beta feature, Kubernetes allows you to specify the CPU,
memory and hugepages resources at the Pod-level. This means you can now define
resource requests and limits for an entire Pod, enabling easier resource sharing
without requiring granular, per-container management of these resources where
it's not needed.


## Why does Pod-level specification matter?

This feature enhances resource management in Kubernetes by offering *flexible resource management* at both the Pod and container levels.

* It provides a consolidated approach to resource declaration, reducing the need for
  meticulous, per-container management, especially for Pods with multiple
  containers. 
* Pod-level resources enable containers within a pod to share unused resoures
  amongst themselves, promoting efficient utilization within the pod. For example,
  it prevents sidecar containers from becoming performance bottlenecks. Previously,
  a sidecar (e.g., a logging agent or service mesh proxy) hitting its individual CPU
  limit could be throttled and slow down the entire Pod, even if the main
  application container had plenty of spare CPU. With pod-level resources, the
  sidecar and the main container can share Pod's resource budget, ensuring smooth
  operation during traffic spikes - either the whole Pod is throttled or all
  containers work.

* When both pod-level and container-level resources are specified, pod-level
  requests and limits take precedence. This gives you – and cluster administrators -
  a powerful way to enforce overall resource boundaries for your Pods. 

  For scheduling, if a pod-level request is explicitly defined, the scheduler uses
  that specific value to find a suitable node, insteaf of the aggregated requests of
  the individual containers. At runtime, the pod-level limit acts as a hard ceiling
  for the combined resource usage of all containers. Crucially, this pod-level limit
  is the absolute enforcer; even if the sum of the individual container limits is
  higher, the total resource consumption can never exceed the pod-level limit.
* Pod-level resources are **prioritized** in influencing the Quality of Service (QoS) class of the Pod.
* For Pods running on Linux nodes, the Out-Of-Memory (OOM) score adjustment
  calculation considers both pod-level and container-level resources requests.
* Pod-level resources are **designed to be compatible with existing Kubernetes functionalities**, ensuring a smooth integration into your workflows.

## How to specify resources for an entire Pod

Using `PodLevelResources` [feature
gate](/docs/reference/command-line-tools-reference/feature-gates/) requires
Kubernetes v1.34 or newer for all cluster components, including the control plane
and every node. This feature gate is in beta and enabled by default in v1.34.

### Example manifest

You can specify CPU, memory and hugepages resources directly in the Pod spec manifest at the `resources` field for the entire Pod.

Here’s an example demonstrating a Pod with both CPU and memory requests and limits
defined at the Pod level:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-resources-demo
  namespace: pod-resources-example
spec:
  # The 'resources' field at the Pod specification level defines the overall
  # resource budget for all containers within this Pod combined.
  resources: # Pod-level resources
    # 'limits' specifies the maximum amount of resources the Pod is allowed to use.
    # The sum of the limits of all containers in the Pod cannot exceed these values.
    limits:
      cpu: "1" # The entire Pod cannot use more than 1 CPU core.
      memory: "200Mi" # The entire Pod cannot use more than 200 MiB of memory.
    # 'requests' specifies the minimum amount of resources guaranteed to the Pod.
    # This value is used by the Kubernetes scheduler to find a node with enough capacity.
    requests:
      cpu: "1" # The Pod is guaranteed 1 CPU core when scheduled.
      memory: "100Mi" # The Pod is guaranteed 100 MiB of memory when scheduled.
  containers:
  - name: main-app-container
    image: nginx
    ...
    # This container has no resource requests or limits specified.
  - name: auxiliary-container
    image: fedora
    command: ["sleep", "inf"]
    ...
    # This container has no resource requests or limits specified.
```

In this example, the `pod-resources-demo` Pod as a whole requests 1 CPU and 100 MiB of memory, and is limited to 1 CPU and 200 MiB of memory. The containers within will operate under these overall Pod-level constraints, as explained in the next section.

### Interaction with container-level resource requests or limits

When both pod-level and container-level resources are specified, **pod-level requests and limits take precedence**. This means the node allocates resources based on the pod-level specifications.

Consider a Pod with two containers where pod-level CPU and memory requests and
limits are defined, and only one container has its own explicit resource
definitions:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-resources-demo
  namespace: pod-resources-example
spec:
  resources:
    limits:
      cpu: "1"
      memory: "200Mi"
    requests:
      cpu: "1"
      memory: "100Mi"
  containers:
  - name: main-app-container
    image: nginx
    resources:
      requests:
        cpu: "0.5"
        memory: "50Mi"
  - name: auxiliary-container
    image: fedora
    command: [ "sleep", "inf"]
    # This container has no resource requests or limits specified.
```

* Pod-Level Limits: The pod-level limits (cpu: "1", memory: "200Mi") establish an absolute boundary for the entire Pod. The sum of resources consumed by all its containers is enforced at this ceiling and cannot be surpassed.

* Resource Sharing and Bursting: Containers can dynamically borrow any unused capacity, allowing them to burst as needed, so long as the Pod's aggregate usage stays within the overall limit.

* Pod-Level Requests: The pod-level requests (cpu: "1", memory: "100Mi") serve as the foundational resource guarantee for the entire Pod. This value informs the scheduler's placement decision and represents the minimum resources the Pod can rely on during node-level contention.

* Container-Level Requests: Container-level requests create a priority system within
the Pod's guaranteed budget. Because main-app-container has an explicit request
(cpu: "0.5", memory: "50Mi"), it is given precedence for its share of resources
under resource pressure over the auxiliary-container, which has no
such explicit claim.

## Limitations
* First of all, [in-place
  resize](/docs/concepts/workloads/pods/#pod-update-and-replacement) of pod-level
  resources is **not supported** for Kubernetes v1.34 (or earlier). Attempting to
  modify the _pod-level_ resource limits or requests on a running Pod results in an
  error: the resize is rejected. The v1.34 implementation of Pod level resources
  focuses on allowing initial declaration of an overall resource envelope, that
  applies to the **entire Pod**. That is distinct from in-place pod resize, which
  (despite what the name might suggest) allows you
  to make dynamic adjustments to _container_ resource
  requests and limits, within a *running* Pod, 
  and potentially without a container restart. In-place resizing is also not yet a
  stable feature; it graduated to Beta in the v1.33 release.

* Only CPU, memory, and hugepages resources can be specified at pod-level.

* Pod-level resources are not supported for Windows pods. If the Pod specification 
explicitly targets Windows (e.g., by setting spec.os.name: "windows"), the API
server will reject the Pod during the validation step. If the Pod is not explicitly
marked for Windows but is scheduled to a Windows node (e.g., via a nodeSelector),
the Kubelet on that Windows node will reject the Pod during its admission process. 

* The Topology Manager, Memory Manager and CPU Manager do not
  align pods and containers based on pod-level resources as these resource managers 
  don't currently support pod-level resources.

#### Getting started and providing feedback

Ready to explore _Pod Level Resources_ feature? You'll need a Kubernetes cluster running version 1.34 or later. Remember to enable the `PodLevelResources` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) across your control plane and all nodes.

As this feature moves through Beta, your feedback is invaluable. Please report any issues or share your experiences via the standard Kubernetes communication channels:



* Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node)
* [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
* [Open Community Issues/PRs](https://github.com/kubernetes/community/labels/sig%2Fnode)