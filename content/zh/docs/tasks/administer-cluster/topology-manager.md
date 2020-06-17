---
title: 控制节点上的拓扑管理策略
reviewers:
- ConnorDoyle
- klueska
- lmdaly
- nolancon

content_type: task
---
<!--
---
title: Control Topology Management Policies on a node
reviewers:
- ConnorDoyle
- klueska
- lmdaly
- nolancon

content_type: task
---
-->

<!-- overview -->

{{< feature-state state="alpha" >}}

<!--
An increasing number of systems leverage a combination of CPUs and hardware accelerators to support latency-critical execution and high-throughput parallel computation. These include workloads in fields such as telecommunications, scientific computing, machine learning, financial services and data analytics. Such hybrid systems comprise a high performance environment.
-->
越来越多的系统利用 CPU 和硬件加速器的组合来支持对延迟要求较高的任务和高吞吐量的并行计算。
这类负载包括电信、科学计算、机器学习、金融服务和数据分析等。
此类混合系统即用于构造这些高性能环境。

<!--
In order to extract the best performance, optimizations related to CPU isolation, memory and device locality are required. However, in Kubernetes, these optimizations are handled by a disjoint set of components.
-->
为了获得最佳性能，需要进行与 CPU 隔离、内存和设备局部性有关的优化。
但是，在 Kubernetes 中，这些优化由各自独立的组件集合来处理。

<!--
_Topology Manager_ is a Kubelet component that aims to co-ordinate the set of components that are responsible for these optimizations.
-->
_拓扑管理器（Topology Manager）_ 是一个 Kubelet 的一部分，旨在协调负责这些优化的一组组件。



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

<!--
## How Topology Manager Works
-->
## 拓扑管理器如何工作

<!--
Prior to the introduction of Topology Manager, the CPU and Device Manager in Kubernetes make resource allocation decisions independently of each other.
This can result in undesirable allocations on multiple-socketed systems, performance/latency sensitive applications will suffer due to these undesirable allocations. 
 Undesirable in this case meaning for example, CPUs and devices being allocated from different NUMA Nodes thus, incurring additional latency.
-->
在引入拓扑管理器之前， Kubernetes 中的 CPU 和设备管理器相互独立地做出资源分配决策。
这可能会导致在多处理系统上出现并非期望的资源分配；由于这些与期望相左的分配，对性能或延迟敏感的应用将受到影响。
这里的不符合期望意指，例如， CPU 和设备是从不同的 NUMA 节点分配的，因此会导致额外的延迟。

<!--
The Topology Manager is a Kubelet component, which acts as a source of truth so that other Kubelet components can make topology aligned resource allocation choices.
-->
拓扑管理器是一个 Kubelet 组件，扮演信息源的角色，以便其他 Kubelet 组件可以做出与拓扑结构相对应的资源分配决定。

<!--
The Topology Manager provides an interface for components, called *Hint Providers*, to send and receive topology information. Topology Manager has a set of node level policies which are explained below.
-->
拓扑管理器为组件提供了一个称为 *建议供应者（Hint Providers）* 的接口，以发送和接收拓扑信息。
拓扑管理器具有一组节点级策略，具体说明如下。

<!--
The Topology manager receives Topology information from the *Hint Providers* as a bitmask denoting NUMA Nodes available and a preferred allocation indication. The Topology Manager policies perform a set of operations on the hints provided and converge on the hint determined by the policy to give the optimal result, if an undesirable hint is stored the preferred field for the hint will be set to false. In the current policies preferred is the narrowest preferred mask.
The selected hint is stored as part of the Topology Manager. Depending on the policy configured the pod can be accepted or rejected from the node based on the selected hint.
The hint is then stored in the Topology Manager for use by the *Hint Providers* when making the resource allocation decisions.
-->
拓扑管理器从 *建议提供者* 接收拓扑信息，作为表示可用的 NUMA 节点和首选分配指示的位掩码。
拓扑管理器策略对所提供的建议执行一组操作，并根据策略对提示进行约减以得到最优解；如果存储了与预期不符的建议，则该建议的优选字段将被设置为 false。
在当前策略中，首选的是最窄的优选掩码。
所选建议将被存储为拓扑管理器的一部分。
取决于所配置的策略，所选建议可用来决定节点接受或拒绝 Pod 。
之后，建议会被存储在拓扑管理器中，供 *建议提供者* 进行资源分配决策时使用。

<!--
### Topology Manager Policies
-->
### 拓扑管理器策略

<!--
The Topology Manager currently:
-->
当前拓扑管理器：

<!--
 - Works on Nodes with the `static` CPU Manager Policy enabled. See [control CPU Management Policies](/docs/tasks/administer-cluster/cpu-management-policies/)
 - Works on Pods making CPU requests or Device requests via extended resources
-->
- 在启用了 `static` CPU 管理器策略的节点上起作用。 请参阅[控制 CPU 管理策略](/docs/tasks/administer-cluster/cpu-management-policies/)
- 适用于通过扩展资源发出 CPU 请求或设备请求的 Pod

<!--
If these conditions are met, Topology Manager will align the requested resources.
-->
如果满足这些条件，则拓扑管理器将调整请求的资源。

