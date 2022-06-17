---
title: 將 Pod 指派給節點
content_type: concept
weight: 20
---

<!--
reviewers:
- davidopp
- kevin-wangzefeng
- bsalamat
title: Assigning Pods to Nodes
content_type: concept
weight: 20
-->

<!-- overview -->

<!--
You can constrain a {{< glossary_tooltip text="Pod" term_id="pod" >}} so that it can only run on particular set of
{{< glossary_tooltip text="Node(s)" term_id="node" >}}.
There are several ways to do this, and the recommended approaches all use
[label selectors](/docs/concepts/overview/working-with-objects/labels/) to facilitate the selection.
Generally such constraints are unnecessary, as the scheduler will automatically do a reasonable placement
(e.g. spread your pods across nodes so as not place the pod on a node with insufficient free resources, etc.)
However, there are some circumstances where you may want to control which node
the Pod deploys to, for example, to ensure that a Pod ends up on a node with an SSD attached to it, or to co-locate pods from two different
services that communicate a lot into the same availability zone.
-->
你可以約束一個 {{< glossary_tooltip text="Pod" term_id="pod" >}}
只能在特定的{{< glossary_tooltip text="節點" term_id="node" >}}上執行。
有幾種方法可以實現這點，推薦的方法都是用
[標籤選擇算符](/zh-cn/docs/concepts/overview/working-with-objects/labels/)來進行選擇。
通常這樣的約束不是必須的，因為排程器將自動進行合理的放置（比如，將 Pod 分散到節點上，
而不是將 Pod 放置在可用資源不足的節點上等等）。但在某些情況下，你可能需要進一步控制
Pod 被部署到的節點。例如，確保 Pod 最終落在連線了 SSD 的機器上，
或者將來自兩個不同的服務且有大量通訊的 Pods 被放置在同一個可用區。

<!-- body -->

<!--
You can use any of the following methods to choose where Kubernetes schedules
specific Pods: 

