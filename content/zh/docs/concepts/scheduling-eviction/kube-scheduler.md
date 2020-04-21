---
title: Kubernetes 调度器
content_template: templates/concept
weight: 60
---

<!--
---
title: Kubernetes Scheduler
content_template: templates/concept
weight: 60
---
-->
{{% capture overview %}}

<!--
In Kubernetes, _scheduling_ refers to making sure that {{< glossary_tooltip text="Pods" term_id="pod" >}}
are matched to {{< glossary_tooltip text="Nodes" term_id="node" >}} so that
{{< glossary_tooltip term_id="kubelet" >}} can run them.
-->
在 Kubernetes 中，_调度_ 是指将 {{< glossary_tooltip text="Pod" term_id="pod" >}} 放置到合适的
{{< glossary_tooltip text="Node" term_id="node" >}} 上，然后对应 Node 上的 {{< glossary_tooltip term_id="kubelet" >}} 才能够运行这些 pod。

{{% /capture %}}

{{% capture body %}}
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
调度器通过 kubernetes 的 watch 机制来发现集群中新创建且尚未被调度到 Node 上的 Pod。调度器会将发现的每一个未调度的 Pod 调度到一个合适的 Node 上来运行。调度器会依据下文的调度原则来做出调度选择。

<!--
If you want to understand why Pods are placed onto a particular Node,
or if you're planning to implement a custom scheduler yourself, this
page will help you learn about scheduling.
-->
如果你想要理解 Pod 为什么会被调度到特定的 Node 上，或者你想要尝试实现一个自定义的调度器，这篇文章将帮助你了解调度。

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
[kube-scheduler](/zh/docs/reference/command-line-tools-reference/kube-scheduler/) 是 Kubernetes 集群的默认调度器，并且是集群 {{< glossary_tooltip text="控制面" term_id="control-plane" >}} 的一部分。如果你真的希望或者有这方面的需求，kube-scheduler 在设计上是允许你自己写一个调度组件并替换原有的 kube-scheduler。

<!--
For every newly created pods or other unscheduled pods, kube-scheduler
selects a optimal node for them to run on.  However, every container in
pods has different requirements for resources and every pod also has
different requirements. Therefore, existing nodes need to be filtered
according to the specific scheduling requirements.
-->
对每一个新创建的 Pod 或者是未被调度的 Pod，kube-scheduler 会选择一个最优的 Node 去运行这个 Pod。然而，Pod 内的每一个容器对资源都有不同的需求，而且 Pod 本身也有不同的资源需求。因此，Pod 在被调度到 Node 上之前，根据这些特定的资源调度需求，需要对集群中的 Node 进行一次过滤。

<!--
In a cluster, Nodes that meet the scheduling requirements for a Pod
are called _feasible_ nodes. If none of the nodes are suitable, the pod
remains unscheduled until the scheduler is able to place it.
-->
在一个集群中，满足一个 Pod 调度请求的所有 Node 称之为 _可调度节点_。如果没有任何一个 Node 能满足 Pod 的资源请求，那么这个 Pod 将一直停留在未调度状态直到调度器能够找到合适的 Node。

<!--
The scheduler finds feasible Nodes for a Pod and then runs a set of
functions to score the feasible Nodes and picks a Node with the highest
score among the feasible ones to run the Pod. The scheduler then notifies
the API server about this decision in a process called _binding_.
-->
调度器先在集群中找到一个 Pod 的所有可调度节点，然后根据一系列函数对这些可调度节点打分，然后选出其中得分最高的 Node 来运行 Pod。之后，调度器将这个调度决定通知给 kube-apiserver，这个过程叫做 _绑定_。

<!--
Factors that need taken into account for scheduling decisions include
individual and collective resource requirements, hardware / software /
policy constraints, affinity and anti-affinity specifications, data
locality, inter-workload interference, and so on.
-->
在做调度决定时需要考虑的因素包括：单独和整体的资源请求、硬件/软件/策略限制、亲和以及反亲和要求、数据局域性、负载间的干扰等等。

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
过滤阶段会将所有满足 Pod 调度需求的 Node 选出来。例如，PodFitsResources 过滤函数会检查候选 Node 的可用资源能否满足 Pod 的资源请求。在过滤之后，得出一个 Node 列表，里面包含了所有可调度节点；通常情况下，这个 Node 列表包含不止一个 Node。如果这个列表是空的，代表这个 Pod 不可调度。

