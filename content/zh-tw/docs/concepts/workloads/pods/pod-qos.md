---
title: Pod QoS 類
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
how Kubernetes assigns a QoS class to each Pod as a consequence of the resource
constraints that you specify for the containers in that Pod. Kubernetes relies on this
classification to make decisions about which Pods to evict when there are not enough
available resources on a Node.
-->
本頁介紹 Kubernetes 中的 **服務質量（Quality of Service，QoS）** 類，
闡述 Kubernetes 如何根據爲 Pod 中的容器指定的資源約束爲每個 Pod 設置 QoS 類。
Kubernetes 依賴這種分類來決定當 Node 上沒有足夠可用資源時要驅逐哪些 Pod。

<!-- body -->

<!--
## Quality of Service classes
-->
## QoS 類   {#qos-class}

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
Kubernetes 對你運行的 Pod 進行分類，並將每個 Pod 分配到特定的 **QoS 類**中。
Kubernetes 使用這種分類來影響不同 Pod 被處理的方式。Kubernetes 基於 Pod
中{{< glossary_tooltip text="容器" term_id="container" >}}的[資源請求](/zh-cn/docs/concepts/configuration/manage-resources-containers/)進行分類，
同時確定這些請求如何與資源限制相關。
這稱爲{{< glossary_tooltip text="服務質量" term_id="qos-class" >}} (QoS) 類。
Kubernetes 基於每個 Pod 中容器的資源請求和限制爲 Pod 設置 QoS 類。Kubernetes 使用 QoS
類來決定從遇到[節點壓力](/zh-cn/docs/concepts/scheduling-eviction/node-pressure-eviction/)的
Node 中驅逐哪些 Pod。可選的 QoS 類有 `Guaranteed`、`Burstable` 和 `BestEffort`。
當一個 Node 耗盡資源時，Kubernetes 將首先驅逐在該 Node 上運行的 `BestEffort` Pod，
然後是 `Burstable` Pod，最後是 `Guaranteed` Pod。當這種驅逐是由於資源壓力時，
只有超出資源請求的 Pod 纔是被驅逐的候選對象。

### Guaranteed

