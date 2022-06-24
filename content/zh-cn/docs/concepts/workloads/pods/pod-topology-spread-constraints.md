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
You can use _topology spread constraints_ to control how {{< glossary_tooltip text="Pods" term_id="Pod" >}} are spread across your cluster among failure-domains such as regions, zones, nodes, and other user-defined topology domains. This can help to achieve high availability as well as efficient resource utilization.
-->
你可以使用 _拓扑分布约束（Topology Spread Constraints）_ 来控制
{{< glossary_tooltip text="Pod" term_id="Pod" >}} 在集群内故障域之间的分布，
例如区域（Region）、可用区（Zone）、节点和其他用户自定义拓扑域。
这样做有助于实现高可用并提升资源利用率。

<!-- body -->

<!--
## Prerequisites

### Node Labels
-->
## 先决条件   {#prerequisites}

### 节点标签   {#node-labels}

<!--
Topology spread constraints rely on node labels to identify the topology domain(s) that each Node is in. For example, a Node might have labels: `node=node1,zone=us-east-1a,region=us-east-1`
-->
拓扑分布约束依赖于节点标签来标识每个节点所在的拓扑域。
例如，某节点可能具有标签：`node=node1,zone=us-east-1a,region=us-east-1`

<!--
Suppose you have a 4-node cluster with the following labels:
-->
假设你拥有具有以下标签的一个 4 节点集群：

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
Instead of manually applying labels, you can also reuse the [well-known labels](/docs/reference/labels-annotations-taints/) that are created and populated automatically on most clusters.
-->
你可以复用在大多数集群上自动创建和填充的[常用标签](/zh-cn/docs/reference/labels-annotations-taints/)，
而不是手动添加标签。

<!--
## Spread Constraints for Pods
-->
## Pod 的分布约束    {#spread-constraints-for-pods}

### API

<!--
The API field `pod.spec.topologySpreadConstraints` is defined as below:
-->
`pod.spec.topologySpreadConstraints` 字段定义如下所示：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  topologySpreadConstraints:
    - maxSkew: <integer>
      topologyKey: <string>
      whenUnsatisfiable: <string>
      labelSelector: <object>
