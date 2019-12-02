---
title: 控制节点上的拓扑管理策略
reviewers:
- ConnorDoyle
- klueska
- lmdaly
- nolancon

content_template: templates/task
---
<!--
---
title: Control Topology Management Policies on a node
reviewers:
- ConnorDoyle
- klueska
- lmdaly
- nolancon

content_template: templates/task
---
-->

{{% capture overview %}}

{{< feature-state state="alpha" >}}

<!--
An increasing number of systems leverage a combination of CPUs and hardware accelerators to support latency-critical execution and high-throughput parallel computation. These include workloads in fields such as telecommunications, scientific computing, machine learning, financial services and data analytics. Such hybrid systems comprise a high performance environment.
-->
越来越多的系统利用 CPU 和硬件加速器的组合来支持关键延迟的执行和高吞吐量并行计算。
其中包括电信，科学计算，机器学习，金融服务和数据分析等领域的工作量。
这样的混合系统包括高性能环境。

<!--
In order to extract the best performance, optimizations related to CPU isolation, memory and device locality are required. However, in Kubernetes, these optimizations are handled by a disjoint set of components.
-->
为了获得最佳性能，需要进行与 CPU 隔离，内存和设备位置有关的优化。
但是，在 Kubernetes 中，这些优化由不相交的组件集处理。

<!--
_Topology Manager_ is a Kubelet component that aims to co-ordinate the set of components that are responsible for these optimizations.
-->
_Topology Manager_ 是一个 Kubelet 组件，旨在协调负责这些优化的一组组件。

{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}

{{% capture steps %}}

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
这可能会导致在多插槽系统上进行不合需要多分配，由于这些不合要求的分配，性能/等待时间敏感的应用程序将受到影响。
在这种不希望的情况下，例如， CPU 和设备是从不同的 NUMA 节点分配的，因此会导致额外的延迟。

<!--
The Topology Manager is a Kubelet component, which acts as a source of truth so that other Kubelet components can make topology aligned resource allocation choices.
-->
拓扑管理器是一个 Kubelet 组件，它充当真理的来源，因此其他 Kubelet 组件可以做出与拓扑对齐的资源分配选择。

<!--
The Topology Manager provides an interface for components, called *Hint Providers*, to send and receive topology information. Topology Manager has a set of node level policies which are explained below.
-->
拓扑管理器为组件提供了一个称为 *Hint Providers* 的接口，以发送和接收拓扑信息。
拓扑管理器具有一组节点级策略，下面对此进行说明。

<!--
The Topology manager receives Topology information from the *Hint Providers* as a bitmask denoting NUMA Nodes available and a preferred allocation indication. The Topology Manager policies perform a set of operations on the hints provided and converge on the hint determined by the policy to give the optimal result, if an undesirable hint is stored the preferred field for the hint will be set to false. In the current policies preferred is the narrowest preferred mask.
The selected hint is stored as part of the Topology Manager. Depending on the policy configured the pod can be accepted or rejected from the node based on the selected hint.
The hint is then stored in the Topology Manager for use by the *Hint Providers* when making the resource allocation decisions.
-->
拓扑管理器从 *Hint Providers* 接收拓扑信息，作为表示 NUMA 可用节点和首选分配指示的位掩码。
拓扑管理器策略对提供的提示执行一组操作，并汇集策略确定的提示以提供最佳结果，如果存储了不希望的提示，则该提示的首选字段将设置为 false。
在当前策略中，首选的是最窄的首选掩码。
所选提示将存储为拓扑管理器的一部分。
根据配置的策略，可以根据所选提示从节点接受或拒绝 pod 。
提示然后存储在拓扑管理器中，供 *Hint Providers* 进行资源分配决策时使用。

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
 - Works on Pods in the `Guaranteed` {{< glossary_tooltip text="QoS class" term_id="qos-class" >}}
-->
- 在启用了 `静态` CPU 管理器策略的节点上工作。 请参阅 [控制 CPU 管理策略](/docs/tasks/administer-cluster/cpu-management-policies/)
- 在 `保证` 的 pod 上工作 {{< glossary_tooltip text="QoS class" term_id="qos-class" >}}

<!--
If these conditions are met, Topology Manager will align CPU and device requests.
-->
如果满足这些条件，则拓扑管理器将调整 CPU 和设备请求。

<!--
Topology Manager supports four allocation policies. You can set a policy via a Kubelet flag, `--topology-manager-policy`.
There are four supported policies:
-->
拓扑管理器支持四种分配策略。
您可以通过 Kubelet 标志 `--topology-manager-policy` 设置策略。
有四种受支持的策略：

