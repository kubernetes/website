---
title: Pod 拓撲分佈約束
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
你可以使用 _拓撲分佈約束（Topology Spread Constraints）_ 來控制
{{< glossary_tooltip text="Pod" term_id="Pod" >}} 在叢集內故障域之間的分佈，
例如區域（Region）、可用區（Zone）、節點和其他使用者自定義拓撲域。
這樣做有助於實現高可用並提升資源利用率。

<!-- body -->

<!--
## Prerequisites

### Node Labels
-->
## 先決條件   {#prerequisites}

### 節點標籤   {#node-labels}

<!--
Topology spread constraints rely on node labels to identify the topology domain(s) that each Node is in. For example, a Node might have labels: `node=node1,zone=us-east-1a,region=us-east-1`
-->
拓撲分佈約束依賴於節點標籤來標識每個節點所在的拓撲域。
例如，某節點可能具有標籤：`node=node1,zone=us-east-1a,region=us-east-1`

<!--
Suppose you have a 4-node cluster with the following labels:
-->
假設你擁有具有以下標籤的一個 4 節點叢集：

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
那麼，從邏輯上看叢集如下：

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
你可以複用在大多數叢集上自動建立和填充的[常用標籤](/zh-cn/docs/reference/labels-annotations-taints/)，
而不是手動新增標籤。

<!--
## Spread Constraints for Pods
-->
## Pod 的分佈約束    {#spread-constraints-for-pods}

### API

<!--
The API field `pod.spec.topologySpreadConstraints` is defined as below:
-->
`pod.spec.topologySpreadConstraints` 欄位定義如下所示：

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
你可以定義一個或多個 `topologySpreadConstraint` 來指示 kube-scheduler
如何根據與現有的 Pod 的關聯關係將每個傳入的 Pod 部署到叢集中。欄位包括：

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

- **maxSkew** 描述 Pod 分佈不均的程度。這是給定拓撲型別中任意兩個拓撲域中匹配的
  Pod 之間的最大允許差值。它必須大於零。取決於 `whenUnsatisfiable` 的取值，
  其語義會有不同。
  - 當 `whenUnsatisfiable` 等於 "DoNotSchedule" 時，`maxSkew` 是目標拓撲域中匹配的
    Pod 數與全域性最小值（一個拓撲域中與標籤選擇器匹配的 Pod 的最小數量。例如，如果你有
    3 個區域，分別具有 0 個、2 個 和 3 個匹配的 Pod，則全域性最小值為 0。）之間可存在的差異。
  - 當 `whenUnsatisfiable` 等於 "ScheduleAnyway" 時，排程器會更為偏向能夠降低偏差值的拓撲域。

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
- **minDomains** 表示符合條件的域的最小數量。域是拓撲的一個特定例項。
  符合條件的域是其節點與節點選擇器匹配的域。

  - 指定的 `minDomains` 的值必須大於 0。
  - 當符合條件的、拓撲鍵匹配的域的數量小於 `minDomains` 時，Pod 拓撲分佈將“全域性最小值”
    （global minimum）設為 0，然後進行 `skew` 計算。“全域性最小值”是一個符合條件的域中匹配
    Pod 的最小數量，如果符合條件的域的數量小於 `minDomains`，則全域性最小值為零。
  - 當符合條件的拓撲鍵匹配域的個數等於或大於 `minDomains` 時，該值對排程沒有影響。
  - 當 `minDomains` 為 nil 時，約束的行為等於 `minDomains` 為 1。
  - 當 `minDomains` 不為 nil 時，`whenUnsatisfiable` 的值必須為 "`DoNotSchedule`" 。

  {{< note >}}
  <!--
  The `minDomains` field is an alpha field added in 1.24. You have to enable the
  `MinDomainsInPodToplogySpread` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
  in order to use it.
  -->
  `minDomains` 欄位是在 1.24 版本中新增的 alpha 欄位。你必須啟用
  `MinDomainsInPodToplogySpread` [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)才能使用它。
  {{< /note >}}

<!--
- **topologyKey** is the key of node labels. If two Nodes are labelled with this key and have identical values for that label, the scheduler treats both Nodes as being in the same topology. The scheduler tries to place a balanced number of Pods into each topology domain.

- **whenUnsatisfiable** indicates how to deal with a Pod if it doesn't satisfy the spread constraint:
    - `DoNotSchedule` (default) tells the scheduler not to schedule it.
    - `ScheduleAnyway` tells the scheduler to still schedule it while prioritizing nodes that minimize the skew.

