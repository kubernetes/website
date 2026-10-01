---
title: 控制节点上的内存管理策略
content_type: task
min-kubernetes-server-version: v1.32
weight: 410
---

<!--
title: Control Memory Management Policies on a Node

reviewers:
- klueska
- derekwaynecarr

content_type: task
min-kubernetes-server-version: v1.32
weight: 410
-->

<!-- overview -->

{{< feature-state feature_gate_name="MemoryManager" >}}

<!--
The Kubernetes *Memory Manager* enables the feature of guaranteed memory (and hugepages)
allocation for pods in the `Guaranteed` {{< glossary_tooltip text="QoS class" term_id="qos-class" >}}.

The Memory Manager employs a hint generation protocol to yield the most suitable NUMA affinity for a pod.
The Memory Manager feeds the central manager (*Topology Manager*) with these affinity hints.
Based on both the hints and Topology Manager policy, the pod is rejected or admitted to the node.
-->
Kubernetes 内存管理器（Memory Manager）为 `Guaranteed`
{{< glossary_tooltip text="QoS 类" term_id="qos-class" >}}
的 Pods 提供可保证的内存（及大页面）分配能力。

内存管理器使用提示生成协议来为 Pod 生成最合适的 NUMA 亲和性配置。
内存管理器将这类亲和性提示输入给中央管理器（即 Topology Manager）。
基于所给的提示和 Topology Manager（拓扑管理器）的策略设置，Pod
或者会被某节点接受，或者被该节点拒绝。

<!--
Moreover, the Memory Manager ensures that the memory which a pod requests
is allocated from a minimum number of NUMA nodes.

For background about memory resources for Pods, read
[Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/).
-->
此外，内存管理器还确保 Pod 所请求的内存是从尽量少的 NUMA 节点分配而来。

有关 Pod 内存资源的背景信息，请参阅[为容器和 Pod 分配内存资源](/zh-cn/docs/tasks/configure-pod-container/assign-memory-resource/)。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
{{< version-check >}} If you are running an older version of Kubernetes, check the documentation
for the version of Kubernetes you are running.

### Resource alignment prerequisites
-->
{{< version-check >}} 如果你运行的是旧版本的 Kubernetes，请查阅你所运行版本的 Kubernetes 文档。

### 资源对齐的前提条件

<!--
To align memory resources with other requested resources in a Pod spec:

- the CPU Manager should be enabled and proper CPU Manager policy should be configured on a Node.
  See [control CPU Management Policies](/docs/tasks/administer-cluster/cpu-management-policies/);
- the Topology Manager should be enabled and proper Topology Manager policy should be configured on a Node.
  See [control Topology Management Policies](/docs/tasks/administer-cluster/topology-manager/).
-->
为了使得内存资源与 Pod 规约中所请求的其他资源对齐：

- CPU 管理器应该被启用，并且在节点（Node）上要配置合适的 CPU 管理器策略，
  参见[控制 CPU 管理策略](/zh-cn/docs/tasks/administer-cluster/cpu-management-policies/)；
- 拓扑管理器要被启用，并且要在节点上配置合适的拓扑管理器策略，
  参见[控制拓扑管理器策略](/zh-cn/docs/tasks/administer-cluster/topology-manager/)。

<!--
### Windows support
-->
### Windows 支持

{{< feature-state feature_gate_name="WindowsCPUAndMemoryAffinity" >}}