```

<!--
You can define one or multiple `topologySpreadConstraint` to instruct the kube-scheduler how to place each incoming Pod in relation to the existing Pods across your cluster. The fields are:
-->
你可以定义一个或多个 `topologySpreadConstraint` 来指示 kube-scheduler
如何根据与现有的 Pod 的关联关系将每个传入的 Pod 部署到集群中。字段包括：

<!--
- **maxSkew** describes the degree to which Pods may be unevenly distributed.
  It's the maximum permitted difference between the number of matching Pods in
  any two topology domains of a given topology type. It must be greater than
  zero. Its semantics differs according to the value of `whenUnsatisfiable`:
  - when `whenUnsatisfiable` equals to "DoNotSchedule", `maxSkew` is the maximum
    permitted difference between the number of matching pods in the target
    topology and the global minimum.
    (the minimum number of pods that match the label selector in a topology domain.
    For example, if you have 3 zones with 0, 2 and 3 matching pods respectively,
    The global minimum is 0).
  - when `whenUnsatisfiable` equals to "ScheduleAnyway", scheduler gives higher
    precedence to topologies that would help reduce the skew.
-->

- **maxSkew** 描述 Pod 分布不均的程度。这是给定拓扑类型中任意两个拓扑域中匹配的
  Pod 之间的最大允许差值。它必须大于零。取决于 `whenUnsatisfiable` 的取值，
  其语义会有不同。
  - 当 `whenUnsatisfiable` 等于 "DoNotSchedule" 时，`maxSkew` 是目标拓扑域中匹配的
    Pod 数与全局最小值（一个拓扑域中与标签选择器匹配的 Pod 的最小数量。例如，如果你有
    3 个区域，分别具有 0 个、2 个 和 3 个匹配的 Pod，则全局最小值为 0。）之间可存在的差异。
  - 当 `whenUnsatisfiable` 等于 "ScheduleAnyway" 时，调度器会更为偏向能够降低偏差值的拓扑域。

<!--
- **minDomains** indicates a minimum number of eligible domains.
  A domain is a particular instance of a topology. An eligible domain is a domain whose
  nodes match the node selector.

  - The value of `minDomains` must be greater than 0, when specified.
  - When the number of eligible domains with match topology keys is less than `minDomains`,
    Pod topology spread treats "global minimum" as 0, and then the calculation of `skew` is performed.
    The "global minimum" is the minimum number of matching Pods in an eligible domain,
    or zero if the number of eligible domains is less than `minDomains`.
  - When the number of eligible domains with matching topology keys equals or is greater than 
    `minDomains`, this value has no effect on scheduling.
  - When `minDomains` is nil, the constraint behaves as if `minDomains` is 1.
  - When `minDomains` is not nil, the value of `whenUnsatisfiable` must be "`DoNotSchedule`".
-->
- **minDomains** 表示符合条件的域的最小数量。域是拓扑的一个特定实例。
  符合条件的域是其节点与节点选择器匹配的域。

  - 指定的 `minDomains` 的值必须大于 0。
  - 当符合条件的、拓扑键匹配的域的数量小于 `minDomains` 时，Pod 拓扑分布将“全局最小值”
    （global minimum）设为 0，然后进行 `skew` 计算。“全局最小值”是一个符合条件的域中匹配
    Pod 的最小数量，如果符合条件的域的数量小于 `minDomains`，则全局最小值为零。
  - 当符合条件的拓扑键匹配域的个数等于或大于 `minDomains` 时，该值对调度没有影响。
  - 当 `minDomains` 为 nil 时，约束的行为等于 `minDomains` 为 1。
  - 当 `minDomains` 不为 nil 时，`whenUnsatisfiable` 的值必须为 "`DoNotSchedule`" 。

  {{< note >}}
  <!--
  The `minDomains` field is an alpha field added in 1.24. You have to enable the
  `MinDomainsInPodToplogySpread` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
  in order to use it.
  -->
  `minDomains` 字段是在 1.24 版本中新增的 alpha 字段。你必须启用
  `MinDomainsInPodToplogySpread` [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)才能使用它。
  {{< /note >}}

<!--
- **topologyKey** is the key of node labels. If two Nodes are labelled with this key and have identical values for that label, the scheduler treats both Nodes as being in the same topology. The scheduler tries to place a balanced number of Pods into each topology domain.

- **whenUnsatisfiable** indicates how to deal with a Pod if it doesn't satisfy the spread constraint:
    - `DoNotSchedule` (default) tells the scheduler not to schedule it.
    - `ScheduleAnyway` tells the scheduler to still schedule it while prioritizing nodes that minimize the skew.

- **labelSelector** is used to find matching Pods. Pods that match this label selector are counted to determine the number of Pods in their corresponding topology domain. See [Label Selectors](/docs/concepts/overview/working-with-objects/labels/#label-selectors) for more details.
-->
- **topologyKey** 是节点标签的键。如果两个节点使用此键标记并且具有相同的标签值，
  则调度器会将这两个节点视为处于同一拓扑域中。调度器试图在每个拓扑域中放置数量均衡的 Pod。

- **whenUnsatisfiable** 指示如果 Pod 不满足分布约束时如何处理：
  - `DoNotSchedule`（默认）告诉调度器不要调度。
  - `ScheduleAnyway` 告诉调度器仍然继续调度，只是根据如何能将偏差最小化来对节点进行排序。

- **labelSelector** 用于查找匹配的 Pod。匹配此标签的 Pod 将被统计，
  以确定相应拓扑域中 Pod 的数量。
  有关详细信息，请参考[标签选择算符](/zh-cn/docs/concepts/overview/working-with-objects/labels/#label-selectors)。

<!--
When a Pod defines more than one `topologySpreadConstraint`, those constraints are ANDed: The kube-scheduler looks for a node for the incoming Pod that satisfies all the constraints.
-->
当 Pod 定义了不止一个 `topologySpreadConstraint`，这些约束之间是逻辑与的关系。
kube-scheduler 会为新的 Pod 寻找一个能够满足所有约束的节点。

<!--
You can read more about this field by running `kubectl explain Pod.spec.topologySpreadConstraints`.
-->
你可以执行 `kubectl explain Pod.spec.topologySpreadConstraints`
命令以了解关于 topologySpreadConstraints 的更多信息。

<!--
### Example: One TopologySpreadConstraint

Suppose you have a 4-node cluster where 3 Pods labeled `foo:bar` are located in node1, node2 and node3 respectively:
-->
### 例子：单个 TopologySpreadConstraint

假设你拥有一个 4 节点集群，其中标记为 `foo:bar` 的 3 个 Pod 分别位于
node1、node2 和 node3 中：

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
If we want an incoming Pod to be evenly spread with existing Pods across zones, the spec can be given as:
-->
如果希望新来的 Pod 均匀分布在现有的可用区域，则可以按如下设置其规约：

{{< codenew file="pods/topology-spread-constraints/one-constraint.yaml" >}}

<!--
`topologyKey: zone` implies the even distribution will only be applied to the nodes which have label pair "zone:&lt;any value&gt;" present. `whenUnsatisfiable: DoNotSchedule` tells the scheduler to let it stay pending if the incoming Pod can’t satisfy the constraint.
-->
`topologyKey: zone` 意味着均匀分布将只应用于存在标签键值对为
"zone:&lt;任何值&gt;" 的节点。
`whenUnsatisfiable: DoNotSchedule` 告诉调度器如果新的 Pod 不满足约束，
则让它保持悬决状态。

<!--
If the scheduler placed this incoming Pod into "zoneA", the Pods distribution would become [3, 1], hence the actual skew is 2 (3 - 1) - which violates `maxSkew: 1`. In this example, the incoming Pod can only be placed onto "zoneB":
-->
如果调度器将新的 Pod 放入 "zoneA"，Pods 分布将变为 [3, 1]，因此实际的偏差为
2（3 - 1）。这违反了 `maxSkew: 1` 的约定。此示例中，新 Pod 只能放置在
"zoneB" 上：

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
-->
你可以调整 Pod 规约以满足各种要求：

<!--
- Change `maxSkew` to a bigger value like "2" so that the incoming Pod can be placed onto "zoneA" as well.
- Change `topologyKey` to "node" so as to distribute the Pods evenly across nodes instead of zones. In the above example, if `maxSkew` remains "1", the incoming Pod can only be placed onto "node4".
- Change `whenUnsatisfiable: DoNotSchedule` to `whenUnsatisfiable: ScheduleAnyway` to ensure the incoming Pod to be always schedulable (suppose other scheduling APIs are satisfied). However, it’s preferred to be placed onto the topology domain which has fewer matching Pods. (Be aware that this preferability is jointly normalized with other internal scheduling priorities like resource usage ratio, etc.)
-->
- 将 `maxSkew` 更改为更大的值，比如 "2"，这样新的 Pod 也可以放在 "zoneA" 上。
- 将 `topologyKey` 更改为 "node"，以便将 Pod 均匀分布在节点上而不是区域中。
  在上面的例子中，如果 `maxSkew` 保持为 "1"，那么传入的 Pod 只能放在 "node4" 上。
- 将 `whenUnsatisfiable: DoNotSchedule` 更改为 `whenUnsatisfiable: ScheduleAnyway`，
  以确保新的 Pod 始终可以被调度（假设满足其他的调度 API）。
  但是，最好将其放置在匹配 Pod 数量较少的拓扑域中。
  （请注意，这一优先判定会与其他内部调度优先级（如资源使用率等）排序准则一起进行标准化。）

<!--
### Example: Multiple TopologySpreadConstraints
-->
### 例子：多个 TopologySpreadConstraints

<!--
This builds upon the previous example. Suppose you have a 4-node cluster where 3 Pods labeled `foo:bar` are located in node1, node2 and node3 respectively (`P` represents Pod):
-->
下面的例子建立在前面例子的基础上。假设你拥有一个 4 节点集群，其中 3 个标记为 `foo:bar` 的
Pod 分别位于 node1、node2 和 node3 上：

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
You can use 2 TopologySpreadConstraints to control the Pods spreading on both zone and node:
-->
可以使用 2 个 TopologySpreadConstraint 来控制 Pod 在 区域和节点两个维度上的分布：

{{< codenew file="pods/topology-spread-constraints/two-constraints.yaml" >}}

<!--
In this case, to match the first constraint, the incoming Pod can only be placed onto "zoneB"; while in terms of the second constraint, the incoming Pod can only be placed onto "node4". Then the results of 2 constraints are ANDed, so the only viable option is to place on "node4".
-->
在这种情况下，为了匹配第一个约束，新的 Pod 只能放置在 "zoneB" 中；而在第二个约束中，
新的 Pod 只能放置在 "node4" 上。最后两个约束的结果加在一起，唯一可行的选择是放置在
"node4" 上。

<!--
Multiple constraints can lead to conflicts. Suppose you have a 3-node cluster across 2 zones:
-->
多个约束之间可能存在冲突。假设有一个跨越 2 个区域的 3 节点集群：

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
If you apply "two-constraints.yaml" to this cluster, you will notice "mypod" stays in `Pending` state. This is because: to satisfy the first constraint, "mypod" can only be put to "zoneB"; while in terms of the second constraint, "mypod" can only put onto "node2". Then a joint result of "zoneB" and "node2" returns nothing.
-->
如果对集群应用 "two-constraints.yaml"，会发现 "mypod" 处于 `Pending` 状态。
这是因为：为了满足第一个约束，"mypod" 只能放在 "zoneB" 中，而第二个约束要求
"mypod" 只能放在 "node2" 上。Pod 调度无法满足两种约束。

<!--
To overcome this situation, you can either increase the `maxSkew` or modify one of the constraints to use `whenUnsatisfiable: ScheduleAnyway`.
-->
为了克服这种情况，你可以增加 `maxSkew` 或修改其中一个约束，让其使用
`whenUnsatisfiable: ScheduleAnyway`。

<!--
### Interaction With Node Affinity and Node Selectors

The scheduler will skip the non-matching nodes from the skew calculations if the incoming Pod has `spec.nodeSelector` or `spec.affinity.nodeAffinity` defined.
-->
### 节点亲和性与节点选择器的相互作用   {#interaction-with-node-affinity-and-node-selectors}

如果 Pod 定义了 `spec.nodeSelector` 或 `spec.affinity.nodeAffinity`，
调度器将在偏差计算中跳过不匹配的节点。

<!--
### Example: TopologySpreadConstraints with NodeAffinity

Suppose you have a 5-node cluster ranging from zoneA to zoneC:
-->
### 示例：TopologySpreadConstraints 与 NodeAffinity

假设你有一个跨越 zoneA 到 zoneC 的 5 节点集群：

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
and you know that "zoneC" must be excluded. In this case, you can compose the yaml as below, so that "mypod" will be placed into "zoneB" instead of "zoneC". Similarly `spec.nodeSelector` is also respected.
-->
而且你知道 "zoneC" 必须被排除在外。在这种情况下，可以按如下方式编写 YAML，
以便将 "mypod" 放置在 "zoneB" 上，而不是 "zoneC" 上。同样，`spec.nodeSelector`
也要一样处理。

{{< codenew file="pods/topology-spread-constraints/one-constraint-with-nodeaffinity.yaml" >}}

<!--
The scheduler doesn't have prior knowledge of all the zones or other topology domains that a cluster has. They are determined from the existing nodes in the cluster. This could lead to a problem in autoscaled clusters, when a node pool (or node group) is scaled to zero nodes and the user is expecting them to scale up, because, in this case, those topology domains won't be considered until there is at least one node in them.
-->
调度器不会预先知道集群拥有的所有区域和其他拓扑域。拓扑域由集群中存在的节点确定。
在自动伸缩的集群中，如果一个节点池（或节点组）的节点数量为零，
而用户正期望其扩容时，可能会导致调度出现问题。
因为在这种情况下，调度器不会考虑这些拓扑域信息，因为它们是空的，没有节点。

<!--
### Other Noticeable Semantics

There are some implicit conventions worth noting here:
-->
### 其他值得注意的语义   {#other-noticeable-semantics}

这里有一些值得注意的隐式约定：

<!--
- Only the Pods holding the same namespace as the incoming Pod can be matching candidates.

- The scheduler will bypass the nodes without `topologySpreadConstraints[*].topologyKey` present. This implies that:

  1. the Pods located on those nodes do not impact `maxSkew` calculation - in the above example, suppose "node1" does not have label "zone", then the 2 Pods will be disregarded, hence the incoming Pod will be scheduled into "zoneA".
  2. the incoming Pod has no chances to be scheduled onto such nodes - in the above example, suppose a "node5" carrying label `{zone-typo: zoneC}` joins the cluster, it will be bypassed due to the absence of label key "zone".
-->
- 只有与新的 Pod 具有相同命名空间的 Pod 才能作为匹配候选者。
- 调度器会忽略没有 `topologySpreadConstraints[*].topologyKey` 的节点。这意味着：
  1. 位于这些节点上的 Pod 不影响 `maxSkew` 的计算。
     在上面的例子中，假设 "node1" 没有标签 "zone"，那么 2 个 Pod 将被忽略，
     因此传入的 Pod 将被调度到 "zoneA" 中。

  2. 新的 Pod 没有机会被调度到这类节点上。
     在上面的例子中，假设一个带有标签 `{zone-typo: zoneC}` 的 "node5" 加入到集群，
     它将由于没有标签键 "zone" 而被忽略。

<!--
- Be aware of what will happen if the incomingPod’s `topologySpreadConstraints[*].labelSelector` doesn’t match its own labels. In the above example, if we remove the incoming Pod’s labels, it can still be placed onto "zoneB" since the constraints are still satisfied. However, after the placement, the degree of imbalance of the cluster remains unchanged - it’s still zoneA having 2 Pods which hold label {foo:bar}, and zoneB having 1 Pod which holds label {foo:bar}. So if this is not what you expect, we recommend the workload’s `topologySpreadConstraints[*].labelSelector` to match its own labels.
-->
- 注意，如果新 Pod 的 `topologySpreadConstraints[*].labelSelector`
  与自身的标签不匹配，将会发生什么。
  在上面的例子中，如果移除新 Pod 上的标签，Pod 仍然可以调度到 "zoneB"，因为约束仍然满足。
  然而，在调度之后，集群的不平衡程度保持不变。zoneA 仍然有 2 个带有 {foo:bar} 标签的 Pod，
  zoneB 有 1 个带有 {foo:bar} 标签的 Pod。
  因此，如果这不是你所期望的，建议工作负载的 `topologySpreadConstraints[*].labelSelector`
  与其自身的标签匹配。

<!--
### Cluster-level default constraints

It is possible to set default topology spread constraints for a cluster. Default
topology spread constraints are applied to a Pod if, and only if:

- It doesn't define any constraints in its `.spec.topologySpreadConstraints`.
- It belongs to a service, replication controller, replica set or stateful set.
-->
### 集群级别的默认约束   {#cluster-level-default-constraints}

为集群设置默认的拓扑分布约束也是可能的。
默认拓扑分布约束在且仅在以下条件满足时才会被应用到 Pod 上：

- Pod 没有在其 `.spec.topologySpreadConstraints` 设置任何约束；
- Pod 隶属于某个服务、副本控制器、ReplicaSet 或 StatefulSet。

<!--
Default constraints can be set as part of the `PodTopologySpread` plugin args
in a [scheduling profile](/docs/reference/scheduling/config/#profiles).
The constraints are specified with the same [API above](#api), except that
`labelSelector` must be empty. The selectors are calculated from the services,
replication controllers, replica sets or stateful sets that the Pod belongs to.

An example configuration might look like follows:
-->
你可以在 [调度方案（Scheduling Profile）](/zh-cn/docs/reference/scheduling/config/#profiles)
中将默认约束作为 `PodTopologySpread` 插件参数的一部分来设置。
约束的设置采用[如前所述的 API](#api)，只是 `labelSelector` 必须为空。
选择算符是根据 Pod 所属的服务、副本控制器、ReplicaSet 或 StatefulSet 来设置的。

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

{{< note >}}
<!--
[`SelectorSpread` plugin](/docs/reference/scheduling/config/#scheduling-plugins)
is disabled by default. It's recommended to use `PodTopologySpread` to achieve similar
behavior.
-->
[`SelectorSpread` 插件](/zh-cn/docs/reference/scheduling/config/#scheduling-plugins)默认是被禁用的。
建议使用 `PodTopologySpread` 来实现类似的行为。
{{< /note >}}

<!--
#### Internal default constraints
-->
#### 内部默认约束    {#internal-default-constraints}

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
-->
对于分布约束中所指定的拓扑键而言，`PodTopologySpread` 插件不会为不包含这些主键的节点评分。
这可能导致在使用默认拓扑约束时，其行为与原来的 `SelectorSpread` 插件的默认行为不同，

<!--
If your nodes are not expected to have **both** `kubernetes.io/hostname` and
`topology.kubernetes.io/zone` labels set, define your own constraints
instead of using the Kubernetes defaults.
-->
如果你的节点不会 **同时** 设置 `kubernetes.io/hostname` 和
`topology.kubernetes.io/zone` 标签，你应该定义自己的约束而不是使用
Kubernetes 的默认约束。
{{< /note >}}

<!--
If you don't want to use the default Pod spreading constraints for your cluster,
you can disable those defaults by setting `defaultingType` to `List` and leaving
empty `defaultConstraints` in the `PodTopologySpread` plugin configuration:
-->
如果你不想为集群使用默认的 Pod 分布约束，你可以通过设置 `defaultingType` 参数为 `List`
并将 `PodTopologySpread` 插件配置中的 `defaultConstraints` 参数置空来禁用默认 Pod 分布约束。

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
## Comparison with PodAffinity/PodAntiAffinity

In Kubernetes, directives related to "Affinity" control how Pods are
scheduled - more packed or more scattered.
-->
## 与 PodAffinity/PodAntiAffinity 相比较

在 Kubernetes 中，与“亲和性”相关的指令控制 Pod 的调度方式（更密集或更分散）。

<!--
- For `PodAffinity`, you can try to pack any number of Pods into qualifying
  topology domain(s)
- For `PodAntiAffinity`, only one Pod can be scheduled into a
  single topology domain.
-->
- 对于 `PodAffinity`，你可以尝试将任意数量的 Pod 集中到符合条件的拓扑域中。
- 对于 `PodAntiAffinity`，只能将一个 Pod 调度到某个拓扑域中。

<!--
For finer control, you can specify topology spread constraints to distribute
Pods across different topology domains - to achieve either high availability or
cost-saving. This can also help on rolling update workloads and scaling out
replicas smoothly. See
[Motivation](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/895-pod-topology-spread#motivation)
for more details.
-->
要实现更细粒度的控制，你可以设置拓扑分布约束来将 Pod 分布到不同的拓扑域下，
从而实现高可用性或节省成本。这也有助于工作负载的滚动更新和平稳地扩展副本规模。
有关详细信息，请参考
[动机](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/20190221-pod-topology-spread.md#motivation)文档。

<!--
## Known Limitations

- There's no guarantee that the constraints remain satisfied when Pods are removed. For example, scaling down a Deployment may result in imbalanced Pods distribution.
You can use [Descheduler](https://github.com/kubernetes-sigs/descheduler) to rebalance the Pods distribution.

- Pods matched on tainted nodes are respected. See [Issue 80921](https://github.com/kubernetes/kubernetes/issues/80921)
-->
## 已知局限性

- 当 Pod 被移除时，无法保证约束仍被满足。例如，缩减某 Deployment 的规模时，
  Pod 的分布可能不再均衡。
  你可以使用 [Descheduler](https://github.com/kubernetes-sigs/descheduler)
  来重新实现 Pod 分布的均衡。

- 具有污点的节点上匹配的 Pods 也会被统计。
  参考 [Issue 80921](https://github.com/kubernetes/kubernetes/issues/80921)。

## {{% heading "whatsnext" %}}

<!--
- [Blog: Introducing PodTopologySpread](https://kubernetes.io/blog/2020/05/introducing-podtopologyspread/)
  explains `maxSkew` in details, as well as bringing up some advanced usage examples.
-->
- [博客: PodTopologySpread介绍](https://kubernetes.io/blog/2020/05/introducing-podtopologyspread/)
  详细解释了 `maxSkew`，并给出了一些高级的使用示例。