<!--
In the _scoring_ step, the scheduler ranks the remaining nodes to choose
the most suitable Pod placement. The scheduler assigns a score to each Node
that survived filtering, basing this score on the active scoring rules.
-->
在打分阶段，调度器会为 Pod 从所有可调度节点中选取一个最合适的 Node。根据当前启用的打分规则，调度器会给每一个可调度节点进行打分。

<!--
Finally, kube-scheduler assigns the Pod to the Node with the highest ranking.
If there is more than one node with equal scores, kube-scheduler selects
one of these at random.
-->
最后，kube-scheduler 会将 Pod 调度到得分最高的 Node 上。如果存在多个得分最高的 Node，kube-scheduler 会从中随机选取一个。

<!--
### Default policies
-->
### 默认策略

<!--
kube-scheduler has a default set of scheduling policies.
-->
kube-scheduler 有一系列的默认调度策略。

<!--
### Filtering

- `PodFitsHostPorts`: Checks if a Node has free ports (the network protocol kind)
  for the Pod ports the the Pod is requesting.

- `PodFitsHost`: Checks if a Pod specifies a specific Node by it hostname.

- `PodFitsResources`: Checks if the Node has free resources (eg, CPU and Memory)
  to meet the requirement of the Pod.

- `PodMatchNodeSelector`: Checks if a Pod's Node {{< glossary_tooltip term_id="selector" >}}
   matches the Node's {{< glossary_tooltip text="label(s)" term_id="label" >}}.

- `NoVolumeZoneConflict`: Evaluate if the {{< glossary_tooltip text="Volumes" term_id="volume" >}}
  that a Pod requests are available on the Node, given the failure zone restrictions for
  that storage.

- `NoDiskConflict`: Evaluates if a Pod can fit on a Node due to the volumes it requests,
   and those that are already mounted.

- `MaxCSIVolumeCount`: Decides how many {{< glossary_tooltip text="CSI" term_id="csi" >}}
  volumes should be attached, and whether that's over a configured limit.

- `CheckNodeMemoryPressure`: If a Node is reporting memory pressure, and there's no
  configured exception, the Pod won't be scheduled there.

- `CheckNodePIDPressure`: If a Node is reporting that process IDs are scarce, and
  there's no configured exception, the Pod won't be scheduled there.

- `CheckNodeDiskPressure`: If a Node is reporting storage pressure (a filesystem that
   is full or nearly full), and there's no configured exception, the Pod won't be
   scheduled there.

- `CheckNodeCondition`: Nodes can report that they have a completely full filesystem,
  that networking isn't available or that kubelet is otherwise not ready to run Pods.
  If such a condition is set for a Node, and there's no configured exception, the Pod
  won't be scheduled there.

- `PodToleratesNodeTaints`: checks if a Pod's {{< glossary_tooltip text="tolerations" term_id="toleration" >}}
  can tolerate the Node's {{< glossary_tooltip text="taints" term_id="taint" >}}.

- `CheckVolumeBinding`: Evaluates if a Pod can fit due to the volumes it requests.
  This applies for both bound and unbound
  {{< glossary_tooltip text="PVCs" term_id="persistent-volume-claim" >}}
-->
### 过滤策略

- `PodFitsHostPorts`：如果 Pod 中定义了 hostPort 属性，那么需要先检查这个指定端口是否
  已经被 Node 上其他服务占用了。

- `PodFitsHost`：若 pod 对象拥有 hostname 属性，则检查 Node 名称字符串与此属性是否匹配。

- `PodFitsResources`：检查 Node 上是否有足够的资源（如，cpu 和内存）来满足 pod 的资源请求。

