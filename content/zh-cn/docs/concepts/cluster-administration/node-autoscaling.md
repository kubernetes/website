---
title: Node 自动扩缩容
linkTitle: Node 自动扩缩容
description: >-
  自动在集群中制备和整合 Node，以适应需求并优化成本。
content_type: concept
weight: 15
---
<!--
reviewers:
- gjtempleton
- jonathan-innis
- maciekpytel
title: Node Autoscaling
linkTitle: Node Autoscaling
description: >-
  Automatically provision and consolidate the Nodes in your cluster to adapt to demand and optimize cost.
content_type: concept
weight: 15
-->

<!--
In order to run workloads in your cluster, you need
{{< glossary_tooltip text="Nodes" term_id="node" >}}. Nodes in your cluster can be _autoscaled_ -
dynamically [_provisioned_](#provisioning), or [_consolidated_](#consolidation) to provide needed
capacity while optimizing cost. Autoscaling is performed by Node [_autoscalers_](#autoscalers).
-->
为了在集群中运行负载，你需要 {{< glossary_tooltip text="Node" term_id="node" >}}。
集群中的 Node 可以被**自动扩缩容**：
通过动态[**制备**](#provisioning)或[**整合**](#consolidation)的方式提供所需的容量并优化成本。
自动扩缩容操作是由 Node [**Autoscaler**](#autoscalers) 执行的。

<!--
## Node provisioning {#provisioning}

If there are Pods in a cluster that can't be scheduled on existing Nodes, new Nodes can be
automatically added to the cluster&mdash;_provisioned_&mdash;to accommodate the Pods. This is
especially useful if the number of Pods changes over time, for example as a result of
[combining horizontal workload with Node autoscaling](#horizontal-workload-autoscaling).

Autoscalers provision the Nodes by creating and deleting cloud provider resources backing them. Most
commonly, the resources backing the Nodes are Virtual Machines.
-->
## Node 制备   {#provisioning}

当集群中有 Pod 无法被调度到现有 Node 上时，系统将**制备**新的 Node 并将其添加到集群中，以容纳这些 Pod。
如果由于组合使用[水平负载和 Node 自动扩缩容](#horizontal-workload-autoscaling)使得
Pod 个数随着时间发生变化，这种自动扩缩容机制将特别有用。

Autoscaler 通过创建和删除云驱动基础资源来制备 Node。最常见的支撑 Node 的资源是虚拟机（VM）。

<!--
The main goal of provisioning is to make all Pods schedulable. This goal is not always attainable
because of various limitations, including reaching configured provisioning limits, provisioning
configuration not being compatible with a particular set of pods, or the lack of cloud provider
capacity. While provisioning, Node autoscalers often try to achieve additional goals (for example
minimizing the cost of the provisioned Nodes or balancing the number of Nodes between failure
domains).
-->
制备的主要目标是使所有 Pod 可调度。
由于各种限制（如已达到配置的制备上限、制备配置与特定 Pod 集不兼容或云驱动容量不足），此目标不一定总是可以实现。
在制备之时，Node Autoscaler 通常还会尝试实现其他目标（例如最小化制备 Node 的成本或在故障域之间平衡 Node 的数量）。

<!--
There are two main inputs to a Node autoscaler when determining Nodes to
provision&mdash;[Pod scheduling constraints](#provisioning-pod-constraints),
and [Node constraints imposed by autoscaler configuration](#provisioning-node-constraints).

Autoscaler configuration may also include other Node provisioning triggers (for example the number
of Nodes falling below a configured minimum limit).
-->
在决定制备 Node 时针对 Node Autoscaler 有两个主要输入：

- [Pod 调度约束](#provisioning-pod-constraints)
- [Autoscaler 配置所施加的 Node 约束](#provisioning-node-constraints)

Autoscaler 配置也可以包含其他 Node 制备触发条件（例如 Node 个数低于配置的最小限制值）。

{{< note >}}
<!--
Provisioning was formerly known as _scale-up_ in Cluster Autoscaler.
-->
在 Cluster Autoscaler 中，制备以前称为**扩容**。
{{< /note >}}

<!--
### Pod scheduling constraints {#provisioning-pod-constraints}

Pods can express [scheduling constraints](/docs/concepts/scheduling-eviction/assign-pod-node/) to
impose limitations on the kind of Nodes they can be scheduled on. Node autoscalers take these
constraints into account to ensure that the pending Pods can be scheduled on the provisioned Nodes.
-->
### Pod 调度约束 {#provisioning-pod-constraints}

Pod 可以通过[调度约束](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/)表达只能调度到特定类别 Node 的限制。
Node Autoscaler 会考虑这些约束，确保 Pending 的 Pod 可以被调度到这些制备的 Node 上。

<!--
The most common kind of scheduling constraints are the resource requests specified by Pod
containers. Autoscalers will make sure that the provisioned Nodes have enough resources to satisfy
the requests. However, they don't directly take into account the real resource usage of the Pods
after they start running. In order to autoscale Nodes based on actual workload resource usage, you
can combine [horizontal workload autoscaling](#horizontal-workload-autoscaling) with Node
autoscaling.

Other common Pod scheduling constraints include
[Node affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity),
[inter-Pod affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity),
or a requirement for a particular [storage volume](/docs/concepts/storage/volumes/).
-->
最常见的调度约束是通过 Pod 容器所指定的资源请求。
Autoscaler 将确保制备的 Node 具有足够资源来满足这些请求。
但是，Autoscaler 不会在 Pod 开始运行之后直接考虑这些 Pod 的真实资源用量。
要根据实际负载资源用量自动扩缩容 Node，
你可以组合使用[水平负载自动扩缩容](#horizontal-workload-autoscaling)和 Node 自动扩缩容。

其他常见的 Pod 调度约束包括
[Node 亲和性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)、
[Pod 间亲和性/反亲和性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)或特定[存储卷](/docs/concepts/storage/volumes/)的要求。

<!--
### Node constraints imposed by autoscaler configuration {#provisioning-node-constraints}

The specifics of the provisioned Nodes (for example the amount of resources, the presence of a given
label) depend on autoscaler configuration. Autoscalers can either choose them from a pre-defined set
of Node configurations, or use [auto-provisioning](#autoprovisioning).
-->
### Autoscaler 配置施加的 Node 约束    {#provisioning-node-constraints}

已制备的 Node 的具体规格（例如资源量、给定标签的存在与否）取决于 Autoscaler 配置。
Autoscaler 可以从一组预定义的 Node 配置中进行选择，或使用[自动制备](#autoprovisioning)。

<!--
### Auto-provisioning {#autoprovisioning}

Node auto-provisioning is a mode of provisioning in which a user doesn't have to fully configure the
specifics of the Nodes that can be provisioned. Instead, the autoscaler dynamically chooses the Node
configuration based on the pending Pods it's reacting to, as well as pre-configured constraints (for
example, the minimum amount of resources or the need for a given label).
-->
### 自动制备   {#autoprovisioning}

Node 自动制备是一种用户无需完全配置 Node 容许制备规格的制备模式。
Autoscaler 会基于 Pending 的 Pod 和预配置的约束（例如最小资源量或给定标签的需求）动态选择 Node 配置。

<!--
## Node consolidation {#consolidation}

The main consideration when running a cluster is ensuring that all schedulable pods are running,
whilst keeping the cost of the cluster as low as possible. To achieve this, the Pods' resource
requests should utilize as much of the Nodes' resources as possible. From this perspective, the
overall Node utilization in a cluster can be used as a proxy for how cost-effective the cluster is.
-->
## Node 整合     {#consolidation}

运行集群时的主要考量是确保所有可调度 Pod 都在运行，并尽可能降低集群成本。
为此，Pod 的资源请求应尽可能利用 Node 的更多资源。
从这个角度看，集群中的整体 Node 利用率可以用作集群成本效益的参考指标。

{{< note >}}
<!--
Correctly setting the resource requests of your Pods is as important to the overall
cost-effectiveness of a cluster as optimizing Node utilization.
Combining Node autoscaling with [vertical workload autoscaling](#vertical-workload-autoscaling) can
help you achieve this.
-->
对于集群的整体成本效益而言，正确设置 Pod 的资源请求与优化 Node 的利用率同样重要。
将 Node 自动扩缩容与[垂直负载自动扩缩容](#vertical-workload-autoscaling)结合使用有助于实现这一目标。
{{< /note >}}

<!--
Nodes in your cluster can be automatically _consolidated_ in order to improve the overall Node
utilization, and in turn the cost-effectiveness of the cluster. Consolidation happens through
removing a set of underutilized Nodes from the cluster. Optionally, a different set of Nodes can
be [provisioned](#provisioning) to replace them.

Consolidation, like provisioning, only considers Pod resource requests and not real resource usage
when making decisions.
-->
集群中的 Node 可以被自动**整合**，以提高整体 Node 利用率以及集群的成本效益。
整合操作通过移除一组利用率低的 Node 来实现。有时会同时[制备](#provisioning)一组不同的 Node 来替代。

与制备类似，整合操作在做出决策时仅考虑 Pod 的资源请求而非实际的资源用量。

<!--
For the purpose of consolidation, a Node is considered _empty_ if it only has DaemonSet and static
Pods running on it. Removing empty Nodes during consolidation is more straightforward than non-empty
ones, and autoscalers often have optimizations designed specifically for consolidating empty Nodes.

Removing non-empty Nodes during consolidation is disruptive&mdash;the Pods running on them are
terminated, and possibly have to be recreated (for example by a Deployment). However, all such
recreated Pods should be able to schedule on existing Nodes in the cluster, or the replacement Nodes
provisioned as part of consolidation. __No Pods should normally become pending as a result of
consolidation.__
-->
在整合过程中，如果一个 Node 上仅运行 DaemonSet 和静态 Pod，这个 Node 就会被视为**空的**。
在整合期间移除空的 Node 要比操作非空 Node 更简单直接，Autoscaler 通常针对空 Node 整合进行优化。

在整合期间移除非空 Node 会有破坏性：Node 上运行的 Pod 会被终止，且可能需要被重新创建（例如由 Deployment 重新创建）。
不过，所有被重新创建的 Pod 都应该能够被调度到集群中的现有 Node 上，或调度到作为整合一部分而制备的替代 Node 上。
__正常情况下，整合操作不应导致 Pod 处于 Pending 状态。__

{{< note >}}
<!--
Autoscalers predict how a recreated Pod will likely be scheduled after a Node is provisioned or
consolidated, but they don't control the actual scheduling. Because of this, some Pods might
become pending as a result of consolidation - if for example a completely new Pod appears while
consolidation is being performed.
-->
Autoscaler 会预测在 Node 被制备或整合后重新创建的 Pod 将可能以何种方式调度，但 Autoscaler 不控制实际的调度行为。
因此，某些 Pod 可能由于整合操作而进入 Pending 状态。例如在执行整合过程中，出现一个全新的 Pod。
{{< /note >}}

<!--
Autoscaler configuration may also enable triggering consolidation by other conditions (for example,
the time elapsed since a Node was created), in order to optimize different properties (for example,
the maximum lifespan of Nodes in a cluster).

The details of how consolidation is performed depend on the configuration of a given autoscaler.
-->
Autoscaler 配置还可以设为由其他状况触发整合（例如 Node 被创建后用掉的时间），以优化属性（例如集群中 Node 的最大生命期）。

执行整合的具体方式取决于给定 Autoscaler 的配置。

{{< note >}}
<!--
Consolidation was formerly known as _scale-down_ in Cluster Autoscaler.
-->
在 Cluster Autoscaler 中， 整合以前称为**缩容**。
{{< /note >}}

<!--
## Autoscalers {#autoscalers}

The functionalities described in previous sections are provided by Node _autoscalers_. In addition
to the Kubernetes API, autoscalers also need to interact with cloud provider APIs to provision and
consolidate Nodes. This means that they need to be explicitly integrated with each supported cloud
provider. The performance and feature set of a given autoscaler can differ between cloud provider
integrations.
-->
## Autoscaler   {#autoscalers}

上述章节中所述的功能由 Node **Autoscaler** 提供。
除了 Kubernetes API 之外，Autoscaler 还需要与云驱动 API 交互来制备和整合 Node。
这意味着 Autoscaler 需要与每个支持的云驱动进行显式集成。
给定的 Autoscaler 的性能和特性集在不同云驱动集成之间可能有所不同。

{{< mermaid >}}
graph TD
    na[Node Autoscaler]
    k8s[Kubernetes]
    cp[云驱动]

    k8s --> |获取 Pod/Node|na
    na --> |腾空 Node|k8s
    na --> |创建/移除支撑 Node 的资源|cp
    cp --> |获取支撑 Node 的资源|na

    classDef white_on_blue fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef blue_on_white fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class na blue_on_white;
    class k8s,cp white_on_blue;
{{</ mermaid >}}

<!--
### Autoscaler implementations

[Cluster Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler)
and [Karpenter](https://github.com/kubernetes-sigs/karpenter) are the two Node autoscalers currently
sponsored by [SIG Autoscaling](https://github.com/kubernetes/community/tree/master/sig-autoscaling).

From the perspective of a cluster user, both autoscalers should provide a similar Node autoscaling
experience. Both will provision new Nodes for unschedulable Pods, and both will consolidate the
Nodes that are no longer optimally utilized.
-->
### Autoscaler 实现

[Cluster Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler)
和 [Karpenter](https://github.com/kubernetes-sigs/karpenter)
是目前由 [SIG Autoscaling](https://github.com/kubernetes/community/tree/master/sig-autoscaling)
维护的两个 Node Autoscaler。

对于集群用户来说，这两个 Autoscaler 都应提供类似的 Node 自动扩缩容体验。
两个 Autoscaler 都将为不可调度的 Pod 制备新的 Node，也都会整合利用率不高的 Node。

<!--
Different autoscalers may also provide features outside the Node autoscaling scope described on this
page, and those additional features may differ between them.

Consult the sections below, and the linked documentation for the individual autoscalers to decide
which autoscaler fits your use case better.
-->
不同的 Autoscaler 还可能提供本文所述的 Node 自动扩缩容范围之外的其他特性，且这些额外的特性也会有所不同。

请参阅以下章节和特定 Autoscaler 的关联文档，了解哪个 Autoscaler 更适合你的使用场景。

<!--
#### Cluster Autoscaler

Cluster Autoscaler adds or removes Nodes to pre-configured _Node groups_. Node groups generally map
to some sort of cloud provider resource group (most commonly a Virtual Machine group). A single
instance of Cluster Autoscaler can simultaneously manage multiple Node groups. When provisioning,
Cluster Autoscaler will add Nodes to the group that best fits the requests of pending Pods. When
consolidating, Cluster Autoscaler always selects specific Nodes to remove, as opposed to just
resizing the underlying cloud provider resource group.
-->
#### Cluster Autoscaler

Cluster Autoscaler 通过向预先配置的 **Node 组**添加或移除 Node。
Node 组通常映射为某种云驱动资源组（最常见的是虚拟机组）。
单实例的 Cluster Autoscaler 将可以同时管理多个 Node 组。
在制备时，Cluster Autoscaler 将把 Node 添加到最贴合 Pending Pod 请求的组。
在整合时，Cluster Autoscaler 始终选择要移除的特定 Node，而不只是重新调整云驱动资源组的大小。

<!--
Additional context:

* [Documentation overview](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/README.md)
* [Cloud provider integrations](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/README.md#faqdocumentation)
* [Cluster Autoscaler FAQ](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md)
* [Contact](https://github.com/kubernetes/community/tree/master/sig-autoscaling#contact)
-->
更多信息：

* [文档概述](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/README.md)
* [云驱动集成](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/README.md#faqdocumentation)
* [Cluster Autoscaler FAQ](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md)
* [联系方式](https://github.com/kubernetes/community/tree/master/sig-autoscaling#contact)

#### Karpenter

<!--
Karpenter auto-provisions Nodes based on [NodePool](https://karpenter.sh/docs/concepts/nodepools/)
configurations provided by the cluster operator. Karpenter handles all aspects of node lifecycle,
not just autoscaling. This includes automatically refreshing Nodes once they reach a certain
lifetime, and auto-upgrading Nodes when new worker Node images are released. It works directly with
individual cloud provider resources (most commonly individual Virtual Machines), and doesn't rely on
cloud provider resource groups.
-->
Karpenter 基于集群操作员所提供的 [NodePool](https://karpenter.sh/docs/concepts/nodepools/)
配置来自动制备 Node。Karpenter 处理 Node 生命周期的所有方面，而不仅仅是自动扩缩容。
这包括 Node 达到某个生命期后的自动刷新，以及在有新 Worker Node 镜像被发布时的自动升级。
Karpenter 直接与特定的云驱动资源（通常是单独的虚拟机）交互，不依赖云驱动资源组。

<!--
Additional context:

* [Documentation](https://karpenter.sh/)
* [Cloud provider integrations](https://github.com/kubernetes-sigs/karpenter?tab=readme-ov-file#karpenter-implementations)
* [Karpenter FAQ](https://karpenter.sh/docs/faq/)
* [Contact](https://github.com/kubernetes-sigs/karpenter#community-discussion-contribution-and-support)
-->
更多上下文信息：

* [官方文档](https://karpenter.sh/)
* [云驱动集成](https://github.com/kubernetes-sigs/karpenter?tab=readme-ov-file#karpenter-implementations)
* [Karpenter FAQ](https://karpenter.sh/docs/faq/)
* [联系方式](https://github.com/kubernetes-sigs/karpenter#community-discussion-contribution-and-support)

<!--
#### Implementation comparison

Main differences between Cluster Autoscaler and Karpenter:

* Cluster Autoscaler provides features related to just Node autoscaling. Karpenter has a wider
  scope, and also provides features intended for managing Node lifecycle altogether (for example,
  utilizing disruption to auto-recreate Nodes once they reach a certain lifetime, or auto-upgrade
  them to new versions).
-->
#### 实现对比

Cluster Autoscaler 和 Karpenter 之间的主要差异：

* Cluster Autoscaler 仅提供与 Node 自动扩缩容相关的特性。
  而 Karpenter 的特性范围更大，还提供 Node 生命周期管理
  （例如在 Node 达到某个生命期后利用中断来自动重新创建 Node，或自动将 Node 升级到新版本）。

<!--
* Cluster Autoscaler doesn't support auto-provisioning, the Node groups it can provision from have
  to be pre-configured. Karpenter supports auto-provisioning, so the user only has to configure a
  set of constraints for the provisioned Nodes, instead of fully configuring homogenous groups.
* Cluster Autoscaler provides cloud provider integrations directly, which means that they're a part
  of the Kubernetes project. For Karpenter, the Kubernetes project publishes Karpenter as a library
  that cloud providers can integrate with to build a Node autoscaler.
* Cluster Autoscaler provides integrations with numerous cloud providers, including smaller and less
  popular providers. There are fewer cloud providers that integrate with Karpenter, including
  [AWS](https://github.com/aws/karpenter-provider-aws), and
  [Azure](https://github.com/Azure/karpenter-provider-azure).
-->
* Cluster Autoscaler 不支持自动制备，其可以制备的 Node 组必须被预先配置。
  Karpenter 支持自动制备，因此用户只需为制备的 Node 配置一组约束，而不需要完整同质化的组。
* Cluster Autoscaler 直接提供云驱动集成，这意味着这些集成组件是 Kubernetes 项目的一部分。
  对于 Karpenter，Kubernetes 将 Karpenter 发布为一个库，云驱动可以集成这个库来构建 Node Autoscaler。
* Cluster Autoscaler 为众多云驱动提供集成，包括一些小众的云驱动。
  Karpenter 支持的云驱动相对较少，目前包括
  [AWS](https://github.com/aws/karpenter-provider-aws) 和
  [Azure](https://github.com/Azure/karpenter-provider-azure)。

<!--
## Combine workload and Node autoscaling

### Horizontal workload autoscaling {#horizontal-workload-autoscaling}

Node autoscaling usually works in response to Pods&mdash;it provisions new Nodes to accommodate
unschedulable Pods, and then consolidates the Nodes once they're no longer needed.
-->
## 组合使用负载自动扩缩容与 Node 自动扩缩容   {#combine-workload-and-node-autoscaling}

### 水平负载自动扩缩容   {#horizontal-workload-autoscaling}

Node 自动扩缩容通常是为了响应 Pod 而发挥作用的。
它会制备新的 Node 容纳不可调度的 Pod，并在不再需要这些 Pod 时整合 Node。

<!--
[Horizontal workload autoscaling](/docs/concepts/workloads/autoscaling#scaling-workloads-horizontally)
automatically scales the number of workload replicas to maintain a desired average resource
utilization across the replicas. In other words, it automatically creates new Pods in response to
application load, and then removes the Pods once the load decreases.

You can use Node autoscaling together with horizontal workload autoscaling to autoscale the Nodes in
your cluster based on the average real resource utilization of your Pods.
-->
[水平负载自动扩缩容](/zh-cn/docs/concepts/workloads/autoscaling#scaling-workloads-horizontally)
自动扩缩负载副本的个数以保持各个副本达到预期的平均资源利用率。
换言之，它会基于应用负载而自动创建新的 Pod，并在负载减少时移除 Pod。

<!--
If the application load increases, the average utilization of its Pods should also increase,
prompting workload autoscaling to create new Pods. Node autoscaling should then provision new Nodes
to accommodate the new Pods.

Once the application load decreases, workload autoscaling should remove unnecessary Pods. Node
autoscaling should, in turn, consolidate the Nodes that are no longer needed.

If configured correctly, this pattern ensures that your application always has the Node capacity to
handle load spikes if needed, but you don't have to pay for the capacity when it's not needed.
-->
如果应用负载增加，其 Pod 的平均利用率也会增加，将提示负载自动扩缩容以创建新的 Pod。
Node 自动扩缩容随之应制备新的 Node 以容纳新的 Pod。

一旦应用负载减少，负载自动扩缩容应移除不必要的 Pod。
Node 自动扩缩容应按序整合不再需要的 Node。

如果配置正确，这种模式确保你的应用在需要时始终有足够的 Node 容量处理突发负载，你也无需在闲置时为这些 Node 容量支付费用。

<!--
### Vertical workload autoscaling {#vertical-workload-autoscaling}

When using Node autoscaling, it's important to set Pod resource requests correctly. If the requests
of a given Pod are too low, provisioning a new Node for it might not help the Pod actually run.
If the requests of a given Pod are too high, it might incorrectly prevent consolidating its Node.
-->
### 垂直负载自动扩缩容   {#vertical-workload-autoscaling}

在使用 Node 自动扩缩容时，重要的是正确设置 Pod 资源请求。
如果给定 Pod 的请求过低，为其制备新的 Node 可能对 Pod 实际运行并无帮助。
如果给定 Pod 的请求过高，则可能对整合 Node 有所妨碍。

<!--
[Vertical workload autoscaling](/docs/concepts/workloads/autoscaling#scaling-workloads-vertically)
automatically adjusts the resource requests of your Pods based on their historical resource usage.

You can use Node autoscaling together with vertical workload autoscaling in order to adjust the
resource requests of your Pods while preserving Node autoscaling capabilities in your cluster.
-->
[垂直负载自动扩缩容](/zh-cn/docs/concepts/workloads/autoscaling#scaling-workloads-vertically)
基于其历史资源用量来自动调整 Pod 的资源请求。

你可以一起使用 Node 自动扩缩容和垂直负载自动扩缩容，以便在集群中保留 Node 自动扩缩容能力的同时调节 Pod 的资源请求。

{{< caution >}}
<!--
When using Node autoscaling, it's not recommended to set up vertical workload autoscaling for
DaemonSet Pods. Autoscalers have to predict what DaemonSet Pods on a new Node will look like in
order to predict available Node resources. Vertical workload autoscaling might make these
predictions unreliable, leading to incorrect scaling decisions.
-->
在使用 Node 自动扩缩容时，不推荐为 DaemonSet Pod 配置垂直负载自动扩缩容。
Autoscaler 需要预测新 Node 上的 DaemonSet Pod 情况，才能预测可用的 Node 资源。
垂直负载自动扩缩容可能会让这些预测不可靠，导致扩缩容决策出错。
{{</ caution >}}

<!--
## Related components

This section describes components providing functionality related to Node autoscaling.

### Descheduler

The [descheduler](https://github.com/kubernetes-sigs/descheduler) is a component providing Node
consolidation functionality based on custom policies, as well as other features related to
optimizing Nodes and Pods (for example deleting frequently restarting Pods).
-->
## 相关组件   {#related-components}

本节以下组件提供与 Node 自动扩缩容相关的功能。

### Descheduler

[Descheduler](https://github.com/kubernetes-sigs/descheduler)
组件基于自定义策略提供 Node 整合功能，以及与优化 Node 和 Pod 相关的其他特性（例如删除频繁重启的 Pod）。

<!--
### Workload autoscalers based on cluster size

[Cluster Proportional Autoscaler](https://github.com/kubernetes-sigs/cluster-proportional-autoscaler)
and [Cluster Proportional Vertical
Autoscaler](https://github.com/kubernetes-sigs/cluster-proportional-vertical-autoscaler) provide
horizontal, and vertical workload autoscaling based on the number of Nodes in the cluster. You can
read more in
[autoscaling based on cluster size](/docs/concepts/workloads/autoscaling#autoscaling-based-on-cluster-size).
-->
### 基于集群规模的负载 Autoscaler

[Cluster Proportional Autoscaler](https://github.com/kubernetes-sigs/cluster-proportional-autoscaler) 和
[Cluster Proportional Vertical Autoscaler](https://github.com/kubernetes-sigs/cluster-proportional-vertical-autoscaler)
基于集群中的 Node 个数进行水平和垂直负载自动扩缩容。
更多细节参阅[基于集群规模自动扩缩容](/zh-cn/docs/concepts/workloads/autoscaling#autoscaling-based-on-cluster-size)。

## {{% heading "whatsnext" %}}

<!--
- Read about [workload-level autoscaling](/docs/concepts/workloads/autoscaling/)
-->
- 阅读[负载层面的自动扩缩容](/zh-cn/docs/concepts/workloads/autoscaling/)