<!--
Topology Manager supports four allocation policies. You can set a policy via a Kubelet flag, `--topology-manager-policy`.
There are four supported policies:
-->
拓扑管理器支持四种分配策略。
您可以通过 Kubelet 标志 `--topology-manager-policy` 设置策略。
所支持的策略有四种：

<!--
* `none` (default)
* `best-effort`
* `restricted`
* `single-numa-node`
-->
* `none` (默认)
* `best-effort`
* `restricted`
* `single-numa-node`

<!--
### none policy {#policy-none}
-->
### none 策略 {#policy-none}

<!--
This is the default policy and does not perform any topology alignment.
-->
这是默认策略，不执行任何拓扑对齐。

<!--
### best-effort policy {#policy-best-effort}
-->
### best-effort 策略 {#policy-best-effort}

<!--
For each container in a Guaranteed Pod, kubelet, with `best-effort` topology 
management policy, calls each Hint Provider to discover their resource availability.
Using this information, the Topology Manager stores the 
preferred NUMA Node affinity for that container. If the affinity is not preferred, 
Topology Manager will store this and admit the pod to the node anyway.
-->
对于 Guaranteed 类的 Pod 中的每个容器，具有 `best-effort` 拓扑管理策略的 kubelet 将调用每个建议提供者以确定资源可用性。
使用此信息，拓扑管理器存储该容器的首选 NUMA 节点亲和性。
如果亲和性不是首选，则拓扑管理器将存储该亲和性，并且无论如何都将  pod 接纳到该节点。

<!--
The *Hint Providers* can then use this information when making the 
resource allocation decision.
-->
之后 *建议提供者* 可以在进行资源分配决策时使用这个信息。

<!--
### restricted policy {#policy-restricted}
-->
### restricted 策略 {#policy-restricted}

<!--
For each container in a Guaranteed Pod, kubelet, with `restricted` topology 
management policy, calls each Hint Provider to discover their resource availability.
Using this information, the Topology Manager stores the 
preferred NUMA Node affinity for that container. If the affinity is not preferred, 
Topology Manager will reject this pod from the node. This will result in a pod in a `Terminated` state with a pod admission failure.
-->
对于 Guaranteed 类 Pod 中的每个容器， 配置了 `restricted` 拓扑管理策略的 kubelet 调用每个建议提供者以确定其资源可用性。。
使用此信息，拓扑管理器存储该容器的首选 NUMA 节点亲和性。
如果亲和性不是首选，则拓扑管理器将从节点中拒绝此 Pod 。
这将导致 Pod 处于 `Terminated` 状态，且 Pod 无法被节点接纳。

<!--
Once the pod is in a `Terminated` state, the Kubernetes scheduler will **not** attempt to reschedule the pod. It is recommended to use a ReplicaSet or Deployment to trigger a redeploy of the pod.
An external control loop could be also implemented to trigger a redeployment of pods that have the `Topology Affinity` error.
-->
一旦 Pod 处于 `Terminated` 状态，Kubernetes 调度器将不会尝试重新调度该 Pod。建议使用 ReplicaSet 或者 Deployment 来重新部署 Pod。
还可以通过实现外部控制环，以启动对具有 `Topology Affinity` 错误的 Pod 的重新部署。

<!--
If the pod is admitted, the *Hint Providers* can then use this information when making the 
resource allocation decision.
-->
如果 Pod 被允许运行在该节点，则 *建议提供者* 可以在做出资源分配决定时使用此信息。

<!--
### single-numa-node policy {#policy-single-numa-node}
-->
### single-numa-node 策略 {#policy-single-numa-node}

<!--
For each container in a Guaranteed Pod, kubelet, with `single-numa-node` topology 
management policy, calls each Hint Provider to discover their resource availability.
Using this information, the Topology Manager determines if a single NUMA Node affinity is possible.
If it is, Topology Manager will store this and the *Hint Providers* can then use this information when making the 
resource allocation decision.
If, however, this is not possible then the Topology Manager will reject the pod from the node. This will result in a pod in a `Terminated` state with a pod admission failure.
-->
对于 Guaranteed 类 Pod 中的每个容器， 配置了 `single-numa-nodde` 拓扑管理策略的 kubelet 调用每个建议提供者以确定其资源可用性。
使用此信息，拓扑管理器确定单 NUMA 节点亲和性是否可能。
如果是这样，则拓扑管理器将存储此信息，然后 *建议提供者* 可以在做出资源分配决定时使用此信息。
如果不可能，则拓扑管理器将拒绝 Pod 运行于该节点。
这将导致 Pod 处于 `Terminated` 状态，且 Pod 无法被节点接受。

<!--
Once the pod is in a `Terminated` state, the Kubernetes scheduler will **not** attempt to reschedule the pod. It is recommended to use a Deployment with replicas to trigger a redeploy of the Pod.
An external control loop could be also implemented to trigger a redeployment of pods that have the `Topology Affinity` error.
-->
一旦 Pod 处于 `Terminated` 状态，Kubernetes 调度器将不会尝试重新调度该 Pod。建议使用 ReplicaSet 或者 Deployment 来重新部署 Pod。
还可以通过实现外部控制环，以触发具有 `Topology Affinity` 错误的 Pod 的重新部署。

