---
title: 使用 NUMA 感知的内存管理器
content_type: task
min-kubernetes-server-version: v1.21
weight: 410
---

<!--
title: Utilizing the NUMA-aware Memory Manager

reviewers:
- klueska
- derekwaynecarr

content_type: task
min-kubernetes-server-version: v1.21
weight: 410
-->

<!-- overview -->

{{< feature-state feature_gate_name="MemoryManager" >}}

<!--
The Kubernetes *Memory Manager* enables the feature of guaranteed memory (and hugepages)
allocation for pods in the `Guaranteed` {{< glossary_tooltip text="QoS class" term_id="qos-class" >}}.

The Memory Manager employs hint generation protocol to yield the most suitable NUMA affinity for a pod.
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

The Memory Manager is only pertinent to Linux based hosts.
-->
此外，内存管理器还确保 Pod 所请求的内存是从尽量少的 NUMA 节点分配而来。

内存管理器仅能用于 Linux 主机。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

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
- 拓扑管理器要被启用，并且要在节点上配置合适的拓扑管理器策略，参见
  [控制拓扑管理器策略](/zh-cn/docs/tasks/administer-cluster/topology-manager/)。

<!--
Starting from v1.22, the Memory Manager is enabled by default through `MemoryManager`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/).

Preceding v1.22, the `kubelet` must be started with the following flag:

`--feature-gates=MemoryManager=true`

