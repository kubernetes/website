---
title: 控制节点上的拓扑管理策略
content_type: task
min-kubernetes-server-version: v1.18
weight: 150
---
<!--
title: Control Topology Management Policies on a node

reviewers:
- ConnorDoyle
- klueska
- lmdaly
- nolancon
- bg-chun

content_type: task
min-kubernetes-server-version: v1.18
weight: 150
-->

<!-- overview -->

{{< feature-state state="beta" for_k8s_version="v1.27" >}}

<!--
An increasing number of systems leverage a combination of CPUs and hardware accelerators to
support latency-critical execution and high-throughput parallel computation. These include
workloads in fields such as telecommunications, scientific computing, machine learning, financial
services and data analytics. Such hybrid systems comprise a high performance environment.
-->
越来越多的系统利用 CPU 和硬件加速器的组合来支持要求低延迟的任务和高吞吐量的并行计算。
这类负载包括电信、科学计算、机器学习、金融服务和数据分析等。
此类混合系统需要有高性能环境支持。

<!--
In order to extract the best performance, optimizations related to CPU isolation, memory and
device locality are required. However, in Kubernetes, these optimizations are handled by a
disjoint set of components.
-->
为了获得最佳性能，需要进行与 CPU 隔离、内存和设备局部性有关的优化。
但是，在 Kubernetes 中，这些优化由各自独立的组件集合来处理。

<!--
_Topology Manager_ is a Kubelet component that aims to coordinate the set of components that are
responsible for these optimizations.
-->
**拓扑管理器（Topology Manager）** 是一个 kubelet 组件，旨在协调负责这些优化的一组组件。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## How topology manager works
-->
## 拓扑管理器如何工作 {#how-topology-manager-works}

<!--
Prior to the introduction of Topology Manager, the CPU and Device Manager in Kubernetes make
resource allocation decisions independently of each other.  This can result in undesirable
allocations on multiple-socketed systems, performance/latency sensitive applications will suffer
due to these undesirable allocations.  Undesirable in this case meaning for example, CPUs and
devices being allocated from different NUMA Nodes thus, incurring additional latency.
-->
在引入拓扑管理器之前，Kubernetes 中的 CPU 和设备管理器相互独立地做出资源分配决策。
这可能会导致在多处理系统上出现不符合期望的资源分配情况；由于这些与期望相左的分配，对性能或延迟敏感的应用将受到影响。
这里的不符合期望意指，例如，CPU 和设备是从不同的 NUMA 节点分配的，因此会导致额外的延迟。

<!--
The Topology Manager is a Kubelet component, which acts as a source of truth so that other Kubelet
components can make topology aligned resource allocation choices.
-->
拓扑管理器是一个 Kubelet 组件，扮演信息源的角色，以便其他 Kubelet 组件可以做出与拓扑结构相对应的资源分配决定。

<!--
The Topology Manager provides an interface for components, called *Hint Providers*, to send and
receive topology information. Topology Manager has a set of node level policies which are
explained below.
-->
拓扑管理器为组件提供了一个称为 **建议提供者（Hint Provider）** 的接口，以发送和接收拓扑信息。
拓扑管理器具有一组节点级策略，具体说明如下。

<!--
The Topology manager receives Topology information from the *Hint Providers* as a bitmask denoting
NUMA Nodes available and a preferred allocation indication. The Topology Manager policies perform
a set of operations on the hints provided and converge on the hint determined by the policy to
give the optimal result, if an undesirable hint is stored the preferred field for the hint will be
set to false. In the current policies preferred is the narrowest preferred mask.
The selected hint is stored as part of the Topology Manager. Depending on the policy configured
the pod can be accepted or rejected from the node based on the selected hint.
The hint is then stored in the Topology Manager for use by the *Hint Providers* when making the
resource allocation decisions.
-->
拓扑管理器从 **建议提供者** 接收拓扑信息，作为表示可用的 NUMA 节点和首选分配指示的位掩码。
拓扑管理器策略对所提供的建议执行一组操作，并根据策略对提示进行约减以得到最优解；
如果存储了与预期不符的建议，则该建议的优选字段将被设置为 false。
在当前策略中，首选是最窄的优选掩码。
所选建议将被存储为拓扑管理器的一部分。
取决于所配置的策略，所选建议可用来决定节点接受或拒绝 Pod。
之后，建议会被存储在拓扑管理器中，供 **建议提供者** 在作资源分配决策时使用。

