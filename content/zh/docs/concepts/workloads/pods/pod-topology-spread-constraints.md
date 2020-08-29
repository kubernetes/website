---
title: Pod 拓扑扩展约束
content_type: concept
weight: 50
---

<!--
title: Pod Topology Spread Constraints
content_type: concept
weight: 50
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.16" state="alpha" >}}

<!--
You can use _topology spread constraints_ to control how {{< glossary_tooltip text="Pods" term_id="Pod" >}} are spread across your cluster among failure-domains such as regions, zones, nodes, and other user-defined topology domains. This can help to achieve high availability as well as efficient resource utilization.
-->

可以使用*拓扑扩展约束*来控制 {{< glossary_tooltip text="Pods" term_id="Pod" >}} 在集群内故障域（例如地区，区域，节点和其他用户自定义拓扑域）之间的分布。这可以帮助实现高可用以及提升资源利用率。

<!-- body -->

<!--
## Prerequisites
-->
## 先决条件

<!--
### Enable Feature Gate
-->
### 启用功能

<!--
Ensure the `EvenPodsSpread` feature gate is enabled (it is disabled by default
in 1.16). See [Feature Gates](/docs/reference/command-line-tools-reference/feature-gates/)
for an explanation of enabling feature gates. The `EvenPodsSpread` feature gate must be enabled for the
{{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}} **and**
{{< glossary_tooltip text="scheduler" term_id="kube-scheduler" >}}.
-->

确保 `EvenPodsSpread` 功能已开启（在 1.16 版本中该功能默认关闭）。
阅读[特性门控](/zh/docs/reference/command-line-tools-reference/feature-gates/)了解如何开启该功能。
`EvenPodsSpread` 必须在 {{< glossary_tooltip text="API 服务器" term_id="kube-apiserver" >}} **和**
{{< glossary_tooltip text="调度器" term_id="kube-scheduler" >}} 中都开启。

<!--
### Node Labels
-->
### 节点标签

<!--
Topology spread constraints rely on node labels to identify the topology domain(s) that each Node is in. For example, a Node might have labels: `node=node1,zone=us-east-1a,region=us-east-1`
-->
拓扑扩展约束依赖于节点标签来标识每个节点所在的拓扑域。例如，一个节点可能具有标签：`node=node1,zone=us-east-1a,region=us-east-1`

<!--
Suppose you have a 4-node cluster with the following labels:
-->
假设你拥有一个具有以下标签的 4 节点集群：

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
然后从逻辑上看集群如下：

```
+---------------+---------------+
|     zoneA     |     zoneB     |
+-------+-------+-------+-------+
| node1 | node2 | node3 | node4 |
+-------+-------+-------+-------+
```

<!--
Instead of manually applying labels, you can also reuse the [well-known labels](/docs/reference/kubernetes-api/labels-annotations-taints/) that are created and populated automatically on most clusters.
-->
可以复用在大多数集群上自动创建和填充的[常用标签](/zh/docs/reference/kubernetes-api/labels-annotations-taints/)，而不是手动添加标签。

<!--
## Spread Constraints for Pods
-->
## Pod 的拓扑约束

### API

<!--
The field `pod.spec.topologySpreadConstraints` is introduced in 1.16 as below:
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
可以定义一个或多个 `topologySpreadConstraint` 来指示 kube-scheduler 如何将每个传入的 Pod 根据与现有的 Pod 的关联关系在集群中部署。字段包括：

<!--
- **maxSkew** describes the degree to which Pods may be unevenly distributed. It's the maximum permitted difference between the number of matching Pods in any two topology domains of a given topology type. It must be greater than zero.
- **topologyKey** is the key of node labels. If two Nodes are labelled with this key and have identical values for that label, the scheduler treats both Nodes as being in the same topology. The scheduler tries to place a balanced number of Pods into each topology domain.
- **whenUnsatisfiable** indicates how to deal with a Pod if it doesn't satisfy the spread constraint:
    - `DoNotSchedule` (default) tells the scheduler not to schedule it.
    - `ScheduleAnyway` tells the scheduler to still schedule it while prioritizing nodes that minimize the skew.