in order to enable the Memory Manager feature.
-->
从 v1.22 开始，内存管理器通过[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
`MemoryManager` 默认启用。

在 v1.22 之前，`kubelet` 必须在启动时设置如下标志：

`--feature-gates=MemoryManager=true`

这样内存管理器特性才会被启用。

<!--
## How Memory Manager Operates?
-->
## 内存管理器如何运作？

<!--
The Memory Manager currently offers the guaranteed memory (and hugepages) allocation
for Pods in Guaranteed QoS class.
To immediately put the Memory Manager into operation follow the guidelines in the section
[Memory Manager configuration](#memory-manager-configuration), and subsequently,
prepare and deploy a `Guaranteed` pod as illustrated in the section
[Placing a Pod in the Guaranteed QoS class](#placing-a-pod-in-the-guaranteed-qos-class).
-->
内存管理器目前为 Guaranteed QoS 类中的 Pod 提供可保证的内存（和大页面）分配能力。
若要立即将内存管理器启用，可参照[内存管理器配置](#memory-manager-configuration)节中的指南，
之后按[将 Pod 放入 Guaranteed QoS 类](#placing-a-pod-in-the-guaranteed-qos-class)
节中所展示的，准备并部署一个 `Guaranteed` Pod。

<!--
The Memory Manager is a Hint Provider, and it provides topology hints for
the Topology Manager which then aligns the requested resources according to these topology hints.
It also enforces `cgroups` (i.e. `cpuset.mems`) for pods.
The complete flow diagram concerning pod admission and deployment process is illustrated in
[Memory Manager KEP: Design Overview][4] and below:
-->
内存管理器是一个提示驱动组件（Hint Provider），负责为拓扑管理器提供拓扑提示，
后者根据这些拓扑提示对所请求的资源执行对齐操作。
内存管理器也会为 Pods 应用 `cgroups` 设置（即 `cpuset.mems`）。
与 Pod 准入和部署流程相关的完整流程图在[Memory Manager KEP: Design Overview][4]，
下面也有说明。

<!--
![Memory Manager in the pod admission and deployment process](/images/docs/memory-manager-diagram.svg)
-->
![Pod 准入与部署流程中的内存管理器](/images/docs/memory-manager-diagram.svg)

<!--
During this process, the Memory Manager updates its internal counters stored in
[Node Map and Memory Maps][2] to manage guaranteed memory allocation.

The Memory Manager updates the Node Map during the startup and runtime as follows.
-->
在这个过程中，内存管理器会更新其内部存储于[节点映射和内存映射][2]中的计数器，
从而管理有保障的内存分配。

内存管理器在启动和运行期间按下述逻辑更新节点映射（Node Map）。

<!--
### Startup
-->
### 启动  {#startup}

<!--
This occurs once a node administrator employs `--reserved-memory` (section
[Reserved memory flag](#reserved-memory-flag)).
In this case, the Node Map becomes updated to reflect this reservation as illustrated in
[Memory Manager KEP: Memory Maps at start-up (with examples)][5].

The administrator must provide `--reserved-memory` flag when `Static` policy is configured.
-->
当节点管理员应用 `--reserved-memory` [预留内存标志](#reserved-memory-flag)时执行此逻辑。
这时，节点映射会被更新以反映内存的预留，如
[Memory Manager KEP: Memory Maps at start-up (with examples)][5]
所说明。

当配置了 `Static` 策略时，管理员必须提供 `--reserved-memory` 标志设置。

<!--
### Runtime
-->
### 运行时  {#runtime} 

<!--
Reference [Memory Manager KEP: Memory Maps at runtime (with examples)][6] illustrates
how a successful pod deployment affects the Node Map, and it also relates to
how potential Out-of-Memory (OOM) situations are handled further by Kubernetes or operating system.
-->
参考文献 [Memory Manager KEP: Memory Maps at runtime (with examples)][6]
中说明了成功的 Pod 部署是如何影响节点映射的，该文档也解释了可能发生的内存不足
（Out-of-memory，OOM）情况是如何进一步被 Kubernetes 或操作系统处理的。

<!--
Important topic in the context of Memory Manager operation is the management of NUMA groups.
Each time pod's memory request is in excess of single NUMA node capacity, the Memory Manager
attempts to create a group that comprises several NUMA nodes and features extend memory capacity.
The problem has been solved as elaborated in
[Memory Manager KEP: How to enable the guaranteed memory allocation over many NUMA nodes?][3].
Also, reference [Memory Manager KEP: Simulation - how the Memory Manager works? (by examples)][1]
illustrates how the management of groups occurs.
-->
在内存管理器运作的语境中，一个重要的话题是对 NUMA 分组的管理。
每当 Pod 的内存请求超出单个 NUMA 节点容量时，内存管理器会尝试创建一个包含多个
NUMA 节点的分组，从而扩展内存容量。解决这个问题的详细描述在文档
[Memory Manager KEP: How to enable the guaranteed memory allocation over many NUMA nodes?][3]
中。同时，关于 NUMA 分组是如何管理的，你还可以参考文档
[Memory Manager KEP: Simulation - how the Memory Manager works? (by examples)][1]。

<!--
## Memory Manager configuration
-->
## 内存管理器配置   {#memory-manager-configuration}

<!--
Other Managers should be first pre-configured. Next, the Memory Manager feature should be enabled
and be run with `Static` policy (section [Static policy](#policy-static)).
Optionally, some amount of memory can be reserved for system or kubelet processes to increase
node stability (section [Reserved memory flag](#reserved-memory-flag)).
-->
其他管理器也要预先配置。接下来，内存管理器特性需要被启用，
并且采用 `Static` 策略（[静态策略](#policy-static)）运行。
作为可选操作，可以预留一定数量的内存给系统或者 kubelet 进程以增强节点的稳定性
（[预留内存标志](#reserved-memory-flag)）。

<!--
### Policies
-->
### 策略    {#policies}

<!--
Memory Manager supports two policies. You can select a policy via a `kubelet` flag `--memory-manager-policy`:

* `None` (default)
* `Static`
-->
内存管理器支持两种策略。你可以通过 `kubelet` 标志 `--memory-manager-policy`
来选择一种策略：

* `None` （默认）
* `Static`

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

In the case of the `Guaranteed` pod, the `Static` Memory Manager policy returns topology hints
relating to the set of NUMA nodes where the memory can be guaranteed,
and reserves the memory through updating the internal [NodeMap][2] object.

In the case of the `BestEffort` or `Burstable` pod, the `Static` Memory Manager policy sends back
the default topology hint as there is no request for the guaranteed memory,
and does not reserve the memory in the internal [NodeMap][2] object.
-->
#### Static 策略    {#policy-static}

对 `Guaranteed` Pod 而言，`Static` 内存管理器策略会返回拓扑提示信息，
该信息与内存分配有保障的 NUMA 节点集合有关，并且内存管理器还通过更新内部的[节点映射][2]
对象来完成内存预留。

对 `BestEffort` 或 `Burstable` Pod 而言，因为不存在对有保障的内存资源的请求，
`Static` 内存管理器策略会返回默认的拓扑提示，并且不会通过内部的[节点映射][2]对象来预留内存。

<!--
### Reserved memory flag
-->
### 预留内存标志    {#reserved-memory-flag}

<!--
The [Node Allocatable](/docs/tasks/administer-cluster/reserve-compute-resources/) mechanism
is commonly used by node administrators to reserve K8S node system resources for the kubelet
or operating system processes in order to enhance the node stability.
A dedicated set of flags can be used for this purpose to set the total amount of reserved memory
for a node. This pre-configured value is subsequently utilized to calculate
the real amount of node's "allocatable" memory available to pods.
-->
[节点可分配](/zh-cn/docs/tasks/administer-cluster/reserve-compute-resources/)机制通常被节点管理员用来为
kubelet 或操作系统进程预留 K8S 节点上的系统资源，目的是提高节点稳定性。
有一组专用的标志可用于这个目的，为节点设置总的预留内存量。
此预配置的值接下来会被用来计算节点上对 Pods “可分配的”内存。

<!--
The Kubernetes scheduler incorporates "allocatable" to optimise pod scheduling process.
The foregoing flags include `--kube-reserved`, `--system-reserved` and `--eviction-threshold`.
The sum of their values will account for the total amount of reserved memory.

A new `--reserved-memory` flag was added to Memory Manager to allow for this total reserved memory
to be split (by a node administrator) and accordingly reserved across many NUMA nodes.
-->
Kubernetes 调度器在优化 Pod 调度过程时，会考虑“可分配的”内存。
前面提到的标志包括 `--kube-reserved`、`--system-reserved` 和 `--eviction-threshold`。
这些标志值的综合计作预留内存的总量。

为内存管理器而新增加的 `--reserved-memory` 标志可以（让节点管理员）将总的预留内存进行划分，
并完成跨 NUMA 节点的预留操作。

<!--
The flag specifies a comma-separated list of memory reservations of different memory types per NUMA node.
Memory reservations across multiple NUMA nodes can be specified using semicolon as separator.
This parameter is only useful in the context of the Memory Manager feature.
The Memory Manager will not use this reserved memory for the allocation of container workloads.

For example, if you have a NUMA node "NUMA0" with `10Gi` of memory available, and
the `--reserved-memory` was specified to reserve `1Gi` of memory at "NUMA0",
the Memory Manager assumes that only `9Gi` is available for containers.
-->
标志设置的值是一个按 NUMA 节点的不同内存类型所给的内存预留的值的列表，用逗号分开。
可以使用分号作为分隔符来指定跨多个 NUMA 节点的内存预留。
只有在内存管理器特性被启用的语境下，这个参数才有意义。
内存管理器不会使用这些预留的内存来为容器负载分配内存。

例如，如果你有一个可用内存为 `10Gi` 的 NUMA 节点 "NUMA0"，而参数 `--reserved-memory`
被设置成要在 "NUMA0" 上预留 `1Gi` 的内存，那么内存管理器会假定节点上只有 `9Gi`
内存可用于容器负载。

<!--
You can omit this parameter, however, you should be aware that the quantity of reserved memory
from all NUMA nodes should be equal to the quantity of memory specified by the
[Node Allocatable feature](/docs/tasks/administer-cluster/reserve-compute-resources/).
If at least one node allocatable parameter is non-zero, you will need to specify
`--reserved-memory` for at least one NUMA node.
In fact, `eviction-hard` threshold value is equal to `100Mi` by default, so
if `Static` policy is used, `--reserved-memory` is obligatory.
-->
你也可以忽略此参数，不过这样做时，你要清楚，所有 NUMA
节点上预留内存的数量要等于[节点可分配特性](/zh-cn/docs/tasks/administer-cluster/reserve-compute-resources/)
所设定的内存量。如果至少有一个节点可分配参数值为非零，你就需要至少为一个 NUMA
节点设置 `--reserved-memory`。实际上，`eviction-hard` 阈值默认为 `100Mi`，
所以当使用 `Static` 策略时，`--reserved-memory` 是必须设置的。

<!--
Also, avoid the following configurations:

1. duplicates, i.e. the same NUMA node or memory type, but with a different value;
1. setting zero limit for any of memory types;
1. NUMA node IDs that do not exist in the machine hardware;
1. memory type names different than `memory` or `hugepages-<size>`
   (hugepages of particular `<size>` should also exist).
-->
此外，应尽量避免如下配置：

1. 重复的配置，即同一 NUMA 节点或内存类型被设置不同的取值；
1. 为某种内存类型设置约束值为零；
1. 使用物理硬件上不存在的 NUMA 节点 ID；
1. 使用名字不是 `memory` 或 `hugepages-<size>` 的内存类型名称
   （特定的 `<size>` 的大页面也必须存在）。

<!--
Syntax:
-->
语法：

`--reserved-memory N:memory-type1=value1,memory-type2=value2,...`

<!--
* `N` (integer) - NUMA node index, e.g. `0`
* `memory-type` (string) - represents memory type:
  * `memory` - conventional memory
  * `hugepages-2Mi` or `hugepages-1Gi` - hugepages
* `value` (string) - the quantity of reserved memory, e.g. `1Gi`
-->
* `N`（整数）- NUMA 节点索引，例如，`0`
* `memory-type`（字符串）- 代表内存类型：
  * `memory` - 常规内存；
  * `hugepages-2Mi` 或 `hugepages-1Gi` - 大页面
* `value`（字符串） - 预留内存的量，例如 `1Gi`

<!--
Example usage:
-->
用法示例：

`--reserved-memory 0:memory=1Gi,hugepages-1Gi=2Gi`

<!--
or
-->
或者

`--reserved-memory 0:memory=1Gi --reserved-memory 1:memory=2Gi`

<!--
or
-->

`--reserved-memory '0:memory=1Gi;1:memory=2Gi'`

<!--
When you specify values for `--reserved-memory` flag, you must comply with the setting that
you prior provided via Node Allocatable Feature flags.
That is, the following rule must be obeyed for each memory type:

`sum(reserved-memory(i)) = kube-reserved + system-reserved + eviction-threshold`,

where `i` is an index of a NUMA node.
-->
当你为 `--reserved-memory` 标志指定取值时，必须要遵从之前通过节点可分配特性标志所设置的值。
换言之，对每种内存类型而言都要遵从下面的规则：

`sum(reserved-memory(i)) = kube-reserved + system-reserved + eviction-threshold` 

其中，`i` 是 NUMA 节点的索引。

<!--
If you do not follow the formula above, the Memory Manager will show an error on startup.

In other words, the example above illustrates that for the conventional memory (`type=memory`),
we reserve `3Gi` in total, i.e.:
-->
如果你不遵守上面的公式，内存管理器会在启动时输出错误信息。

换言之，上面的例子我们一共要预留 `3Gi` 的常规内存（`type=memory`），即：

`sum(reserved-memory(i)) = reserved-memory(0) + reserved-memory(1) = 1Gi + 2Gi = 3Gi`

<!--
An example of kubelet command-line arguments relevant to the node Allocatable configuration:
-->
下面的例子中给出与节点可分配配置相关的 kubelet 命令行参数：

* `--kube-reserved=cpu=500m,memory=50Mi`
* `--system-reserved=cpu=123m,memory=333Mi`
* `--eviction-hard=memory.available<500Mi`

{{< note >}}
<!--
The default hard eviction threshold is 100MiB, and **not** zero.
Remember to increase the quantity of memory that you reserve by setting `--reserved-memory`
by that hard eviction threshold. Otherwise, the kubelet will not start Memory Manager and
display an error.
-->
默认的硬性驱逐阈值是 100MiB，**不是**零。
请记得在使用 `--reserved-memory` 设置要预留的内存量时，加上这个硬性驱逐阈值。
否则 kubelet 不会启动内存管理器，而会输出一个错误信息。
{{< /note >}}

<!--
Here is an example of a correct configuration:
-->
下面是一个正确配置的示例：

```shell
--feature-gates=MemoryManager=true
--kube-reserved=cpu=4,memory=4Gi
--system-reserved=cpu=1,memory=1Gi
--memory-manager-policy=Static
--reserved-memory '0:memory=3Gi;1:memory=2148Mi'
```

<!--
Let us validate the configuration above:
-->
我们对上面的配置做一个检查：

1. `kube-reserved + system-reserved + eviction-hard(default) = reserved-memory(0) + reserved-memory(1)`
1. `4GiB + 1GiB + 100MiB = 3GiB + 2148MiB`
1. `5120MiB + 100MiB = 3072MiB + 2148MiB`
1. `5220MiB = 5220MiB` （这是对的）

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

Pod with integer CPU(s) runs in the `Guaranteed` QoS class, when `requests` are equal to `limits`:
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

<!--
## Troubleshooting

The following means can be used to troubleshoot the reason why a pod could not be deployed or
became rejected at a node:
-->
## 故障排查   {#troubleshooting}

下面的方法可用来排查为什么 Pod 无法被调度或者被节点拒绝：

<!--
- pod status - indicates topology affinity errors
- system logs - include valuable information for debugging, e.g., about generated hints
- state file - the dump of internal state of the Memory Manager
  (includes [Node Map and Memory Maps][2])
- starting from v1.22, the [device plugin resource API](#device-plugin-resource-api) can be used
  to retrieve information about the memory reserved for containers
-->
- Pod 状态 - 可表明拓扑亲和性错误
- 系统日志 - 包含用来调试的有价值的信息，例如，关于所生成的提示信息
- 状态文件 - 其中包含内存管理器内部状态的转储（包含[节点映射和内存映射][2]）
- 从 v1.22 开始，[设备插件资源 API](#device-plugin-resource-api) 
  可以用来检索关于为容器预留的内存的信息

<!--
### Pod status (TopologyAffinityError) {#TopologyAffinityError}

This error typically occurs in the following situations:

* a node has not enough resources available to satisfy the pod's request
* the pod's request is rejected due to particular Topology Manager policy constraints

The error appears in the status of a pod:
-->
### Pod 状态 （TopologyAffinityError）   {#TopologyAffinityError}

这类错误通常在以下情形出现：

* 节点缺少足够的资源来满足 Pod 请求
* Pod 的请求因为特定的拓扑管理器策略限制而被拒绝

错误信息会出现在 Pod 的状态中：

```shell
kubectl get pods
```

```none
NAME         READY   STATUS                  RESTARTS   AGE
guaranteed   0/1     TopologyAffinityError   0          113s
```

<!--
Use `kubectl describe pod <id>` or `kubectl get events` to obtain detailed error message:
-->
使用 `kubectl describe pod <id>` 或 `kubectl get events` 可以获得详细的错误信息。

```none
Warning  TopologyAffinityError  10m   kubelet, dell8  Resources cannot be allocated with Topology locality
```

<!--
### System logs

Search system logs with respect to a particular pod.

The set of hints that Memory Manager generated for the pod can be found in the logs.
Also, the set of hints generated by CPU Manager should be present in the logs.
-->
### 系统日志     {#system-logs}

针对特定的 Pod 搜索系统日志。

内存管理器为 Pod 所生成的提示信息可以在日志中找到。
此外，日志中应该也存在 CPU 管理器所生成的提示信息。

<!--
Topology Manager merges these hints to calculate a single best hint.
The best hint should be also present in the logs.

The best hint indicates where to allocate all the resources.
Topology Manager tests this hint against its current policy, and based on the verdict,
it either admits the pod to the node or rejects it.

Also, search the logs for occurrences associated with the Memory Manager,
e.g. to find out information about `cgroups` and `cpuset.mems` updates.
-->
拓扑管理器将这些提示信息进行合并，计算得到唯一的最合适的提示数据。
此最佳提示数据也应该出现在日志中。

最佳提示表明要在哪里分配所有的资源。拓扑管理器会用当前的策略来测试此数据，
并基于得出的结论或者接纳 Pod 到节点，或者将其拒绝。

此外，你可以搜索日志查找与内存管理器相关的其他条目，例如 `cgroups` 和
`cpuset.mems` 的更新信息等。

<!--
### Examine the memory manager state on a node

Let us first deploy a sample `Guaranteed` pod whose specification is as follows:
-->
### 检查节点上内存管理器状态

我们首先部署一个 `Guaranteed` Pod 示例，其规约如下所示：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: guaranteed
spec:
  containers:
  - name: guaranteed
    image: consumer
    imagePullPolicy: Never
    resources:
      limits:
        cpu: "2"
        memory: 150Gi
      requests:
        cpu: "2"
        memory: 150Gi
    command: ["sleep","infinity"]
```

<!--
Next, let us log into the node where it was deployed and examine the state file in
`/var/lib/kubelet/memory_manager_state`:
-->
接下来，我们登录到 Pod 运行所在的节点，检查位于
`/var/lib/kubelet/memory_manager_state` 的状态文件：

```json
{
   "policyName":"Static",
   "machineState":{
      "0":{
         "numberOfAssignments":1,
         "memoryMap":{
            "hugepages-1Gi":{
               "total":0,
               "systemReserved":0,
               "allocatable":0,
               "reserved":0,
               "free":0
            },
            "memory":{
               "total":134987354112,
               "systemReserved":3221225472,
               "allocatable":131766128640,
               "reserved":131766128640,
               "free":0
            }
         },
         "nodes":[
            0,
            1
         ]
      },
      "1":{
         "numberOfAssignments":1,
         "memoryMap":{
            "hugepages-1Gi":{
               "total":0,
               "systemReserved":0,
               "allocatable":0,
               "reserved":0,
               "free":0
            },
            "memory":{
               "total":135286722560,
               "systemReserved":2252341248,
               "allocatable":133034381312,
               "reserved":29295144960,
               "free":103739236352
            }
         },
         "nodes":[
            0,
            1
         ]
      }
   },
   "entries":{
      "fa9bdd38-6df9-4cf9-aa67-8c4814da37a8":{
         "guaranteed":[
            {
               "numaAffinity":[
                  0,
                  1
               ],
               "type":"memory",
               "size":161061273600
            }
         ]
      }
   },
   "checksum":4142013182
}
```

<!--
It can be deduced from the state file that the pod was pinned to both NUMA nodes, i.e.:
-->
从这个状态文件，可以推断 Pod 被同时绑定到两个 NUMA 节点，即：

```json
"numaAffinity":[
   0,
   1
],
```

<!--
Pinned term means that pod's memory consumption is constrained (through `cgroups` configuration)
to these NUMA nodes.

This automatically implies that Memory Manager instantiated a new group that
comprises these two NUMA nodes, i.e. `0` and `1` indexed NUMA nodes.
-->
术语绑定（pinned）意味着 Pod 的内存使用被（通过 `cgroups` 配置）限制到这些 NUMA 节点。

这也直接意味着内存管理器已经创建了一个 NUMA 分组，由这两个 NUMA 节点组成，
即索引值分别为 `0` 和 `1` 的 NUMA 节点。

<!--
Notice that the management of groups is handled in a relatively complex manner, and
further elaboration is provided in Memory Manager KEP in [this][1] and [this][3] sections.

In order to analyse memory resources available in a group,the corresponding entries from
NUMA nodes belonging to the group must be added up.
-->
注意 NUMA 分组的管理是有一个相对复杂的管理器处理的，
相关逻辑的进一步细节可在内存管理器的 KEP 中[示例1][1]和[跨 NUMA 节点][3]节找到。

为了分析 NUMA 组中可用的内存资源，必须对分组内 NUMA 节点对应的条目进行汇总。

<!--
For example, the total amount of free "conventional" memory in the group can be computed
by adding up the free memory available at every NUMA node in the group,
i.e., in the `"memory"` section of NUMA node `0` (`"free":0`) and NUMA node `1` (`"free":103739236352`).
So, the total amount of free "conventional" memory in this group is equal to `0 + 103739236352` bytes.
-->
例如，NUMA 分组中空闲的“常规”内存的总量可以通过将分组内所有 NUMA
节点上空闲内存加和来计算，即将 NUMA 节点 `0` 和 NUMA 节点 `1`  的 `"memory"` 节
（分别是 `"free":0` 和 `"free": 103739236352`）相加，得到此分组中空闲的“常规”
内存总量为 `0 + 103739236352` 字节。

<!--
The line `"systemReserved":3221225472` indicates that the administrator of this node reserved
`3221225472` bytes (i.e. `3Gi`) to serve kubelet and system processes at NUMA node `0`,
by using `--reserved-memory` flag.
-->
`"systemReserved": 3221225472` 这一行表明节点的管理员使用 `--reserved-memory` 为 NUMA
节点 `0` 上运行的 kubelet 和系统进程预留了 `3221225472` 字节 （即 `3Gi`）。

<!--
### Device plugin resource API

The kubelet provides a `PodResourceLister` gRPC service to enable discovery of resources and associated metadata.
By using its [List gRPC endpoint](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#grpc-endpoint-list),
information about reserved memory for each container can be retrieved, which is contained
in protobuf `ContainerMemory` message.
This information can be retrieved solely for pods in Guaranteed QoS class.
-->
### 设备插件资源 API     {#device-plugin-resource-api}

kubelet 提供了一个 `PodResourceLister` gRPC 服务来启用对资源和相关元数据的检测。
通过使用它的
[List gRPC 端点](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#grpc-endpoint-list)，
可以获得每个容器的预留内存信息，该信息位于 protobuf 协议的 `ContainerMemory` 消息中。
只能针对 Guaranteed QoS 类中的 Pod 来检索此信息。

## {{% heading "whatsnext" %}}

<!--
以下均为英文设计文档，因此其标题不翻译。
-->
- [Memory Manager KEP: Design Overview][4]
- [Memory Manager KEP: Memory Maps at start-up (with examples)][5]
- [Memory Manager KEP: Memory Maps at runtime (with examples)][6]
- [Memory Manager KEP: Simulation - how the Memory Manager works? (by examples)][1]
- [Memory Manager KEP: The Concept of Node Map and Memory Maps][2]
- [Memory Manager KEP: How to enable the guaranteed memory allocation over many NUMA nodes?][3]

[1]: https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/1769-memory-manager#simulation---how-the-memory-manager-works-by-examples
[2]: https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/1769-memory-manager#the-concept-of-node-map-and-memory-maps
[3]: https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/1769-memory-manager#how-to-enable-the-guaranteed-memory-allocation-over-many-numa-nodes
[4]: https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/1769-memory-manager#design-overview
[5]: https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/1769-memory-manager#memory-maps-at-start-up-with-examples
[6]: https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/1769-memory-manager#memory-maps-at-runtime-with-examples