<!--
## Topology manager scopes and policies

The Topology Manager currently:

- Aligns Pods of all QoS classes.
- Aligns the requested resources that Hint Provider provides topology hints for.
-->
## 拓扑管理器作用域和策略 {#topology-manager-scopes-and-policies}

拓扑管理器目前：

- 对所有 QoS 类的 Pod 执行对齐操作。
- 针对建议提供者所提供的拓扑建议，对请求的资源进行对齐。

<!--
If these conditions are met, the Topology Manager will align the requested resources.

In order to customise how this alignment is carried out, the Topology Manager provides two
distinct knobs: `scope` and `policy`.
-->
如果满足这些条件，则拓扑管理器将对齐请求的资源。

为了定制如何进行对齐，拓扑管理器提供了两种不同的方式：`scope` 和 `policy`。

<!--
The `scope` defines the granularity at which you would like resource alignment to be performed
(e.g. at the `pod` or `container` level). And the `policy` defines the actual strategy used to
carry out the alignment (e.g. `best-effort`, `restricted`, `single-numa-node`, etc.).
Details on the various `scopes` and `policies` available today can be found below.
-->
`scope` 定义了你希望的资源对齐粒度（例如，是在 `pod` 还是 `container` 层级上对齐）。
`policy` 定义了对齐时实际使用的策略（例如，`best-effort`、`restricted`、`single-numa-node` 等等）。
可以在下文找到现今可用的各种 `scopes` 和 `policies` 的具体信息。

{{< note >}}
<!--
To align CPU resources with other requested resources in a Pod spec, the CPU Manager should be
enabled and proper CPU Manager policy should be configured on a Node.
See [control CPU Management Policies](/docs/tasks/administer-cluster/cpu-management-policies/).
-->
为了将 Pod 规约中的 CPU 资源与其他请求资源对齐，需要启用 CPU
管理器并在节点上配置适当的 CPU 管理器策略。
参看[控制 CPU 管理策略](/zh-cn/docs/tasks/administer-cluster/cpu-management-policies/).
{{< /note >}}

{{< note >}}
<!--
To align memory (and hugepages) resources with other requested resources in a Pod spec, the Memory
Manager should be enabled and proper Memory Manager policy should be configured on a Node. Examine
[Memory Manager](/docs/tasks/administer-cluster/memory-manager/) documentation.
-->
为了将 Pod 规约中的内存（和 hugepages）资源与所请求的其他资源对齐，需要启用内存管理器，
并且在节点配置适当的内存管理器策略。
查看[内存管理器](/zh-cn/docs/tasks/administer-cluster/memory-manager/)文档。
{{< /note >}}

<!--
## Topology manager scopes

The Topology Manager can deal with the alignment of resources in a couple of distinct scopes:

* `container` (default)
* `pod`

Either option can be selected at a time of the kubelet startup, by setting the
`topologyManagerScope` in the
[kubelet configuration file](/docs/tasks/administer-cluster/kubelet-config-file/).
-->
## 拓扑管理器作用域 {#topology-manager-scopes}

拓扑管理器可以在以下不同的作用域内进行资源对齐：

* `container`（默认）
* `pod`

在 kubelet 启动时，你可以通过在
[kubelet 配置文件](/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/)中设置
`topologyManagerScope` 来选择其中任一选项。

<!--
### `container` scope

The `container` scope is used by default. You can also explicitly set the
`topologyManagerScope` to `container` in the
[kubelet configuration file](/docs/tasks/administer-cluster/kubelet-config-file/).
-->
### `container` 作用域 {#container-scope}

默认使用的是 `container` 作用域。
你也可以在 [kubelet 配置文件](/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/)中明确将
`topologyManagerScope` 设置为 `container`。

<!--
Within this scope, the Topology Manager performs a number of sequential resource alignments, i.e.,
for each container (in a pod) a separate alignment is computed. In other words, there is no notion
of grouping the containers to a specific set of NUMA nodes, for this particular scope. In effect,
the Topology Manager performs an arbitrary alignment of individual containers to NUMA nodes.
-->
在该作用域内，拓扑管理器依次进行一系列的资源对齐，
也就是，对（Pod 中的）每一个容器计算单独的对齐。
换句话说，在该特定的作用域内，没有根据特定的 NUMA 节点集来把容器分组的概念。
实际上，拓扑管理器会把单个容器任意地对齐到 NUMA 节点上。