- **labelSelector** is used to find matching Pods. Pods that match this label selector are counted to determine the number of Pods in their corresponding topology domain. See [Label Selectors](/docs/concepts/overview/working-with-objects/labels/#label-selectors) for more details.
-->
- **topologyKey** 是節點標籤的鍵。如果兩個節點使用此鍵標記並且具有相同的標籤值，
  則排程器會將這兩個節點視為處於同一拓撲域中。排程器試圖在每個拓撲域中放置數量均衡的 Pod。

- **whenUnsatisfiable** 指示如果 Pod 不滿足分佈約束時如何處理：
  - `DoNotSchedule`（預設）告訴排程器不要排程。
  - `ScheduleAnyway` 告訴排程器仍然繼續排程，只是根據如何能將偏差最小化來對節點進行排序。

- **labelSelector** 用於查詢匹配的 Pod。匹配此標籤的 Pod 將被統計，
  以確定相應拓撲域中 Pod 的數量。
  有關詳細資訊，請參考[標籤選擇算符](/zh-cn/docs/concepts/overview/working-with-objects/labels/#label-selectors)。

<!--
When a Pod defines more than one `topologySpreadConstraint`, those constraints are ANDed: The kube-scheduler looks for a node for the incoming Pod that satisfies all the constraints.
-->
當 Pod 定義了不止一個 `topologySpreadConstraint`，這些約束之間是邏輯與的關係。
kube-scheduler 會為新的 Pod 尋找一個能夠滿足所有約束的節點。

<!--
You can read more about this field by running `kubectl explain Pod.spec.topologySpreadConstraints`.
-->
你可以執行 `kubectl explain Pod.spec.topologySpreadConstraints`
命令以瞭解關於 topologySpreadConstraints 的更多資訊。

<!--
### Example: One TopologySpreadConstraint

Suppose you have a 4-node cluster where 3 Pods labeled `foo:bar` are located in node1, node2 and node3 respectively:
-->
### 例子：單個 TopologySpreadConstraint

假設你擁有一個 4 節點叢集，其中標記為 `foo:bar` 的 3 個 Pod 分別位於
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
如果希望新來的 Pod 均勻分佈在現有的可用區域，則可以按如下設定其規約：

{{< codenew file="pods/topology-spread-constraints/one-constraint.yaml" >}}

<!--
`topologyKey: zone` implies the even distribution will only be applied to the nodes which have label pair "zone:&lt;any value&gt;" present. `whenUnsatisfiable: DoNotSchedule` tells the scheduler to let it stay pending if the incoming Pod can’t satisfy the constraint.
-->
`topologyKey: zone` 意味著均勻分佈將只應用於存在標籤鍵值對為
"zone:&lt;任何值&gt;" 的節點。
`whenUnsatisfiable: DoNotSchedule` 告訴排程器如果新的 Pod 不滿足約束，
則讓它保持懸決狀態。

<!--
If the scheduler placed this incoming Pod into "zoneA", the Pods distribution would become [3, 1], hence the actual skew is 2 (3 - 1) - which violates `maxSkew: 1`. In this example, the incoming Pod can only be placed onto "zoneB":
-->
如果排程器將新的 Pod 放入 "zoneA"，Pods 分佈將變為 [3, 1]，因此實際的偏差為
2（3 - 1）。這違反了 `maxSkew: 1` 的約定。此示例中，新 Pod 只能放置在
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
你可以調整 Pod 規約以滿足各種要求：

<!--
- Change `maxSkew` to a bigger value like "2" so that the incoming Pod can be placed onto "zoneA" as well.
- Change `topologyKey` to "node" so as to distribute the Pods evenly across nodes instead of zones. In the above example, if `maxSkew` remains "1", the incoming Pod can only be placed onto "node4".
- Change `whenUnsatisfiable: DoNotSchedule` to `whenUnsatisfiable: ScheduleAnyway` to ensure the incoming Pod to be always schedulable (suppose other scheduling APIs are satisfied). However, it’s preferred to be placed onto the topology domain which has fewer matching Pods. (Be aware that this preferability is jointly normalized with other internal scheduling priorities like resource usage ratio, etc.)
-->
- 將 `maxSkew` 更改為更大的值，比如 "2"，這樣新的 Pod 也可以放在 "zoneA" 上。
- 將 `topologyKey` 更改為 "node"，以便將 Pod 均勻分佈在節點上而不是區域中。
  在上面的例子中，如果 `maxSkew` 保持為 "1"，那麼傳入的 Pod 只能放在 "node4" 上。
- 將 `whenUnsatisfiable: DoNotSchedule` 更改為 `whenUnsatisfiable: ScheduleAnyway`，
  以確保新的 Pod 始終可以被排程（假設滿足其他的排程 API）。
  但是，最好將其放置在匹配 Pod 數量較少的拓撲域中。
  （請注意，這一優先判定會與其他內部排程優先順序（如資源使用率等）排序準則一起進行標準化。）

<!--
### Example: Multiple TopologySpreadConstraints
-->
### 例子：多個 TopologySpreadConstraints

<!--
This builds upon the previous example. Suppose you have a 4-node cluster where 3 Pods labeled `foo:bar` are located in node1, node2 and node3 respectively (`P` represents Pod):
-->
下面的例子建立在前面例子的基礎上。假設你擁有一個 4 節點叢集，其中 3 個標記為 `foo:bar` 的
Pod 分別位於 node1、node2 和 node3 上：

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
可以使用 2 個 TopologySpreadConstraint 來控制 Pod 在 區域和節點兩個維度上的分佈：

{{< codenew file="pods/topology-spread-constraints/two-constraints.yaml" >}}

<!--
In this case, to match the first constraint, the incoming Pod can only be placed onto "zoneB"; while in terms of the second constraint, the incoming Pod can only be placed onto "node4". Then the results of 2 constraints are ANDed, so the only viable option is to place on "node4".
-->
在這種情況下，為了匹配第一個約束，新的 Pod 只能放置在 "zoneB" 中；而在第二個約束中，
新的 Pod 只能放置在 "node4" 上。最後兩個約束的結果加在一起，唯一可行的選擇是放置在
"node4" 上。

<!--
Multiple constraints can lead to conflicts. Suppose you have a 3-node cluster across 2 zones:
-->
多個約束之間可能存在衝突。假設有一個跨越 2 個區域的 3 節點叢集：

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
如果對叢集應用 "two-constraints.yaml"，會發現 "mypod" 處於 `Pending` 狀態。
這是因為：為了滿足第一個約束，"mypod" 只能放在 "zoneB" 中，而第二個約束要求
"mypod" 只能放在 "node2" 上。Pod 排程無法滿足兩種約束。

<!--
To overcome this situation, you can either increase the `maxSkew` or modify one of the constraints to use `whenUnsatisfiable: ScheduleAnyway`.
-->
為了克服這種情況，你可以增加 `maxSkew` 或修改其中一個約束，讓其使用
`whenUnsatisfiable: ScheduleAnyway`。

<!--
### Interaction With Node Affinity and Node Selectors

The scheduler will skip the non-matching nodes from the skew calculations if the incoming Pod has `spec.nodeSelector` or `spec.affinity.nodeAffinity` defined.
-->
### 節點親和性與節點選擇器的相互作用   {#interaction-with-node-affinity-and-node-selectors}

如果 Pod 定義了 `spec.nodeSelector` 或 `spec.affinity.nodeAffinity`，
排程器將在偏差計算中跳過不匹配的節點。

<!--
### Example: TopologySpreadConstraints with NodeAffinity

Suppose you have a 5-node cluster ranging from zoneA to zoneC:
-->
### 示例：TopologySpreadConstraints 與 NodeAffinity

假設你有一個跨越 zoneA 到 zoneC 的 5 節點叢集：

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
而且你知道 "zoneC" 必須被排除在外。在這種情況下，可以按如下方式編寫 YAML，
以便將 "mypod" 放置在 "zoneB" 上，而不是 "zoneC" 上。同樣，`spec.nodeSelector`
也要一樣處理。

{{< codenew file="pods/topology-spread-constraints/one-constraint-with-nodeaffinity.yaml" >}}

<!--
The scheduler doesn't have prior knowledge of all the zones or other topology domains that a cluster has. They are determined from the existing nodes in the cluster. This could lead to a problem in autoscaled clusters, when a node pool (or node group) is scaled to zero nodes and the user is expecting them to scale up, because, in this case, those topology domains won't be considered until there is at least one node in them.
-->
排程器不會預先知道叢集擁有的所有區域和其他拓撲域。拓撲域由叢集中存在的節點確定。
在自動伸縮的叢集中，如果一個節點池（或節點組）的節點數量為零，
而使用者正期望其擴容時，可能會導致排程出現問題。
因為在這種情況下，排程器不會考慮這些拓撲域資訊，因為它們是空的，沒有節點。

<!--
### Other Noticeable Semantics

There are some implicit conventions worth noting here:
-->
### 其他值得注意的語義   {#other-noticeable-semantics}

這裡有一些值得注意的隱式約定：

<!--
- Only the Pods holding the same namespace as the incoming Pod can be matching candidates.

- The scheduler will bypass the nodes without `topologySpreadConstraints[*].topologyKey` present. This implies that:

  1. the Pods located on those nodes do not impact `maxSkew` calculation - in the above example, suppose "node1" does not have label "zone", then the 2 Pods will be disregarded, hence the incoming Pod will be scheduled into "zoneA".
  2. the incoming Pod has no chances to be scheduled onto such nodes - in the above example, suppose a "node5" carrying label `{zone-typo: zoneC}` joins the cluster, it will be bypassed due to the absence of label key "zone".
-->
- 只有與新的 Pod 具有相同名稱空間的 Pod 才能作為匹配候選者。
- 排程器會忽略沒有 `topologySpreadConstraints[*].topologyKey` 的節點。這意味著：
  1. 位於這些節點上的 Pod 不影響 `maxSkew` 的計算。
     在上面的例子中，假設 "node1" 沒有標籤 "zone"，那麼 2 個 Pod 將被忽略，
     因此傳入的 Pod 將被排程到 "zoneA" 中。

  2. 新的 Pod 沒有機會被排程到這類節點上。
     在上面的例子中，假設一個帶有標籤 `{zone-typo: zoneC}` 的 "node5" 加入到叢集，
     它將由於沒有標籤鍵 "zone" 而被忽略。

<!--
- Be aware of what will happen if the incomingPod’s `topologySpreadConstraints[*].labelSelector` doesn’t match its own labels. In the above example, if we remove the incoming Pod’s labels, it can still be placed onto "zoneB" since the constraints are still satisfied. However, after the placement, the degree of imbalance of the cluster remains unchanged - it’s still zoneA having 2 Pods which hold label {foo:bar}, and zoneB having 1 Pod which holds label {foo:bar}. So if this is not what you expect, we recommend the workload’s `topologySpreadConstraints[*].labelSelector` to match its own labels.
-->
- 注意，如果新 Pod 的 `topologySpreadConstraints[*].labelSelector`
  與自身的標籤不匹配，將會發生什麼。
  在上面的例子中，如果移除新 Pod 上的標籤，Pod 仍然可以排程到 "zoneB"，因為約束仍然滿足。
  然而，在排程之後，叢集的不平衡程度保持不變。zoneA 仍然有 2 個帶有 {foo:bar} 標籤的 Pod，
  zoneB 有 1 個帶有 {foo:bar} 標籤的 Pod。
  因此，如果這不是你所期望的，建議工作負載的 `topologySpreadConstraints[*].labelSelector`
  與其自身的標籤匹配。

<!--
### Cluster-level default constraints

It is possible to set default topology spread constraints for a cluster. Default
topology spread constraints are applied to a Pod if, and only if:

- It doesn't define any constraints in its `.spec.topologySpreadConstraints`.
- It belongs to a service, replication controller, replica set or stateful set.
-->
### 叢集級別的預設約束   {#cluster-level-default-constraints}

為叢集設定預設的拓撲分佈約束也是可能的。
預設拓撲分佈約束在且僅在以下條件滿足時才會被應用到 Pod 上：

- Pod 沒有在其 `.spec.topologySpreadConstraints` 設定任何約束；
- Pod 隸屬於某個服務、副本控制器、ReplicaSet 或 StatefulSet。

<!--
Default constraints can be set as part of the `PodTopologySpread` plugin args
in a [scheduling profile](/docs/reference/scheduling/config/#profiles).
The constraints are specified with the same [API above](#api), except that
`labelSelector` must be empty. The selectors are calculated from the services,
replication controllers, replica sets or stateful sets that the Pod belongs to.

An example configuration might look like follows:
-->
你可以在 [排程方案（Scheduling Profile）](/zh-cn/docs/reference/scheduling/config/#profiles)
中將預設約束作為 `PodTopologySpread` 外掛引數的一部分來設定。
約束的設定採用[如前所述的 API](#api)，只是 `labelSelector` 必須為空。
選擇算符是根據 Pod 所屬的服務、副本控制器、ReplicaSet 或 StatefulSet 來設定的。

配置的示例可能看起來像下面這個樣子：

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
[`SelectorSpread` 外掛](/zh-cn/docs/reference/scheduling/config/#scheduling-plugins)預設是被禁用的。
建議使用 `PodTopologySpread` 來實現類似的行為。
{{< /note >}}

<!--
#### Internal default constraints
-->
#### 內部預設約束    {#internal-default-constraints}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

<!--
If you don't configure any cluster-level default constraints for pod topology spreading,
then kube-scheduler acts as if you specified the following default topology constraints:
-->
如果你沒有為 Pod 拓撲分佈配置任何叢集級別的預設約束，
kube-scheduler 的行為就像你指定了以下預設拓撲約束一樣：

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
此外，原來用於提供等同行為的 `SelectorSpread` 外掛預設被禁用。

{{< note >}}
<!--
The `PodTopologySpread` plugin does not score the nodes that don't have
the topology keys specified in the spreading constraints. This might result
in a different default behavior compared to the legacy `SelectorSpread` plugin when
using the default topology constraints.
-->
對於分佈約束中所指定的拓撲鍵而言，`PodTopologySpread` 外掛不會為不包含這些主鍵的節點評分。
這可能導致在使用預設拓撲約束時，其行為與原來的 `SelectorSpread` 外掛的預設行為不同，

<!--
If your nodes are not expected to have **both** `kubernetes.io/hostname` and
`topology.kubernetes.io/zone` labels set, define your own constraints
instead of using the Kubernetes defaults.
-->
如果你的節點不會 **同時** 設定 `kubernetes.io/hostname` 和
`topology.kubernetes.io/zone` 標籤，你應該定義自己的約束而不是使用
Kubernetes 的預設約束。
{{< /note >}}

<!--
If you don't want to use the default Pod spreading constraints for your cluster,
you can disable those defaults by setting `defaultingType` to `List` and leaving
empty `defaultConstraints` in the `PodTopologySpread` plugin configuration:
-->
如果你不想為叢集使用預設的 Pod 分佈約束，你可以透過設定 `defaultingType` 引數為 `List`
並將 `PodTopologySpread` 外掛配置中的 `defaultConstraints` 引數置空來禁用預設 Pod 分佈約束。

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
## 與 PodAffinity/PodAntiAffinity 相比較

在 Kubernetes 中，與“親和性”相關的指令控制 Pod 的排程方式（更密集或更分散）。

<!--
- For `PodAffinity`, you can try to pack any number of Pods into qualifying
  topology domain(s)
- For `PodAntiAffinity`, only one Pod can be scheduled into a
  single topology domain.
-->
- 對於 `PodAffinity`，你可以嘗試將任意數量的 Pod 集中到符合條件的拓撲域中。
- 對於 `PodAntiAffinity`，只能將一個 Pod 排程到某個拓撲域中。

<!--
For finer control, you can specify topology spread constraints to distribute
Pods across different topology domains - to achieve either high availability or
cost-saving. This can also help on rolling update workloads and scaling out
replicas smoothly. See
[Motivation](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/895-pod-topology-spread#motivation)
for more details.
-->
要實現更細粒度的控制，你可以設定拓撲分佈約束來將 Pod 分佈到不同的拓撲域下，
從而實現高可用性或節省成本。這也有助於工作負載的滾動更新和平穩地擴充套件副本規模。
有關詳細資訊，請參考
[動機](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/20190221-pod-topology-spread.md#motivation)文件。

<!--
## Known Limitations

- There's no guarantee that the constraints remain satisfied when Pods are removed. For example, scaling down a Deployment may result in imbalanced Pods distribution.
You can use [Descheduler](https://github.com/kubernetes-sigs/descheduler) to rebalance the Pods distribution.

- Pods matched on tainted nodes are respected. See [Issue 80921](https://github.com/kubernetes/kubernetes/issues/80921)
-->
## 已知侷限性

- 當 Pod 被移除時，無法保證約束仍被滿足。例如，縮減某 Deployment 的規模時，
  Pod 的分佈可能不再均衡。
  你可以使用 [Descheduler](https://github.com/kubernetes-sigs/descheduler)
  來重新實現 Pod 分佈的均衡。

- 具有汙點的節點上匹配的 Pods 也會被統計。
  參考 [Issue 80921](https://github.com/kubernetes/kubernetes/issues/80921)。

## {{% heading "whatsnext" %}}

<!--
- [Blog: Introducing PodTopologySpread](https://kubernetes.io/blog/2020/05/introducing-podtopologyspread/)
  explains `maxSkew` in details, as well as bringing up some advanced usage examples.
-->
- [部落格: PodTopologySpread介紹](https://kubernetes.io/blog/2020/05/introducing-podtopologyspread/)
  詳細解釋了 `maxSkew`，並給出了一些高階的使用示例。
