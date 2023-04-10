---
title: Pod QoS 类
content_type: concept
weight: 85
---
<!--
title: Pod Quality of Service Classes
content_type: concept
weight: 85
-->

<!-- overview -->

<!--
This page introduces _Quality of Service (QoS) classes_ in Kubernetes, and explains
how Kubernetes assigns a QoS class to each Pods as a consequence of the resource
constraints that you specify for the containers in that Pod. Kubernetes relies on this
classification to make decisions about which Pods to evict when there are not enough
available resources on a Node.
-->
本页介绍 Kubernetes 中的 **服务质量（Quality of Service，QoS）** 类，
阐述 Kubernetes 如何根据为 Pod 中的容器指定的资源约束为每个 Pod 设置 QoS 类。
Kubernetes 依赖这种分类来决定当 Node 上没有足够可用资源时要驱逐哪些 Pod。

<!-- body -->

<!--
## Quality of Service classes
-->
## QoS 类   {#qos-class}

<!--
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
-->
Kubernetes 对你运行的 Pod 进行分类，并将每个 Pod 分配到特定的 **QoS 类**中。
Kubernetes 使用这种分类来影响不同 Pod 被处理的方式。Kubernetes 基于 Pod
中{{< glossary_tooltip text="容器" term_id="container" >}}的[资源请求](/zh-cn/docs/concepts/configuration/manage-resources-containers/)进行分类，
同时确定这些请求如何与资源限制相关。
这称为{{< glossary_tooltip text="服务质量" term_id="qos-class" >}} (QoS) 类。
Kubernetes 基于每个 Pod 中容器的资源请求和限制为 Pod 设置 QoS 类。Kubernetes 使用 QoS
类来决定从遇到[节点压力](/zh-cn/docs/concepts/scheduling-eviction/node-pressure-eviction/)的
Node 中驱逐哪些 Pod。可选的 QoS 类有 `Guaranteed`、`Burstable` 和 `BestEffort`。
当一个 Node 耗尽资源时，Kubernetes 将首先驱逐在该 Node 上运行的 `BestEffort` Pod，
然后是 `Burstable` Pod，最后是 `Guaranteed` Pod。当这种驱逐是由于资源压力时，
只有超出资源请求的 Pod 才是被驱逐的候选对象。

### Guaranteed