<!--
The notion of grouping the containers was endorsed and implemented on purpose in the following
scope, for example the `pod` scope.
-->
容器分组的概念是在以下的作用域内特别实现的，也就是 `pod` 作用域。

<!--
### `pod` scope

To select the `pod` scope, set `topologyManagerScope` in the [kubelet configuration file](/docs/tasks/administer-cluster/kubelet-config-file/) to `pod`.
-->
### `pod` 作用域 {#pod-scope}

要选择 `pod` 作用域，在 [kubelet 配置文件](/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/)中将
`topologyManagerScope` 设置为 `pod`。

<!--
This scope allows for grouping all containers in a pod to a common set of NUMA nodes. That is, the
Topology Manager treats a pod as a whole and attempts to allocate the entire pod (all containers)
to either a single NUMA node or a common set of NUMA nodes. The following examples illustrate the
alignments produced by the Topology Manager on different occasions:
-->
该作用域允许把一个 Pod 里的所有容器作为一个分组，分配到一个共同的 NUMA 节点集。
也就是，拓扑管理器会把一个 Pod 当成一个整体，
并且试图把整个 Pod（所有容器）分配到一个单个的 NUMA 节点或者一个共同的 NUMA 节点集。
以下的例子说明了拓扑管理器在不同的场景下使用的对齐方式：

<!--
* all containers can be and are allocated to a single NUMA node;
* all containers can be and are allocated to a shared set of NUMA nodes.
-->
* 所有容器可以被分配到一个单一的 NUMA 节点，实际上也是这样分配的；
* 所有容器可以被分配到一个共享的 NUMA 节点集，实际上也是这样分配的。