- `PodMatchNodeSelector`：检查 Node 的 {{< glossary_tooltip text="标签" term_id="label" >}} 是否能匹配
  Pod 属性上 Node 的 {{< glossary_tooltip text="标签" term_id="label" >}} 值。

- `NoVolumeZoneConflict`：检测 pod 请求的 {{< glossary_tooltip text="Volumes" term_id="volume" >}} 在
  Node 上是否可用，因为某些存储卷存在区域调度约束。

- `NoDiskConflict`：检查 Pod 对象请求的存储卷在 Node 上是否可用，若不存在冲突则通过检查。

- `MaxCSIVolumeCount`：检查 Node 上已经挂载的 {{< glossary_tooltip text="CSI" term_id="csi" >}}
  存储卷数量是否超过了指定的最大值。

- `CheckNodeMemoryPressure`：如果 Node 上报了内存资源压力过大，而且没有配置异常，那么 Pod 将不会被调度到这个 Node 上。

- `CheckNodePIDPressure`：如果 Node 上报了 PID 资源压力过大，而且没有配置异常，那么 Pod 将不会被调度到这个 Node 上。

- `CheckNodeDiskPressure`：如果 Node 上报了磁盘资源压力过大（文件系统满了或者将近满了），
  而且配置没有异常，那么 Pod 将不会被调度到这个 Node 上。

- `CheckNodeCondition`：Node 可以上报其自身的状态，如磁盘、网络不可用，表明 kubelet 未准备好运行 pod。
  如果 Node 被设置成这种状态，那么 pod 将不会被调度到这个 Node 上。

- `PodToleratesNodeTaints`：检查 pod 属性上的 {{< glossary_tooltip text="tolerations" term_id="toleration" >}} 能否容忍
  Node 的 {{< glossary_tooltip text="taints" term_id="taint" >}}。

- `CheckVolumeBinding`：检查 Node 上已经绑定的和未绑定的 {{< glossary_tooltip text="PVCs" term_id="persistent-volume-claim" >}}
  能否满足 Pod 对象的存储卷需求。

<!--
### Scoring

- `SelectorSpreadPriority`: Spreads Pods across hosts, considering Pods that
   belonging to the same {{< glossary_tooltip text="Service" term_id="service" >}},
   {{< glossary_tooltip term_id="statefulset" >}} or
   {{< glossary_tooltip term_id="replica-set" >}}.

- `InterPodAffinityPriority`: Computes a sum by iterating through the elements
  of weightedPodAffinityTerm and adding “weight” to the sum if the corresponding
  PodAffinityTerm is satisfied for that node; the node(s) with the highest sum
  are the most preferred.

- `LeastRequestedPriority`: Favors nodes with fewer requested resources. In other
  words, the more Pods that are placed on a Node, and the more resources those
  Pods use, the lower the ranking this policy will give.

- `MostRequestedPriority`: Favors nodes with most requested resources. This policy
  will fit the scheduled Pods onto the smallest number of Nodes needed to run your
  overall set of workloads.

- `RequestedToCapacityRatioPriority`: Creates a requestedToCapacity based ResourceAllocationPriority using default resource scoring function shape.

- `BalancedResourceAllocation`: Favors nodes with balanced resource usage.

- `NodePreferAvoidPodsPriority`: Priorities nodes according to the node annotation
  `scheduler.alpha.kubernetes.io/preferAvoidPods`. You can use this to hint that
  two different Pods shouldn't run on the same Node.

- `NodeAffinityPriority`: Prioritizes nodes according to node affinity scheduling
   preferences indicated in PreferredDuringSchedulingIgnoredDuringExecution.
   You can read more about this in [Assigning Pods to Nodes](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/)

- `TaintTolerationPriority`: Prepares the priority list for all the nodes, based on
  the number of intolerable taints on the node. This policy adjusts a node's rank
  taking that list into account.

- `ImageLocalityPriority`: Favors nodes that already have the
  {{< glossary_tooltip text="container images" term_id="image" >}} for that
  Pod cached locally.

