---
title: Kubernetes 调度器
content_type: concept
weight: 50
---

<!--
title: Kubernetes Scheduler
content_type: concept
weight: 50
-->
<!-- overview -->

<!--
In Kubernetes, _scheduling_ refers to making sure that {{< glossary_tooltip text="Pods" term_id="pod" >}}
are matched to {{< glossary_tooltip text="Nodes" term_id="node" >}} so that
{{< glossary_tooltip term_id="kubelet" >}} can run them.
-->
在 Kubernetes 中，_调度_ 是指将 {{< glossary_tooltip text="Pod" term_id="pod" >}} 放置到合适的
{{< glossary_tooltip text="Node" term_id="node" >}} 上，然后对应 Node 上的
{{< glossary_tooltip term_id="kubelet" >}} 才能够运行这些 pod。

<!-- body -->
<!--
## Scheduling overview {#scheduling}
-->
## 调度概览 {#scheduling}

<!--
A scheduler watches for newly created Pods that have no Node assigned. For
every Pod that the scheduler discovers, the scheduler becomes responsible
for finding the best Node for that Pod to run on. The scheduler reaches
this placement decision taking into account the scheduling principles
described below.
-->
调度器通过 kubernetes 的监测（Watch）机制来发现集群中新创建且尚未被调度到 Node 上的 Pod。
调度器会将发现的每一个未调度的 Pod 调度到一个合适的 Node 上来运行。
调度器会依据下文的调度原则来做出调度选择。

<!--
If you want to understand why Pods are placed onto a particular Node,
or if you're planning to implement a custom scheduler yourself, this
page will help you learn about scheduling.
-->
如果你想要理解 Pod 为什么会被调度到特定的 Node 上，或者你想要尝试实现
一个自定义的调度器，这篇文章将帮助你了解调度。

<!--
## kube-scheduler
-->
## kube-scheduler

<!--
[kube-scheduler](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler/)
is the default scheduler for Kubernetes and runs as part of the
{{< glossary_tooltip text="control plane" term_id="control-plane" >}}.
kube-scheduler is designed so that, if you want and need to, you can
write your own scheduling component and use that instead.
-->
[kube-scheduler](/zh/docs/reference/command-line-tools-reference/kube-scheduler/)
是 Kubernetes 集群的默认调度器，并且是集群
{{< glossary_tooltip text="控制面" term_id="control-plane" >}} 的一部分。
如果你真的希望或者有这方面的需求，kube-scheduler 在设计上是允许
你自己写一个调度组件并替换原有的 kube-scheduler。

<!--
For every newly created pods or other unscheduled pods, kube-scheduler
selects a optimal node for them to run on.  However, every container in
pods has different requirements for resources and every pod also has
different requirements. Therefore, existing nodes need to be filtered
according to the specific scheduling requirements.
-->
对每一个新创建的 Pod 或者是未被调度的 Pod，kube-scheduler 会选择一个最优的
Node 去运行这个 Pod。然而，Pod 内的每一个容器对资源都有不同的需求，而且
Pod 本身也有不同的资源需求。因此，Pod 在被调度到 Node 上之前，
根据这些特定的资源调度需求，需要对集群中的 Node 进行一次过滤。

<!--
In a cluster, Nodes that meet the scheduling requirements for a Pod
are called _feasible_ nodes. If none of the nodes are suitable, the pod
remains unscheduled until the scheduler is able to place it.
-->
在一个集群中，满足一个 Pod 调度请求的所有 Node 称之为 _可调度节点_。
如果没有任何一个 Node 能满足 Pod 的资源请求，那么这个 Pod 将一直停留在
未调度状态直到调度器能够找到合适的 Node。

<!--
The scheduler finds feasible Nodes for a Pod and then runs a set of
functions to score the feasible Nodes and picks a Node with the highest
score among the feasible ones to run the Pod. The scheduler then notifies
the API server about this decision in a process called _binding_.
-->
调度器先在集群中找到一个 Pod 的所有可调度节点，然后根据一系列函数对这些可调度节点打分，
选出其中得分最高的 Node 来运行 Pod。之后，调度器将这个调度决定通知给
kube-apiserver，这个过程叫做 _绑定_。

<!--
Factors that need taken into account for scheduling decisions include
individual and collective resource requirements, hardware / software /
policy constraints, affinity and anti-affinity specifications, data
locality, inter-workload interference, and so on.
-->
在做调度决定时需要考虑的因素包括：单独和整体的资源请求、硬件/软件/策略限制、
亲和以及反亲和要求、数据局域性、负载间的干扰等等。