<!--
The total amount of particular resource demanded for the entire pod is calculated according to
[effective requests/limits](/docs/concepts/workloads/pods/init-containers/#resources) formula, and
thus, this total value is equal to the maximum of:

* the sum of all app container requests,
* the maximum of init container requests,

for a resource.
-->
整个 Pod 所请求的某种资源总量是根据
[有效 request/limit](/zh-cn/docs/concepts/workloads/pods/init-containers/#resources)
公式来计算的，因此，对某一种资源而言，该总量等于以下数值中的最大值：

* 所有应用容器请求之和；
* 初始容器请求的最大值。

<!--
Using the `pod` scope in tandem with `single-numa-node` Topology Manager policy is specifically
valuable for workloads that are latency sensitive or for high-throughput applications that perform
IPC. By combining both options, you are able to place all containers in a pod onto a single NUMA
node; hence, the inter-NUMA communication overhead can be eliminated for that pod.
-->
`pod` 作用域与 `single-numa-node` 拓扑管理器策略一起使用，
对于延时敏感的工作负载，或者对于进行 IPC 的高吞吐量应用程序，都是特别有价值的。
把这两个选项组合起来，你可以把一个 Pod 里的所有容器都放到一个单个的 NUMA 节点，
使得该 Pod 消除了 NUMA 之间的通信开销。

<!--
In the case of `single-numa-node` policy, a pod is accepted only if a suitable set of NUMA nodes
is present among possible allocations. Reconsider the example above:
-->
在 `single-numa-node` 策略下，只有当可能的分配方案中存在合适的 NUMA 节点集时，Pod 才会被接受。
重新考虑上述的例子：

<!--
* a set containing only a single NUMA node - it leads to pod being admitted,
* whereas a set containing more NUMA nodes - it results in pod rejection (because instead of one
  NUMA node, two or more NUMA nodes are required to satisfy the allocation).
-->
* 节点集只包含单个 NUMA 节点时，Pod 就会被接受，
* 然而，节点集包含多个 NUMA 节点时，Pod 就会被拒绝
  （因为满足该分配方案需要两个或以上的 NUMA 节点，而不是单个 NUMA 节点）。

<!--
To recap, Topology Manager first computes a set of NUMA nodes and then tests it against Topology
Manager policy, which either leads to the rejection or admission of the pod.
-->
简要地说，拓扑管理器首先计算出 NUMA 节点集，然后使用拓扑管理器策略来测试该集合，
从而决定拒绝或者接受 Pod。

<!--
## Topology manager policies
-->
## 拓扑管理器策略 {#topology-manager-policies}

<!--
Topology Manager supports four allocation policies. You can set a policy via a Kubelet flag,
`--topology-manager-policy`. There are four supported policies:

* `none` (default)
* `best-effort`
* `restricted`
* `single-numa-node`
-->
拓扑管理器支持四种分配策略。
你可以通过 Kubelet 标志 `--topology-manager-policy` 设置策略。
所支持的策略有四种：

* `none`（默认）
* `best-effort`
* `restricted`
* `single-numa-node`

{{< note >}}
<!--
If Topology Manager is configured with the **pod** scope, the container, which is considered by
the policy, is reflecting requirements of the entire pod, and thus each container from the pod
will result with **the same** topology alignment decision.
-->
如果拓扑管理器配置使用 **pod** 作用域，
那么在策略评估一个容器时，该容器反映的是整个 Pod 的要求，
所以该 Pod 里的每个容器都会应用 **相同的** 拓扑对齐决策。
{{< /note >}}

<!--
### `none` policy {#policy-none}

This is the default policy and does not perform any topology alignment.
-->
### `none` 策略 {#policy-none}

这是默认策略，不执行任何拓扑对齐。

<!--
### `best-effort` policy {#policy-best-effort}

For each container in a Pod, the kubelet, with `best-effort` topology management policy, calls
each Hint Provider to discover their resource availability. Using this information, the Topology
Manager stores the preferred NUMA Node affinity for that container. If the affinity is not
preferred, Topology Manager will store this and admit the pod to the node anyway.
-->
### `best-effort` 策略 {#policy-best-effort}

对于 Pod 中的每个容器，具有 `best-effort` 拓扑管理策略的
kubelet 将调用每个建议提供者以确定资源可用性。
使用此信息，拓扑管理器存储该容器的首选 NUMA 节点亲和性。
如果亲和性不是首选，则拓扑管理器将存储该亲和性，并且无论如何都将 Pod 接纳到该节点。

<!--
The *Hint Providers* can then use this information when making the
resource allocation decision.
-->
之后**建议提供者**可以在进行资源分配决策时使用这个信息。

<!--
### `restricted` policy {#policy-restricted}

For each container in a Pod, the kubelet, with `restricted` topology management policy, calls each
Hint Provider to discover their resource availability.  Using this information, the Topology
Manager stores the preferred NUMA Node affinity for that container. If the affinity is not
preferred, Topology Manager will reject this pod from the node. This will result in a pod in a
`Terminated` state with a pod admission failure.
-->
### `restricted` 策略 {#policy-restricted}

对于 Pod 中的每个容器，配置了 `restricted` 拓扑管理策略的 kubelet
调用每个建议提供者以确定其资源可用性。
使用此信息，拓扑管理器存储该容器的首选 NUMA 节点亲和性。
如果亲和性不是首选，则拓扑管理器将从节点中拒绝此 Pod。
这将导致 Pod 处于 `Terminated` 状态，且 Pod 无法被节点接受。

<!--
Once the pod is in a `Terminated` state, the Kubernetes scheduler will **not** attempt to
reschedule the pod. It is recommended to use a ReplicaSet or Deployment to trigger a redeploy of
the pod. An external control loop could be also implemented to trigger a redeployment of pods that
have the `Topology Affinity` error.
-->
一旦 Pod 处于 `Terminated` 状态，Kubernetes 调度器将**不会**尝试重新调度该 Pod。
建议使用 ReplicaSet 或者 Deployment 来触发重新部署 Pod。
还可以通过实现外部控制环，以触发重新部署具有 `Topology Affinity` 错误的 Pod。

<!--
If the pod is admitted, the *Hint Providers* can then use this information when making the
resource allocation decision.
-->
如果 Pod 被允许运行在某节点，则**建议提供者**可以在做出资源分配决定时使用此信息。

<!--
### `single-numa-node` policy {#policy-single-numa-node}

For each container in a Pod, the kubelet, with `single-numa-node` topology management policy,
calls each Hint Provider to discover their resource availability.  Using this information, the
Topology Manager determines if a single NUMA Node affinity is possible.  If it is, Topology
Manager will store this and the *Hint Providers* can then use this information when making the
resource allocation decision.  If, however, this is not possible then the Topology Manager will
reject the pod from the node. This will result in a pod in a `Terminated` state with a pod
admission failure.
-->
### `single-numa-node` 策略 {#policy-single-numa-node}

对于 Pod 中的每个容器，配置了 `single-numa-node` 拓扑管理策略的
kubelet 调用每个建议提供者以确定其资源可用性。
使用此信息，拓扑管理器确定是否支持单 NUMA 节点亲和性。
如果支持，则拓扑管理器将存储此信息，然后 **建议提供者** 可以在做出资源分配决定时使用此信息。
如果不支持，则拓扑管理器将拒绝 Pod 运行于该节点。
这将导致 Pod 处于 `Terminated` 状态，且 Pod 无法被节点接受。

<!--
Once the pod is in a `Terminated` state, the Kubernetes scheduler will **not** attempt to
reschedule the pod. It is recommended to use a Deployment with replicas to trigger a redeploy of
the Pod.An external control loop could be also implemented to trigger a redeployment of pods
that have the `Topology Affinity` error.
-->
一旦 Pod 处于 `Terminated` 状态，Kubernetes 调度器将不会尝试重新调度该 Pod。
建议使用多副本的 Deployment 来触发重新部署 Pod。
还可以通过实现外部控制环，以触发重新部署具有 `Topology Affinity` 错误的 Pod。

<!--
## Topology manager policy options

Support for the Topology Manager policy options requires `TopologyManagerPolicyOptions`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) to be enabled
(it is enabled by default).
-->
## 拓扑管理器策略选项  {#topology-manager-policy-options}

对拓扑管理器策略选项的支持需要启用 `TopologyManagerPolicyOptions`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)（默认启用）。