* [nodeSelector](#nodeselector) field matching against [node labels](#built-in-node-labels)
* [Affinity and anti-affinity](#affinity-and-anti-affinity)
* [nodeName](#nodename) field
-->
你可以使用下列方法中的任何一種來選擇 Kubernetes 對特定 Pod 的排程：

* 與[節點標籤](#built-in-node-labels)匹配的 [nodeSelector](#nodeSelector)
* [親和性與反親和性](#affinity-and-anti-affinity)
* [nodeName](#nodename) 欄位

<!--
## Node labels {#built-in-node-labels}

Like many other Kubernetes objects, nodes have
[labels](/docs/concepts/overview/working-with-objects/labels/). You can [attach labels manually](/docs/tasks/configure-pod-container/assign-pods-nodes/#add-a-label-to-a-node).
Kubernetes also populates a standard set of labels on all nodes in a cluster. See [Well-Known Labels, Annotations and Taints](/docs/reference/labels-annotations-taints/)
for a list of common node labels.
-->
## 節點標籤     {#built-in-node-labels}

與很多其他 Kubernetes 物件類似，節點也有[標籤](/zh-cn/docs/concepts/overview/working-with-objects/labels/)。
你可以[手動地新增標籤](/zh-cn/docs/tasks/configure-pod-container/assign-pods-nodes/#add-a-label-to-a-node)。
Kubernetes 也會為叢集中所有節點新增一些標準的標籤。
參見[常用的標籤、註解和汙點](/zh-cn/docs/reference/labels-annotations-taints/)以瞭解常見的節點標籤。

{{< note >}}
<!--
The value of these labels is cloud provider specific and is not guaranteed to be reliable.
For example, the value of `kubernetes.io/hostname` may be the same as the node name in some environments
and a different value in other environments.
-->
這些標籤的取值是取決於雲提供商的，並且是無法在可靠性上給出承諾的。
例如，`kubernetes.io/hostname` 的取值在某些環境中可能與節點名稱相同，
而在其他環境中會取不同的值。
{{< /note >}}

<!--
### Node isolation/restriction

Adding labels to nodes allows you to target Pods for scheduling on specific
nodes or groups of nodes. You can use this functionality to ensure that specific
Pods only run on nodes with certain isolation, security, or regulatory
properties. 
-->
## 節點隔離/限制  {#node-isolation-restriction}

透過為節點新增標籤，你可以準備讓 Pod 排程到特定節點或節點組上。
你可以使用這個功能來確保特定的 Pod 只能執行在具有一定隔離性，安全性或監管屬性的節點上。

<!--
If you use labels for node isolation, choose label keys that the {{<glossary_tooltip text="kubelet" term_id="kubelet">}}
cannot modify. This prevents a compromised node from setting those labels on
itself so that the scheduler schedules workloads onto the compromised node.
-->
如果使用標籤來實現節點隔離，建議選擇節點上的
{{<glossary_tooltip text="kubelet" term_id="kubelet">}}
無法修改的標籤鍵。
這可以防止受感染的節點在自身上設定這些標籤，進而影響排程器將工作負載排程到受感染的節點。

<!--
The [`NodeRestriction` admission plugin](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)
prevents the kubelet from setting or modifying labels with a
`node-restriction.kubernetes.io/` prefix. 

To make use of that label prefix for node isolation:
-->
[`NodeRestriction` 准入外掛](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#noderestriction)防止
kubelet 使用 `node-restriction.kubernetes.io/` 字首設定或修改標籤。

要使用該標籤字首進行節點隔離：

<!--
1. Ensure you are using the [Node authorizer](/docs/reference/access-authn-authz/node/) and have _enabled_ the `NodeRestriction` admission plugin.
2. Add labels with the `node-restriction.kubernetes.io/` prefix to your nodes, and use those labels in your [node selectors](#nodeselector).
   For example, `example.com.node-restriction.kubernetes.io/fips=true` or `example.com.node-restriction.kubernetes.io/pci-dss=true`.
-->
1. 確保你在使用[節點鑑權](/zh-cn/docs/reference/access-authn-authz/node/)機制並且已經啟用了
   [NodeRestriction 准入外掛](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#noderestriction)。
2. 將帶有 `node-restriction.kubernetes.io/` 字首的標籤新增到 Node 物件，
   然後在[節點選擇器](#nodeSelector)中使用這些標籤。
   例如，`example.com.node-restriction.kubernetes.io/fips=true` 或
   `example.com.node-restriction.kubernetes.io/pci-dss=true`。

## nodeSelector

<!--
`nodeSelector` is the simplest recommended form of node selection constraint.
You can add the `nodeSelector` field to your Pod specification and specify the
[node labels](#built-in-node-labels) you want the target node to have.
Kubernetes only schedules the Pod onto nodes that have each of the labels you
specify. 
-->
`nodeSelector` 是節點選擇約束的最簡單推薦形式。你可以將 `nodeSelector` 欄位新增到
Pod 的規約中設定你希望目標節點所具有的[節點標籤](#built-in-node-labels)。
Kubernetes 只會將 Pod 排程到擁有你所指定的每個標籤的節點上。

<!--
See [Assign Pods to Nodes](/docs/tasks/configure-pod-container/assign-pods-nodes) for more
information.
-->
進一步的資訊可參見[將 Pod 指派給節點](/zh-cn/docs/tasks/configure-pod-container/assign-pods-nodes)。

<!--
## Affinity and anti-affinity

`nodeSelector` is the simplest way to constrain Pods to nodes with specific
labels. Affinity and anti-affinity expands the types of constraints you can
define. Some of the benefits of affinity and anti-affinity include:
-->
## 親和性與反親和性  {#affinity-and-anti-affinity}

`nodeSelector` 提供了一種最簡單的方法來將 Pod 約束到具有特定標籤的節點上。
親和性和反親和性擴充套件了你可以定義的約束型別。使用親和性與反親和性的一些好處有：

<!--
* The affinity/anti-affinity language is more expressive. `nodeSelector` only
  selects nodes with all the specified labels. Affinity/anti-affinity gives you
  more control over the selection logic.
* You can indicate that a rule is *soft* or *preferred*, so that the scheduler
  still schedules the Pod even if it can't find a matching node.
* You can constrain a Pod using labels on other Pods running on the node (or other topological domain),
  instead of just node labels, which allows you to define rules for which Pods
  can be co-located on a node.
-->
* 親和性、反親和性語言的表達能力更強。`nodeSelector` 只能選擇擁有所有指定標籤的節點。
  親和性、反親和性為你提供對選擇邏輯的更強控制能力。
* 你可以標明某規則是“軟需求”或者“偏好”，這樣排程器在無法找到匹配節點時仍然排程該 Pod。
* 你可以使用節點上（或其他拓撲域中）執行的其他 Pod 的標籤來實施排程約束，
  而不是隻能使用節點本身的標籤。這個能力讓你能夠定義規則允許哪些 Pod 可以被放置在一起。

<!--
### Node affinity

Node affinity is conceptually similar to `nodeSelector`, allowing you to constrain which nodes your
Pod can be scheduled on based on node labels. There are two types of node
affinity:
-->
### 節點親和性   {#node-affinity}

節點親和性概念上類似於 `nodeSelector`，
它使你可以根據節點上的標籤來約束 Pod 可以排程到哪些節點上。
節點親和性有兩種：

<!--
* `requiredDuringSchedulingIgnoredDuringExecution`: The scheduler can't
  schedule the Pod unless the rule is met. This functions like `nodeSelector`,
  but with a more expressive syntax.
* `preferredDuringSchedulingIgnoredDuringExecution`: The scheduler tries to
  find a node that meets the rule. If a matching node is not available, the
  scheduler still schedules the Pod.
-->
* `requiredDuringSchedulingIgnoredDuringExecution`：
  排程器只有在規則被滿足的時候才能執行排程。此功能類似於 `nodeSelector`，
  但其語法表達能力更強。
* `preferredDuringSchedulingIgnoredDuringExecution`：
  排程器會嘗試尋找滿足對應規則的節點。如果找不到匹配的節點，排程器仍然會排程該 Pod。

{{<note>}}
<!--
In the preceding types, `IgnoredDuringExecution` means that if the node labels
change after Kubernetes schedules the Pod, the Pod continues to run.
-->
在上述型別中，`IgnoredDuringExecution` 意味著如果節點標籤在 Kubernetes
排程 Pod 時發生了變更，Pod 仍將繼續執行。
{{</note>}}

<!--
You can specify node affinities using the `.spec.affinity.nodeAffinity` field in
your Pod spec.

For example, consider the following Pod spec:
-->
你可以使用 Pod 規約中的 `.spec.affinity.nodeAffinity` 欄位來設定節點親和性。
例如，考慮下面的 Pod 規約：

{{< codenew file="pods/pod-with-node-affinity.yaml" >}}

<!--
In this example, the following rules apply:

* The node *must* have a label with the key `kubernetes.io/os` and
  the value `linux`.
* The node *preferably* has a label with the key `another-node-label-key` and
  the value `another-node-label-value`.
-->
在這一示例中，所應用的規則如下：

* 節點必須包含鍵名為 `kubernetes.io/os` 的標籤，並且其取值為 `linux`。
* 節點 **最好** 具有鍵名為 `another-node-label-key` 且取值為
  `another-node-label-value` 的標籤。

<!--
You can use the `operator` field to specify a logical operator for Kubernetes to use when
interpreting the rules. You can use `In`, `NotIn`, `Exists`, `DoesNotExist`,
`Gt` and `Lt`.
-->
你可以使用 `operator` 欄位來為 Kubernetes 設定在解釋規則時要使用的邏輯運算子。
你可以使用 `In`、`NotIn`、`Exists`、`DoesNotExist`、`Gt` 和 `Lt` 之一作為運算子。

<!--
`NotIn` and `DoesNotExist` allow you to define node anti-affinity behavior.
Alternatively, you can use [node taints](/docs/concepts/scheduling-eviction/taint-and-toleration/) 
to repel Pods from specific nodes.
-->
`NotIn` 和 `DoesNotExist` 可用來實現節點反親和性行為。
你也可以使用[節點汙點](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)
將 Pod 從特定節點上驅逐。

{{< note >}}
<!--
If you specify both `nodeSelector` and `nodeAffinity`, *both* must be satisfied
for the Pod to be scheduled onto a node.
-->
如果你同時指定了 `nodeSelector` 和 `nodeAffinity`，**兩者** 必須都要滿足，
才能將 Pod 排程到候選節點上。

<!--
If you specify multiple `nodeSelectorTerms` associated with `nodeAffinity`
types, then the Pod can be scheduled onto a node if one of the specified `nodeSelectorTerms` can be
satisfied.
-->
如果你指定了多個與 `nodeAffinity` 型別關聯的 `nodeSelectorTerms`，
只要其中一個 `nodeSelectorTerms` 滿足的話，Pod 就可以被排程到節點上。

<!--
If you specify multiple `matchExpressions` associated with a single `nodeSelectorTerms`,
then the Pod can be scheduled onto a node only if all the `matchExpressions` are
satisfied. 
-->
如果你指定了多個與同一 `nodeSelectorTerms` 關聯的 `matchExpressions`，
則只有當所有 `matchExpressions` 都滿足時 Pod 才可以被排程到節點上。
{{< /note >}}

<!--
See [Assign Pods to Nodes using Node Affinity](/docs/tasks/configure-pod-container/assign-pods-nodes-using-node-affinity/)
for more information.
-->
參閱[使用節點親和性來為 Pod 指派節點](/zh-cn/docs/tasks/configure-pod-container/assign-pods-nodes-using-node-affinity/)，
以瞭解進一步的資訊。

<!--
#### Node affinity weight

You can specify a `weight` between 1 and 100 for each instance of the
`preferredDuringSchedulingIgnoredDuringExecution` affinity type. When the
scheduler finds nodes that meet all the other scheduling requirements of the Pod, the
scheduler iterates through every preferred rule that the node satisfies and adds the
value of the `weight` for that expression to a sum.
-->
#### 節點親和性權重   {#node-affinity-weight}

你可以為 `preferredDuringSchedulingIgnoredDuringExecution` 親和性型別的每個例項設定
`weight` 欄位，其取值範圍是 1 到 100。
當排程器找到能夠滿足 Pod 的其他排程請求的節點時，排程器會遍歷節點滿足的所有的偏好性規則，
並將對應表示式的 `weight` 值加和。

<!--
The final sum is added to the score of other priority functions for the node.
Nodes with the highest total score are prioritized when the scheduler makes a
scheduling decision for the Pod.

For example, consider the following Pod spec: 
-->
最終的加和值會新增到該節點的其他優先順序函式的評分之上。
在排程器為 Pod 作出排程決定時，總分最高的節點的優先順序也最高。

例如，考慮下面的 Pod 規約：

{{< codenew file="pods/pod-with-affinity-anti-affinity.yaml" >}}

<!--
If there are two possible nodes that match the
`requiredDuringSchedulingIgnoredDuringExecution` rule, one with the
`label-1:key-1` label and another with the `label-2:key-2` label, the scheduler
considers the `weight` of each node and adds the weight to the other scores for
that node, and schedules the Pod onto the node with the highest final score.
-->
如果存在兩個候選節點，都滿足 `requiredDuringSchedulingIgnoredDuringExecution` 規則，
其中一個節點具有標籤 `label-1:key-1`，另一個節點具有標籤 `label-2:key-2`，
排程器會考察各個節點的 `weight` 取值，並將該權重值新增到節點的其他得分值之上，

{{< note >}}
<!--
If you want Kubernetes to successfully schedule the Pods in this example, you
must have existing nodes with the `kubernetes.io/os=linux` label.
-->
如果你希望 Kubernetes 能夠成功地排程此例中的 Pod，你必須擁有打了
`kubernetes.io/os=linux` 標籤的節點。
{{< /note >}}

<!--
#### Node affinity per scheduling profile
-->
#### 逐個排程方案中設定節點親和性    {#node-affinity-per-scheduling-profile}

{{< feature-state for_k8s_version="v1.20" state="beta" >}}

<!--
When configuring multiple [scheduling profiles](/docs/reference/scheduling/config/#multiple-profiles), you can associate
a profile with a Node affinity, which is useful if a profile only applies to a specific set of nodes.
To do so, add an `addedAffinity` to the `args` field  of the [`NodeAffinity` plugin](/docs/reference/scheduling/config/#scheduling-plugins)
in the [scheduler configuration](/docs/reference/scheduling/config/). For example:
-->
在配置多個[排程方案](/zh-cn/docs/reference/scheduling/config/#multiple-profiles)時，
你可以將某個方案與節點親和性關聯起來，如果某個排程方案僅適用於某組特殊的節點時，
這樣做是很有用的。
要實現這點，可以在[排程器配置](/zh-cn/docs/reference/scheduling/config/)中為
[`NodeAffinity` 外掛](/zh-cn/docs/reference/scheduling/config/#scheduling-plugins)的
`args` 欄位新增 `addedAffinity`。例如：

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta3
kind: KubeSchedulerConfiguration

profiles:
  - schedulerName: default-scheduler
  - schedulerName: foo-scheduler
    pluginConfig:
      - name: NodeAffinity
        args:
          addedAffinity:
            requiredDuringSchedulingIgnoredDuringExecution:
              nodeSelectorTerms:
              - matchExpressions:
                - key: scheduler-profile
                  operator: In
                  values:
                  - foo
```

<!--
The `addedAffinity` is applied to all Pods that set `.spec.schedulerName` to `foo-scheduler`, in addition to the
NodeAffinity specified in the PodSpec.
That is, in order to match the Pod, nodes need to satisfy `addedAffinity` and
the Pod's `.spec.NodeAffinity`.
-->
這裡的 `addedAffinity` 除遵從 Pod 規約中設定的節點親和性之外，還
適用於將 `.spec.schedulerName` 設定為 `foo-scheduler`。
換言之，為了匹配 Pod，節點需要滿足 `addedAffinity` 和 Pod 的 `.spec.NodeAffinity`。

<!--
Since the `addedAffinity` is not visible to end users, its behavior might be
unexpected to them. Use node labels that have a clear correlation to the
scheduler profile name.
-->
由於 `addedAffinity` 對終端使用者不可見，其行為可能對使用者而言是出乎意料的。
應該使用與排程方案名稱有明確關聯的節點標籤。

{{< note >}}
<!--
The DaemonSet controller, which [creates Pods for DaemonSets](/docs/concepts/workloads/controllers/daemonset/#scheduled-by-default-scheduler),
does not support scheduling profiles. When the DaemonSet controller creates
Pods, the default Kubernetes scheduler places those Pods and honors any
`nodeAffinity` rules in the DaemonSet controller.
-->
DaemonSet 控制器[為 DaemonSet 建立 Pods](/zh-cn/docs/concepts/workloads/controllers/daemonset/#scheduled-by-default-scheduler)，
但該控制器不理會排程方案。
DaemonSet 控制器建立 Pod 時，預設的 Kubernetes 排程器負責放置 Pod，
並遵從 DaemonSet 控制器中奢侈的 `nodeAffinity` 規則。
{{< /note >}}

<!--
### Inter-pod affinity and anti-affinity

Inter-pod affinity and anti-affinity allow you to constrain which nodes your
Pods can be scheduled on based on the labels of **Pods** already running on that
node, instead of the node labels.
-->
### pod 間親和性與反親和性  {#inter-pod-affinity-and-anti-affinity}

Pod 間親和性與反親和性使你可以基於已經在節點上執行的 **Pod** 的標籤來約束
Pod 可以排程到的節點，而不是基於節點上的標籤。

<!--
Inter-pod affinity and anti-affinity rules take the form "this
Pod should (or, in the case of anti-affinity, should not) run in an X if that X
is already running one or more Pods that meet rule Y", where X is a topology
domain like node, rack, cloud provider zone or region, or similar and Y is the
rule Kubernetes tries to satisfy.
-->
Pod 間親和性與反親和性的規則格式為“如果 X 上已經運行了一個或多個滿足規則 Y 的 Pod，
則這個 Pod 應該（或者在反親和性的情況下不應該）執行在 X 上”。
這裡的 X 可以是節點、機架、雲提供商可用區或地理區域或類似的拓撲域，
Y 則是 Kubernetes 嘗試滿足的規則。

<!--
You express these rules (Y) as [label selectors](/docs/concepts/overview/working-with-objects/labels/#label-selectors)
with an optional associated list of namespaces. Pods are namespaced objects in
Kubernetes, so Pod labels also implicitly have namespaces. Any label selectors
for Pod labels should specify the namespaces in which Kubernetes should look for those
labels.
-->
你透過[標籤選擇算符](/zh-cn/docs/concepts/overview/working-with-objects/labels/#label-selectors)
的形式來表達規則（Y），並可根據需要指定選關聯的名字空間列表。
Pod 在 Kubernetes 中是名字空間作用域的物件，因此 Pod 的標籤也隱式地具有名字空間屬性。
針對 Pod 標籤的所有標籤選擇算符都要指定名字空間，Kubernetes
會在指定的名字空間內尋找標籤。

<!--
You express the topology domain (X) using a `topologyKey`, which is the key for
the node label that the system uses to denote the domain. For examples, see
[Well-Known Labels, Annotations and Taints](/docs/reference/labels-annotations-taints/).
-->
你會透過 `topologyKey` 來表達拓撲域（X）的概念，其取值是系統用來標示域的節點標籤鍵。
相關示例可參見[常用標籤、註解和汙點](/zh-cn/docs/reference/labels-annotations-taints/)。

{{< note >}}
<!--
Inter-pod affinity and anti-affinity require substantial amount of
processing which can slow down scheduling in large clusters significantly. We do
not recommend using them in clusters larger than several hundred nodes.
-->
Pod 間親和性和反親和性都需要相當的計算量，因此會在大規模叢集中顯著降低排程速度。
我們不建議在包含數百個節點的叢集中使用這類設定。
{{< /note >}}

{{< note >}}
<!--
Pod anti-affinity requires nodes to be consistently labelled, in other words,
every node in the cluster must have an appropriate label matching `topologyKey`.
If some or all nodes are missing the specified `topologyKey` label, it can lead
to unintended behavior.
-->
Pod 反親和性需要節點上存在一致性的標籤。換言之，
叢集中每個節點都必須擁有與 `topologyKey` 匹配的標籤。
如果某些或者所有節點上不存在所指定的 `topologyKey` 標籤，排程行為可能與預期的不同。
{{< /note >}}

<!--
#### Types of inter-pod affinity and anti-affinity

Similar to [node affinity](#node-affinity) are two types of Pod affinity and
anti-affinity as follows:
-->
#### Pod 間親和性與反親和性的型別

與[節點親和性](#node-affinity)類似，Pod 的親和性與反親和性也有兩種型別：

* `requiredDuringSchedulingIgnoredDuringExecution`
* `preferredDuringSchedulingIgnoredDuringExecution`

<!--
For example, you could use
`requiredDuringSchedulingIgnoredDuringExecution` affinity to tell the scheduler to
co-locate Pods of two services in the same cloud provider zone because they
communicate with each other a lot. Similarly, you could use
`preferredDuringSchedulingIgnoredDuringExecution` anti-affinity to spread Pods
from a service across multiple cloud provider zones.
-->
例如，你可以使用 `requiredDuringSchedulingIgnoredDuringExecution` 親和性來告訴排程器，
將兩個服務的 Pod 放到同一個雲提供商可用區內，因為它們彼此之間通訊非常頻繁。
類似地，你可以使用 `preferredDuringSchedulingIgnoredDuringExecution`
反親和性來將同一服務的多個 Pod 分佈到多個雲提供商可用區中。

<!--
To use inter-pod affinity, use the `affinity.podAffinity` field in the Pod spec.
For inter-pod anti-affinity, use the `affinity.podAntiAffinity` field in the Pod
spec.
-->
要使用 Pod 間親和性，可以使用 Pod 規約中的 `.affinity.podAffinity` 欄位。
對於 Pod 間反親和性，可以使用 Pod 規約中的 `.affinity.podAntiAffinity` 欄位。

<!--
#### Pod affinity example {#an-example-of-a-pod-that-uses-pod-affinity}

Consider the following Pod spec:
-->
#### Pod 親和性示例   {#an-example-of-a-pod-that-uses-pod-affinity}

考慮下面的 Pod 規約：

{{< codenew file="pods/pod-with-pod-affinity.yaml" >}}

<!--
This example defines one Pod affinity rule and one Pod anti-affinity rule. The
Pod affinity rule uses the "hard"
`requiredDuringSchedulingIgnoredDuringExecution`, while the anti-affinity rule
uses the "soft" `preferredDuringSchedulingIgnoredDuringExecution`.
-->
本示例定義了一條 Pod 親和性規則和一條 Pod 反親和性規則。Pod 親和性規則配置為
`requiredDuringSchedulingIgnoredDuringExecution`，而 Pod 反親和性配置為
`preferredDuringSchedulingIgnoredDuringExecution`。

<!--
The affinity rule says that the scheduler can only schedule a Pod onto a node if
the node is in the same zone as one or more existing Pods with the label
`security=S1`. More precisely, the scheduler must place the Pod on a node that has the
`topology.kubernetes.io/zone=V` label, as long as there is at least one node in
that zone that currently has one or more Pods with the Pod label `security=S1`. 
-->
親和性規則表示，僅當節點和至少一個已執行且有 `security=S1` 的標籤的
Pod 處於同一區域時，才可以將該 Pod 排程到節點上。
更確切的說，排程器必須將 Pod 排程到具有 `topology.kubernetes.io/zone=V`
標籤的節點上，並且叢集中至少有一個位於該可用區的節點上執行著帶有
`security=S1` 標籤的 Pod。

<!--
The anti-affinity rule says that the scheduler should try to avoid scheduling
the Pod onto a node that is in the same zone as one or more Pods with the label
`security=S2`. More precisely, the scheduler should try to avoid placing the Pod on a node that has the
`topology.kubernetes.io/zone=R` label if there are other nodes in the
same zone currently running Pods with the `Security=S2` Pod label.
-->
反親和性規則表示，如果節點處於 Pod 所在的同一可用區且至少一個 Pod 具有
`security=S2` 標籤，則該 Pod 不應被排程到該節點上。
更確切地說， 如果同一可用區中存在其他執行著帶有 `security=S2` 標籤的 Pod 節點，
並且節點具有標籤 `topology.kubernetes.io/zone=R`，Pod 不能被排程到該節點上。

<!--
To get yourself more familiar with the examples of Pod affinity and anti-affinity,
refer to the [design proposal](https://github.com/kubernetes/design-proposals-archive/blob/main/scheduling/podaffinity.md).
-->
查閱[設計文件](https://github.com/kubernetes/design-proposals-archive/blob/main/scheduling/podaffinity.md)
以進一步熟悉 Pod 親和性與反親和性的示例。

<!--
You can use the `In`, `NotIn`, `Exists` and `DoesNotExist` values in the
`operator` field for Pod affinity and anti-affinity.

In principle, the `topologyKey` can be any allowed label key with the following
exceptions for performance and security reasons:
-->
你可以針對 Pod 間親和性與反親和性為其 `operator` 欄位使用 `In`、`NotIn`、`Exists`、
`DoesNotExist` 等值。

原則上，`topologyKey` 可以是任何合法的標籤鍵。出於效能和安全原因，`topologyKey`
有一些限制：

<!--
* For Pod affinity and anti-affinity, an empty `topologyKey` field is not allowed in both
  `requiredDuringSchedulingIgnoredDuringExecution`
  and `preferredDuringSchedulingIgnoredDuringExecution`.
* For `requiredDuringSchedulingIgnoredDuringExecution` Pod anti-affinity rules,
  the admission controller `LimitPodHardAntiAffinityTopology` limits
  `topologyKey` to `kubernetes.io/hostname`. You can modify or disable the
  admission controller if you want to allow custom topologies.
-->
* 對於 Pod 親和性而言，在 `requiredDuringSchedulingIgnoredDuringExecution`
  和 `preferredDuringSchedulingIgnoredDuringExecution` 中，`topologyKey`
  不允許為空。
* 對於 `requiredDuringSchedulingIgnoredDuringExecution` 要求的 Pod 反親和性，
  准入控制器 `LimitPodHardAntiAffinityTopology` 要求 `topologyKey` 只能是
  `kubernetes.io/hostname`。如果你希望使用其他定製拓撲邏輯，
  你可以更改准入控制器或者禁用之。

<!--
In addition to `labelSelector` and `topologyKey`, you can optionally specify a list
of namespaces which the `labelSelector` should match against using the
`namespaces` field at the same level as `labelSelector` and `topologyKey`.
If omitted or empty, `namespaces` defaults to the namespace of the Pod where the
affinity/anti-affinity definition appears.
-->
除了 `labelSelector` 和 `topologyKey`，你也可以指定 `labelSelector`
要匹配的名稱空間列表，方法是在 `labelSelector` 和 `topologyKey`
所在層同一層次上設定  `namespaces`。
如果 `namespaces` 被忽略或者為空，則預設為 Pod 親和性/反親和性的定義所在的名稱空間。

<!--
#### Namespace selector
-->
#### 名字空間選擇算符  {#namespace-selector}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

<!--
You can also select matching namespaces using `namespaceSelector`, which is a label query over the set of namespaces.
The affinity term is applied to namespaces selected by both `namespaceSelector` and the `namespaces` field.
Note that an empty `namespaceSelector` ({}) matches all namespaces, while a null or empty `namespaces` list and 
null `namespaceSelector` matches the namespace of the Pod where the rule is defined.
-->
使用者也可以使用 `namespaceSelector` 選擇匹配的名字空間，`namespaceSelector`
是對名字空間集合進行標籤查詢的機制。
親和性條件會應用到 `namespaceSelector` 所選擇的名字空間和 `namespaces` 欄位中
所列舉的名字空間之上。
注意，空的 `namespaceSelector`（`{}`）會匹配所有名字空間，而 null 或者空的
`namespaces` 列表以及 null 值 `namespaceSelector` 意味著“當前 Pod 的名字空間”。


<!--
#### More practical use-cases

Inter-pod affinity and anti-affinity can be even more useful when they are used with higher
level collections such as ReplicaSets, StatefulSets, Deployments, etc.  These
rules allow you to configure that a set of workloads should
be co-located in the same defined topology, eg., the same node.
-->
#### 更實際的用例

Pod 間親和性與反親和性在與更高級別的集合（例如 ReplicaSet、StatefulSet、
Deployment 等）一起使用時，它們可能更加有用。
這些規則使得你可以配置一組工作負載，使其位於相同定義拓撲（例如，節點）中。

<!--
In the following example Deployment for the redis cache, the replicas get the label `app=store`. The
`podAntiAffinity` rule tells the scheduler to avoid placing multiple replicas
with the `app=store` label on a single node. This creates each cache in a
separate node.
-->
在下面的 Redis 快取 Deployment 示例中，副本上設定了標籤 `app=store`。
`podAntiAffinity` 規則告訴排程器避免將多個帶有 `app=store` 標籤的副本部署到同一節點上。
因此，每個獨立節點上會建立一個快取例項。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis-cache
spec:
  selector:
    matchLabels:
      app: store
  replicas: 3
  template:
    metadata:
      labels:
        app: store
    spec:
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - store
            topologyKey: "kubernetes.io/hostname"
      containers:
      - name: redis-server
        image: redis:3.2-alpine
```

<!--
The following Deployment for the web servers creates replicas with the label `app=web-store`. The
Pod affinity rule tells the scheduler to place each replica on a node that has a
Pod with the label `app=store`. The Pod anti-affinity rule tells the scheduler
to avoid placing multiple `app=web-store` servers on a single node.
-->
下面的 Deployment 用來提供 Web 伺服器服務，會建立帶有標籤 `app=web-store` 的副本。
Pod 親和性規則告訴排程器將副本放到執行有標籤包含 `app=store` Pod 的節點上。
Pod 反親和性規則告訴排程器不要在同一節點上放置多個 `app=web-store` 的伺服器。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-server
spec:
  selector:
    matchLabels:
      app: web-store
  replicas: 3
  template:
    metadata:
      labels:
        app: web-store
    spec:
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - web-store
            topologyKey: "kubernetes.io/hostname"
        podAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - store
            topologyKey: "kubernetes.io/hostname"
      containers:
      - name: web-app
        image: nginx:1.16-alpine
```

<!--
Creating the two preceding Deployments results in the following cluster layout,
where each web server is co-located with a cache, on three separate nodes.
-->
建立前面兩個 Deployment 會產生如下的叢集佈局，每個 Web 伺服器與一個快取例項並置，
並分別執行在三個獨立的節點上。

|       node-1         |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
| *webserver-1*        |   *webserver-2*     |    *webserver-3*   |
|  *cache-1*           |     *cache-2*       |     *cache-3*      |

<!--
See the [ZooKeeper tutorial](/docs/tutorials/stateful-application/zookeeper/#tolerating-node-failure)
for an example of a StatefulSet configured with anti-affinity for high
availability, using the same technique as this example.
-->
參閱 [ZooKeeper 教程](/zh-cn/docs/tutorials/stateful-application/zookeeper/#tolerating-node-failure)
瞭解一個 StatefulSet 的示例，該 StatefulSet 配置了反親和性以實現高可用，
所使用的是與此例相同的技術。

<!--
## nodeName

`nodeName` is a more direct form of node selection than affinity or
`nodeSelector`. `nodeName` is a field in the Pod spec. If the `nodeName` field
is not empty, the scheduler ignores the Pod and the kubelet on the named node
tries to place the Pod on that node. Using `nodeName` overrules using
`nodeSelector` or affinity and anti-affinity rules.
-->
## nodeName

`nodeName` 是比親和性或者 `nodeSelector` 更為直接的形式。`nodeName` 是 Pod
規約中的一個欄位。如果 `nodeName` 欄位不為空，排程器會忽略該 Pod，
而指定節點上的 kubelet 會嘗試將 Pod 放到該節點上。
使用 `nodeName` 規則的優先順序會高於使用 `nodeSelector` 或親和性與非親和性的規則。

<!--
Some of the limitations of using `nodeName` to select nodes are:

- If the named node does not exist, the Pod will not run, and in
  some cases may be automatically deleted.
- If the named node does not have the resources to accommodate the
  Pod, the Pod will fail and its reason will indicate why,
  for example OutOfmemory or OutOfcpu.
- Node names in cloud environments are not always predictable or stable.
-->
使用 `nodeName` 來選擇節點的方式有一些侷限性：

- 如果所指代的節點不存在，則 Pod 無法執行，而且在某些情況下可能會被自動刪除。
- 如果所指代的節點無法提供用來執行 Pod 所需的資源，Pod 會失敗，
  而其失敗原因中會給出是否因為記憶體或 CPU 不足而造成無法執行。
- 在雲環境中的節點名稱並不總是可預測的，也不總是穩定的。

<!--
Here is an example of a Pod spec using the `nodeName` field:
-->
下面是一個使用 `nodeName` 欄位的 Pod 規約示例：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - name: nginx
    image: nginx
  nodeName: kube-01
```

<!--
The above Pod will only run on the node `kube-01`.
-->
上面的 Pod 只能執行在節點 `kube-01` 之上。

## {{% heading "whatsnext" %}}

<!--
* Read more about [taints and tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/) .
* Read the design docs for [node affinity](https://git.k8s.io/community/contributors/design-proposals/scheduling/nodeaffinity.md)
  and for [inter-pod affinity/anti-affinity](https://git.k8s.io/community/contributors/design-proposals/scheduling/podaffinity.md).
* Learn about how the [topology manager](/docs/tasks/administer-cluster/topology-manager/) takes part in node-level
  resource allocation decisions. 
* Learn how to use [nodeSelector](/docs/tasks/configure-pod-container/assign-pods-nodes/).
* Learn how to use [affinity and anti-affinity](/docs/tasks/configure-pod-container/assign-pods-nodes-using-node-affinity/).
-->
* 進一步閱讀[汙點與容忍度](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)文件。
* 閱讀[節點親和性](https://git.k8s.io/community/contributors/design-proposals/scheduling/nodeaffinity.md)
  和[Pod 間親和性與反親和性](https://git.k8s.io/community/contributors/design-proposals/scheduling/podaffinity.md)
  的設計文件。
* 瞭解[拓撲管理器](/zh-cn/docs/tasks/administer-cluster/topology-manager/)如何參與節點層面資源分配決定。
* 瞭解如何使用 [nodeSelector](/zh-cn/docs/tasks/configure-pod-container/assign-pods-nodes/)。
* 瞭解如何使用[親和性和反親和性](/zh-cn/docs/tasks/configure-pod-container/assign-pods-nodes-using-node-affinity/)。