<!--
### Pod Interactions with Topology Manager Policies
-->
### Pod 与拓扑管理器策略的交互

<!--
Consider the containers in the following pod specs:
-->
考虑以下 pod 规范中的容器：

```yaml
spec:
  containers:
  - name: nginx
    image: nginx
```

<!--
This pod runs in the `BestEffort` QoS class because no resource `requests` or
`limits` are specified.
-->
该 Pod 在 `BestEffort` QoS 类中运行，因为没有指定资源 `requests` 或 `limits` 。

```yaml
spec:
  containers:
  - name: nginx
    image: nginx
    resources:
      limits:
        memory: "200Mi"
      requests:
        memory: "100Mi"
```

<!--
This pod runs in the `Burstable` QoS class because requests are less than limits.
-->
由于 requests 数少于 limits，因此该 Pod 以 `Burstable` QoS 类运行。

<!--
If the selected policy is anything other than `none` , Topology Manager would not consider either of these Pod
specifications. 
-->
如果选择的策略是 `none` 以外的任何其他策略，拓扑管理器不会考虑这些 Pod 中的任何一个规范。


```yaml
spec:
  containers:
  - name: nginx
    image: nginx
    resources:
      limits:
        memory: "200Mi"
        cpu: "2"
        example.com/device: "1"
      requests:
        memory: "200Mi"
        cpu: "2"
        example.com/device: "1"
```

<!--
This pod runs in the `Guaranteed` QoS class because `requests` are equal to `limits`.
-->
此 Pod 在 `Guaranteed` QoS 类中运行，因为其 `requests` 值等于 `limits` 值。


```yaml
spec:
  containers:
  - name: nginx
    image: nginx
    resources:
      limits:
        example.com/deviceA: "1"
        example.com/deviceB: "1"
      requests:
        example.com/deviceA: "1"
        example.com/deviceB: "1"
```
<!--
This pod runs in the `BestEffort` QoS class because there are no CPU and memory requests.
-->
由于没有 CPU 和内存请求，因此该 Pod 在 `BestEffort` QoS 类中运行。

<!--
The Topology Manager would consider both of the above pods. The Topology Manager would consult the Hint Providers, which are CPU and Device Manager to get topology hints for the pods. 
In the case of the `Guaranteed` pod the `static` CPU Manager policy would return hints relating to the CPU request and the Device Manager would send back hints for the requested device.
-->
拓扑管理器将考虑以上两个 Pod。拓扑管理器将咨询 CPU 和设备管理器，以获取 Pod 的拓扑提示。
对于 `Guaranteed` Pod，`static` CPU 管理器策略将返回与 CPU 请求有关的提示，而设备管理器将返回有关所请求设备的提示。

<!--
In the case of the `BestEffort` pod the CPU Manager would send back the default hint as there is no CPU request and the Device Manager would send back the hints for each of the requested devices.
-->
对于 `BestEffort` Pod，由于没有 CPU 请求，CPU 管理器将发送默认提示，而设备管理器将为每个请求的设备发送提示。

<!--
Using this information the Topology Manager calculates the optimal hint for the pod and stores this information, which will be used by the Hint Providers when they are making their resource assignments.
-->
使用此信息，拓扑管理器将为 Pod 计算最佳提示并存储该信息，并且供提示提供程序在进行资源分配时使用。

<!--
### Known Limitations
-->
### 已知的局限性
<!--
1. As of K8s 1.16 the Topology Manager is currently only guaranteed to work if a *single* container in the pod spec requires aligned resources. This is due to the hint generation being based on current resource allocations, and all containers in a pod generate hints before any resource allocation has been made. This results in unreliable hints for all but the first container in a pod.
*Due to this limitation if multiple pods/containers are considered by Kubelet in quick succession they may not respect the Topology Manager policy.
-->
1. 从 K8s 1.16 开始，当前只能在保证 Pod 规范中的 *单个* 容器需要相匹配的资源时，拓扑管理器才能正常工作。这是由于生成的提示信息是基于当前资源分配的，并且 pod 中的所有容器都会在进行任何资源分配之前生成提示信息。这样会导致除 Pod 中的第一个容器以外的所有容器生成不可靠的提示信息。
* 由于此限制，如果 kubelet 快速连续考虑多个 Pod/容器，它们可能不遵守拓扑管理器策略。

<!--
2. The maximum number of NUMA nodes that Topology Manager will allow is 8, past this there will be a state explosion when trying to enumerate the possible NUMA affinities and generating their hints.
-->
2. 拓扑管理器允许的最大 NUMA 节点数为 8，并且在尝试枚举可能的 NUMA 关联并生成其提示信息时，将出现状态问题。

<!--
3. The scheduler is not topology-aware, so it is possible to be scheduled on a node and then fail on the node due to the Topology Manager.
-->
3. 调度器不支持拓扑功能，因此可能会由于拓扑管理器的原因而在节点上进行调度，然后在该节点上调度失败。