<!--
## Scheduling with kube-scheduler {#kube-scheduler-implementation}
-->
## kube-scheduler 调度流程 {#kube-scheduler-implementation}

<!--
kube-scheduler selects a node for the pod in a 2-step operation:

1. Filtering
2. Scoring
-->
kube-scheduler 给一个 pod 做调度选择包含两个步骤：

1. 过滤
2. 打分

<!--
The _filtering_ step finds the set of Nodes where it's feasible to
schedule the Pod. For example, the PodFitsResources filter checks whether a
candidate Node has enough available resource to meet a Pod's specific
resource requests. After this step, the node list contains any suitable
Nodes; often, there will be more than one. If the list is empty, that
Pod isn't (yet) schedulable.
-->
过滤阶段会将所有满足 Pod 调度需求的 Node 选出来。
例如，PodFitsResources 过滤函数会检查候选 Node 的可用资源能否满足 Pod 的资源请求。
在过滤之后，得出一个 Node 列表，里面包含了所有可调度节点；通常情况下，
这个 Node 列表包含不止一个 Node。如果这个列表是空的，代表这个 Pod 不可调度。

<!--
In the _scoring_ step, the scheduler ranks the remaining nodes to choose
the most suitable Pod placement. The scheduler assigns a score to each Node
that survived filtering, basing this score on the active scoring rules.
-->
在打分阶段，调度器会为 Pod 从所有可调度节点中选取一个最合适的 Node。
根据当前启用的打分规则，调度器会给每一个可调度节点进行打分。

<!--
Finally, kube-scheduler assigns the Pod to the Node with the highest ranking.
If there is more than one node with equal scores, kube-scheduler selects
one of these at random.
-->
最后，kube-scheduler 会将 Pod 调度到得分最高的 Node 上。
如果存在多个得分最高的 Node，kube-scheduler 会从中随机选取一个。

<!--
There are two supported ways to configure the filtering and scoring behavior
of the scheduler:
-->
支持以下两种方式配置调度器的过滤和打分行为：

<!--
1. [Scheduling Policies](/docs/reference/scheduling/policies) allow you to
  configure _Predicates_ for filtering and _Priorities_ for scoring.
1. [Scheduling Profiles](/docs/reference/scheduling/config/#profiles) allow you to
  configure Plugins that implement different scheduling stages, including:
  `QueueSort`, `Filter`, `Score`, `Bind`, `Reserve`, `Permit`, and others. You
  can also configure the kube-scheduler to run different profiles.
 -->
1. [调度策略](/zh/docs/reference/scheduling/policies) 允许你配置过滤的 _断言(Predicates)_
   和打分的 _优先级(Priorities)_ 。
2. [调度配置](/zh/docs/reference/scheduling/config/#profiles) 允许你配置实现不同调度阶段的插件，
   包括：`QueueSort`, `Filter`, `Score`, `Bind`, `Reserve`, `Permit` 等等。
   你也可以配置 kube-scheduler 运行不同的配置文件。

## {{% heading "whatsnext" %}}
<!--
* Read about [scheduler performance tuning](/docs/concepts/scheduling-eviction/scheduler-perf-tuning/)
* Read about [Pod topology spread constraints](/docs/concepts/workloads/pods/pod-topology-spread-constraints/)
* Read the [reference documentation](/docs/reference/command-line-tools-reference/kube-scheduler/) for kube-scheduler
* Learn about [configuring multiple schedulers](/docs/tasks/extend-kubernetes/configure-multiple-schedulers/)
* Learn about [topology management policies](/docs/tasks/administer-cluster/topology-manager/)
* Learn about [Pod Overhead](/docs/concepts/scheduling-eviction/pod-overhead/)
-->
* 阅读关于 [调度器性能调优](/zh/docs/concepts/scheduling-eviction/scheduler-perf-tuning/)
* 阅读关于 [Pod 拓扑分布约束](/zh/docs/concepts/workloads/pods/pod-topology-spread-constraints/)
* 阅读关于 kube-scheduler 的 [参考文档](/zh/docs/reference/command-line-tools-reference/kube-scheduler/)
* 了解关于 [配置多个调度器](/zh/docs/tasks/extend-kubernetes/configure-multiple-schedulers/) 的方式
* 了解关于 [拓扑结构管理策略](/zh/docs/tasks/administer-cluster/topology-manager/)
* 了解关于 [Pod 额外开销](/zh/docs/concepts/scheduling-eviction/pod-overhead/)
