---
title: 將 Pod 指派給節點
content_type: concept
weight: 20
---
<!--
reviewers:
- davidopp
- dom4ha
- kevin-wangzefeng
- macsko
- sanposhiho
title: Assigning Pods to Nodes
content_type: concept
weight: 20
-->

<!-- overview -->

<!--
You can constrain a {{< glossary_tooltip text="Pod" term_id="pod" >}} so that it is
_restricted_ to run on particular {{< glossary_tooltip text="node(s)" term_id="node" >}},
or to _prefer_ to run on particular nodes.
There are several ways to do this and the recommended approaches all use
[label selectors](/docs/concepts/overview/working-with-objects/labels/) to facilitate the selection.
Often, you do not need to set any such constraints; the
{{< glossary_tooltip text="scheduler" term_id="kube-scheduler" >}} will automatically do a reasonable placement
(for example, spreading your Pods across nodes so as not place Pods on a node with insufficient free resources).
However, there are some circumstances where you may want to control which node
the Pod deploys to, for example, to ensure that a Pod ends up on a node with an SSD attached to it,
or to co-locate Pods from two different services that communicate a lot into the same availability zone.
-->
你可以約束一個 {{< glossary_tooltip text="Pod" term_id="pod" >}}
以便**限制**其只能在特定的{{< glossary_tooltip text="節點" term_id="node" >}}上運行，
或優先在特定的節點上運行。有幾種方法可以實現這點，
推薦的方法都是用[標籤選擇算符](/zh-cn/docs/concepts/overview/working-with-objects/labels/)來進行選擇。
通常這樣的約束不是必須的，因爲調度器將自動進行合理的放置（比如，將 Pod 分散到節點上，
而不是將 Pod 放置在可用資源不足的節點上等等）。但在某些情況下，你可能需要進一步控制
Pod 被部署到哪個節點。例如，確保 Pod 最終落在連接了 SSD 的機器上，
或者將來自兩個不同的服務且有大量通信的 Pod 被放置在同一個可用區。

<!-- body -->

<!--
You can use any of the following methods to choose where Kubernetes schedules
specific Pods:

- [nodeSelector](#nodeselector) field matching against [node labels](#built-in-node-labels)
- [Affinity and anti-affinity](#affinity-and-anti-affinity)
- [nodeName](#nodename) field
- [Pod topology spread constraints](#pod-topology-spread-constraints)
-->
你可以使用下列方法中的任何一種來選擇 Kubernetes 對特定 Pod 的調度：

- 與[節點標籤](#built-in-node-labels)匹配的 [nodeSelector](#nodeSelector)
- [親和性與反親和性](#affinity-and-anti-affinity)
- [nodeName](#nodename) 字段
- [Pod 拓撲分佈約束](#pod-topology-spread-constraints)

<!--
## Node labels {#built-in-node-labels}

Like many other Kubernetes objects, nodes have
[labels](/docs/concepts/overview/working-with-objects/labels/). You can
[attach labels manually](/docs/tasks/configure-pod-container/assign-pods-nodes/#add-a-label-to-a-node).
Kubernetes also populates a [standard set of labels](/docs/reference/node/node-labels/)
on all nodes in a cluster.
-->
## 節點標籤     {#built-in-node-labels}

與很多其他 Kubernetes 對象類似，節點也有[標籤](/zh-cn/docs/concepts/overview/working-with-objects/labels/)。
你可以[手動地添加標籤](/zh-cn/docs/tasks/configure-pod-container/assign-pods-nodes/#add-a-label-to-a-node)。
Kubernetes 也會爲叢集中所有節點添加一些[標準的標籤](/zh-cn/docs/reference/node/node-labels/)。

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

通過爲節點添加標籤，你可以準備讓 Pod 調度到特定節點或節點組上。
你可以使用這個功能來確保特定的 Pod 只能運行在具有一定隔離性、安全性或監管屬性的節點上。

<!--
If you use labels for node isolation, choose label keys that the {{<glossary_tooltip text="kubelet" term_id="kubelet">}}
cannot modify. This prevents a compromised node from setting those labels on
itself so that the scheduler schedules workloads onto the compromised node.
-->
如果使用標籤來實現節點隔離，建議選擇節點上的
{{<glossary_tooltip text="kubelet" term_id="kubelet">}}
無法修改的標籤鍵。
這可以防止受感染的節點在自身上設置這些標籤，進而影響調度器將工作負載調度到受感染的節點。

<!--
The [`NodeRestriction` admission plugin](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)
prevents the kubelet from setting or modifying labels with a
`node-restriction.kubernetes.io/` prefix.

To make use of that label prefix for node isolation:
-->
[`NodeRestriction` 准入插件](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#noderestriction)防止
kubelet 使用 `node-restriction.kubernetes.io/` 前綴設置或修改標籤。

要使用該標籤前綴進行節點隔離：

<!--
1. Ensure you are using the [Node authorizer](/docs/reference/access-authn-authz/node/) and have _enabled_ the `NodeRestriction` admission plugin.
2. Add labels with the `node-restriction.kubernetes.io/` prefix to your nodes, and use those labels in your [node selectors](#nodeselector).
   For example, `example.com.node-restriction.kubernetes.io/fips=true` or `example.com.node-restriction.kubernetes.io/pci-dss=true`.
-->
1. 確保你在使用[節點鑑權](/zh-cn/docs/reference/access-authn-authz/node/)機制並且已經啓用了
   [NodeRestriction 准入插件](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#noderestriction)。
2. 將帶有 `node-restriction.kubernetes.io/` 前綴的標籤添加到 Node 對象，
   然後在[節點選擇算符](#nodeSelector)中使用這些標籤。
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
`nodeSelector` 是節點選擇約束的最簡單推薦形式。你可以將 `nodeSelector` 字段添加到
Pod 的規約中設置你希望目標節點所具有的[節點標籤](#built-in-node-labels)。
Kubernetes 只會將 Pod 調度到擁有你所指定的每個標籤的節點上。

<!--
See [Assign Pods to Nodes](/docs/tasks/configure-pod-container/assign-pods-nodes) for more
information.
-->
進一步的資訊可參見[將 Pod 指派給節點](/zh-cn/docs/tasks/configure-pod-container/assign-pods-nodes)。

<!--
## Affinity and anti-affinity

`nodeSelector` is the simplest way to constrain Pods to nodes with specific
labels. Affinity and anti-affinity expand the types of constraints you can
define. Some of the benefits of affinity and anti-affinity include:
-->
## 親和性與反親和性  {#affinity-and-anti-affinity}

`nodeSelector` 提供了一種最簡單的方法來將 Pod 約束到具有特定標籤的節點上。
親和性和反親和性擴展了你可以定義的約束類型。使用親和性與反親和性的一些好處有：

<!--
- The affinity/anti-affinity language is more expressive. `nodeSelector` only
  selects nodes with all the specified labels. Affinity/anti-affinity gives you
  more control over the selection logic.
- You can indicate that a rule is *soft* or *preferred*, so that the scheduler
  still schedules the Pod even if it can't find a matching node.
- You can constrain a Pod using labels on other Pods running on the node (or other topological domain),
  instead of just node labels, which allows you to define rules for which Pods
  can be co-located on a node.
-->
- 親和性、反親和性語言的表達能力更強。`nodeSelector` 只能選擇擁有所有指定標籤的節點。
  親和性、反親和性爲你提供對選擇邏輯的更強控制能力。
- 你可以標明某規則是“軟需求”或者“偏好”，這樣調度器在無法找到匹配節點時仍然調度該 Pod。
- 你可以使用節點上（或其他拓撲域中）運行的其他 Pod 的標籤來實施調度約束，
  而不是隻能使用節點本身的標籤。這個能力讓你能夠定義規則允許哪些 Pod 可以被放置在一起。

<!--
The affinity feature consists of two types of affinity:

- *Node affinity* functions like the `nodeSelector` field but is more expressive and
  allows you to specify soft rules.
- *Inter-pod affinity/anti-affinity* allows you to constrain Pods against labels
  on other Pods.
-->
親和性功能由兩種類型的親和性組成：

- **節點親和性**功能類似於 `nodeSelector` 字段，但它的表達能力更強，並且允許你指定軟規則。
- Pod 間親和性/反親和性允許你根據其他 Pod 的標籤來約束 Pod。

<!--
### Node affinity

Node affinity is conceptually similar to `nodeSelector`, allowing you to constrain which nodes your
Pod can be scheduled on based on node labels. There are two types of node
affinity:
-->
### 節點親和性   {#node-affinity}

節點親和性概念上類似於 `nodeSelector`，
它使你可以根據節點上的標籤來約束 Pod 可以調度到哪些節點上。
節點親和性有兩種：

<!--
- `requiredDuringSchedulingIgnoredDuringExecution`: The scheduler can't
  schedule the Pod unless the rule is met. This functions like `nodeSelector`,
  but with a more expressive syntax.
- `preferredDuringSchedulingIgnoredDuringExecution`: The scheduler tries to
  find a node that meets the rule. If a matching node is not available, the
  scheduler still schedules the Pod.
-->
- `requiredDuringSchedulingIgnoredDuringExecution`：
  調度器只有在規則被滿足的時候才能執行調度。此功能類似於 `nodeSelector`，
  但其語法表達能力更強。
- `preferredDuringSchedulingIgnoredDuringExecution`：
  調度器會嘗試尋找滿足對應規則的節點。如果找不到匹配的節點，調度器仍然會調度該 Pod。

{{<note>}}
<!--
In the preceding types, `IgnoredDuringExecution` means that if the node labels
change after Kubernetes schedules the Pod, the Pod continues to run.
-->
在上述類型中，`IgnoredDuringExecution` 意味着如果節點標籤在 Kubernetes
調度 Pod 後發生了變更，Pod 仍將繼續運行。
{{</note>}}

<!--
You can specify node affinities using the `.spec.affinity.nodeAffinity` field in
your Pod spec.

For example, consider the following Pod spec:
-->
你可以使用 Pod 規約中的 `.spec.affinity.nodeAffinity` 字段來設置節點親和性。

例如，考慮下面的 Pod 規約：

{{% code_sample file="pods/pod-with-node-affinity.yaml" %}}

<!--
In this example, the following rules apply:

- The node *must* have a label with the key `topology.kubernetes.io/zone` and
  the value of that label *must* be either `antarctica-east1` or `antarctica-west1`.
- The node *preferably* has a label with the key `another-node-label-key` and
  the value `another-node-label-value`.
-->
在這一示例中，所應用的規則如下：

- 節點**必須**包含一個鍵名爲 `topology.kubernetes.io/zone` 的標籤，
  並且該標籤的取值**必須**爲 `antarctica-east1` 或 `antarctica-west1`。
- 節點**最好**具有一個鍵名爲 `another-node-label-key` 且取值爲
  `another-node-label-value` 的標籤。

<!--
You can use the `operator` field to specify a logical operator for Kubernetes to use when
interpreting the rules. You can use `In`, `NotIn`, `Exists`, `DoesNotExist`,
`Gt` and `Lt`.
-->
你可以使用 `operator` 字段來爲 Kubernetes 設置在解釋規則時要使用的邏輯操作符。
你可以使用 `In`、`NotIn`、`Exists`、`DoesNotExist`、`Gt` 和 `Lt` 之一作爲操作符。

<!--
Read [Operators](#operators)
to learn more about how these work.
-->
閱讀[操作符](#operators)瞭解有關這些操作的更多資訊。

<!--
`NotIn` and `DoesNotExist` allow you to define node anti-affinity behavior.
Alternatively, you can use [node taints](/docs/concepts/scheduling-eviction/taint-and-toleration/)
to repel Pods from specific nodes.
-->
`NotIn` 和 `DoesNotExist` 可用來實現節點反親和性行爲。
你也可以使用[節點污點](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)
將 Pod 從特定節點上驅逐。

{{< note >}}
<!--
If you specify both `nodeSelector` and `nodeAffinity`, *both* must be satisfied
for the Pod to be scheduled onto a node.
-->
如果你同時指定了 `nodeSelector` 和 `nodeAffinity`，**兩者**必須都要滿足，
才能將 Pod 調度到候選節點上。

<!--
If you specify multiple terms in `nodeSelectorTerms` associated with `nodeAffinity`
types, then the Pod can be scheduled onto a node if one of the specified terms
can be satisfied (terms are ORed).
-->
如果你在與 nodeAffinity 類型關聯的 nodeSelectorTerms 中指定多個條件，
只要其中一個 `nodeSelectorTerms` 滿足（各個條件按邏輯或操作組合）的話，
Pod 就可以被調度到節點上。

<!--
If you specify multiple expressions in a single `matchExpressions` field associated with a
term in `nodeSelectorTerms`, then the Pod can be scheduled onto a node only
if all the expressions are satisfied (expressions are ANDed).
-->
如果你在與 `nodeSelectorTerms` 中的條件相關聯的單個 `matchExpressions` 字段中指定多個表達式，
則只有當所有表達式都滿足（各表達式按邏輯與操作組合）時，Pod 才能被調度到節點上。
{{< /note >}}

<!--
See [Assign Pods to Nodes using Node Affinity](/docs/tasks/configure-pod-container/assign-pods-nodes-using-node-affinity/)
for more information.
-->
參閱[使用節點親和性來爲 Pod 指派節點](/zh-cn/docs/tasks/configure-pod-container/assign-pods-nodes-using-node-affinity/)，
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

你可以爲 `preferredDuringSchedulingIgnoredDuringExecution` 親和性類型的每個實例設置
`weight` 字段，其取值範圍是 1 到 100。
當調度器找到能夠滿足 Pod 的其他調度請求的節點時，調度器會遍歷節點滿足的所有的偏好性規則，
並將對應表達式的 `weight` 值加和。

<!--
The final sum is added to the score of other priority functions for the node.
Nodes with the highest total score are prioritized when the scheduler makes a
scheduling decision for the Pod.

For example, consider the following Pod spec:
-->
最終的加和值會添加到該節點的其他優先級函數的評分之上。
在調度器爲 Pod 作出調度決定時，總分最高的節點的優先級也最高。

例如，考慮下面的 Pod 規約：

{{% code_sample file="pods/pod-with-affinity-preferred-weight.yaml" %}}

<!--
If there are two possible nodes that match the
`preferredDuringSchedulingIgnoredDuringExecution` rule, one with the
`label-1:key-1` label and another with the `label-2:key-2` label, the scheduler
considers the `weight` of each node and adds the weight to the other scores for
that node, and schedules the Pod onto the node with the highest final score.
-->
如果存在兩個候選節點，都滿足 `preferredDuringSchedulingIgnoredDuringExecution` 規則，
其中一個節點具有標籤 `label-1:key-1`，另一個節點具有標籤 `label-2:key-2`，
調度器會考察各個節點的 `weight` 取值，並將該權重值添加到節點的其他得分值之上，

{{< note >}}
<!--
If you want Kubernetes to successfully schedule the Pods in this example, you
must have existing nodes with the `kubernetes.io/os=linux` label.
-->
如果你希望 Kubernetes 能夠成功地調度此例中的 Pod，你必須擁有打了
`kubernetes.io/os=linux` 標籤的節點。
{{< /note >}}

<!--
#### Node affinity per scheduling profile
-->
#### 逐個調度方案中設置節點親和性    {#node-affinity-per-scheduling-profile}

{{< feature-state for_k8s_version="v1.20" state="beta" >}}

<!--
When configuring multiple [scheduling profiles](/docs/reference/scheduling/config/#multiple-profiles), you can associate
a profile with a node affinity, which is useful if a profile only applies to a specific set of nodes.
To do so, add an `addedAffinity` to the `args` field of the [`NodeAffinity` plugin](/docs/reference/scheduling/config/#scheduling-plugins)
in the [scheduler configuration](/docs/reference/scheduling/config/). For example:
-->
在設定多個[調度方案](/zh-cn/docs/reference/scheduling/config/#multiple-profiles)時，
你可以將某個方案與節點親和性關聯起來，如果某個調度方案僅適用於某組特殊的節點時，
這樣做是很有用的。
要實現這點，可以在[調度器設定](/zh-cn/docs/reference/scheduling/config/)中爲
[`NodeAffinity` 插件](/zh-cn/docs/reference/scheduling/config/#scheduling-plugins)的
`args` 字段添加 `addedAffinity`。例如：

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
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
這裏的 `addedAffinity` 除遵從 Pod 規約中設置的節點親和性之外，
還適用於將 `.spec.schedulerName` 設置爲 `foo-scheduler`。
換言之，爲了匹配 Pod，節點需要滿足 `addedAffinity` 和 Pod 的 `.spec.NodeAffinity`。

<!--
Since the `addedAffinity` is not visible to end users, its behavior might be
unexpected to them. Use node labels that have a clear correlation to the
scheduler profile name.
-->
由於 `addedAffinity` 對最終使用者不可見，其行爲可能對使用者而言是出乎意料的。
應該使用與調度方案名稱有明確關聯的節點標籤。

{{< note >}}
<!--
The DaemonSet controller, which [creates Pods for DaemonSets](/docs/concepts/workloads/controllers/daemonset/#how-daemon-pods-are-scheduled),
does not support scheduling profiles. When the DaemonSet controller creates
Pods, the default Kubernetes scheduler places those Pods and honors any
`nodeAffinity` rules in the DaemonSet controller.
-->
DaemonSet 控制器[爲 DaemonSet 創建 Pod](/zh-cn/docs/concepts/workloads/controllers/daemonset/#how-daemon-pods-are-scheduled)，
但該控制器不理會調度方案。
DaemonSet 控制器創建 Pod 時，預設的 Kubernetes 調度器負責放置 Pod，
並遵從 DaemonSet 控制器中設置的 `nodeAffinity` 規則。
{{< /note >}}

<!--
### Inter-pod affinity and anti-affinity

Inter-pod affinity and anti-affinity allow you to constrain which nodes your
Pods can be scheduled on based on the labels of Pods already running on that
node, instead of the node labels.
-->
### Pod 間親和性與反親和性  {#inter-pod-affinity-and-anti-affinity}

Pod 間親和性與反親和性使你可以基於已經在節點上運行的 Pod 的標籤來約束
Pod 可以調度到的節點，而不是基於節點上的標籤。

<!--
#### Types of Inter-pod Affinity and Anti-affinity

Inter-pod affinity and anti-affinity take the form "this
Pod should (or, in the case of anti-affinity, should not) run in an X if that X
is already running one or more Pods that meet rule Y", where X is a topology
domain like node, rack, cloud provider zone or region, or similar and Y is the
rule Kubernetes tries to satisfy.
-->
#### Pod 間親和性與反親和性的類型

Pod 間親和性與反親和性的格式爲“如果 X 上已經運行了一個或多個滿足規則 Y 的 Pod，
則這個 Pod 應該（或者在反親和性的情況下不應該）運行在 X 上”。
這裏的 X 可以是節點、機架、雲提供商可用區或地理區域或類似的拓撲域，
Y 則是 Kubernetes 嘗試滿足的規則。

<!--
You express these rules (Y) as [label selectors](/docs/concepts/overview/working-with-objects/labels/#label-selectors)
with an optional associated list of namespaces. Pods are namespaced objects in
Kubernetes, so Pod labels also implicitly have namespaces. Any label selectors
for Pod labels should specify the namespaces in which Kubernetes should look for those
labels.
-->
你通過[標籤選擇算符](/zh-cn/docs/concepts/overview/working-with-objects/labels/#label-selectors)
的形式來表達規則（Y），並可根據需要指定選關聯的名字空間列表。
Pod 在 Kubernetes 中是名字空間作用域的對象，因此 Pod 的標籤也隱式地具有名字空間屬性。
針對 Pod 標籤的所有標籤選擇算符都要指定名字空間，Kubernetes
會在指定的名字空間內尋找標籤。

<!--
You express the topology domain (X) using a `topologyKey`, which is the key for
the node label that the system uses to denote the domain. For examples, see
[Well-Known Labels, Annotations and Taints](/docs/reference/labels-annotations-taints/).
-->
你會通過 `topologyKey` 來表達拓撲域（X）的概念，其取值是系統用來標示域的節點標籤鍵。
相關示例可參見[常用標籤、註解和污點](/zh-cn/docs/reference/labels-annotations-taints/)。

{{< note >}}
<!--
Inter-pod affinity and anti-affinity require substantial amounts of
processing which can slow down scheduling in large clusters significantly. We do
not recommend using them in clusters larger than several hundred nodes.
-->
Pod 間親和性和反親和性都需要相當的計算量，因此會在大規模叢集中顯著降低調度速度。
我們不建議在包含數百個節點的叢集中使用這類設置。
{{< /note >}}

{{< note >}}
<!--
Pod anti-affinity requires nodes to be consistently labeled, in other words,
every node in the cluster must have an appropriate label matching `topologyKey`.
If some or all nodes are missing the specified `topologyKey` label, it can lead
to unintended behavior.
-->
Pod 反親和性需要節點上存在一致性的標籤。換言之，
叢集中每個節點都必須擁有與 `topologyKey` 匹配的標籤。
如果某些或者所有節點上不存在所指定的 `topologyKey` 標籤，調度行爲可能與預期的不同。
{{< /note >}}

<!--
Similar to [node affinity](#node-affinity) are two types of Pod affinity and
anti-affinity as follows:
-->
與[節點親和性](#node-affinity)類似，Pod 的親和性與反親和性也有兩種類型：

- `requiredDuringSchedulingIgnoredDuringExecution`
- `preferredDuringSchedulingIgnoredDuringExecution`

<!--
For example, you could use
`requiredDuringSchedulingIgnoredDuringExecution` affinity to tell the scheduler to
co-locate Pods of two services in the same cloud provider zone because they
communicate with each other a lot. Similarly, you could use
`preferredDuringSchedulingIgnoredDuringExecution` anti-affinity to spread Pods
from a service across multiple cloud provider zones.
-->
例如，你可以使用 `requiredDuringSchedulingIgnoredDuringExecution` 親和性來告訴調度器，
將兩個服務的 Pod 放到同一個雲提供商可用區內，因爲它們彼此之間通信非常頻繁。
類似地，你可以使用 `preferredDuringSchedulingIgnoredDuringExecution`
反親和性來將同一服務的多個 Pod 分佈到多個雲提供商可用區中。

<!--
To use inter-pod affinity, use the `affinity.podAffinity` field in the Pod spec.
For inter-pod anti-affinity, use the `affinity.podAntiAffinity` field in the Pod
spec.
-->
要使用 Pod 間親和性，可以使用 Pod 規約中的 `.affinity.podAffinity` 字段。
對於 Pod 間反親和性，可以使用 Pod 規約中的 `.affinity.podAntiAffinity` 字段。

<!--
#### Scheduling Behavior

When scheduling a new Pod, the Kubernetes scheduler evaluates the Pod's affinity/anti-affinity rules in the context of the current cluster state:

1. Hard Constraints (Node Filtering):
   - `podAffinity.requiredDuringSchedulingIgnoredDuringExecution` and `podAntiAffinity.requiredDuringSchedulingIgnoredDuringExecution`:
     - The scheduler ensures the new Pod is assigned to nodes that satisfy these required affinity and anti-affinity rules based on existing Pods.
-->
#### 調度行爲

在調度新 Pod 時，Kubernetes 調度器會根據當前叢集狀態評估 Pod 的親和性/反親和性規則：

1. 硬約束（節點過濾）：
   - `podAffinity.requiredDuringSchedulingIgnoredDuringExecution` 和
     `podAntiAffinity.requiredDuringSchedulingIgnoredDuringExecution`：
     - 調度器基於現有 Pod，確保新 Pod 被分配到滿足這些必需的親和性和反親和性規則的節點上。

<!--
2. Soft Constraints (Scoring):
   - `podAffinity.preferredDuringSchedulingIgnoredDuringExecution` and `podAntiAffinity.preferredDuringSchedulingIgnoredDuringExecution`:
     - The scheduler scores nodes based on how well they meet these preferred affinity and anti-affinity rules to optimize Pod placement.
-->
2. 軟約束（評分）：
   - `podAffinity.preferredDuringSchedulingIgnoredDuringExecution` 和
     `podAntiAffinity.preferredDuringSchedulingIgnoredDuringExecution`：
     - 調度器根據節點滿足這些優選的親和性和反親和性規則的程度來評分，以優化 Pod 的放置。

<!--
3. Ignored Fields:
   - Existing Pods' `podAffinity.preferredDuringSchedulingIgnoredDuringExecution`:
     - These preferred affinity rules are not considered during the scheduling decision for new Pods.
   - Existing Pods' `podAntiAffinity.preferredDuringSchedulingIgnoredDuringExecution`:
     - Similarly, preferred anti-affinity rules of existing Pods are ignored during scheduling.
-->
3. 忽略的字段：
   - 現有 Pod 的 `podAffinity.preferredDuringSchedulingIgnoredDuringExecution`：
     - 在爲新 Pod 做調度決策時，不會考慮這些優選的親和性規則。
   - 現有 Pod 的 `podAntiAffinity.preferredDuringSchedulingIgnoredDuringExecution`：
     - 同樣，在調度時會忽略現有 Pod 的優選反親和性規則。

<!--
#### Scheduling a Group of Pods with Inter-pod Affinity to Themselves

If the current Pod being scheduled is the first in a series that have affinity to themselves,
it is allowed to be scheduled if it passes all other affinity checks. This is determined by
verifying that no other Pod in the cluster matches the namespace and selector of this Pod,
that the Pod matches its own terms, and the chosen node matches all requested topologies.
This ensures that there will not be a deadlock even if all the Pods have inter-pod affinity
specified.
-->
#### 調度一組具有 Pod 間親和性的 Pod   {#scheduling-a-group-of-pods-with-inter-pod-affinity-to-themselves}

如果當前正被調度的 Pod 在具有自我親和性的 Pod 序列中排在第一個，
那麼只要它滿足其他所有的親和性規則，它就可以被成功調度。
這是通過以下方式確定的：確保叢集中沒有其他 Pod 與此 Pod 的名字空間和標籤選擇算符匹配；
該 Pod 滿足其自身定義的條件，並且選定的節點滿足所指定的所有拓撲要求。
這確保即使所有的 Pod 都設定了 Pod 間親和性，也不會出現調度死鎖的情況。

<!--
#### Pod Affinity example {#an-example-of-a-pod-that-uses-pod-affinity}

Consider the following Pod spec:
-->
#### Pod 親和性示例   {#an-example-of-a-pod-that-uses-pod-affinity}

考慮下面的 Pod 規約：

{{% code_sample file="pods/pod-with-pod-affinity.yaml" %}}

<!--
This example defines one Pod affinity rule and one Pod anti-affinity rule. The
Pod affinity rule uses the "hard"
`requiredDuringSchedulingIgnoredDuringExecution`, while the anti-affinity rule
uses the "soft" `preferredDuringSchedulingIgnoredDuringExecution`.
-->
本示例定義了一條 Pod 親和性規則和一條 Pod 反親和性規則。Pod 親和性規則設定爲
`requiredDuringSchedulingIgnoredDuringExecution`，而 Pod 反親和性設定爲
`preferredDuringSchedulingIgnoredDuringExecution`。

<!--
The affinity rule specifies that the scheduler is allowed to place the example Pod
on a node only if that node belongs to a specific [zone](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
where other Pods have been labeled with `security=S1`.
For instance, if we have a cluster with a designated zone, let's call it "Zone V,"
consisting of nodes labeled with `topology.kubernetes.io/zone=V`, the scheduler can
assign the Pod to any node within Zone V, as long as there is at least one Pod within
Zone V already labeled with `security=S1`. Conversely, if there are no Pods with `security=S1`
labels in Zone V, the scheduler will not assign the example Pod to any node in that zone.
-->
親和性規則規定，只有節點屬於特定的[區域](/zh-cn/docs/concepts/scheduling-eviction/topology-spread-constraints/)
且該區域中的其他 Pod 已打上 `security=S1` 標籤時，調度器纔可以將示例 Pod 調度到此節點上。
例如，如果我們有一個具有指定區域（稱之爲 "Zone V"）的叢集，此區域由帶有 `topology.kubernetes.io/zone=V`
標籤的節點組成，那麼只要 Zone V 內已經至少有一個 Pod 打了 `security=S1` 標籤，
調度器就可以將此 Pod 調度到 Zone V 內的任何節點。相反，如果 Zone V 中沒有帶有 `security=S1` 標籤的 Pod，
則調度器不會將示例 Pod 調度給該區域中的任何節點。

<!--
The anti-affinity rule specifies that the scheduler should try to avoid scheduling the Pod
on a node if that node belongs to a specific [zone](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
where other Pods have been labeled with `security=S2`.
For instance, if we have a cluster with a designated zone, let's call it "Zone R,"
consisting of nodes labeled with `topology.kubernetes.io/zone=R`, the scheduler should avoid
assigning the Pod to any node within Zone R, as long as there is at least one Pod within
Zone R already labeled with `security=S2`. Conversely, the anti-affinity rule does not impact
scheduling into Zone R if there are no Pods with `security=S2` labels.
-->
反親和性規則規定，如果節點屬於特定的[區域](/zh-cn/docs/concepts/scheduling-eviction/topology-spread-constraints/)
且該區域中的其他 Pod 已打上 `security=S2` 標籤，則調度器應嘗試避免將 Pod 調度到此節點上。
例如，如果我們有一個具有指定區域（我們稱之爲 "Zone R"）的叢集，此區域由帶有 `topology.kubernetes.io/zone=R`
標籤的節點組成，只要 Zone R 內已經至少有一個 Pod 打了 `security=S2` 標籤，
調度器應避免將 Pod 分配給 Zone R 內的任何節點。相反，如果 Zone R 中沒有帶有 `security=S2` 標籤的 Pod，
則反親和性規則不會影響將 Pod 調度到 Zone R。

<!--
To get yourself more familiar with the examples of Pod affinity and anti-affinity,
refer to the [design proposal](https://git.k8s.io/design-proposals-archive/scheduling/podaffinity.md).
-->
查閱[設計文檔](https://git.k8s.io/design-proposals-archive/scheduling/podaffinity.md)
以進一步熟悉 Pod 親和性與反親和性的示例。

<!--
You can use the `In`, `NotIn`, `Exists` and `DoesNotExist` values in the
`operator` field for Pod affinity and anti-affinity.
-->
你可以針對 Pod 間親和性與反親和性爲其 `operator` 字段使用 `In`、`NotIn`、`Exists`、`DoesNotExist` 等值。

<!--
Read [Operators](#operators)
to learn more about how these work.
-->
閱讀[操作符](#operators)瞭解有關這些操作的更多資訊。

<!--
In principle, the `topologyKey` can be any allowed label key with the following
exceptions for performance and security reasons:
-->
原則上，`topologyKey` 可以是任何合法的標籤鍵。出於性能和安全原因，`topologyKey`
有一些限制：

<!--
- For Pod affinity and anti-affinity, an empty `topologyKey` field is not allowed in both `requiredDuringSchedulingIgnoredDuringExecution`
  and `preferredDuringSchedulingIgnoredDuringExecution`.
- For `requiredDuringSchedulingIgnoredDuringExecution` Pod anti-affinity rules,
  the admission controller `LimitPodHardAntiAffinityTopology` limits
  `topologyKey` to `kubernetes.io/hostname`. You can modify or disable the
  admission controller if you want to allow custom topologies.
-->
- 對於 Pod 親和性而言，在 `requiredDuringSchedulingIgnoredDuringExecution`
  和 `preferredDuringSchedulingIgnoredDuringExecution` 中，`topologyKey`
  不允許爲空。
- 對於 `requiredDuringSchedulingIgnoredDuringExecution` 要求的 Pod 反親和性，
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
要匹配的名字空間列表，方法是在 `labelSelector` 和 `topologyKey`
所在層同一層次上設置 `namespaces`。
如果 `namespaces` 被忽略或者爲空，則預設爲 Pod 親和性/反親和性的定義所在的名字空間。

<!--
#### Namespace Selector
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
親和性條件會應用到 `namespaceSelector` 所選擇的名字空間和 `namespaces` 字段中所列舉的名字空間之上。
注意，空的 `namespaceSelector`（`{}`）會匹配所有名字空間，而 null 或者空的
`namespaces` 列表以及 null 值 `namespaceSelector` 意味着“當前 Pod 的名字空間”。

#### matchLabelKeys

{{< feature-state feature_gate_name="MatchLabelKeysInPodAffinity" >}}

{{< note >}}
<!-- UPDATE THIS WHEN PROMOTING TO STABLE -->
<!--
The `matchLabelKeys` field is a beta-level field and is enabled by default in
Kubernetes {{< skew currentVersion >}}.
When you want to disable it, you have to disable it explicitly via the
`MatchLabelKeysInPodAffinity` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/).
-->
`matchLabelKeys` 字段是一個 Beta 級別的字段，在 Kubernetes {{< skew currentVersion >}} 中預設被啓用。
當你想要禁用此字段時，你必須通過 `MatchLabelKeysInPodAffinity`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)禁用它。
{{< /note >}}

<!--
Kubernetes includes an optional `matchLabelKeys` field for Pod affinity
or anti-affinity. The field specifies keys for the labels that should match with the incoming Pod's labels,
when satisfying the Pod (anti)affinity.

The keys are used to look up values from the Pod labels; those key-value labels are combined
(using `AND`) with the match restrictions defined using the `labelSelector` field. The combined
filtering selects the set of existing Pods that will be taken into Pod (anti)affinity calculation.
-->
Kubernetes 在 Pod 親和性或反親和性中包含一個可選的 `matchLabelKeys` 字段。
此字段指定了應與傳入 Pod 的標籤匹配的標籤鍵，以滿足 Pod 的（反）親和性。

這些鍵用於從 Pod 的標籤中查找值；這些鍵值標籤與使用 `labelSelector`
字段定義的匹配限制組合（使用 `AND` 操作）。
這種組合的過濾機制選擇將用於 Pod（反）親和性計算的現有 Pod 集合。

{{< caution >}}
<!--
It's not recommended to use `matchLabelKeys` with labels that might be updated directly on pods.
Even if you edit the pod's label that is specified at `matchLabelKeys` **directly**, (that is, not via a deployment),
kube-apiserver doesn't reflect the label update onto the merged `labelSelector`.
-->
不建議在 `matchLabelKeys` 中使用可能會直接在 Pod 上更新的標籤。  
即使你編輯**直接**在 `matchLabelKeys` 中指定的 Pod 的標籤
（也就是說，不是通過 Deployment 進行更新），
kube-apiserver 也不會將這種標籤的更新反映到合併後的 `labelSelector` 上。
{{< /caution >}}

<!--
A common use case is to use `matchLabelKeys` with `pod-template-hash` (set on Pods
managed as part of a Deployment, where the value is unique for each revision).
Using `pod-template-hash` in `matchLabelKeys` allows you to target the Pods that belong
to the same revision as the incoming Pod, so that a rolling upgrade won't break affinity.
-->
一個常見的用例是在 `matchLabelKeys` 中使用 `pod-template-hash`
（設置在作爲 Deployment 的一部分進行管理的 Pod 上，其中每個版本的值是唯一的）。
在 `matchLabelKeys` 中使用 `pod-template-hash` 允許你定位與傳入 Pod 相同版本的 Pod，
確保滾動升級不會破壞親和性。

<!--
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: application-server
...
spec:
  template:
    spec:
      affinity:
        podAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - database
            topologyKey: topology.kubernetes.io/zone
            # Only Pods from a given rollout are taken into consideration when calculating pod affinity.
            # If you update the Deployment, the replacement Pods follow their own affinity rules
            # (if there are any defined in the new Pod template)
            matchLabelKeys:
            - pod-template-hash
```
-->
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: application-server
...
spec:
  template:
    spec:
      affinity:
        podAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - database
            topologyKey: topology.kubernetes.io/zone
            # 只有在計算 Pod 親和性時，才考慮指定上線的 Pod。
            # 如果你更新 Deployment，替代的 Pod 將遵循它們自己的親和性規則
            # （如果在新的 Pod 模板中定義了任何規則）。
            matchLabelKeys:
            - pod-template-hash
```

#### mismatchLabelKeys

{{< feature-state feature_gate_name="MatchLabelKeysInPodAffinity" >}}

{{< note >}}
<!-- UPDATE THIS WHEN PROMOTING TO STABLE -->
<!--
The `mismatchLabelKeys` field is an beta-level field and is disabled by default in
Kubernetes {{< skew currentVersion >}}.
When you want to disable it, you have to disable it explicitly via the
`MatchLabelKeysInPodAffinity` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/).
-->
`mismatchLabelKeys` 字段是一個 Beta 級別的字段，在 Kubernetes {{< skew currentVersion >}} 中預設被禁用。
當你想要禁用此字段時，你必須通過 `MatchLabelKeysInPodAffinity`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)禁用它。
{{< /note >}}

<!--
Kubernetes includes an optional `mismatchLabelKeys` field for Pod affinity
or anti-affinity. The field specifies keys for the labels that should not match with the incoming Pod's labels,
when satisfying the Pod (anti)affinity.
-->
Kubernetes 爲 Pod 親和性或反親和性提供了一個可選的 `mismatchLabelKeys` 字段。
此字段指定了在滿足 Pod（反）親和性時，不應與傳入 Pod 的標籤匹配的鍵。

{{< caution >}}
<!--
It's not recommended to use `mismatchLabelKeys` with labels that might be updated directly on pods.
Even if you edit the pod's label that is specified at `mismatchLabelKeys` **directly**, (that is, not via a deployment),
kube-apiserver doesn't reflect the label update onto the merged `labelSelector`.
-->
不建議在 `matchLabelKeys` 中使用可能會直接在 Pod 上更新的標籤。  
即使你編輯**直接**在 `matchLabelKeys` 中指定的 Pod 的標籤
（也就是說，不是通過 Deployment 進行更新），
kube-apiserver 也不會將這種標籤的更新反映到合併後的 `labelSelector` 上。
{{< /caution >}}

<!--
One example use case is to ensure Pods go to the topology domain (node, zone, etc) where only Pods from the same tenant or team are scheduled in.
In other words, you want to avoid running Pods from two different tenants on the same topology domain at the same time.
-->
一個示例用例是確保 Pod 進入指定的拓撲域（節點、區域等），在此拓撲域中只調度來自同一租戶或團隊的 Pod。
換句話說，你想要避免在同一拓撲域中同時運行來自兩個不同租戶的 Pod。

<!--
```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    # Assume that all relevant Pods have a "tenant" label set
    tenant: tenant-a
...
spec:
  affinity:
    podAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      # ensure that Pods associated with this tenant land on the correct node pool
      - matchLabelKeys:
          - tenant
        topologyKey: node-pool
    podAntiAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      # ensure that Pods associated with this tenant can't schedule to nodes used for another tenant
      - mismatchLabelKeys:
        - tenant # whatever the value of the "tenant" label for this Pod, prevent
                 # scheduling to nodes in any pool where any Pod from a different
                 # tenant is running.
        labelSelector:
          # We have to have the labelSelector which selects only Pods with the tenant label,
          # otherwise this Pod would have anti-affinity against Pods from daemonsets as well, for example,
          # which aren't supposed to have the tenant label.
          matchExpressions:
          - key: tenant
            operator: Exists
        topologyKey: node-pool
```
-->
```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    # 假設所有相關的 Pod 都設置了 “tenant” 標籤
    tenant: tenant-a
...
spec:
  affinity:
    podAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      # 確保與此租戶關聯的 Pod 落在正確的節點池上
      - matchLabelKeys:
          - tenant
        topologyKey: node-pool
    podAntiAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      # 確保與此租戶關聯的 Pod 不能調度到用於其他租戶的節點上
      - mismatchLabelKeys:
        - tenant # 無論此 Pod 的 “tenant” 標籤的值是什麼，
                 # 如果節點池中有來自別的租戶的任何 Pod 在運行，
                 # 都會阻礙此 Pod 被調度到這些節點池中的節點上
        labelSelector:
          # 我們必須有一個 labelSelector，只選擇具有 “tenant” 標籤的 Pod，
          # 否則此 Pod 也會與來自 DaemonSet 的 Pod 產生反親和性，
          # 例如，這些 Pod 不應該具有 “tenant” 標籤
          matchExpressions:
          - key: tenant
            operator: Exists
        topologyKey: node-pool
```

<!--
#### More practical use-cases

Inter-pod affinity and anti-affinity can be even more useful when they are used with higher
level collections such as ReplicaSets, StatefulSets, Deployments, etc. These
rules allow you to configure that a set of workloads should
be co-located in the same defined topology; for example, preferring to place two related
Pods onto the same node.
-->
#### 更實際的用例

Pod 間親和性與反親和性在與更高級別的集合（例如 ReplicaSet、StatefulSet、
Deployment 等）一起使用時，它們可能更加有用。
這些規則使得你可以設定一組工作負載，使其位於所定義的同一拓撲中；
例如優先將兩個相關的 Pod 置於相同的節點上。

<!--
For example: imagine a three-node cluster. You use the cluster to run a web application
and also an in-memory cache (such as Redis). For this example, also assume that latency between
the web application and the memory cache should be as low as is practical. You could use inter-pod
affinity and anti-affinity to co-locate the web servers with the cache as much as possible.
-->
以一個三節點的叢集爲例。你使用該叢集運行一個帶有內存緩存（例如 Redis）的 Web 應用程式。
在此例中，還假設 Web 應用程式和內存緩存之間的延遲應儘可能低。
你可以使用 Pod 間的親和性和反親和性來儘可能地將該 Web 伺服器與緩存並置。

<!--
In the following example Deployment for the Redis cache, the replicas get the label `app=store`. The
`podAntiAffinity` rule tells the scheduler to avoid placing multiple replicas
with the `app=store` label on a single node. This creates each cache in a
separate node.
-->
在下面的 Redis 緩存 Deployment 示例中，副本上設置了標籤 `app=store`。
`podAntiAffinity` 規則告訴調度器避免將多個帶有 `app=store` 標籤的副本部署到同一節點上。
因此，每個獨立節點上會創建一個緩存實例。

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
The following example Deployment for the web servers creates replicas with the label `app=web-store`.
The Pod affinity rule tells the scheduler to place each replica on a node that has a Pod
with the label `app=store`. The Pod anti-affinity rule tells the scheduler never to place
multiple `app=web-store` servers on a single node.
-->
下例的 Deployment 爲 Web 伺服器創建帶有標籤 `app=web-store` 的副本。
Pod 親和性規則告訴調度器將每個副本放到存在標籤爲 `app=store` 的 Pod 的節點上。
Pod 反親和性規則告訴調度器決不要在單個節點上放置多個 `app=web-store` 伺服器。

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
創建前面兩個 Deployment 會產生如下的叢集佈局，每個 Web 伺服器與一個緩存實例並置，
並分別運行在三個獨立的節點上。

|    node-1     |    node-2     |    node-3     |
|:-------------:|:-------------:|:-------------:|
| *webserver-1* | *webserver-2* | *webserver-3* |
|   *cache-1*   |   *cache-2*   |   *cache-3*   |

<!--
The overall effect is that each cache instance is likely to be accessed by a single client that
is running on the same node. This approach aims to minimize both skew (imbalanced load) and latency.
-->
總體效果是每個緩存實例都非常可能被在同一個節點上運行的某個客戶端訪問，
這種方法旨在最大限度地減少偏差（負載不平衡）和延遲。

<!--
You might have other reasons to use Pod anti-affinity.
See the [ZooKeeper tutorial](/docs/tutorials/stateful-application/zookeeper/#tolerating-node-failure)
for an example of a StatefulSet configured with anti-affinity for high
availability, using the same technique as this example.
-->
你可能還有使用 Pod 反親和性的一些其他原因。
參閱 [ZooKeeper 教程](/zh-cn/docs/tutorials/stateful-application/zookeeper/#tolerating-node-failure)
瞭解一個 StatefulSet 的示例，該 StatefulSet 設定了反親和性以實現高可用，
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

`nodeName` 是比親和性或者 `nodeSelector` 更爲直接的形式。`nodeName` 是 Pod
規約中的一個字段。如果 `nodeName` 字段不爲空，調度器會忽略該 Pod，
而指定節點上的 kubelet 會嘗試將 Pod 放到該節點上。
使用 `nodeName` 規則的優先級會高於使用 `nodeSelector` 或親和性與非親和性的規則。

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

- 如果所指代的節點不存在，則 Pod 無法運行，而且在某些情況下可能會被自動刪除。
- 如果所指代的節點無法提供用來運行 Pod 所需的資源，Pod 會失敗，
  而其失敗原因中會給出是否因爲內存或 CPU 不足而造成無法運行。
- 在雲環境中的節點名稱並不總是可預測的，也不總是穩定的。

{{< warning >}}
<!--
`nodeName` is intended for use by custom schedulers or advanced use cases where
you need to bypass any configured schedulers. Bypassing the schedulers might lead to
failed Pods if the assigned Nodes get oversubscribed. You can use [node affinity](#node-affinity)
or a the [`nodeselector` field](#nodeselector) to assign a Pod to a specific Node without bypassing the schedulers.
-->
`nodeName` 旨在供自定義調度器或需要繞過任何已設定調度器的高級場景使用。
如果已分配的 Node 負載過重，繞過調度器可能會導致 Pod 失敗。
你可以使用[節點親和性](#node-affinity)或 [`nodeselector` 字段](#nodeselector)將
Pod 分配給特定 Node，而無需繞過調度器。
{{</ warning >}}

<!--
Here is an example of a Pod spec using the `nodeName` field:
-->
下面是一個使用 `nodeName` 字段的 Pod 規約示例：

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
上面的 Pod 只能運行在節點 `kube-01` 之上。

## nominatedNodeName

{{< feature-state feature_gate_name="NominatedNodeNameForExpectation" >}}

<!--
`nominatedNodeName` can be used for external components to nominate node for a pending pod.
This nomination is best effort: it might be ignored if the scheduler determines the pod cannot go to a nominated node.
-->
外部組件可以使用 `nominatedNodeName` 爲待處理的 Pod 提名節點。
這種提名是盡力而爲的：如果調度器確定 Pod 不能進入被提名的節點，
那麼這個提名可能會被忽略。

<!--
Also, this field can be (over)written by the scheduler:
- If the scheduler finds a node to nominate via the preemption.
- If the scheduler decides where the pod is going, and move it to the binding cycle.
  - Note that, in this case, `nominatedNodeName` is put only when the pod has to go through `WaitOnPermit` or `PreBind` extension points.

Here is an example of a Pod status using the `nominatedNodeName` field:
-->
此外，此字段可以由調度器（重新）寫入：
- 如果調度器通過搶佔找到一個可提名的節點。
- 如果調度器決定了 Pod 的去向，並將其移至綁定階段。
  - 注意，在這種情況下，僅當 Pod 必須經過 `WaitOnPermit` 或
    `PreBind` 擴展點時，纔會設置 `nominatedNodeName`。

以下是使用 `nominatedNodeName` 字段的 Pod 狀態示例：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
...
status:
  nominatedNodeName: kube-01
```

<!--
## Pod topology spread constraints

You can use _topology spread constraints_ to control how {{< glossary_tooltip text="Pods" term_id="Pod" >}}
are spread across your cluster among failure-domains such as regions, zones, nodes, or among any other
topology domains that you define. You might do this to improve performance, expected availability, or
overall utilization.

Read [Pod topology spread constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
to learn more about how these work.
-->
## Pod 拓撲分佈約束 {#pod-topology-spread-constraints}

你可以使用 **拓撲分佈約束（Topology Spread Constraints）** 來控制
{{< glossary_tooltip text="Pod" term_id="Pod" >}} 在叢集內故障域之間的分佈，
故障域的示例有區域（Region）、可用區（Zone）、節點和其他使用者自定義的拓撲域。
這樣做有助於提升性能、實現高可用或提升資源利用率。

閱讀 [Pod 拓撲分佈約束](/zh-cn/docs/concepts/scheduling-eviction/topology-spread-constraints/)
以進一步瞭解這些約束的工作方式。

<!--
## Operators

The following are all the logical operators that you can use in the `operator` field for `nodeAffinity` and `podAffinity` mentioned above.
-->
## 操作符   {#operators}

下面是你可以在上述 `nodeAffinity` 和 `podAffinity` 的 `operator`
字段中可以使用的所有邏輯運算符。

<!--
|    Operator    |    Behavior     |
| :------------: | :-------------: |
| `In` | The label value is present in the supplied set of strings |
|   `NotIn`   | The label value is not contained in the supplied set of strings |
| `Exists` | A label with this key exists on the object |
| `DoesNotExist` | No label with this key exists on the object |
-->
| 操作符 | 行爲 |
| :------------: | :-------------: |
| `In` | 標籤值存在於提供的字符串集中 |
| `NotIn`  | 標籤值不包含在提供的字符串集中 |
| `Exists` | 對象上存在具有此鍵的標籤 |
| `DoesNotExist` | 對象上不存在具有此鍵的標籤 |

<!--
The following operators can only be used with `nodeAffinity`.
-->
以下操作符只能與 `nodeAffinity` 一起使用。

<!--
|    Operator    |    Behavior    |
| :------------: | :-------------: |
| `Gt` | The field value will be parsed as an integer, and that integer is less than the integer that results from parsing the value of a label named by this selector |
| `Lt` | The field value will be parsed as an integer, and that integer is greater than the integer that results from parsing the value of a label named by this selector |
-->
| 操作符 | 行爲 |
| :------------: | :-------------: |
| `Gt` | 字段值將被解析爲整數，並且該整數小於通過解析此選擇算符命名的標籤的值所得到的整數 |
| `Lt` | 字段值將被解析爲整數，並且該整數大於通過解析此選擇算符命名的標籤的值所得到的整數 |

{{<note>}}
<!--
`Gt` and `Lt` operators will not work with non-integer values. If the given value
doesn't parse as an integer, the Pod will fail to get scheduled. Also, `Gt` and `Lt`
are not available for `podAffinity`.
-->
`Gt` 和 `Lt` 操作符不能與非整數值一起使用。
如果給定的值未解析爲整數，則該 Pod 將無法被調度。
另外，`Gt` 和 `Lt` 不適用於 `podAffinity`。
{{</note>}}

## {{% heading "whatsnext" %}}

<!--
- Read more about [taints and tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/).
- Read the design docs for [node affinity](https://git.k8s.io/design-proposals-archive/scheduling/nodeaffinity.md)
  and for [inter-pod affinity/anti-affinity](https://git.k8s.io/design-proposals-archive/scheduling/podaffinity.md).
- Learn about how the [topology manager](/docs/tasks/administer-cluster/topology-manager/) takes part in node-level
  resource allocation decisions.
- Learn how to use [nodeSelector](/docs/tasks/configure-pod-container/assign-pods-nodes/).
- Learn how to use [affinity and anti-affinity](/docs/tasks/configure-pod-container/assign-pods-nodes-using-node-affinity/).
-->
- 進一步閱讀[污點與容忍度](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)文檔。
- 閱讀[節點親和性](https://git.k8s.io/design-proposals-archive/scheduling/nodeaffinity.md)和
  [Pod 間親和性與反親和性](https://git.k8s.io/design-proposals-archive/scheduling/podaffinity.md)的設計文檔。
- 瞭解[拓撲管理器](/zh-cn/docs/tasks/administer-cluster/topology-manager/)如何參與節點層面資源分配決定。
- 瞭解如何使用 [nodeSelector](/zh-cn/docs/tasks/configure-pod-container/assign-pods-nodes/)。
- 瞭解如何使用[親和性和反親和性](/zh-cn/docs/tasks/configure-pod-container/assign-pods-nodes-using-node-affinity/)。
