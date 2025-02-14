---
title: Pod Quality of Service Classes
content_type: concept
weight: 85
---

<!-- overview -->

This page introduces _Quality of Service (QoS) classes_ in Kubernetes, and explains
how Kubernetes assigns a QoS class to each Pod as a consequence of the resource
constraints that you specify for the containers in that Pod. Kubernetes relies on this
classification to make decisions about which Pods to evict when there are not enough
available resources on a Node.

<!-- body -->

## Quality of Service classes

Kubernetes classifies the Pods that you run and allocates each Pod into a specific
_quality of service (QoS) class_. Kubernetes uses that classification to influence how different
pods are handled. Kubernetes does this classification based on the
[resource requests](/docs/concepts/configuration/manage-resources-containers/)
of the {{< glossary_tooltip text="Containers" term_id="container" >}} in that Pod, along with
how those requests relate to resource limits.
This is known as {{< glossary_tooltip text="Quality of Service" term_id="qos-class" >}}
(QoS) class. Kubernetes assigns every Pod a QoS class based on the resource requests
and limits of its component Containers. QoS classes are used by Kubernetes to decide
which Pods to evict from a Node experiencing
[Node Pressure](/docs/concepts/scheduling-eviction/node-pressure-eviction/). The possible
QoS classes are `Guaranteed`, `Burstable`, and `BestEffort`. When a Node runs out of resources,
Kubernetes will first evict `BestEffort` Pods running on that Node, followed by `Burstable` and
finally `Guaranteed` Pods. When this eviction is due to resource pressure, only Pods exceeding
resource requests are candidates for eviction.

### Guaranteed

Pods that are `Guaranteed` have the strictest resource limits and are least likely
to face eviction. They are guaranteed not to be killed until they exceed their limits
or there are no lower-priority Pods that can be preempted from the Node. They may
not acquire resources beyond their specified limits. These Pods can also make
use of exclusive CPUs using the
[`static`](/docs/tasks/administer-cluster/cpu-management-policies/#static-policy) CPU management policy.

#### Criteria

For a Pod to be given a QoS class of `Guaranteed`:

* Every Container in the Pod must have a memory limit and a memory request.
* For every Container in the Pod, the memory limit must equal the memory request.
* Every Container in the Pod must have a CPU limit and a CPU request.
* For every Container in the Pod, the CPU limit must equal the CPU request.

### Burstable

Pods that are `Burstable` have some lower-bound resource guarantees based on the request, but
do not require a specific limit. If a limit is not specified, it defaults to a
limit equivalent to the capacity of the Node, which allows the Pods to flexibly increase
their resources if resources are available. In the event of Pod eviction due to Node
resource pressure, these Pods are evicted only after all `BestEffort` Pods are evicted.
Because a `Burstable` Pod can include a Container that has no resource limits or requests, a Pod
that is `Burstable` can try to use any amount of node resources.

#### Criteria

A Pod is given a QoS class of `Burstable` if:

* The Pod does not meet the criteria for QoS class `Guaranteed`.
* At least one Container in the Pod has a memory or CPU request or limit.

### BestEffort

Pods in the `BestEffort` QoS class can use node resources that aren't specifically assigned
to Pods in other QoS classes. For example, if you have a node with 16 CPU cores available to the
kubelet, and you assign 4 CPU cores to a `Guaranteed` Pod, then a Pod in the `BestEffort`
QoS class can try to use any amount of the remaining 12 CPU cores.

The kubelet prefers to evict `BestEffort` Pods if the node comes under resource pressure.

#### Criteria

A Pod has a QoS class of `BestEffort` if it doesn't meet the criteria for either `Guaranteed`
or `Burstable`. In other words, a Pod is `BestEffort` only if none of the Containers in the Pod have a
memory limit or a memory request, and none of the Containers in the Pod have a
CPU limit or a CPU request.
Containers in a Pod can request other resources (not CPU or memory) and still be classified as
`BestEffort`.

## Memory QoS with cgroup v2

{{< feature-state feature_gate_name="MemoryQoS" >}}

Memory QoS uses the memory controller of cgroup v2 to guarantee memory resources in Kubernetes.
Memory requests and limits of containers in pod are used to set specific interfaces `memory.min`
and `memory.high` provided by the memory controller. When `memory.min` is set to memory requests,
memory resources are reserved and never reclaimed by the kernel; this is how Memory QoS ensures
memory availability for Kubernetes pods. And if memory limits are set in the container,
this means that the system needs to limit container memory usage; Memory QoS uses `memory.high`
to throttle workload approaching its memory limit, ensuring that the system is not overwhelmed
by instantaneous memory allocation.

Memory QoS relies on QoS class to determine which settings to apply; however, these are different
mechanisms that both provide controls over quality of service.

## Some behavior is independent of QoS class {#class-independent-behavior}

Certain behavior is independent of the QoS class assigned by Kubernetes. For example:

* Any Container exceeding a resource limit will be killed and restarted by the kubelet without
  affecting other Containers in that Pod.

* If a Container exceeds its resource request and the node it runs on faces
  resource pressure, the Pod it is in becomes a candidate for [eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/).
  If this occurs, all Containers in the Pod will be terminated. Kubernetes may create a
  replacement Pod, usually on a different node.

* The resource request of a Pod is equal to the sum of the resource requests of
  its component Containers, and the resource limit of a Pod is equal to the sum of
  the resource limits of its component Containers.

* The kube-scheduler does not consider QoS class when selecting which Pods to
  [preempt](/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption).
  Preemption can occur when a cluster does not have enough resources to run all the Pods
  you defined.

## {{% heading "whatsnext" %}}

* Learn about [resource management for Pods and Containers](/docs/concepts/configuration/manage-resources-containers/).
* Learn about [Node-pressure eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/).
* Learn about [Pod priority and preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/).
* Learn about [Pod disruptions](/docs/concepts/workloads/pods/disruptions/).
* Learn how to [assign memory resources to containers and pods](/docs/tasks/configure-pod-container/assign-memory-resource/).
* Learn how to [assign CPU resources to containers and pods](/docs/tasks/configure-pod-container/assign-cpu-resource/).
* Learn how to [configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/).