<!--
You can toggle groups of options on and off based upon their maturity level using the following feature gates:
* `TopologyManagerPolicyBetaOptions` default enabled. Enable to show beta-level options.
* `TopologyManagerPolicyAlphaOptions` default disabled. Enable to show alpha-level options.
-->
你可以使用以下特性门控根据成熟度级别打开和关闭这些选项组：

* `TopologyManagerPolicyBetaOptions` 默认启用。启用以显示 Beta 级别选项。
* `TopologyManagerPolicyAlphaOptions` 默认禁用。启用以显示 Alpha 级别选项。

<!--
You will still have to enable each option using the `TopologyManagerPolicyOptions` kubelet option.
-->
你仍然需要使用 `TopologyManagerPolicyOptions` kubelet 选项来启用每个选项。

<!--
### `prefer-closest-numa-nodes` (beta) {#policy-option-prefer-closest-numa-nodes}

The `prefer-closest-numa-nodes` option is beta since Kubernetes 1.28. In Kubernetes {{< skew currentVersion >}}
this policy option is visible by default provided that the `TopologyManagerPolicyOptions` and
`TopologyManagerPolicyBetaOptions` [feature gates](/docs/reference/command-line-tools-reference/feature-gates/)
are enabled.
-->
### `prefer-closest-numa-nodes`（Beta） {#policy-option-prefer-closest-numa-nodes}

自 Kubernetes 1.28 起，`prefer-closest-numa-nodes` 选项进入 Beta 阶段。
在 Kubernetes {{< skew currentVersion >}} 中，只要启用了
`TopologyManagerPolicyOptions` 和 `TopologyManagerPolicyBetaOptions`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，此策略选项默认可见。

<!--
The topology manager is not aware by default of NUMA distances, and does not take them into account when making
Pod admission decisions. This limitation surfaces in multi-socket, as well as single-socket multi NUMA systems,
and can cause significant performance degradation in latency-critical execution and high-throughput applications
if the topology manager decides to align resources on non-adjacent NUMA nodes.

If you specify the `prefer-closest-numa-nodes` policy option, the `best-effort` and `restricted`
policies favor sets of NUMA nodes with shorter distance between them when making admission decisions.
-->
拓扑管理器默认不会感知 NUMA 距离，并且在做出 Pod 准入决策时不会考虑这些距离。
这种限制出现在多插槽以及单插槽多 NUMA 系统中，如果拓扑管理器决定将资源对齐到不相邻的 NUMA 节点上，
可能导致执行延迟敏感和高吞吐的应用出现明显的性能下降。

如果你指定 `prefer-closest-numa-nodes` 策略选项，则在做出准入决策时 `best-effort` 和 `restricted`
策略将偏向于彼此之间距离较短的一组 NUMA 节点。