<!--
* `none` (default)
* `best-effort`
* `restricted`
* `single-numa-node`
-->
* `none` (默认)
* `best-effort`
* `限制`
* `单节点数`

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
对于有保证的 Pod 中的每个容器，具有 `best-effort` 拓扑管理策略的 kubelet 调用每个提示提供程序以发现其资源可用性。
使用此信息，拓扑管理器存储该容器的首选 NUMA 节点亲和性。
如果亲和性不是首选，则拓扑管理器将存储该亲和性，并且无论如何都将  pod 接纳到该节点。

<!--
The *Hint Providers* can then use this information when making the 
resource allocation decision.
-->
然后 *Hint Providers* 可以在进行资源分配决策时使用这个信息。

<!--
### restricted policy {#policy-restricted}
-->
### 限制策略 {#policy-restricted}

<!--
For each container in a Guaranteed Pod, kubelet, with `restricted` topology 
management policy, calls each Hint Provider to discover their resource availability.
Using this information, the Topology Manager stores the 
preferred NUMA Node affinity for that container. If the affinity is not preferred, 
Topology Manager will reject this pod from the node. This will result in a pod in a `Terminated` state with a pod admission failure.
-->
对于保证 Pod 中的每个容器， kubelet 具有 `受限` 拓扑管理策略，调用每个提示提供程序以发现其资源可用性。
使用此信息，拓扑管理器存储该容器的首选 NUMA 节点亲和性。
如果亲和性不是首选，则拓扑管理器将从节点中拒绝此 Pod 。
这将导致 Pod 处于 `已终止` 状态，且 Pod 接纳失败。

<!--
If the pod is admitted, the *Hint Providers* can then use this information when making the 
resource allocation decision.
-->
如果允许使用 Pod，则 *Hint Providers* 可以在做出资源分配决定时使用此信息。

<!--
### single-numa-node policy {#policy-single-numa-node}
-->
### 单节点数策略 {#policy-single-numa-node}

<!--
For each container in a Guaranteed Pod, kubelet, with `single-numa-node` topology 
management policy, calls each Hint Provider to discover their resource availability.
Using this information, the Topology Manager determines if a single NUMA Node affinity is possible.
If it is, Topology Manager will store this and the *Hint Providers* can then use this information when making the 
resource allocation decision.
If, however, this is not possible then the Topology Manager will reject the pod from the node. This will result in a pod in a `Terminated` state with a pod admission failure.
-->
对于保证 Pod 中的每个容器， kubelet 具有 `单节点数` 拓扑管理策略，调用每个提示提供程序以发现其资源可用性。
使用此信息，拓扑管理器确定单个 NUMA 节点亲和性是否可能。
如果是这样，则拓扑管理器将存储此信息，然后 *Hint Providers* 可以在做出资源分配决定时使用此信息。
但是，如果不可能，则拓扑管理器将拒绝来自该节点的容器。
这将导致 Pod 处于 `已终止` 状态，且 Pod 接纳失败。


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
该 Pod 在 `BestEffort` QoS 类中运行，因为没有资源 `requests` 或指定了 `限制` 。

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
由于请求数少于限制，因此该 Pod 以 `突发` QoS 类运行。

<!--
If the selected policy is anything other than `none` , Topology Manager would not consider either of these Pod
specifications. 
-->
如果选择的策略不是 `none` 以外的任何其他策略，拓扑管理器不会考虑这些 Pod 中的任何一个规范。


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
此 Pod 在 `保证` QoS 类中运行，因为 `请求` 等于 `限制` 。

<!--
Topology Manager would consider this Pod. The Topology Manager consults the CPU Manager `static` policy, which returns the topology of available CPUs. 
Topology Manager also consults Device Manager to discover the topology of available devices for example.com/device.
-->
拓扑管理器会考虑使用此 Pod 。
拓扑管理器查询 CPU 管理器的 `静态` 策略，该策略返回可用 CPU 的拓扑。
拓扑管理器还咨询设备管理器以发现 example.com/device 的可用设备的拓扑。

<!--
Topology Manager will use this information to store the best Topology for this container. In the case of this Pod, CPU and Device Manager will use this stored information at the resource allocation stage.
-->
拓扑管理器将使用此信息来存储此容器的最佳拓扑。
对于此 Pod ， CPU 和设备管理器将在资源分配阶段使用此存储的信息。

{{% /capture %}}