- **labelSelector** is used to find matching Pods. Pods that match this label selector are counted to determine the number of Pods in their corresponding topology domain. See [Label Selectors](/docs/concepts/overview/working-with-objects/labels/#label-selectors) for more details.
-->

- **maxSkew** 描述 pod 分布不均的程度。这是给定拓扑类型中任意两个拓扑域中匹配的 pod 之间的最大允许差值。它必须大于零。
- **topologyKey** 是节点标签的键。如果两个节点使用此键标记并且具有相同的标签值，则调度器会将这两个节点视为处于同一拓扑中。调度器试图在每个拓扑域中放置数量均衡的 pod。
- **whenUnsatisfiable** 指示如果 pod 不满足扩展约束时如何处理：
  - `DoNotSchedule`（默认）告诉调度器不用进行调度。
  - `ScheduleAnyway` 告诉调度器在对最小化倾斜的节点进行优先级排序时仍对其进行调度。
- **labelSelector** 用于查找匹配的 pod。匹配此标签的 pod 将被统计，以确定相应拓扑域中 pod 的数量。
  有关详细信息，请参考[标签选择算符](/zh/docs/concepts/overview/working-with-objects/labels/#label-selectors)。

<!--
You can read more about this field by running `kubectl explain Pod.spec.topologySpreadConstraints`.
-->
执行 `kubectl explain Pod.spec.topologySpreadConstraints` 命令了解更多关于 topologySpreadConstraints 的信息。

<!--
### Example: One TopologySpreadConstraint

Suppose you have a 4-node cluster where 3 Pods labeled `foo:bar` are located in node1, node2 and node3 respectively (`P` represents Pod):
-->
### 例子：单个拓扑扩展约束

假设你拥有一个 4 节点集群，其中标记为 `foo:bar` 的 3 个 pod 分别位于 node1，node2 和 node3 中（`P` 表示 pod）：

```
+---------------+---------------+
|     zoneA     |     zoneB     |
+-------+-------+-------+-------+
| node1 | node2 | node3 | node4 |
+-------+-------+-------+-------+
|   P   |   P   |   P   |       |
+-------+-------+-------+-------+
```

<!--
If we want an incoming Pod to be evenly spread with existing Pods across zones, the spec can be given as:
-->
如果希望传入的 pod 均匀散布在现有的 pod 区域，则可以指定字段如下：

{{< codenew file="pods/topology-spread-constraints/one-constraint.yaml" >}}

<!--
`topologyKey: zone` implies the even distribution will only be applied to the nodes which have label pair "zone:&lt;any value&gt;" present. `whenUnsatisfiable: DoNotSchedule` tells the scheduler to let it stay pending if the incoming Pod can’t satisfy the constraint.
-->
`topologyKey: zone` 意味着均匀分布将只应用于存在标签对为 "zone:&lt;any value&gt;" 的节点上。
`whenUnsatisfiable: DoNotSchedule` 告诉调度器，如果传入的 pod 不满足约束，则让它保持悬决状态。

<!--
If the scheduler placed this incoming Pod into "zoneA", the Pods distribution would become [3, 1], 
hence the actual skew is 2 (3 - 1) - which violates `maxSkew: 1`. In this example, the incoming Pod can only be placed onto "zoneB":
-->
如果调度器将传入的 pod 放入 "zoneA"，pod 分布将变为 [3, 1]，因此实际的倾斜为 2（3 - 1）。
这违反了 `maxSkew: 1`。此示例中，传入的 pod 只能放置在 "zoneB" 上：

```
+---------------+---------------+      +---------------+---------------+
|     zoneA     |     zoneB     |      |     zoneA     |     zoneB     |
+-------+-------+-------+-------+      +-------+-------+-------+-------+
| node1 | node2 | node3 | node4 |  OR  | node1 | node2 | node3 | node4 |
+-------+-------+-------+-------+      +-------+-------+-------+-------+
|   P   |   P   |   P   |   P   |      |   P   |   P   |  P P  |       |
+-------+-------+-------+-------+      +-------+-------+-------+-------+
```

<!--
You can tweak the Pod spec to meet various kinds of requirements:
-->
可以调整 pod 规格以满足各种要求：

<!--
- Change `maxSkew` to a bigger value like "2" so that the incoming Pod can be placed onto "zoneA" as well.
- Change `topologyKey` to "node" so as to distribute the Pods evenly across nodes instead of zones. In the above example, if `maxSkew` remains "1", the incoming Pod can only be placed onto "node4".
- Change `whenUnsatisfiable: DoNotSchedule` to `whenUnsatisfiable: ScheduleAnyway` to ensure the incoming Pod to be always schedulable (suppose other scheduling APIs are satisfied). However, it’s preferred to be placed onto the topology domain which has fewer matching Pods. (Be aware that this preferability is jointly normalized with other internal scheduling priorities like resource usage ratio, etc.)
-->
- 将 `maxSkew` 更改为更大的值，比如 "2"，这样传入的 pod 也可以放在 "zoneA" 上。
- 将 `topologyKey` 更改为 "node"，以便将 pod 均匀分布在节点上而不是区域中。
  在上面的例子中，如果 `maxSkew` 保持为 "1"，那么传入的 pod 只能放在 "node4" 上。
- 将 `whenUnsatisfiable: DoNotSchedule` 更改为 `whenUnsatisfiable: ScheduleAnyway`，
  以确保传入的 Pod 始终可以调度（假设满足其他的调度 API）。
  但是，最好将其放置在具有较少匹配 Pod 的拓扑域中。
  （请注意，此优先性与其他内部调度优先级（如资源使用率等）一起进行标准化。）

<!--
### Example: Multiple TopologySpreadConstraints
-->
### 例子：多个拓扑扩展约束

<!--
This builds upon the previous example. Suppose you have a 4-node cluster where 3 Pods labeled `foo:bar` are located in node1, node2 and node3 respectively (`P` represents Pod):
-->

下面的例子建立在前面例子的基础上。假设你拥有一个 4 节点集群，其中 3 个标记为 `foo:bar` 的
Pod 分别位于 node1，node2 和 node3 上（`P` 表示 Pod）：

```
+---------------+---------------+
|     zoneA     |     zoneB     |
+-------+-------+-------+-------+
| node1 | node2 | node3 | node4 |
+-------+-------+-------+-------+
|   P   |   P   |   P   |       |
+-------+-------+-------+-------+
```

<!--
You can use 2 TopologySpreadConstraints to control the Pods spreading on both zone and node:
-->
可以使用 2 个拓扑扩展约束来控制 pod 在 区域和节点两个维度上进行分布：

{{< codenew file="pods/topology-spread-constraints/two-constraints.yaml" >}}

<!--
In this case, to match the first constraint, the incoming Pod can only be placed onto "zoneB"; while in terms of the second constraint, the incoming Pod can only be placed onto "node4". Then the results of 2 constraints are ANDed, so the only viable option is to place on "node4".
-->
在这种情况下，为了匹配第一个约束，传入的 pod 只能放置在 "zoneB" 中；而在第二个约束中，
传入的 Pod 只能放置在 "node4" 上。然后两个约束的结果加在一起，因此唯一可行的选择是放置在 "node4" 上。

<!--
Multiple constraints can lead to conflicts. Suppose you have a 3-node cluster across 2 zones:
-->
多个约束可能导致冲突。假设有一个跨越 2 个区域的 3 节点集群：

```
+---------------+-------+
|     zoneA     | zoneB |
+-------+-------+-------+
| node1 | node2 |  nod3 |
+-------+-------+-------+
|  P P  |   P   |  P P  |
+-------+-------+-------+
```

<!--
If you apply "two-constraints.yaml" to this cluster, you will notice "mypod" stays in `Pending` state. This is because: to satisfy the first constraint, "mypod" can only be put to "zoneB"; while in terms of the second constraint, "mypod" can only put to "node2". Then a joint result of "zoneB" and "node2" returns nothing.
-->
如果对集群应用 "two-constraints.yaml"，会发现 "mypod" 处于 `Pending` 状态。
这是因为：为了满足第一个约束，"mypod" 只能放在 "zoneB" 中，而第二个约束要求
"mypod" 只能放在 "node2" 上。pod 调度无法满足两种约束。

<!--
To overcome this situation, you can either increase the `maxSkew` or modify one of the constraints to use `whenUnsatisfiable: ScheduleAnyway`.
-->
为了克服这种情况，可以增加 `maxSkew` 或修改其中一个约束，让其使用
`whenUnsatisfiable: ScheduleAnyway`。

<!--
### Conventions

There are some implicit conventions worth noting here:
-->
### 约定

这里有一些值得注意的隐式约定：

<!--
- Only the Pods holding the same namespace as the incoming Pod can be matching candidates.
- Nodes without `topologySpreadConstraints[*].topologyKey` present will be bypassed. It implies that:
    1. the Pods located on those nodes do not impact `maxSkew` calculation - in the above example, suppose "node1" does not have label "zone", then the 2 Pods will be disregarded, hence the incomingPod will be scheduled into "zoneA".
    2. the incoming Pod has no chances to be scheduled onto this kind of nodes - in the above example, suppose a "node5" carrying label `{zone-typo: zoneC}` joins the cluster, it will be bypassed due to the absence of label key "zone".
-->
- 只有与传入 pod 具有相同命名空间的 pod 才能作为匹配候选者。
- 没有 `topologySpreadConstraints[*].topologyKey` 的节点将被忽略。这意味着：
  1. 位于这些节点上的 pod 不影响 `maxSkew` 的计算。
     在上面的例子中，假设 "node1" 没有标签 "zone"，那么 2 个 Pod 将被忽略，
     因此传入的 Pod 将被调度到 "zoneA" 中。
  2. 传入的 Pod 没有机会被调度到这类节点上。
     在上面的例子中，假设一个带有标签 `{zone-typo: zoneC}` 的 "node5" 加入到集群，
     它将由于没有标签键 "zone" 而被忽略。

<!--
- Be aware of what will happen if the incomingPod’s `topologySpreadConstraints[*].labelSelector` doesn’t match its own labels. In the above example, if we remove the incoming Pod’s labels, it can still be placed onto "zoneB" since the constraints are still satisfied. However, after the placement, the degree of imbalance of the cluster remains unchanged - it’s still zoneA having 2 Pods which hold label {foo:bar}, and zoneB having 1 Pod which holds label {foo:bar}. So if this is not what you expect, we recommend the workload’s `topologySpreadConstraints[*].labelSelector` to match its own labels.
-->
注意，如果传入 Pod 的 `topologySpreadConstraints[*].labelSelector` 与自身的标签不匹配，将会发生什么。
在上面的例子中，如果移除传入 Pod 的标签，Pod 仍然可以调度到 "zoneB"，因为约束仍然满足。
然而，在调度之后，集群的不平衡程度保持不变。zoneA 仍然有 2 个带有 {foo:bar} 标签的 Pod，
zoneB 有 1 个带有 {foo:bar} 标签的 Pod。
因此，如果这不是你所期望的，建议工作负载的 `topologySpreadConstraints[*].labelSelector`
与其自身的标签匹配。

<!--
- If the incoming Pod has `spec.nodeSelector` or `spec.affinity.nodeAffinity` defined, nodes not matching them will be bypassed.
    Suppose you have a 5-node cluster ranging from zoneA to zoneC:
    and you know that "zoneC" must be excluded. In this case, you can compose the yaml as below, so that "mypod" will be placed onto "zoneB" instead of "zoneC". Similarly `spec.nodeSelector` is also respected.
-->

- 如果传入的 pod 定义了 `spec.nodeSelector` 或 `spec.affinity.nodeAffinity`，则将忽略不匹配的节点。

    假设有一个从 zonea 到 zonec 的 5 节点集群：

    ```
    +---------------+---------------+-------+
    |     zoneA     |     zoneB     | zoneC |
    +-------+-------+-------+-------+-------+
    | node1 | node2 | node3 | node4 | node5 |
    +-------+-------+-------+-------+-------+
    |   P   |   P   |   P   |       |       |
    +-------+-------+-------+-------+-------+
    ```

    你知道 "zoneC" 必须被排除在外。在这种情况下，可以按如下方式编写 yaml，以便将 "mypod" 放置在 "zoneB" 上，而不是 "zoneC" 上。同样，`spec.nodeSelector` 也要一样处理。

    {{< codenew file="pods/topology-spread-constraints/one-constraint-with-nodeaffinity.yaml" >}}

<!--
## Comparison with PodAffinity/PodAntiAffinity

In Kubernetes, directives related to "Affinity" control how Pods are
scheduled - more packed or more scattered.
-->
## 与 PodAffinity/PodAntiAffinity 相比较

在 Kubernetes 中，与 "Affinity" 相关的指令控制 pod 的调度方式（更密集或更分散）。

<!--
- For `PodAffinity`, you can try to pack any number of Pods into qualifying
topology domain(s)
- For `PodAntiAffinity`, only one Pod can be scheduled into a
single topology domain.
-->
- 对于 `PodAffinity`，可以尝试将任意数量的 pod 打包到符合条件的拓扑域中。
- 对于 `PodAntiAffinity`，只能将一个 pod 调度到单个拓扑域中。

<!--
The "EvenPodsSpread" feature provides flexible options to distribute Pods evenly across different
topology domains - to achieve high availability or cost-saving. This can also help on rolling update
workloads and scaling out replicas smoothly.
See [Motivation](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/20190221-pod-topology-spread.md#motivation) for more details.
-->
"EvenPodsSpread" 功能提供灵活的选项来将 pod 均匀分布到不同的拓扑域中，以实现高可用性或节省成本。
这也有助于滚动更新工作负载和平滑扩展副本。
有关详细信息，请参考[动机](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/20190221-pod-topology-spread.md#motivation)。

<!--
## Known Limitations

As of 1.16, at which this feature is Alpha, there are some known limitations:
-->

## 已知局限性

1.16 版本（此功能为 alpha）存在下面的一些限制：

<!--
- Scaling down a `Deployment` may result in imbalanced Pods distribution.
- Pods matched on tainted nodes are respected. See [Issue 80921](https://github.com/kubernetes/kubernetes/issues/80921)
-->
- `Deployment` 的缩容可能导致 pod 分布不平衡。
- pod 匹配到污点节点是允许的。参考 [Issue 80921](https://github.com/kubernetes/kubernetes/issues/80921)。