<!--
Pods that are `Guaranteed` have the strictest resource limits and are least likely
to face eviction. They are guaranteed not to be killed until they exceed their limits
or there are no lower-priority Pods that can be preempted from the Node. They may
not acquire resources beyond their specified limits. These Pods can also make
use of exclusive CPUs using the
[`static`](/docs/tasks/administer-cluster/cpu-management-policies/#static-policy) CPU management policy.
-->
`Guaranteed` Pod 具有最严格的资源限制，并且最不可能面临驱逐。
在这些 Pod 超过其自身的限制或者从 Node 上没有可以抢占的低优先级 Pod 之前，
这些 Pod 保证不会被杀死。这些 Pod 不可以获得超出其指定 limit 的资源。这些 Pod 也可以使用
[`static`](/zh-cn/docs/tasks/administer-cluster/cpu-management-policies/#static-policy)
CPU 管理策略来使用独占的 CPU。

<!--
#### Criteria

For a Pod to be given a QoS class of `Guaranteed`:
-->
#### 判据

Pod 被赋予 `Guaranteed` QoS 类的几个判据：

<!--
* Every Container in the Pod must have a memory limit and a memory request.
* For every Container in the Pod, the memory limit must equal the memory request.
* Every Container in the Pod must have a CPU limit and a CPU request.
* For every Container in the Pod, the CPU limit must equal the CPU request.
-->
* Pod 中的每个容器必须有内存 limit 和内存 request。
* 对于 Pod 中的每个容器，内存 limit 必须等于内存 request。
* Pod 中的每个容器必须有 CPU limit 和 CPU request。
* 对于 Pod 中的每个容器，CPU limit 必须等于 CPU request。

### Burstable

<!--
Pods that are `Burstable` have some lower-bound resource guarantees based on the request, but
do not require a specific limit. If a limit is not specified, it defaults to a
limit equivalent to the capacity of the Node, which allows the Pods to flexibly increase
their resources if resources are available. In the event of Pod eviction due to Node
resource pressure, these Pods are evicted only after all `BestEffort` Pods are evicted.
Because a `Burstable` Pod can include a Container that has no resource limits or requests, a Pod
that is `Burstable` can try to use any amount of node resources.
-->
`Burstable` Pod 有一些基于 request 的资源下限保证，但不需要特定的 limit。
如果未指定 limit，则默认为其 limit 等于 Node 容量，这允许 Pod 在资源可用时灵活地增加其资源。
在由于 Node 资源压力导致 Pod 被驱逐的情况下，只有在所有 `BestEffort` Pod 被驱逐后
这些 Pod 才会被驱逐。因为 `Burstable` Pod 可以包括没有资源 limit 或资源 request 的容器，
所以 `Burstable` Pod 可以尝试使用任意数量的节点资源。

<!--
#### Criteria

A Pod is given a QoS class of `Burstable` if:

* The Pod does not meet the criteria for QoS class `Guaranteed`.
* At least one Container in the Pod has a memory or CPU request or limit.
-->
#### 判据

Pod 被赋予 `Burstable` QoS 类的几个判据：

* Pod 不满足针对 QoS 类 `Guaranteed` 的判据。
* Pod 中至少一个容器有内存或 CPU request 或 limit。

### BestEffort

<!--
Pods in the `BestEffort` QoS class can use node resources that aren't specifically assigned
to Pods in other QoS classes. For example, if you have a node with 16 CPU cores available to the
kubelet, and you assign 4 CPU cores to a `Guaranteed` Pod, then a Pod in the `BestEffort`
QoS class can try to use any amount of the remaining 12 CPU cores.

The kubelet prefers to evict `BestEffort` Pods if the node comes under resource pressure.
-->
`BestEffort` QoS 类中的 Pod 可以使用未专门分配给其他 QoS 类中的 Pod 的节点资源。
例如若你有一个节点有 16 核 CPU 可供 kubelet 使用，并且你将 4 核 CPU 分配给一个 `Guaranteed` Pod，
那么 `BestEffort` QoS 类中的 Pod 可以尝试任意使用剩余的 12 核 CPU。

如果节点遇到资源压力，kubelet 将优先驱逐 `BestEffort` Pod。

<!--
#### Criteria

A Pod has a QoS class of `BestEffort` if it doesn't meet the criteria for either `Guaranteed`
or `Burstable`. In other words, a Pod is `BestEffort` only if none of the Containers in the Pod have a
memory limit or a memory request, and none of the Containers in the Pod have a
CPU limit or a CPU request.
Containers in a Pod can request other resources (not CPU or memory) and still be classified as
`BestEffort`.
-->
#### 判据

如果 Pod 不满足 `Guaranteed` 或 `Burstable` 的判据，则它的 QoS 类为 `BestEffort`。
换言之，只有当 Pod 中的所有容器没有内存 limit 或内存 request，也没有 CPU limit 或
CPU request 时，Pod 才是 `BestEffort`。Pod 中的容器可以请求（除 CPU 或内存之外的）
其他资源并且仍然被归类为 `BestEffort`。

<!--
## Some behavior is independent of QoS class {#class-independent-behavior}

Certain behavior is independent of the QoS class assigned by Kubernetes. For example:
-->
## 某些行为独立于 QoS 类 {#class-independent-behavior}

某些行为独立于 Kubernetes 分配的 QoS 类。例如：

<!--
* Any Container exceeding a resource limit will be killed and restarted by the kubelet without
  affecting other Containers in that Pod.
* If a Container exceeds its resource request and the node it runs on faces
  resource pressure, the Pod it is in becomes a candidate for [eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/).
  If this occurs, all Containers in the Pod will be terminated. Kubernetes may create a
  replacement Pod, usually on a different node.
-->
* 所有超过资源 limit 的容器都将被 kubelet 杀死并重启，而不会影响该 Pod 中的其他容器。
* 如果一个容器超出了自身的资源 request，且该容器运行的节点面临资源压力，则该容器所在的 Pod
  就会成为被[驱逐](/zh-cn/docs/concepts/scheduling-eviction/node-pressure-eviction/)的候选对象。
  如果出现这种情况，Pod 中的所有容器都将被终止。Kubernetes 通常会在不同的节点上创建一个替代的 Pod。
<!--
* The resource request of a Pod is equal to the sum of the resource requests of
  its component Containers, and the resource limit of a Pod is equal to the sum of
  the resource limits of its component Containers.
* The kube-scheduler does not consider QoS class when selecting which Pods to
  [preempt](/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption).
  Preemption can occur when a cluster does not have enough resources to run all the Pods
  you defined.
-->
* Pod 的资源 request 等于其成员容器的资源 request 之和，Pod 的资源 limit 等于其组成容器的资源 limit 之和。
* kube-scheduler 在选择要[抢占](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption)的
  Pod 时不考虑 QoS 类。当集群没有足够的资源来运行你所定义的所有 Pod 时，就会发生抢占。

## {{% heading "whatsnext" %}}

<!--
* Learn about [resource management for Pods and Containers](/docs/concepts/configuration/manage-resources-containers/).
* Learn about [Node-pressure eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/).
* Learn about [Pod priority and preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/).
* Learn about [Pod disruptions](/docs/concepts/workload/pods/disruptions/).
* Learn how to [assign memory resources to containers and pods](/docs/tasks/configure-pod-container/assign-memory-resource/).
* Learn how to [assign CPU resources to containers and pods](/docs/tasks/configure-pod-container/assign-cpu-resource/).
* Learn how to [configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/).
-->
* 进一步了解[为 Pod 和容器管理资源](/zh-cn/docs/concepts/configuration/manage-resources-containers/)。
* 进一步了解[节点压力驱逐](/zh-cn/docs/concepts/scheduling-eviction/node-pressure-eviction/)。
* 进一步了解 [Pod 优先级和抢占](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)。
* 进一步了解 [Pod 干扰](/zh-cn/docs/concepts/workloads/pods/disruptions/)。
* 进一步了解如何[为容器和 Pod 分配内存资源](/zh-cn/docs/tasks/configure-pod-container/assign-memory-resource/)。
* 进一步了解如何[为容器和 Pod 分配 CPU 资源](/zh-cn/docs/tasks/configure-pod-container/assign-cpu-resource/)。
* 进一步了解如何[配置 Pod 的服务质量](/zh-cn/docs/tasks/configure-pod-container/quality-service-pod/)。