- `ServiceSpreadingPriority`: For a given Service, this policy aims to make sure that
  the Pods for the Service run on different nodes. It favouring scheduling onto nodes
  that don't have Pods for the service already assigned there. The overall outcome is
  that the Service becomes more resilient to a single Node failure.

- `CalculateAntiAffinityPriorityMap`: This policy helps implement
  [pod anti-affinity](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#affinity-and-anti-affinity).

- `EqualPriorityMap`: Gives an equal weight of one to all nodes.
-->
### 打分策略

- `SelectorSpreadPriority`：尽量将归属于同一个 {{< glossary_tooltip text="Service" term_id="service" >}}、{{< glossary_tooltip term_id="statefulset" >}} 或 {{< glossary_tooltip term_id="replica-set" >}} 的 Pod 资源分散到不同的 Node 上。

- `InterPodAffinityPriority`：遍历 Pod 对象的亲和性条目，并将那些能够匹配到给定 Node 的条目的权重相加，结果值越大的 Node 得分越高。

- `LeastRequestedPriority`：空闲资源比例越高的 Node 得分越高。换句话说，Node 上的 Pod 越多，并且资源被占用的越多，那么这个 Node 的得分就会越少。

- `MostRequestedPriority`：空闲资源比例越低的 Node 得分越高。这个调度策略将会把你所有的工作负载（Pod）调度到尽量少的 Node 上。

- `RequestedToCapacityRatioPriority`：为 Node 上每个资源占用比例设定得分值，给资源打分函数在打分时使用。

- `BalancedResourceAllocation`：优选那些使得资源利用率更为均衡的节点。

- `NodePreferAvoidPodsPriority`：这个策略将根据 Node 的注解信息中是否含有 `scheduler.alpha.kubernetes.io/preferAvoidPods` 来
  计算其优先级。使用这个策略可以将两个不同 Pod 运行在不同的 Node 上。

- `NodeAffinityPriority`：基于 Pod 属性中 PreferredDuringSchedulingIgnoredDuringExecution 来进行 Node 亲和性调度。你可以通过这篇文章
  [Pods 到 Nodes 的分派](/zh/docs/concepts/configuration/assign-pod-node/) 来了解到更详细的内容。

- `TaintTolerationPriority`：基于 Pod 中对每个 Node 上污点容忍程度进行优先级评估，这个策略能够调整待选 Node 的排名。

- `ImageLocalityPriority`：Node 上已经拥有 Pod 需要的 {{< glossary_tooltip text="容器镜像" term_id="image" >}} 的 Node 会有较高的优先级。

- `ServiceSpreadingPriority`：这个调度策略的主要目的是确保将归属于同一个 Service 的 Pod 调度到不同的 Node 上。如果 Node 上
  没有归属于同一个 Service 的 Pod，这个策略更倾向于将 Pod 调度到这类 Node 上。最终的目的：即使在一个 Node 宕机之后 Service 也具有很强容灾能力。

- `CalculateAntiAffinityPriorityMap`：这个策略主要是用来实现[pod反亲和]
  (/zh/docs/concepts/configuration/assign-pod-node/#affinity-and-anti-affinity)。

- `EqualPriorityMap`：将所有的 Node 设置成相同的权重为 1。

{{% /capture %}}
{{% capture whatsnext %}}
* 阅读关于 [调度器性能调优](/zh/docs/concepts/scheduling/scheduler-perf-tuning/)
* 阅读关于 [Pod 拓扑分布约束](/zh/docs/concepts/workloads/pods/pod-topology-spread-constraints/)
* 阅读关于 kube-scheduler 的 [参考文档](/zh/docs/reference/command-line-tools-reference/kube-scheduler/)
* 了解关于 [配置多个调度器](/zh/docs/tasks/administer-cluster/configure-multiple-schedulers/) 的方式
* 了解关于 [拓扑结构管理策略](/zh/docs/tasks/administer-cluster/topology-manager/)
* 了解关于 [Pod 额外开销](/zh/docs/concepts/configuration/pod-overhead/)
{{% /capture %}}