<!--
You can enable this option by adding `prefer-closest-numa-nodes=true` to the Topology Manager policy options.

By default (without this option), Topology Manager aligns resources on either a single NUMA node or,
in the case where more than one NUMA node is required, using the minimum number of NUMA nodes.
-->
你可以通过将 `prefer-closest-numa-nodes=true` 添加到拓扑管理器策略选项来启用此选项。

默认情况下，如果没有此选项，拓扑管理器会在单个 NUMA 节点或（在需要多个 NUMA 节点时）最小数量的 NUMA 节点上对齐资源。

<!--
### `max-allowable-numa-nodes` (beta) {#policy-option-max-allowable-numa-nodes}

The `max-allowable-numa-nodes` option is beta since Kubernetes 1.31. In Kubernetes {{< skew currentVersion >}}
this policy option is visible by default provided that the `TopologyManagerPolicyOptions` and
`TopologyManagerPolicyBetaOptions` [feature gates](/docs/reference/command-line-tools-reference/feature-gates/)
are enabled.
-->
### `max-allowable-numa-nodes`（Beta） {#policy-option-max-allowable-numa-nodes}

自 Kubernetes 1.31 起，`max-allowable-numa-nodes` 选项进入 Beta 阶段。
在 Kubernetes {{< skew currentVersion >}} 中，只要启用了
`TopologyManagerPolicyOptions` 和 `TopologyManagerPolicyBetaOptions`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，此策略选项默认可见。

<!--
The time to admit a pod is tied to the number of NUMA nodes on the physical machine.
By default, Kubernetes does not run a kubelet with the topology manager enabled, on any (Kubernetes) node where
more than 8 NUMA nodes are detected.
-->
Pod 被准入的时间与物理机上的 NUMA 节点数量相关。
默认情况下，Kubernetes 不会在检测到有 8 个以上 NUMA
节点的任何（Kubernetes）节点上运行启用拓扑管理器的 kubelet。

{{< note >}}
<!--
If you select the the `max-allowable-numa-nodes` policy option, nodes with more than 8 NUMA nodes can
be allowed to run with the topology manager enabled. The Kubernetes project only has limited data on the impact
of using the topology manager on (Kubernetes) nodes with more than 8 NUMA nodes. Because of that
lack of data, using this policy option with Kubernetes {{< skew currentVersion >}} is **not** recommended and is
at your own risk.
-->
如果你选择 `max-allowable-numa-nodes` 策略选项，则可以允许在有 8 个以上 NUMA 节点的节点上启用拓扑管理器。
Kubernetes 项目对在有 8 个以上 NUMA 节点的（Kubernetes）节点上使用拓扑管理器的影响只有有限的数据。
由于缺少数据，所以不推荐在 Kubernetes {{< skew currentVersion >}} 上使用此策略选项，你需自行承担风险。
{{< /note >}}

<!--
You can enable this option by adding `max-allowable-numa-nodes=true` to the Topology Manager policy options.

Setting a value of `max-allowable-numa-nodes` does not (in and of itself) affect the
latency of pod admission, but binding a Pod to a (Kubernetes) node with many NUMA does does have an impact.
Future, potential improvements to Kubernetes may improve Pod admission performance and the high
latency that happens as the number of NUMA nodes increases.
-->
你可以通过将 `max-allowable-numa-nodes=true` 添加到拓扑管理器策略选项来启用此选项。

设置 `max-allowable-numa-nodes` 的值本身不会影响 Pod 准入的延时，
但将 Pod 绑定到有多个 NUMA 节点的（Kubernetes）节点确实会产生影响。
Kubernetes 后续潜在的改进可能会提高 Pod 准入性能，并降低随着 NUMA 节点数量增加而产生的高延迟。

<!--
## Pod interactions with topology manager policies

Consider the containers in the following Pod manifest:
-->
### Pod 与拓扑管理器策略的交互 {#pod-interactions-with-topology-manager-policies}

考虑以下 Pod 清单中的容器：

```yaml
spec:
  containers:
  - name: nginx
    image: nginx
```

<!--
This pod runs in the `BestEffort` QoS class because no resource `requests` or `limits` are specified.
-->
该 Pod 以 `BestEffort` QoS 类运行，因为没有指定资源 `requests` 或 `limits`。

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
由于 `requests` 数少于 `limits`，因此该 Pod 以 `Burstable` QoS 类运行。

