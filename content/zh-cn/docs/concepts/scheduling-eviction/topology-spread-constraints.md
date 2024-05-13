---
title: Pod 拓扑分布约束
content_type: concept
weight: 40
---
<!--
title: Pod Topology Spread Constraints
content_type: concept
weight: 40
-->

<!-- overview -->

<!--
You can use _topology spread constraints_ to control how
{{< glossary_tooltip text="Pods" term_id="Pod" >}} are spread across your cluster
among failure-domains such as regions, zones, nodes, and other user-defined topology
domains. This can help to achieve high availability as well as efficient resource
utilization.

You can set [cluster-level constraints](#cluster-level-default-constraints) as a default,
or configure topology spread constraints for individual workloads.
-->
你可以使用 **拓扑分布约束（Topology Spread Constraints）** 来控制
{{< glossary_tooltip text="Pod" term_id="Pod" >}} 在集群内故障域之间的分布，
例如区域（Region）、可用区（Zone）、节点和其他用户自定义拓扑域。
这样做有助于实现高可用并提升资源利用率。

你可以将[集群级约束](#cluster-level-default-constraints)设为默认值，或为个别工作负载配置拓扑分布约束。

<!-- body -->

<!--
## Motivation

Imagine that you have a cluster of up to twenty nodes, and you want to run a
{{< glossary_tooltip text="workload" term_id="workload" >}}
that automatically scales how many replicas it uses. There could be as few as
two Pods or as many as fifteen.
When there are only two Pods, you'd prefer not to have both of those Pods run on the
same node: you would run the risk that a single node failure takes your workload
offline.

In addition to this basic usage, there are some advanced usage examples that
enable your workloads to benefit on high availability and cluster utilization.
-->
## 动机 {#motivation}

假设你有一个最多包含二十个节点的集群，你想要运行一个自动扩缩的
{{< glossary_tooltip text="工作负载" term_id="workload" >}}，请问要使用多少个副本？
答案可能是最少 2 个 Pod，最多 15 个 Pod。
当只有 2 个 Pod 时，你倾向于这 2 个 Pod 不要同时在同一个节点上运行：
你所遭遇的风险是如果放在同一个节点上且单节点出现故障，可能会让你的工作负载下线。

除了这个基本的用法之外，还有一些高级的使用案例，能够让你的工作负载受益于高可用性并提高集群利用率。

<!--
As you scale up and run more Pods, a different concern becomes important. Imagine
that you have three nodes running five Pods each. The nodes have enough capacity
to run that many replicas; however, the clients that interact with this workload
are split across three different datacenters (or infrastructure zones). Now you
have less concern about a single node failure, but you notice that latency is
higher than you'd like, and you are paying for network costs associated with
sending network traffic between the different zones.

You decide that under normal operation you'd prefer to have a similar number of replicas
[scheduled](/docs/concepts/scheduling-eviction/) into each infrastructure zone,
and you'd like the cluster to self-heal in the case that there is a problem.

Pod topology spread constraints offer you a declarative way to configure that.
-->
随着你的工作负载扩容，运行的 Pod 变多，将需要考虑另一个重要问题。
假设你有 3 个节点，每个节点运行 5 个 Pod。这些节点有足够的容量能够运行许多副本；
但与这个工作负载互动的客户端分散在三个不同的数据中心（或基础设施可用区）。
现在你可能不太关注单节点故障问题，但你会注意到延迟高于自己的预期，
在不同的可用区之间发送网络流量会产生一些网络成本。

你决定在正常运营时倾向于将类似数量的副本[调度](/zh-cn/docs/concepts/scheduling-eviction/)
到每个基础设施可用区，且你想要该集群在遇到问题时能够自愈。

Pod 拓扑分布约束使你能够以声明的方式进行配置。

<!--
## `topologySpreadConstraints` field

The Pod API includes a field, `spec.topologySpreadConstraints`. The usage of this field looks like
the following:
-->
## `topologySpreadConstraints` 字段   {#topologyspreadconstraints-field}

Pod API 包括一个 `spec.topologySpreadConstraints` 字段。这个字段的用法如下所示：

<!--
```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: example-pod
spec:
  # Configure a topology spread constraint
  topologySpreadConstraints:
    - maxSkew: <integer>
      minDomains: <integer> # optional
      topologyKey: <string>
      whenUnsatisfiable: <string>
      labelSelector: <object>
      matchLabelKeys: <list> # optional; beta since v1.27
      nodeAffinityPolicy: [Honor|Ignore] # optional; beta since v1.26
      nodeTaintsPolicy: [Honor|Ignore] # optional; beta since v1.26
  ### other Pod fields go here
```
-->
```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: example-pod
spec:
  # 配置一个拓扑分布约束
  topologySpreadConstraints:
    - maxSkew: <integer>
      minDomains: <integer> # 可选
      topologyKey: <string>
      whenUnsatisfiable: <string>
      labelSelector: <object>
      matchLabelKeys: <list> # 可选；自从 v1.27 开始成为 Beta
      nodeAffinityPolicy: [Honor|Ignore] # 可选；自从 v1.26 开始成为 Beta
      nodeTaintsPolicy: [Honor|Ignore] # 可选；自从 v1.26 开始成为 Beta
  ### 其他 Pod 字段置于此处
```

<!--
You can read more about this field by running `kubectl explain Pod.spec.topologySpreadConstraints` or
refer to [scheduling](/docs/reference/kubernetes-api/workload-resources/pod-v1/#scheduling) section of the API reference for Pod.
-->
你可以运行 `kubectl explain Pod.spec.topologySpreadConstraints` 或参阅 Pod API
参考的[调度](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#scheduling)一节，
了解有关此字段的更多信息。

<!--
### Spread constraint definition

You can define one or multiple `topologySpreadConstraints` entries to instruct the
kube-scheduler how to place each incoming Pod in relation to the existing Pods across
your cluster. Those fields are:
-->
### 分布约束定义   {#spread-constraint-definition}

你可以定义一个或多个 `topologySpreadConstraints` 条目以指导 kube-scheduler
如何将每个新来的 Pod 与跨集群的现有 Pod 相关联。这些字段包括：

<!--
- **maxSkew** describes the degree to which Pods may be unevenly distributed. You must
  specify this field and the number must be greater than zero. Its semantics differ
  according to the value of `whenUnsatisfiable`:

  - if you select `whenUnsatisfiable: DoNotSchedule`, then `maxSkew` defines the
    maximum permitted difference between the number of matching pods in the target
    topology and the _global minimum_
    (the minimum number of matching pods in an eligible domain or zero if the number of eligible domains is less than MinDomains).
    For example, if you have 3 zones with 2, 2 and 1 matching pods respectively,
    `MaxSkew` is set to 1 then the global minimum is 1.
  - if you select `whenUnsatisfiable: ScheduleAnyway`, the scheduler gives higher
    precedence to topologies that would help reduce the skew.
-->
- **maxSkew** 描述这些 Pod 可能被不均匀分布的程度。你必须指定此字段且该数值必须大于零。
  其语义将随着 `whenUnsatisfiable` 的值发生变化：

  - 如果你选择 `whenUnsatisfiable: DoNotSchedule`，则 `maxSkew` 定义目标拓扑中匹配 Pod
    的数量与**全局最小值**（符合条件的域中匹配的最小 Pod 数量，如果符合条件的域数量小于 MinDomains 则为零）
    之间的最大允许差值。例如，如果你有 3 个可用区，分别有 2、2 和 1 个匹配的 Pod，则 `MaxSkew` 设为 1，
    且全局最小值为 1。
  - 如果你选择 `whenUnsatisfiable: ScheduleAnyway`，则该调度器会更为偏向能够降低偏差值的拓扑域。

<!--
- **minDomains** indicates a minimum number of eligible domains. This field is optional.
  A domain is a particular instance of a topology. An eligible domain is a domain whose
  nodes match the node selector.
-->
- **minDomains** 表示符合条件的域的最小数量。此字段是可选的。域是拓扑的一个特定实例。
  符合条件的域是其节点与节点选择器匹配的域。

  {{< note >}}
  <!--
  Before Kubernetes v1.30, the `minDomains` field was only available if the
  `MinDomainsInPodTopologySpread` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
  was enabled (default since v1.28). In older Kubernetes clusters it might be explicitly
  disabled or the field might not be available.
  -->
  在 Kubernetes v1.30 之前，`minDomains` 字段只有在启用 `MinDomainsInPodTopologySpread`
  [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)时才可用（自 v1.28 起默认启用）
  在早期的 Kubernetes 集群中，此特性门控可能被显式禁用或此字段可能不可用。
  {{< /note >}}

  <!--
  - The value of `minDomains` must be greater than 0, when specified.
    You can only specify `minDomains` in conjunction with `whenUnsatisfiable: DoNotSchedule`.
  - When the number of eligible domains with match topology keys is less than `minDomains`,
    Pod topology spread treats global minimum as 0, and then the calculation of `skew` is performed.
    The global minimum is the minimum number of matching Pods in an eligible domain,
    or zero if the number of eligible domains is less than `minDomains`.
  - When the number of eligible domains with matching topology keys equals or is greater than
    `minDomains`, this value has no effect on scheduling.
  - If you do not specify `minDomains`, the constraint behaves as if `minDomains` is 1.
  -->

  - 指定的 `minDomains` 值必须大于 0。你可以结合 `whenUnsatisfiable: DoNotSchedule` 仅指定 `minDomains`。
  - 当符合条件的、拓扑键匹配的域的数量小于 `minDomains` 时，拓扑分布将“全局最小值”（global minimum）设为 0，
    然后进行 `skew` 计算。“全局最小值”是一个符合条件的域中匹配 Pod 的最小数量，
    如果符合条件的域的数量小于 `minDomains`，则全局最小值为零。
  - 当符合条件的拓扑键匹配域的个数等于或大于 `minDomains` 时，该值对调度没有影响。
  - 如果你未指定 `minDomains`，则约束行为类似于 `minDomains` 等于 1。

<!--
- **topologyKey** is the key of [node labels](#node-labels). Nodes that have a label with this key
	and identical values are considered to be in the same topology.
  We call each instance of a topology (in other words, a <key, value> pair) a domain. The scheduler
  will try to put a balanced number of pods into each domain.
	Also, we define an eligible domain as a domain whose nodes meet the requirements of
	nodeAffinityPolicy and nodeTaintsPolicy.

- **whenUnsatisfiable** indicates how to deal with a Pod if it doesn't satisfy the spread constraint:
  - `DoNotSchedule` (default) tells the scheduler not to schedule it.
  - `ScheduleAnyway` tells the scheduler to still schedule it while prioritizing nodes that minimize the skew.

- **labelSelector** is used to find matching Pods. Pods
  that match this label selector are counted to determine the
  number of Pods in their corresponding topology domain.
  See [Label Selectors](/docs/concepts/overview/working-with-objects/labels/#label-selectors)
  for more details.
-->
- **topologyKey** 是[节点标签](#node-labels)的键。如果节点使用此键标记并且具有相同的标签值，
  则将这些节点视为处于同一拓扑域中。我们将拓扑域中（即键值对）的每个实例称为一个域。
  调度器将尝试在每个拓扑域中放置数量均衡的 Pod。
  另外，我们将符合条件的域定义为其节点满足 nodeAffinityPolicy 和 nodeTaintsPolicy 要求的域。

- **whenUnsatisfiable** 指示如果 Pod 不满足分布约束时如何处理：
  - `DoNotSchedule`（默认）告诉调度器不要调度。
  - `ScheduleAnyway` 告诉调度器仍然继续调度，只是根据如何能将偏差最小化来对节点进行排序。

- **labelSelector** 用于查找匹配的 Pod。匹配此标签的 Pod 将被统计，以确定相应拓扑域中 Pod 的数量。
  有关详细信息，请参考[标签选择算符](/zh-cn/docs/concepts/overview/working-with-objects/labels/#label-selectors)。

<!--
- **matchLabelKeys** is a list of pod label keys to select the pods over which
  spreading will be calculated. The keys are used to lookup values from the pod labels,
  those key-value labels are ANDed with `labelSelector` to select the group of existing
  pods over which spreading will be calculated for the incoming pod. The same key is
  forbidden to exist in both `matchLabelKeys` and `labelSelector`. `matchLabelKeys` cannot
  be set when `labelSelector` isn't set. Keys that don't exist in the pod labels will be
  ignored. A null or empty list means only match against the `labelSelector`.

  With `matchLabelKeys`, you don't need to update the `pod.spec` between different revisions.
  The controller/operator just needs to set different values to the same label key for different
  revisions. The scheduler will assume the values automatically based on `matchLabelKeys`. For
  example, if you are configuring a Deployment, you can use the label keyed with
  [pod-template-hash](/docs/concepts/workloads/controllers/deployment/#pod-template-hash-label), which
  is added automatically by the Deployment controller, to distinguish between different revisions
  in a single Deployment.
-->
- **matchLabelKeys** 是一个 Pod 标签键的列表，用于选择需要计算分布方式的 Pod 集合。
  这些键用于从 Pod 标签中查找值，这些键值标签与 `labelSelector` 进行逻辑与运算，以选择一组已有的 Pod，
  通过这些 Pod 计算新来 Pod 的分布方式。`matchLabelKeys` 和 `labelSelector` 中禁止存在相同的键。
  未设置 `labelSelector` 时无法设置 `matchLabelKeys`。Pod 标签中不存在的键将被忽略。
  null 或空列表意味着仅与 `labelSelector` 匹配。

  借助 `matchLabelKeys`，你无需在变更 Pod 修订版本时更新 `pod.spec`。
  控制器或 Operator 只需要将不同修订版的标签键设为不同的值。
  调度器将根据 `matchLabelKeys` 自动确定取值。例如，如果你正在配置一个 Deployment，
  则你可以使用由 Deployment 控制器自动添加的、以
  [pod-template-hash](/zh-cn/docs/concepts/workloads/controllers/deployment/#pod-template-hash-label)
  为键的标签来区分同一个 Deployment 的不同修订版。

  ```yaml
      topologySpreadConstraints:
          - maxSkew: 1
            topologyKey: kubernetes.io/hostname
            whenUnsatisfiable: DoNotSchedule
            labelSelector:
              matchLabels:
                app: foo
            matchLabelKeys:
              - pod-template-hash
  ```

  {{< note >}}
  <!--
  The `matchLabelKeys` field is a beta-level field and enabled by default in 1.27. You can disable it by disabling the
  `MatchLabelKeysInPodTopologySpread` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/).
  -->
  `matchLabelKeys` 字段是 1.27 中默认启用的一个 Beta 级别字段。
  你可以通过禁用 `MatchLabelKeysInPodTopologySpread`
  [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)来禁用此字段。
  {{< /note >}}

<!--
- **nodeAffinityPolicy** indicates how we will treat Pod's nodeAffinity/nodeSelector
  when calculating pod topology spread skew. Options are:
  - Honor: only nodes matching nodeAffinity/nodeSelector are included in the calculations.
  - Ignore: nodeAffinity/nodeSelector are ignored. All nodes are included in the calculations.

  If this value is null, the behavior is equivalent to the Honor policy.
-->
- **nodeAffinityPolicy** 表示我们在计算 Pod 拓扑分布偏差时将如何处理 Pod 的 nodeAffinity/nodeSelector。
  选项为：
  - Honor：只有与 nodeAffinity/nodeSelector 匹配的节点才会包括到计算中。
  - Ignore：nodeAffinity/nodeSelector 被忽略。所有节点均包括到计算中。

  如果此值为 nil，此行为等同于 Honor 策略。

  {{< note >}}
  <!--
  The `nodeAffinityPolicy` is a beta-level field and enabled by default in 1.26. You can disable it by disabling the
  `NodeInclusionPolicyInPodTopologySpread` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/).
  -->
  `nodeAffinityPolicy` 是 1.26 中默认启用的一个 Beta 级别字段。
  你可以通过禁用 `NodeInclusionPolicyInPodTopologySpread`
  [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)来禁用此字段。
  {{< /note >}}

<!--
- **nodeTaintsPolicy** indicates how we will treat node taints when calculating
  pod topology spread skew. Options are:
  - Honor: nodes without taints, along with tainted nodes for which the incoming pod
    has a toleration, are included.
  - Ignore: node taints are ignored. All nodes are included.

  If this value is null, the behavior is equivalent to the Ignore policy.
-->
- **nodeTaintsPolicy** 表示我们在计算 Pod 拓扑分布偏差时将如何处理节点污点。选项为：
  - Honor：包括不带污点的节点以及污点被新 Pod 所容忍的节点。
  - Ignore：节点污点被忽略。包括所有节点。

  如果此值为 null，此行为等同于 Ignore 策略。

  {{< note >}}
  <!--
  The `nodeTaintsPolicy` is a beta-level field and enabled by default in 1.26. You can disable it by disabling the
  `NodeInclusionPolicyInPodTopologySpread` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/).
  -->
  `nodeTaintsPolicy` 是一个 Beta 级别字段，在 1.26 版本默认启用。
  你可以通过禁用 `NodeInclusionPolicyInPodTopologySpread`
  [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)来禁用此字段。
  {{< /note >}}

<!--
When a Pod defines more than one `topologySpreadConstraint`, those constraints are
combined using a logical AND operation: the kube-scheduler looks for a node for the incoming Pod
that satisfies all the configured constraints.
-->
当 Pod 定义了不止一个 `topologySpreadConstraint`，这些约束之间是逻辑与的关系。
kube-scheduler 会为新的 Pod 寻找一个能够满足所有约束的节点。

<!--
### Node labels

Topology spread constraints rely on node labels to identify the topology
domain(s) that each {{< glossary_tooltip text="node" term_id="node" >}} is in.
For example, a node might have labels:
-->
### 节点标签 {#node-labels}

拓扑分布约束依赖于节点标签来标识每个{{< glossary_tooltip text="节点" term_id="node" >}}所在的拓扑域。
例如，某节点可能具有标签：

```yaml
  region: us-east-1
  zone: us-east-1a
```

{{< note >}}
<!--
For brevity, this example doesn't use the
[well-known](/docs/reference/labels-annotations-taints/) label keys
`topology.kubernetes.io/zone` and `topology.kubernetes.io/region`. However,
those registered label keys are nonetheless recommended rather than the private
(unqualified) label keys `region` and `zone` that are used here.

You can't make a reliable assumption about the meaning of a private label key
between different contexts.
-->
为了简便，此示例未使用[众所周知](/zh-cn/docs/reference/labels-annotations-taints/)的标签键
`topology.kubernetes.io/zone` 和 `topology.kubernetes.io/region`。
但是，建议使用那些已注册的标签键，而不是此处使用的私有（不合格）标签键 `region` 和 `zone`。

你无法对不同上下文之间的私有标签键的含义做出可靠的假设。
{{< /note >}}

<!--
Suppose you have a 4-node cluster with the following labels:
-->
假设你有一个 4 节点的集群且带有以下标签：

```
NAME    STATUS   ROLES    AGE     VERSION   LABELS
node1   Ready    <none>   4m26s   v1.16.0   node=node1,zone=zoneA
node2   Ready    <none>   3m58s   v1.16.0   node=node2,zone=zoneA
node3   Ready    <none>   3m17s   v1.16.0   node=node3,zone=zoneB
node4   Ready    <none>   2m43s   v1.16.0   node=node4,zone=zoneB
```

<!--
Then the cluster is logically viewed as below:
-->
那么，从逻辑上看集群如下：

{{<mermaid>}}
graph TB
    subgraph "zoneB"
        n3(Node3)
        n4(Node4)
    end
    subgraph "zoneA"
        n1(Node1)
        n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4 k8s;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

<!--
## Consistency

You should set the same Pod topology spread constraints on all pods in a group.

Usually, if you are using a workload controller such as a Deployment, the pod template
takes care of this for you. If you mix different spread constraints then Kubernetes
follows the API definition of the field; however, the behavior is more likely to become
confusing and troubleshooting is less straightforward.

You need a mechanism to ensure that all the nodes in a topology domain (such as a
cloud provider region) are labelled consistently.
To avoid you needing to manually label nodes, most clusters automatically
populate well-known labels such as `kubernetes.io/hostname`. Check whether
your cluster supports this.
-->
## 一致性 {#Consistency}

你应该为一个组中的所有 Pod 设置相同的 Pod 拓扑分布约束。

通常，如果你正使用一个工作负载控制器，例如 Deployment，则 Pod 模板会帮你解决这个问题。
如果你混合不同的分布约束，则 Kubernetes 会遵循该字段的 API 定义；
但是，该行为可能更令人困惑，并且故障排除也没那么简单。

你需要一种机制来确保拓扑域（例如云提供商区域）中的所有节点具有一致的标签。
为了避免你需要手动为节点打标签，大多数集群会自动填充知名的标签，
例如 `kubernetes.io/hostname`。检查你的集群是否支持此功能。

<!--
## Topology spread constraint examples

### Example: one topology spread constraint {#example-one-topologyspreadconstraint}

Suppose you have a 4-node cluster where 3 Pods labelled `foo: bar` are located in
node1, node2 and node3 respectively:
-->
## 拓扑分布约束示例 {#topology-spread-constraint-examples}

### 示例：一个拓扑分布约束 {#example-one-topologyspreadconstraint}

假设你拥有一个 4 节点集群，其中标记为 `foo: bar` 的 3 个 Pod 分别位于 node1、node2 和 node3 中：

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p3(Pod) --> n3(Node3)
        n4(Node4)
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4,p1,p2,p3 k8s;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

<!--
If you want an incoming Pod to be evenly spread with existing Pods across zones, you
can use a manifest similar to:
-->
如果你希望新来的 Pod 均匀分布在现有的可用区域，则可以按如下设置其清单：

{{% code_sample file="pods/topology-spread-constraints/one-constraint.yaml" %}}

<!--
From that manifest, `topologyKey: zone` implies the even distribution will only be applied
to nodes that are labeled `zone: <any value>` (nodes that don't have a `zone` label
are skipped). The field `whenUnsatisfiable: DoNotSchedule` tells the scheduler to let the
incoming Pod stay pending if the scheduler can't find a way to satisfy the constraint.

If the scheduler placed this incoming Pod into zone `A`, the distribution of Pods would
become `[3, 1]`. That means the actual skew is then 2 (calculated as `3 - 1`), which
violates `maxSkew: 1`. To satisfy the constraints and context for this example, the
incoming Pod can only be placed onto a node in zone `B`:
-->
从此清单看，`topologyKey: zone` 意味着均匀分布将只应用于存在标签键值对为 `zone: <any value>` 的节点
（没有 `zone` 标签的节点将被跳过）。如果调度器找不到一种方式来满足此约束，
则 `whenUnsatisfiable: DoNotSchedule` 字段告诉该调度器将新来的 Pod 保持在 pending 状态。

如果该调度器将这个新来的 Pod 放到可用区 `A`，则 Pod 的分布将成为 `[3, 1]`。
这意味着实际偏差是 2（计算公式为 `3 - 1`），这违反了 `maxSkew: 1` 的约定。
为了满足这个示例的约束和上下文，新来的 Pod 只能放到可用区 `B` 中的一个节点上：

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p3(Pod) --> n3(Node3)
        p4(mypod) --> n4(Node4)
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4,p1,p2,p3 k8s;
    class p4 plain;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

或者

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p3(Pod) --> n3(Node3)
        p4(mypod) --> n3
        n4(Node4)
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4,p1,p2,p3 k8s;
    class p4 plain;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

<!--
You can tweak the Pod spec to meet various kinds of requirements:

- Change `maxSkew` to a bigger value - such as `2` -  so that the incoming Pod can
  be placed into zone `A` as well.
- Change `topologyKey` to `node` so as to distribute the Pods evenly across nodes
  instead of zones. In the above example, if `maxSkew` remains `1`, the incoming
  Pod can only be placed onto the node `node4`.
- Change `whenUnsatisfiable: DoNotSchedule` to `whenUnsatisfiable: ScheduleAnyway`
  to ensure the incoming Pod to be always schedulable (suppose other scheduling APIs
  are satisfied). However, it's preferred to be placed into the topology domain which
  has fewer matching Pods. (Be aware that this preference is jointly normalized
  with other internal scheduling priorities such as resource usage ratio).
-->
你可以调整 Pod 规约以满足各种要求：

- 将 `maxSkew` 更改为更大的值，例如 `2`，这样新来的 Pod 也可以放在可用区 `A` 中。
- 将 `topologyKey` 更改为 `node`，以便将 Pod 均匀分布在节点上而不是可用区中。
  在上面的例子中，如果 `maxSkew` 保持为 `1`，则新来的 Pod 只能放到 `node4` 节点上。
- 将 `whenUnsatisfiable: DoNotSchedule` 更改为 `whenUnsatisfiable: ScheduleAnyway`，
  以确保新来的 Pod 始终可以被调度（假设满足其他的调度 API）。但是，最好将其放置在匹配 Pod 数量较少的拓扑域中。
  请注意，这一优先判定会与其他内部调度优先级（如资源使用率等）排序准则一起进行标准化。

<!--
### Example: multiple topology spread constraints {#example-multiple-topologyspreadconstraints}

This builds upon the previous example. Suppose you have a 4-node cluster where 3
existing Pods labeled `foo: bar` are located on node1, node2 and node3 respectively:
-->
### 示例：多个拓扑分布约束 {#example-multiple-topologyspreadconstraints}

下面的例子建立在前面例子的基础上。假设你拥有一个 4 节点集群，
其中 3 个标记为 `foo: bar` 的 Pod 分别位于 node1、node2 和 node3 上：

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p3(Pod) --> n3(Node3)
        n4(Node4)
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4,p1,p2,p3 k8s;
    class p4 plain;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

<!--
You can combine two topology spread constraints to control the spread of Pods both
by node and by zone:
-->
可以组合使用 2 个拓扑分布约束来控制 Pod 在节点和可用区两个维度上的分布：

{{% code_sample file="pods/topology-spread-constraints/two-constraints.yaml" %}}

<!--
In this case, to match the first constraint, the incoming Pod can only be placed onto
nodes in zone `B`; while in terms of the second constraint, the incoming Pod can only be
scheduled to the node `node4`. The scheduler only considers options that satisfy all
defined constraints, so the only valid placement is onto node `node4`.
-->
在这种情况下，为了匹配第一个约束，新的 Pod 只能放置在可用区 `B` 中；
而在第二个约束中，新来的 Pod 只能调度到节点 `node4` 上。
该调度器仅考虑满足所有已定义约束的选项，因此唯一可行的选择是放置在节点 `node4` 上。

<!--
### Example: conflicting topology spread constraints {#example-conflicting-topologyspreadconstraints}

Multiple constraints can lead to conflicts. Suppose you have a 3-node cluster across 2 zones:
-->
### 示例：有冲突的拓扑分布约束 {#example-conflicting-topologyspreadconstraints}

多个约束可能导致冲突。假设有一个跨 2 个可用区的 3 节点集群：

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p4(Pod) --> n3(Node3)
        p5(Pod) --> n3
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n1
        p3(Pod) --> n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4,p1,p2,p3,p4,p5 k8s;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

<!--
If you were to apply
[`two-constraints.yaml`](https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/topology-spread-constraints/two-constraints.yaml)
(the manifest from the previous example)
to **this** cluster, you would see that the Pod `mypod` stays in the `Pending` state.
This happens because: to satisfy the first constraint, the Pod `mypod` can only
be placed into zone `B`; while in terms of the second constraint, the Pod `mypod`
can only schedule to node `node2`. The intersection of the two constraints returns
an empty set, and the scheduler cannot place the Pod.

To overcome this situation, you can either increase the value of `maxSkew` or modify
one of the constraints to use `whenUnsatisfiable: ScheduleAnyway`. Depending on
circumstances, you might also decide to delete an existing Pod manually - for example,
if you are troubleshooting why a bug-fix rollout is not making progress.
-->
如果你将 [`two-constraints.yaml`](https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/topology-spread-constraints/two-constraints.yaml)
（来自上一个示例的清单）应用到**这个**集群，你将看到 Pod `mypod` 保持在 `Pending` 状态。
出现这种情况的原因为：为了满足第一个约束，Pod `mypod` 只能放置在可用区 `B` 中；
而在第二个约束中，Pod `mypod` 只能调度到节点 `node2` 上。
两个约束的交集将返回一个空集，且调度器无法放置该 Pod。

为了应对这种情形，你可以提高 `maxSkew` 的值或修改其中一个约束才能使用 `whenUnsatisfiable: ScheduleAnyway`。
根据实际情形，例如若你在故障排查时发现某个漏洞修复工作毫无进展，你还可能决定手动删除一个现有的 Pod。

<!--
#### Interaction with node affinity and node selectors

The scheduler will skip the non-matching nodes from the skew calculations if the
incoming Pod has `spec.nodeSelector` or `spec.affinity.nodeAffinity` defined.
-->
#### 与节点亲和性和节点选择算符的相互作用 {#interaction-with-node-affinity-and-node-selectors}

如果 Pod 定义了 `spec.nodeSelector` 或 `spec.affinity.nodeAffinity`，
调度器将在偏差计算中跳过不匹配的节点。

<!--
### Example: topology spread constraints with node affinity {#example-topologyspreadconstraints-with-nodeaffinity}

Suppose you have a 5-node cluster ranging across zones A to C:
-->
### 示例：带节点亲和性的拓扑分布约束 {#example-topologyspreadconstraints-with-nodeaffinity}

假设你有一个跨可用区 A 到 C 的 5 节点集群：

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p3(Pod) --> n3(Node3)
        n4(Node4)
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n2(Node2)
    end

classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
class n1,n2,n3,n4,p1,p2,p3 k8s;
class p4 plain;
class zoneA,zoneB cluster;
{{< /mermaid >}}

{{<mermaid>}}
graph BT
    subgraph "zoneC"
        n5(Node5)
    end

classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
class n5 k8s;
class zoneC cluster;
{{< /mermaid >}}

<!--
and you know that zone `C` must be excluded. In this case, you can compose a manifest
as below, so that Pod `mypod` will be placed into zone `B` instead of zone `C`.
Similarly, Kubernetes also respects `spec.nodeSelector`.
-->
而且你知道可用区 `C` 必须被排除在外。在这种情况下，可以按如下方式编写清单，
以便将 Pod `mypod` 放置在可用区 `B` 上，而不是可用区 `C` 上。
同样，Kubernetes 也会一样处理 `spec.nodeSelector`。

{{% code_sample file="pods/topology-spread-constraints/one-constraint-with-nodeaffinity.yaml" %}}

<!--
## Implicit conventions

There are some implicit conventions worth noting here:

- Only the Pods holding the same namespace as the incoming Pod can be matching candidates.

- The scheduler bypasses any nodes that don't have any `topologySpreadConstraints[*].topologyKey`
  present. This implies that:

  1. any Pods located on those bypassed nodes do not impact `maxSkew` calculation - in the
     above [example](#example-conflicting-topologyspreadconstraints), suppose the node `node1`
     does not have a label "zone", then the 2 Pods will
     be disregarded, hence the incoming Pod will be scheduled into zone `A`.
  2. the incoming Pod has no chances to be scheduled onto this kind of nodes -
     in the above example, suppose a node `node5` has the **mistyped** label `zone-typo: zoneC`
     (and no `zone` label set). After node `node5` joins the cluster, it will be bypassed and
     Pods for this workload aren't scheduled there.
-->
## 隐式约定 {#implicit-conventions}

这里有一些值得注意的隐式约定：

- 只有与新来的 Pod 具有相同命名空间的 Pod 才能作为匹配候选者。

- 调度器会忽略没有任何 `topologySpreadConstraints[*].topologyKey` 的节点。这意味着：

  1. 位于这些节点上的 Pod 不影响 `maxSkew` 计算，在上面的[例子](#example-conflicting-topologyspreadconstraints)中，
     假设节点 `node1` 没有标签 "zone"，则 2 个 Pod 将被忽略，因此新来的
     Pod 将被调度到可用区 `A` 中。
  2. 新的 Pod 没有机会被调度到这类节点上。在上面的例子中，
     假设节点 `node5` 带有**拼写错误的**标签 `zone-typo: zoneC`（且没有设置 `zone` 标签）。
     节点 `node5` 接入集群之后，该节点将被忽略且针对该工作负载的 Pod 不会被调度到那里。

<!--
- Be aware of what will happen if the incoming Pod's
  `topologySpreadConstraints[*].labelSelector` doesn't match its own labels. In the
  above example, if you remove the incoming Pod's labels, it can still be placed onto
  nodes in zone `B`, since the constraints are still satisfied. However, after that
  placement, the degree of imbalance of the cluster remains unchanged - it's still zone `A`
  having 2 Pods labeled as `foo: bar`, and zone `B` having 1 Pod labeled as
  `foo: bar`. If this is not what you expect, update the workload's
  `topologySpreadConstraints[*].labelSelector` to match the labels in the pod template.
-->
- 注意，如果新 Pod 的 `topologySpreadConstraints[*].labelSelector` 与自身的标签不匹配，将会发生什么。
  在上面的例子中，如果移除新 Pod 的标签，则 Pod 仍然可以放置到可用区 `B` 中的节点上，因为这些约束仍然满足。
  然而，在放置之后，集群的不平衡程度保持不变。可用区 `A` 仍然有 2 个 Pod 带有标签 `foo: bar`，
  而可用区 `B` 有 1 个 Pod 带有标签 `foo: bar`。如果这不是你所期望的，
  更新工作负载的 `topologySpreadConstraints[*].labelSelector` 以匹配 Pod 模板中的标签。

<!--
## Cluster-level default constraints

It is possible to set default topology spread constraints for a cluster. Default
topology spread constraints are applied to a Pod if, and only if:

- It doesn't define any constraints in its `.spec.topologySpreadConstraints`.
- It belongs to a Service, ReplicaSet, StatefulSet or ReplicationController.

Default constraints can be set as part of the `PodTopologySpread` plugin
arguments in a [scheduling profile](/docs/reference/scheduling/config/#profiles).
The constraints are specified with the same [API above](#topologyspreadconstraints-field), except that
`labelSelector` must be empty. The selectors are calculated from the Services,
ReplicaSets, StatefulSets or ReplicationControllers that the Pod belongs to.

An example configuration might look like follows:
-->
## 集群级别的默认约束 {#cluster-level-default-constraints}

为集群设置默认的拓扑分布约束也是可能的。默认拓扑分布约束在且仅在以下条件满足时才会被应用到 Pod 上：

- Pod 没有在其 `.spec.topologySpreadConstraints` 中定义任何约束。
- Pod 隶属于某个 Service、ReplicaSet、StatefulSet 或 ReplicationController。

默认约束可以设置为[调度方案](/zh-cn/docs/reference/scheduling/config/#profiles)中
`PodTopologySpread` 插件参数的一部分。约束的设置采用[如前所述的 API](#topologyspreadconstraints-field)，
只是 `labelSelector` 必须为空。
选择算符是根据 Pod 所属的 Service、ReplicaSet、StatefulSet 或 ReplicationController 来设置的。

配置的示例可能看起来像下面这个样子：

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta3
kind: KubeSchedulerConfiguration

profiles:
  - schedulerName: default-scheduler
    pluginConfig:
      - name: PodTopologySpread
        args:
          defaultConstraints:
            - maxSkew: 1
              topologyKey: topology.kubernetes.io/zone
              whenUnsatisfiable: ScheduleAnyway
          defaultingType: List
```

<!--
### Built-in default constraints {#internal-default-constraints}
-->
### 内置默认约束 {#internal-default-constraints}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

<!--
If you don't configure any cluster-level default constraints for pod topology spreading,
then kube-scheduler acts as if you specified the following default topology constraints:
-->
如果你没有为 Pod 拓扑分布配置任何集群级别的默认约束，
kube-scheduler 的行为就像你指定了以下默认拓扑约束一样：

```yaml
defaultConstraints:
  - maxSkew: 3
    topologyKey: "kubernetes.io/hostname"
    whenUnsatisfiable: ScheduleAnyway
  - maxSkew: 5
    topologyKey: "topology.kubernetes.io/zone"
    whenUnsatisfiable: ScheduleAnyway
```

<!--
Also, the legacy `SelectorSpread` plugin, which provides an equivalent behavior,
is disabled by default.
-->
此外，原来用于提供等同行为的 `SelectorSpread` 插件默认被禁用。

{{< note >}}
<!--
The `PodTopologySpread` plugin does not score the nodes that don't have
the topology keys specified in the spreading constraints. This might result
in a different default behavior compared to the legacy `SelectorSpread` plugin when
using the default topology constraints.

If your nodes are not expected to have **both** `kubernetes.io/hostname` and
`topology.kubernetes.io/zone` labels set, define your own constraints
instead of using the Kubernetes defaults.
-->
对于分布约束中所指定的拓扑键而言，`PodTopologySpread` 插件不会为不包含这些拓扑键的节点评分。
这可能导致在使用默认拓扑约束时，其行为与原来的 `SelectorSpread` 插件的默认行为不同。

如果你的节点不会**同时**设置 `kubernetes.io/hostname` 和 `topology.kubernetes.io/zone` 标签，
你应该定义自己的约束而不是使用 Kubernetes 的默认约束。
{{< /note >}}

<!--
If you don't want to use the default Pod spreading constraints for your cluster,
you can disable those defaults by setting `defaultingType` to `List` and leaving
empty `defaultConstraints` in the `PodTopologySpread` plugin configuration:
-->
如果你不想为集群使用默认的 Pod 分布约束，你可以通过设置 `defaultingType` 参数为 `List`，
并将 `PodTopologySpread` 插件配置中的 `defaultConstraints` 参数置空来禁用默认 Pod 分布约束：

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta3
kind: KubeSchedulerConfiguration

profiles:
  - schedulerName: default-scheduler
    pluginConfig:
      - name: PodTopologySpread
        args:
          defaultConstraints: []
          defaultingType: List
```

<!--
## Comparison with podAffinity and podAntiAffinity {#comparison-with-podaffinity-podantiaffinity}

In Kubernetes, [inter-Pod affinity and anti-affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)
control how Pods are scheduled in relation to one another - either more packed
or more scattered.

`podAffinity`
: attracts Pods; you can try to pack any number of Pods into qualifying
  topology domain(s).

`podAntiAffinity`
: repels Pods. If you set this to `requiredDuringSchedulingIgnoredDuringExecution` mode then
  only a single Pod can be scheduled into a single topology domain; if you choose
  `preferredDuringSchedulingIgnoredDuringExecution` then you lose the ability to enforce the
  constraint.
-->
## 比较 podAffinity 和 podAntiAffinity {#comparison-with-podaffinity-podantiaffinity}

在 Kubernetes 中，
[Pod 间亲和性和反亲和性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)控制
Pod 彼此的调度方式（更密集或更分散）。

`podAffinity`
: 吸引 Pod；你可以尝试将任意数量的 Pod 集中到符合条件的拓扑域中。

`podAntiAffinity`
: 驱逐 Pod。如果将此设为 `requiredDuringSchedulingIgnoredDuringExecution` 模式，
则只有单个 Pod 可以调度到单个拓扑域；如果你选择 `preferredDuringSchedulingIgnoredDuringExecution`，
则你将丢失强制执行此约束的能力。

<!--
For finer control, you can specify topology spread constraints to distribute
Pods across different topology domains - to achieve either high availability or
cost-saving. This can also help on rolling update workloads and scaling out
replicas smoothly.

For more context, see the
[Motivation](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/895-pod-topology-spread#motivation)
section of the enhancement proposal about Pod topology spread constraints.
-->
要实现更细粒度的控制，你可以设置拓扑分布约束来将 Pod 分布到不同的拓扑域下，从而实现高可用性或节省成本。
这也有助于工作负载的滚动更新和平稳地扩展副本规模。

有关详细信息，请参阅有关 Pod 拓扑分布约束的增强倡议的
[动机](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/895-pod-topology-spread#motivation)一节。

<!--
## Known limitations

- There's no guarantee that the constraints remain satisfied when Pods are removed. For
  example, scaling down a Deployment may result in imbalanced Pods distribution.

  You can use a tool such as the [Descheduler](https://github.com/kubernetes-sigs/descheduler)
  to rebalance the Pods distribution.
- Pods matched on tainted nodes are respected.
  See [Issue 80921](https://github.com/kubernetes/kubernetes/issues/80921).
-->
## 已知局限性 {#known-limitations}

- 当 Pod 被移除时，无法保证约束仍被满足。例如，缩减某 Deployment 的规模时，Pod 的分布可能不再均衡。

  你可以使用 [Descheduler](https://github.com/kubernetes-sigs/descheduler) 来重新实现 Pod 分布的均衡。

- 具有污点的节点上匹配的 Pod 也会被统计。
  参考 [Issue 80921](https://github.com/kubernetes/kubernetes/issues/80921)。

<!--
- The scheduler doesn't have prior knowledge of all the zones or other topology
  domains that a cluster has. They are determined from the existing nodes in the
  cluster. This could lead to a problem in autoscaled clusters, when a node pool (or
  node group) is scaled to zero nodes, and you're expecting the cluster to scale up,
  because, in this case, those topology domains won't be considered until there is
  at least one node in them.

  You can work around this by using a cluster autoscaling tool that is aware of
  Pod topology spread constraints and is also aware of the overall set of topology
  domains.
-->
- 该调度器不会预先知道集群拥有的所有可用区和其他拓扑域。
  拓扑域由集群中存在的节点确定。在自动扩缩的集群中，如果一个节点池（或节点组）的节点数量缩减为零，
  而用户正期望其扩容时，可能会导致调度出现问题。
  因为在这种情况下，调度器不会考虑这些拓扑域，直至这些拓扑域中至少包含有一个节点。

  你可以通过使用感知 Pod 拓扑分布约束并感知整个拓扑域集的集群自动扩缩工具来解决此问题。

## {{% heading "whatsnext" %}}

<!--
- The blog article [Introducing PodTopologySpread](/blog/2020/05/introducing-podtopologyspread/)
  explains `maxSkew` in some detail, as well as covering some advanced usage examples.
- Read the [scheduling](/docs/reference/kubernetes-api/workload-resources/pod-v1/#scheduling) section of
  the API reference for Pod.
-->
- 博客：[PodTopologySpread 介绍](/blog/2020/05/introducing-podtopologyspread/)详细解释了 `maxSkew`，
  并给出了一些进阶的使用示例。
- 阅读针对 Pod 的 API
  参考的[调度](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#scheduling)一节。