<!--
Windows support can be enabled via the `WindowsCPUAndMemoryAffinity` feature gate
and it requires support in the container runtime.  
Only the [None](#policy-none) and [BestEffort](#policy-best-effort) policies are supported on Windows.
-->
可以通过 `WindowsCPUAndMemoryAffinity` 特性门控启用 Windows 支持，
但这需要容器运行时的支持。在 Windows 上，仅支持
[None](#policy-none) 和 [BestEffort](#policy-best-effort) 策略。

<!--
## How does the Memory Manager operate?
-->
## 内存管理器如何运作？   {#how-does-the-memory-manager-operate}

<!--
For Linux nodes, the Memory Manager offers the guaranteed memory (and hugepages) allocation
for Pods in Guaranteed QoS class.
To immediately put the Memory Manager into operation follow the guidelines in the section
[Memory Manager configuration](#memory-manager-configuration), and subsequently,
prepare and deploy a `Guaranteed` Pod as illustrated in the section
[Placing a Pod in the Guaranteed QoS class](#placing-a-pod-in-the-guaranteed-qos-class).
-->
对于 Linux 节点，内存管理器为 Guaranteed QoS 类中的 Pod 提供可保证的内存（和大页面）分配能力。
若要立即将内存管理器启用，可参照[内存管理器配置](#memory-manager-configuration)节中的指南，
之后按[将 Pod 放入 Guaranteed QoS 类](#placing-a-pod-in-the-guaranteed-qos-class)节中所展示的，
准备并部署一个 `Guaranteed` Pod。

<!--
The Memory Manager is a Hint provider, and it provides topology hints for
the Topology Manager which then aligns the requested resources according to these topology hints.
On Linux, it also enforces `cgroups` (specifically, `cpuset.mems`) for pods.
The complete flow diagram concerning pod admission and deployment process is illustrated
below:
-->
内存管理器是一个提示驱动组件（Hint Provider），负责为拓扑管理器提供拓扑提示，
后者根据这些拓扑提示对所请求的资源执行对齐操作。
在 Linux 上，内存管理器也会为 Pod 应用 `cgroups` 设置（具体来说，即 `cpuset.mems`）。
关于 Pod 准入与部署流程的完整流程图如下所示：

<!--
![Memory Manager in the pod admission and deployment process](/images/docs/memory-manager-diagram.svg)
-->
![Pod 准入与部署流程中的内存管理器](/images/docs/memory-manager-diagram.svg)

<!--
During this process, the Memory Manager updates its internal counters stored in
[Node Map and Memory Maps][2] to manage guaranteed memory allocation.
-->
在这个过程中，内存管理器会更新其内部存储于[节点映射和内存映射][2]中的计数器，
从而管理有保障的内存分配。


<!--
The memory manager activates during kubelet startup if a node administrator configures
`reservedMemory` for the kubelet (section [Reserved memory configuration](#reserved-memory-flag)).
In this case, the kubelet updates its node map to reflect this reservation.

When the `Static` policy is configured, you **must** configure reserved memory for the node
(for example, with the `reservedMemory` configuration field in the kubelet configuration).
-->
如果节点管理员为 kubelet 配置了 `reservedMemory`（参见[预留内存配置](#reserved-memory-flag)部分），
则内存管理器会在 kubelet 启动期间激活。此时，kubelet 会更新其节点映射以反映此预留。

如果配置了 `Static` 策略，则**必须**为节点配置预留内存（例如，在
kubelet 配置中使用 `reservedMemory` 配置字段）。

<!--
An important topic in the context of Memory Manager operation is the management of NUMA groups.
Each time pod's memory request is in excess of single NUMA node capacity, the Memory Manager
attempts to create a group that comprises several NUMA nodes and that features extended memory
capacity.
-->
在内存管理器运作的语境中，一个重要的话题是对 NUMA 分组的管理。
每当 Pod 的内存请求超出单个 NUMA 节点容量时，内存管理器会尝试创建一个包含多个
NUMA 节点的分组，从而扩展内存容量。

<!--
## Memory Manager configuration
-->
## 内存管理器配置   {#memory-manager-configuration}

<!--
Other Managers should already be configured (see [resource alignment prerequisites](#resource-alignment-prerequisites).
Set the `memoryManagerPolicy` configuration field within the [kubelet configuration]({{< relref "/docs/reference/config-api/kubelet-config.v1beta1" >}}), to the name of your chosen [policy](#policies).
Optionally, some amount of memory can be reserved for system or kubelet processes to increase
node stability (section [Reserved memory configuration](#reserved-memory-flag)).
-->
其他管理器应已完成配置（请参阅[资源对齐前提条件](#resource-alignment-prerequisites)）。
在 [kubelet 配置]({{< relref "/docs/reference/config-api/kubelet-config.v1beta1" >}})中，将
`memoryManagerPolicy` 配置字段设置为你选择的[策略](#policies)名称。
作为可选操作，可以预留一定数量的内存给系统或者 kubelet 进程以增强节点的稳定性
（[预留内存配置](#reserved-memory-flag)）。

<!--
### Policies
-->
### 策略    {#policies}

<!--
Kubernetes' memory manager provides three policies. You can select a policy via the `memoryManagerPolicy` configuration field
in the kubelet configuration; the values available in Kubernetes {{< skew currentVersion >}} are:

* [`None`](#policy-none) (default)
* [`Static`](#policy-static) (Linux only)
* [`BestEffort`](#policy-best-effort) (Windows only)
-->
Kubernetes 内存管理器支持三种策略。你可以通过 kubelet
配置中的 `memoryManagerPolicy` 字段来选择策略；
在 Kubernetes {{< skew currentVersion >}} 版本中，可用的选项包括：

* [`None`](#policy-none)（默认）
* [`Static`](#policy-static)（仅 Linux）
* [`BestEffort`](#policy-best-effort)（仅 Windows）

<!--
#### None policy {#policy-none}

This is the default policy and does not affect the memory allocation in any way.
It acts the same as if the Memory Manager is not present at all.

The `None` policy returns default topology hint. This special hint denotes that Hint Provider
(Memory Manager in this case) has no preference for NUMA affinity with any resource.
-->
#### None 策略    {#policy-none}

这是默认的策略，并且不会以任何方式影响内存分配。该策略的行为好像内存管理器不存在一样。

`None` 策略返回默认的拓扑提示信息。这种特殊的提示会表明拓扑驱动组件（Hint Provider）
（在这里是内存管理器）对任何资源都没有与 NUMA 亲和性关联的偏好。

<!--
#### Static policy {#policy-static}

{{< feature-state feature_gate_name="MemoryManager" >}}

**This policy is only supported on Linux.**

In the case of the `Guaranteed` pod, the `Static` Memory Manager policy returns topology hints
relating to the set of NUMA nodes where the memory can be guaranteed,
and reserves the memory through updating the internal [NodeMap][2] object.

In the case of the `BestEffort` or `Burstable` pod, the `Static` Memory Manager policy sends back
the default topology hint as there is no request for the guaranteed memory,
and does not reserve the memory in the internal [NodeMap][2] object.
-->
#### Static 策略    {#policy-static}

{{< feature-state feature_gate_name="MemoryManager" >}}

**此策略仅在 Linux 上受支持。**

对 `Guaranteed` Pod 而言，`Static` 内存管理器策略会返回拓扑提示信息，
该信息与内存分配有保障的 NUMA 节点集合有关，并且内存管理器还通过更新内部的[节点映射][2]
对象来完成内存预留。

对 `BestEffort` 或 `Burstable` Pod 而言，因为不存在对有保障的内存资源的请求，
`Static` 内存管理器策略会返回默认的拓扑提示，并且不会通过内部的[节点映射][2]对象来预留内存。

<!--
#### BestEffort policy {#policy-best-effort}
-->
#### BestEffort 策略   {#policy-best-effort}

{{< feature-state feature_gate_name="WindowsCPUAndMemoryAffinity" >}}

<!--
**This policy is only supported on Windows.**

On Windows, NUMA node assignment works differently than Linux.
There is no mechanism to ensure that Memory access only comes from a specific NUMA node.
Instead the Windows operating system scheduler selects the most optimal NUMA node based on the CPU(s) assignments.
It is possible that Windows might use other NUMA nodes if the Windows scheduler deems them optimal.
-->
**此策略仅 Windows 上支持。**

在 Windows 上，NUMA 节点分配方式与 Linux 上不同。
没有机制确保内存访问仅来自特定的 NUMA 节点。
相反，Windows 操作系统调度程序会根据 CPU 分配情况选择最优的 NUMA 节点。
如果 Windows 调度程序认为其他 NUMA 节点更优，它也可能会使用这些节点。

<!--
The policy does track the amount of memory available and requested through the internal _node map_.
The memory manager makes a best effort at ensuring that enough memory is available on a NUMA node before making
a resource assignment.  
This means that in most cases memory assignment should function as specified.
-->
此策略通过内部的“节点映射表”（node map）来追踪可用内存量及请求的内存量。
在进行资源分配之前，内存管理器会尽力确保 NUMA 节点上有足够的可用内存。
这意味着在大多数情况下，内存分配应能按预期正常工作。

<!--
Reserved memory configuration {#reserved-memory-flag}
-->
### 预留内存配置    {#reserved-memory-flag}

<!--
As an administrator, you can configure the total amount of reserved memory
for a node. This pre-configured value is subsequently utilized to calculate
the real amount of [node allocatable](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable) memory available to pods.
-->
作为管理员，你可以配置节点的预留内存总量。
该预先配置的值随后将用于计算可供 Pod
使用的实际[节点可分配](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)内存量。

<!--
The Kubernetes scheduler incorporates allocatable memory information to optimise pod
[scheduling](/docs/concepts/scheduling-eviction/).
. The _node allocatable_ mechanism is commonly used by node administrators to reserve K8s node
system resources for the kubelet or operating system processes to help assure node stability.
-->
Kubernetes 调度器利用“可分配内存”信息来优化 Pod [调度](/zh-cn/docs/concepts/scheduling-eviction/)。
“节点可分配资源”（node allocatable）机制常被节点管理员用于为 kubelet
或操作系统进程预留 Kubernetes 节点系统资源，以确保节点的稳定性。

<!--
The relevant kubelet settings include `kubeReserved`, `systemReserved` and `reservedMemory`.
The `reservedMemory` setting allows you to split the total reserved memory and assign it
across many NUMA nodes.

You specify a comma-separated list of memory reservations, of different
memory types, per NUMA node.
You can also specify reservations that span multiple NUMA nodes, using a semicolon as separator.

The Memory Manager will not use this reserved memory for running container workloads.
-->
相关的 kubelet 设置包括 `kubeReserved`、`systemReserved` 和 `reservedMemory`。
通过 `reservedMemory` 设置，你可以将预留的总内存进行拆分，并分配到多个 NUMA 节点上。

你可以针对每个 NUMA 节点，指定一个以逗号分隔的内存预留列表，其中包含不同类型的内存预留。
你也可以使用分号作为分隔符，指定跨越多个 NUMA 节点的内存预留。

内存管理器（Memory Manager）不会将这些预留内存用于运行容器工作负载。

<!--
For example, if you have a NUMA node "NUMA0" with 10GiB of memory available, and
you configure `reservedMemory`  to reserve `1Gi` (of memory) for NUMA0,
the Memory Manager assumes that only 9GiB is available for pods.

You can omit this parameter, however, you should be aware that the quantity of reserved memory
from all NUMA nodes should be equal to the quantity of _node allocatable_ memory.

If at least one node allocatable parameter is non-zero, you will need to specify
`reservedMemory` for at least one NUMA node.
In fact, the `evictionHard` threshold value is equal to `100Mi` by default, so
if you use the `Static` policy, specifying `reservedMemory` is obligatory.
-->
例如，如果你有一个 NUMA 节点 "NUMA0" 可用内存为 10 GiB，并且你通过 `reservedMemory`
为 NUMA0 预留 `1 Gi` 内存，内存管理器（Memory Manager）将假设仅有 9 GiB 可供 Pod 使用。

你可以省略此参数，但你应当注意：所有 NUMA 节点预留内存的总量应当等于**节点可分配**内存的总量。

如果至少一个节点可分配参数不为零，你就需要为至少一个 NUMA 节点指定 `reservedMemory`。
事实上，`evictionHard` 阈值默认等于 `100Mi`，因此如果你使用 `Static` 策略，则必须指定 `reservedMemory`。

<!--
### Memory manager reserved memory syntax {#reserved-memory-syntax}

Here are some examples of how to set the `reservedMemory` configuration for the kubelet.
-->
### 内存管理器预留内存语法 {#reserved-memory-syntax}

以下是为 kubelet 设置 `reservedMemory` 配置的一些示例。

<!--
```yaml
  # Example 1
  reservedMemory:
  - numaNode: 0 # NUMA node index
    limits:
      memory: "1Gi" # byte quantity
  - numaNode: 1
    limits:
      memory: "2Gi" # byte quantity
```
-->
```yaml
  # 示例 1
  reservedMemory:
  - numaNode: 0 # NUMA 节点索引
    limits:
      memory: "1Gi" # 字节数量
  - numaNode: 1
    limits:
      memory: "2Gi" # 字节数量
```

<!--
```yaml
  # Example 2
  reservedMemory:
  - numaNode: 0
    limits:
      "memory": "512Gi"
  - numaNode: 1
    limits:
      "memory": "512Gi"
      "hugepages-1Gi": "2Gi" # only relevant on Linux
```
-->
```yaml
  # 示例 2
  reservedMemory:
  - numaNode: 0
    limits:
      "memory": "512Gi"
  - numaNode: 1
    limits:
      "memory": "512Gi"
      "hugepages-1Gi": "2Gi" # 仅适用于 Linux
```

<!--
### Constraints on NUMA memory reservation

When you specify values for `reservedMemory`, this must be compatible with the `kubeReserved`
and `systemReserved` values that are in effect, along with any `memory.available` setting
you make as part of `evictionHard`.
-->
### NUMA 内存预留的约束

当你为 `reservedMemory` 指定值时，该值必须与当前生效的 `kubeReserved`
和 `systemReserved` 值兼容，同时也要与你在 `evictionHard` 中设置的 `memory.available` 兼容。

```math
\begin{equation*}
\sum_{ \textnormal{i} = 0}^{ \textnormal{node count}} { \textit{reservedMemory} [ \textnormal{i} ]} = \textit{kubeReserved} + \textit{systemReserved} + \textit{evictionHard} \, \boxed{\textnormal{memory.available}}
\end{equation*}\\\
\text{where i is an index of a NUMA node}
```

<!--
If you do not follow the formula above, the Memory Manager will show an error on startup.

In other words, the example 1 (above) illustrates that for the conventional memory (`type=memory`),
Kubernetes reserves `3Gi` in total, that is:
-->
如果你不遵守上面的公式，内存管理器会在启动时输出错误信息。

换言之，上述示例 1 表明，对于常规内存（`type=memory`），Kubernetes 总共预留了 `3Gi`，即：

`sum(reserved-memory(i)) = reserved-memory(0) + reserved-memory(1) = 1Gi + 2Gi = 3Gi`

```math
\begin{equation*}
\sum_{ \textnormal{i} = 0}^{ \textnormal{node count}} \textit{reservedMemory}_{ [ \textnormal{i} ] }  =  \underbrace{\textit{reservedMemory} [ 0 ] + \textit{reservedMemory} [ 1 ] }_{\textnormal{type=memory}}
            = 1 \textnormal{GiB} + 2 \textnormal{GiB}
            = 3 \textnormal{GiB}
\end{equation*}\\\
\text{where i is an index of a NUMA node}
```

<!--
Some examples of kubelet configuration settings relevant to the node allocatable configuration:
-->
以下是与节点可分配资源配置相关的 kubelet 配置设置示例：

<!--
```yaml
  kubeReserved: { cpu: "500m", memory: "50Mi" } # half a CPU, 50MiB of memory
  systemReserved: { cpu: "500m", memory: "256Mi" } # half a CPU, 256MiB of memory
```
-->
```yaml
  kubeReserved: { cpu: "500m", memory: "50Mi" } # 半个 CPU，50MiB 内存
  systemReserved: { cpu: "500m", memory: "256Mi" } # 半个 CPU，256MiB 内存
```

{{< note >}}
<!--
The default hard eviction threshold is 100MiB, and **not** zero.
Remember to increase the quantity of memory that you reserve by setting `reservedMemory`
by that hard eviction threshold. Otherwise, the kubelet will not start Memory Manager and
display an error.
-->
默认的硬性驱逐阈值是 100MiB，**不是**零。
请记得在使用 `reservedMemory` 设置要预留的内存量时，加上这个硬性驱逐阈值。
否则 kubelet 不会启动内存管理器，而会输出一个错误信息。

<!--
Here is an example of a correct configuration that uses `reservedMemory`:
-->
以下是一个使用 `reservedMemory` 的正确配置示例：

<!--
# this snippet relies on the default value of evictionHard
# 3GiB minus 100MiB
-->
```yaml
  # 此代码片段依赖于 evictionHard 的默认值。
  memoryManagerPolicy: Static
  kubeReserved: { cpu: "4", memory: "4Gi" }
  systemReserved: { cpu: "1", memory: "1Gi" }
  reservedMemory:
  - numaNode: 0
    limits:
      memory: "3Gi"
  - numaNode: 1
    limits:
      memory: "2148Mi" # 3GiB 减去 100MiB
```
{{< /note >}}

<!--
### Configurations to avoid {#reserved-memory-configurations-to-avoid}

Avoid the following configurations:

1. duplicates: the same NUMA node or memory type, but with a different value;
1. setting a zero limit for any of memory types;
1. NUMA node IDs that do not exist in the machine hardware;
1. memory type names different than `memory` or `hugepages-<size>`
   (hugepages of particular `<size>` should also exist).
-->
### 应避免的配置 {#reserved-memory-configurations-to-avoid}

请避免以下配置：

1. 重复项：同一个 NUMA 节点或内存类型，但设置了不同的值；
1. 为任何一种内存类型设置零值限制；
1. 使用机器硬件中不存在的 NUMA 节点 ID；
1. 内存类型名称不是 `memory` 或 `hugepages-<size>`
   （对应 `<size>` 的巨页也必须存在）。

<!--
## Placing a Pod in the Guaranteed QoS class

If the selected policy is anything other than `None`, the Memory Manager identifies pods
that are in the `Guaranteed` QoS class.
The Memory Manager provides specific topology hints to the Topology Manager for each `Guaranteed` pod.
For pods in a QoS class other than `Guaranteed`, the Memory Manager provides default topology hints
to the Topology Manager.
-->
## 将 Pod 放入 Guaranteed QoS 类  {#placing-a-pod-in-the-guaranteed-qos-class}

若所选择的策略不是 `None`，则内存管理器会辨识处于 `Guaranteed` QoS 类中的 Pod。
内存管理器为每个 `Guaranteed` Pod 向拓扑管理器提供拓扑提示信息。
对于不在 `Guaranteed` QoS 类中的其他 Pod，内存管理器向拓扑管理器提供默认的拓扑提示信息。

<!--
The following excerpts from pod manifests assign a pod to the `Guaranteed` QoS class.

A Pod with integer CPU(s) runs in the `Guaranteed` QoS class, when `requests` are equal to `limits`:
-->
下面的来自 Pod 清单的片段将 Pod 加入到 `Guaranteed` QoS 类中。

当 Pod 的 CPU `requests` 等于 `limits` 且为整数值时，Pod 将运行在 `Guaranteed` QoS 类中。

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
Also, a pod sharing CPU(s) runs in the `Guaranteed` QoS class, when `requests` are equal to `limits`.
-->
此外，共享 CPU 的 Pods 在 `requests` 等于 `limits` 值时也运行在 `Guaranteed` QoS 类中。

```yaml
spec:
  containers:
  - name: nginx
    image: nginx
    resources:
      limits:
        memory: "200Mi"
        cpu: "300m"
        example.com/device: "1"
      requests:
        memory: "200Mi"
        cpu: "300m"
        example.com/device: "1"
```

<!--
Notice that both CPU and memory requests must be specified for a Pod to lend it to Guaranteed QoS class.
-->
要注意的是，只有 CPU 和内存请求都被设置时，Pod 才会进入 Guaranteed QoS 类。

## {{% heading "whatsnext" %}}

<!--
- Read [Troubleshooting Topology Management](/docs/tasks/debug/debug-cluster/topology/)
- Read the [KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/1769-memory-manager) (Kubernetes enhancement proposal) for memory manager
* Read about [Pod-level resource managers](/docs/concepts/workloads/resource-managers/#pod-level-resource-managers).
-->
- 阅读[拓扑管理器故障排除](/zh-cn/docs/tasks/debug/debug-cluster/topology/)
- 阅读内存管理器的 [KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/1769-memory-manager)（Kubernetes 增强提案）
* 阅读 [Pod 级资源管理器](/zh-cn/docs/concepts/workloads/resource-managers/#pod-level-resource-managers)。