<!--
Pods that are `Guaranteed` have the strictest resource limits and are least likely
to face eviction. They are guaranteed not to be killed until they exceed their limits
or there are no lower-priority Pods that can be preempted from the Node. They may
not acquire resources beyond their specified limits. These Pods can also make
use of exclusive CPUs using the
[`static`](/docs/tasks/administer-cluster/cpu-management-policies/#static-policy) CPU management policy.
-->
`Guaranteed` Pod 具有最嚴格的資源限制，並且最不可能面臨驅逐。
在這些 Pod 超過其自身的限制或者沒有可以從 Node 搶佔的低優先級 Pod 之前，
這些 Pod 保證不會被殺死。這些 Pod 不可以獲得超出其指定 limit 的資源。這些 Pod 也可以使用
[`static`](/zh-cn/docs/tasks/administer-cluster/cpu-management-policies/#static-policy)
CPU 管理策略來使用獨佔的 CPU。

<!--
#### Criteria

For a Pod to be given a QoS class of `Guaranteed`:
-->
#### 判據   {#criteria}

Pod 被賦予 `Guaranteed` QoS 類的幾個判據：

<!--
* Every Container in the Pod must have a memory limit and a memory request.
* For every Container in the Pod, the memory limit must equal the memory request.
* Every Container in the Pod must have a CPU limit and a CPU request.
* For every Container in the Pod, the CPU limit must equal the CPU request.
-->
* Pod 中的每個容器必須有內存 limit 和內存 request。
* 對於 Pod 中的每個容器，內存 limit 必須等於內存 request。
* Pod 中的每個容器必須有 CPU limit 和 CPU request。
* 對於 Pod 中的每個容器，CPU limit 必須等於 CPU request。

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
`Burstable` Pod 有一些基於 request 的資源下限保證，但不需要特定的 limit。
如果未指定 limit，則默認爲其 limit 等於 Node 容量，這允許 Pod 在資源可用時靈活地增加其資源。
在由於 Node 資源壓力導致 Pod 被驅逐的情況下，只有在所有 `BestEffort` Pod 被驅逐後
這些 Pod 纔會被驅逐。因爲 `Burstable` Pod 可以包括沒有資源 limit 或資源 request 的容器，
所以 `Burstable` Pod 可以嘗試使用任意數量的節點資源。

<!--
#### Criteria

A Pod is given a QoS class of `Burstable` if:

* The Pod does not meet the criteria for QoS class `Guaranteed`.
* At least one Container in the Pod has a memory or CPU request or limit.
-->
#### 判據   {#criteria-1}

Pod 被賦予 `Burstable` QoS 類的幾個判據：

* Pod 不滿足針對 QoS 類 `Guaranteed` 的判據。
* Pod 中至少一個容器有內存或 CPU 的 request 或 limit。

### BestEffort

<!--
Pods in the `BestEffort` QoS class can use node resources that aren't specifically assigned
to Pods in other QoS classes. For example, if you have a node with 16 CPU cores available to the
kubelet, and you assign 4 CPU cores to a `Guaranteed` Pod, then a Pod in the `BestEffort`
QoS class can try to use any amount of the remaining 12 CPU cores.

The kubelet prefers to evict `BestEffort` Pods if the node comes under resource pressure.
-->
`BestEffort` QoS 類中的 Pod 可以使用未專門分配給其他 QoS 類中的 Pod 的節點資源。
例如若你有一個節點有 16 核 CPU 可供 kubelet 使用，並且你將 4 核 CPU 分配給一個 `Guaranteed` Pod，
那麼 `BestEffort` QoS 類中的 Pod 可以嘗試任意使用剩餘的 12 核 CPU。

如果節點遇到資源壓力，kubelet 將優先驅逐 `BestEffort` Pod。

<!--
#### Criteria

A Pod has a QoS class of `BestEffort` if it doesn't meet the criteria for either `Guaranteed`
or `Burstable`. In other words, a Pod is `BestEffort` only if none of the Containers in the Pod have a
memory limit or a memory request, and none of the Containers in the Pod have a
CPU limit or a CPU request.
Containers in a Pod can request other resources (not CPU or memory) and still be classified as
`BestEffort`.
-->
#### 判據   {#criteria-2}

如果 Pod 不滿足 `Guaranteed` 或 `Burstable` 的判據，則它的 QoS 類爲 `BestEffort`。
換言之，只有當 Pod 中的所有容器沒有內存 limit 或內存 request，也沒有 CPU limit 或
CPU request 時，Pod 纔是 `BestEffort`。Pod 中的容器可以請求（除 CPU 或內存之外的）
其他資源並且仍然被歸類爲 `BestEffort`。

<!--
## Memory QoS with cgroup v2
-->
## 使用 cgroup v2 的內存 QoS   {#memory-qos-with-cgroup-v2}

{{< feature-state feature_gate_name="MemoryQoS" >}}

<!--
Memory QoS uses the memory controller of cgroup v2 to guarantee memory resources in Kubernetes.
Memory requests and limits of containers in pod are used to set specific interfaces `memory.min`
and `memory.high` provided by the memory controller. When `memory.min` is set to memory requests,
memory resources are reserved and never reclaimed by the kernel; this is how Memory QoS ensures
memory availability for Kubernetes pods. And if memory limits are set in the container,
this means that the system needs to limit container memory usage; Memory QoS uses `memory.high`
to throttle workload approaching its memory limit, ensuring that the system is not overwhelmed
by instantaneous memory allocation.
-->
內存 QoS 使用 cgroup v2 的內存控制器來保證 Kubernetes 中的內存資源。
Pod 中容器的內存請求和限制用於設置由內存控制器所提供的特定接口 `memory.min` 和 `memory.high`。
當 `memory.min` 被設置爲內存請求時，內存資源被保留並且永遠不會被內核回收；
這就是內存 QoS 確保 Kubernetes Pod 的內存可用性的方式。而如果容器中設置了內存限制，
這意味着系統需要限制容器內存的使用；內存 QoS 使用 `memory.high` 來限制接近其內存限制的工作負載，
確保系統不會因瞬時內存分配而不堪重負。

<!--
Memory QoS relies on QoS class to determine which settings to apply; however, these are different
mechanisms that both provide controls over quality of service.
-->
內存 QoS 依賴於 QoS 類來確定應用哪些設置；它們的機制不同，但都提供對服務質量的控制。

<!--
## Some behavior is independent of QoS class {#class-independent-behavior}

Certain behavior is independent of the QoS class assigned by Kubernetes. For example:
-->
## 某些行爲獨立於 QoS 類 {#class-independent-behavior}

某些行爲獨立於 Kubernetes 分配的 QoS 類。例如：

<!--
* Any Container exceeding a resource limit will be killed and restarted by the kubelet without
  affecting other Containers in that Pod.
* If a Container exceeds its resource request and the node it runs on faces
  resource pressure, the Pod it is in becomes a candidate for [eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/).
  If this occurs, all Containers in the Pod will be terminated. Kubernetes may create a
  replacement Pod, usually on a different node.
-->
* 所有超過資源 limit 的容器都將被 kubelet 殺死並重啓，而不會影響該 Pod 中的其他容器。
* 如果一個容器超出了自身的資源 request，且該容器運行的節點面臨資源壓力，則該容器所在的 Pod
  就會成爲被[驅逐](/zh-cn/docs/concepts/scheduling-eviction/node-pressure-eviction/)的候選對象。
  如果出現這種情況，Pod 中的所有容器都將被終止。Kubernetes 通常會在不同的節點上創建一個替代的 Pod。
<!--
* The resource request of a Pod is equal to the sum of the resource requests of
  its component Containers, and the resource limit of a Pod is equal to the sum of
  the resource limits of its component Containers.
* The kube-scheduler does not consider QoS class when selecting which Pods to
  [preempt](/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption).
  Preemption can occur when a cluster does not have enough resources to run all the Pods
  you defined.
-->
* Pod 的資源 request 等於其成員容器的資源 request 之和，Pod 的資源 limit 等於其成員容器的資源 limit 之和。
* kube-scheduler 在選擇要[搶佔](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption)的
  Pod 時不考慮 QoS 類。當集羣沒有足夠的資源來運行你所定義的所有 Pod 時，就會發生搶佔。

## {{% heading "whatsnext" %}}

<!--
* Learn about [resource management for Pods and Containers](/docs/concepts/configuration/manage-resources-containers/).
* Learn about [Node-pressure eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/).
* Learn about [Pod priority and preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/).
* Learn about [Pod disruptions](/docs/concepts/workloads/pods/disruptions/).
* Learn how to [assign memory resources to containers and pods](/docs/tasks/configure-pod-container/assign-memory-resource/).
* Learn how to [assign CPU resources to containers and pods](/docs/tasks/configure-pod-container/assign-cpu-resource/).
* Learn how to [configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/).
-->
* 進一步瞭解[爲 Pod 和容器管理資源](/zh-cn/docs/concepts/configuration/manage-resources-containers/)。
* 進一步瞭解[節點壓力驅逐](/zh-cn/docs/concepts/scheduling-eviction/node-pressure-eviction/)。
* 進一步瞭解 [Pod 優先級和搶佔](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)。
* 進一步瞭解 [Pod 干擾](/zh-cn/docs/concepts/workloads/pods/disruptions/)。
* 進一步瞭解如何[爲容器和 Pod 分配內存資源](/zh-cn/docs/tasks/configure-pod-container/assign-memory-resource/)。
* 進一步瞭解如何[爲容器和 Pod 分配 CPU 資源](/zh-cn/docs/tasks/configure-pod-container/assign-cpu-resource/)。
* 進一步瞭解如何[配置 Pod 的服務質量](/zh-cn/docs/tasks/configure-pod-container/quality-service-pod/)。