<!--
If the selected policy is anything other than `none`, Topology Manager would consider these Pod
specifications. The Topology Manager would consult the Hint Providers to get topology hints.
In the case of the `static`, the CPU Manager policy would return default topology hint, because
these Pods do not have explicitly request CPU resources.
-->
如果选择的策略是 `none` 以外的任何其他策略，拓扑管理器都会评估这些 Pod 的规范。
拓扑管理器会咨询建议提供者，获得拓扑建议。
若策略为 `static`，则 CPU 管理器策略会返回默认的拓扑建议，因为这些 Pod
并没有显式地请求 CPU 资源。

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
This pod with integer CPU request runs in the `Guaranteed` QoS class because `requests` are equal
to `limits`.
-->
此 Pod 独立使用 CPU 请求量，以 `Guaranteed` QoS 类运行，因为其 `requests` 值等于 `limits` 值。

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
This pod with sharing CPU request runs in the `Guaranteed` QoS class because `requests` are equal
to `limits`.
-->
此 Pod 和其他资源共享 CPU 请求量，以 `Guaranteed` QoS 类运行，因为其 `requests` 值等于 `limits` 值。


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
因为未指定 CPU 和内存请求，所以 Pod 以 `BestEffort` QoS 类运行。

<!--
The Topology Manager would consider the above pods. The Topology Manager would consult the Hint
Providers, which are CPU and Device Manager to get topology hints for the pods.

In the case of the `Guaranteed` pod with integer CPU request, the `static` CPU Manager policy
would return topology hints relating to the exclusive CPU and the Device Manager would send back
hints for the requested device.
-->
拓扑管理器将考虑以上 Pod。拓扑管理器将咨询建议提供者即 CPU 和设备管理器，以获取 Pod 的拓扑提示。
对于独立使用 CPU 请求量的 `Guaranteed` Pod，`static` CPU 管理器策略将返回独占 CPU 相关的拓扑提示，
而设备管理器将返回有关所请求设备的提示。

<!--
In the case of the `Guaranteed` pod with sharing CPU request, the `static` CPU Manager policy
would return default topology hint as there is no exclusive CPU request and the Device Manager
would send back hints for the requested device.

In the above two cases of the `Guaranteed` pod, the `none` CPU Manager policy would return default
topology hint.
-->
对于与其他资源 CPU 共享请求量的 `Guaranteed` Pod，`static` CPU
管理器策略将返回默认的拓扑提示，因为没有独享的 CPU 请求；而设备管理器
则针对所请求的设备返回有关提示。

在上述两种 `Guaranteed` Pod 的情况中，`none` CPU 管理器策略会返回默认的拓扑提示。

<!--
In the case of the `BestEffort` pod, the `static` CPU Manager policy would send back the default
topology hint as there is no CPU request and the Device Manager would send back the hints for each
of the requested devices.
-->
对于 `BestEffort` Pod，由于没有 CPU 请求，`static` CPU 管理器策略将发送默认拓扑提示，
而设备管理器将为每个请求的设备发送提示。

<!--
Using this information the Topology Manager calculates the optimal hint for the pod and stores
this information, which will be used by the Hint Providers when they are making their resource
assignments.
-->
基于此信息，拓扑管理器将为 Pod 计算最佳提示并存储该信息，并且供
提示提供程序在进行资源分配时使用。

<!--
## Known limitations

1. The maximum number of NUMA nodes that Topology Manager allows is 8. With more than 8 NUMA nodes
   there will be a state explosion when trying to enumerate the possible NUMA affinities and
   generating their hints. See [`max-allowable-numa-nodes`](#policy-option-max-allowable-numa-nodes)
   (beta) for more options.

2. The scheduler is not topology-aware, so it is possible to be scheduled on a node and then fail
   on the node due to the Topology Manager.
-->
## 已知的局限性 {#known-limitations}

1. 拓扑管理器所能处理的最大 NUMA 节点个数是 8。若 NUMA 节点数超过 8，
   枚举可能的 NUMA 亲和性并为之生成提示时会发生状态爆炸。
   更多选项参见 [`max-allowable-numa-nodes`](#policy-option-max-allowable-numa-nodes)（Beta）。
2. 调度器无法感知拓扑，所以有可能一个 Pod 被调度到一个节点之后，会因为拓扑管理器的缘故在该节点上启动失败。
