---
title: 将 Pod 指派给节点
content_type: concept
weight: 20
---

<!--
reviewers:
- davidopp
- kevin-wangzefeng
- alculquicondor
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
你可以约束一个 {{< glossary_tooltip text="Pod" term_id="pod" >}}
以便 **限制** 其只能在特定的{{< glossary_tooltip text="节点" term_id="node" >}}上运行，
或优先在特定的节点上运行。
有几种方法可以实现这点，推荐的方法都是用
[标签选择算符](/zh-cn/docs/concepts/overview/working-with-objects/labels/)来进行选择。
通常这样的约束不是必须的，因为调度器将自动进行合理的放置（比如，将 Pod 分散到节点上，
而不是将 Pod 放置在可用资源不足的节点上等等）。但在某些情况下，你可能需要进一步控制
Pod 被部署到哪个节点。例如，确保 Pod 最终落在连接了 SSD 的机器上，
或者将来自两个不同的服务且有大量通信的 Pods 被放置在同一个可用区。

<!-- body -->

<!--
You can use any of the following methods to choose where Kubernetes schedules
specific Pods:

- [nodeSelector](#nodeselector) field matching against [node labels](#built-in-node-labels)
- [Affinity and anti-affinity](#affinity-and-anti-affinity)
- [nodeName](#nodename) field
- [Pod topology spread constraints](#pod-topology-spread-constraints)
-->
你可以使用下列方法中的任何一种来选择 Kubernetes 对特定 Pod 的调度：

- 与[节点标签](#built-in-node-labels)匹配的 [nodeSelector](#nodeSelector)
- [亲和性与反亲和性](#affinity-and-anti-affinity)
- [nodeName](#nodename) 字段
- [Pod 拓扑分布约束](#pod-topology-spread-constraints)

<!--
## Node labels {#built-in-node-labels}

Like many other Kubernetes objects, nodes have
[labels](/docs/concepts/overview/working-with-objects/labels/). You can [attach labels manually](/docs/tasks/configure-pod-container/assign-pods-nodes/#add-a-label-to-a-node).
Kubernetes also populates a standard set of labels on all nodes in a cluster. See [Well-Known Labels, Annotations and Taints](/docs/reference/labels-annotations-taints/)
for a list of common node labels.
-->
## 节点标签     {#built-in-node-labels}

与很多其他 Kubernetes 对象类似，节点也有[标签](/zh-cn/docs/concepts/overview/working-with-objects/labels/)。
你可以[手动地添加标签](/zh-cn/docs/tasks/configure-pod-container/assign-pods-nodes/#add-a-label-to-a-node)。
Kubernetes 也会为集群中所有节点添加一些标准的标签。
参见[常用的标签、注解和污点](/zh-cn/docs/reference/labels-annotations-taints/)以了解常见的节点标签。

{{< note >}}
<!--
The value of these labels is cloud provider specific and is not guaranteed to be reliable.
For example, the value of `kubernetes.io/hostname` may be the same as the node name in some environments
and a different value in other environments.
-->
这些标签的取值是取决于云提供商的，并且是无法在可靠性上给出承诺的。
例如，`kubernetes.io/hostname` 的取值在某些环境中可能与节点名称相同，
而在其他环境中会取不同的值。
{{< /note >}}

<!--
### Node isolation/restriction

Adding labels to nodes allows you to target Pods for scheduling on specific
nodes or groups of nodes. You can use this functionality to ensure that specific
Pods only run on nodes with certain isolation, security, or regulatory
properties.
-->
## 节点隔离/限制  {#node-isolation-restriction}

通过为节点添加标签，你可以准备让 Pod 调度到特定节点或节点组上。
你可以使用这个功能来确保特定的 Pod 只能运行在具有一定隔离性，安全性或监管属性的节点上。

<!--
If you use labels for node isolation, choose label keys that the {{<glossary_tooltip text="kubelet" term_id="kubelet">}}
cannot modify. This prevents a compromised node from setting those labels on
itself so that the scheduler schedules workloads onto the compromised node.
-->
如果使用标签来实现节点隔离，建议选择节点上的
{{<glossary_tooltip text="kubelet" term_id="kubelet">}}
无法修改的标签键。
这可以防止受感染的节点在自身上设置这些标签，进而影响调度器将工作负载调度到受感染的节点。

<!--
The [`NodeRestriction` admission plugin](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)
prevents the kubelet from setting or modifying labels with a
`node-restriction.kubernetes.io/` prefix.

To make use of that label prefix for node isolation:
-->
[`NodeRestriction` 准入插件](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#noderestriction)防止
kubelet 使用 `node-restriction.kubernetes.io/` 前缀设置或修改标签。

要使用该标签前缀进行节点隔离：

<!--
1. Ensure you are using the [Node authorizer](/docs/reference/access-authn-authz/node/) and have _enabled_ the `NodeRestriction` admission plugin.
2. Add labels with the `node-restriction.kubernetes.io/` prefix to your nodes, and use those labels in your [node selectors](#nodeselector).
   For example, `example.com.node-restriction.kubernetes.io/fips=true` or `example.com.node-restriction.kubernetes.io/pci-dss=true`.
-->
1. 确保你在使用[节点鉴权](/zh-cn/docs/reference/access-authn-authz/node/)机制并且已经启用了
   [NodeRestriction 准入插件](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#noderestriction)。
2. 将带有 `node-restriction.kubernetes.io/` 前缀的标签添加到 Node 对象，
   然后在[节点选择器](#nodeSelector)中使用这些标签。
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
`nodeSelector` 是节点选择约束的最简单推荐形式。你可以将 `nodeSelector` 字段添加到
Pod 的规约中设置你希望目标节点所具有的[节点标签](#built-in-node-labels)。
Kubernetes 只会将 Pod 调度到拥有你所指定的每个标签的节点上。

<!--
See [Assign Pods to Nodes](/docs/tasks/configure-pod-container/assign-pods-nodes) for more
information.
-->
进一步的信息可参见[将 Pod 指派给节点](/zh-cn/docs/tasks/configure-pod-container/assign-pods-nodes)。

<!--
## Affinity and anti-affinity

`nodeSelector` is the simplest way to constrain Pods to nodes with specific
labels. Affinity and anti-affinity expands the types of constraints you can
define. Some of the benefits of affinity and anti-affinity include:
-->
## 亲和性与反亲和性  {#affinity-and-anti-affinity}

`nodeSelector` 提供了一种最简单的方法来将 Pod 约束到具有特定标签的节点上。
亲和性和反亲和性扩展了你可以定义的约束类型。使用亲和性与反亲和性的一些好处有：

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
- 亲和性、反亲和性语言的表达能力更强。`nodeSelector` 只能选择拥有所有指定标签的节点。
  亲和性、反亲和性为你提供对选择逻辑的更强控制能力。
- 你可以标明某规则是“软需求”或者“偏好”，这样调度器在无法找到匹配节点时仍然调度该 Pod。
- 你可以使用节点上（或其他拓扑域中）运行的其他 Pod 的标签来实施调度约束，
  而不是只能使用节点本身的标签。这个能力让你能够定义规则允许哪些 Pod 可以被放置在一起。

<!--
The affinity feature consists of two types of affinity:

- *Node affinity* functions like the `nodeSelector` field but is more expressive and
  allows you to specify soft rules.
- *Inter-pod affinity/anti-affinity* allows you to constrain Pods against labels
  on other Pods.
-->
亲和性功能由两种类型的亲和性组成：

- **节点亲和性**功能类似于 `nodeSelector` 字段，但它的表达能力更强，并且允许你指定软规则。
- Pod 间亲和性/反亲和性允许你根据其他 Pod 的标签来约束 Pod。

<!--
### Node affinity

Node affinity is conceptually similar to `nodeSelector`, allowing you to constrain which nodes your
Pod can be scheduled on based on node labels. There are two types of node
affinity:
-->
### 节点亲和性   {#node-affinity}

节点亲和性概念上类似于 `nodeSelector`，
它使你可以根据节点上的标签来约束 Pod 可以调度到哪些节点上。
节点亲和性有两种：

<!--
- `requiredDuringSchedulingIgnoredDuringExecution`: The scheduler can't
  schedule the Pod unless the rule is met. This functions like `nodeSelector`,
  but with a more expressive syntax.
- `preferredDuringSchedulingIgnoredDuringExecution`: The scheduler tries to
  find a node that meets the rule. If a matching node is not available, the
  scheduler still schedules the Pod.
-->
- `requiredDuringSchedulingIgnoredDuringExecution`：
  调度器只有在规则被满足的时候才能执行调度。此功能类似于 `nodeSelector`，
  但其语法表达能力更强。
- `preferredDuringSchedulingIgnoredDuringExecution`：
  调度器会尝试寻找满足对应规则的节点。如果找不到匹配的节点，调度器仍然会调度该 Pod。

{{<note>}}
<!--
In the preceding types, `IgnoredDuringExecution` means that if the node labels
change after Kubernetes schedules the Pod, the Pod continues to run.
-->
在上述类型中，`IgnoredDuringExecution` 意味着如果节点标签在 Kubernetes
调度 Pod 后发生了变更，Pod 仍将继续运行。
{{</note>}}

<!--
You can specify node affinities using the `.spec.affinity.nodeAffinity` field in
your Pod spec.

For example, consider the following Pod spec:
-->
你可以使用 Pod 规约中的 `.spec.affinity.nodeAffinity` 字段来设置节点亲和性。
例如，考虑下面的 Pod 规约：

{{< codenew file="pods/pod-with-node-affinity.yaml" >}}

<!--
In this example, the following rules apply:

- The node *must* have a label with the key `topology.kubernetes.io/zone` and
  the value of that label *must* be either `antarctica-east1` or `antarctica-west1`.
- The node *preferably* has a label with the key `another-node-label-key` and
  the value `another-node-label-value`.
-->
在这一示例中，所应用的规则如下：

- 节点**必须**包含一个键名为 `topology.kubernetes.io/zone` 的标签，
  并且该标签的取值**必须**为 `antarctica-east1` 或 `antarctica-west1`。
- 节点**最好**具有一个键名为 `another-node-label-key` 且取值为
  `another-node-label-value` 的标签。

<!--
You can use the `operator` field to specify a logical operator for Kubernetes to use when
interpreting the rules. You can use `In`, `NotIn`, `Exists`, `DoesNotExist`,
`Gt` and `Lt`.
-->
你可以使用 `operator` 字段来为 Kubernetes 设置在解释规则时要使用的逻辑操作符。
你可以使用 `In`、`NotIn`、`Exists`、`DoesNotExist`、`Gt` 和 `Lt` 之一作为操作符。

<!--
`NotIn` and `DoesNotExist` allow you to define node anti-affinity behavior.
Alternatively, you can use [node taints](/docs/concepts/scheduling-eviction/taint-and-toleration/)
to repel Pods from specific nodes.
-->
`NotIn` 和 `DoesNotExist` 可用来实现节点反亲和性行为。
你也可以使用[节点污点](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)
将 Pod 从特定节点上驱逐。

{{< note >}}
<!--
If you specify both `nodeSelector` and `nodeAffinity`, *both* must be satisfied
for the Pod to be scheduled onto a node.
-->
如果你同时指定了 `nodeSelector` 和 `nodeAffinity`，**两者** 必须都要满足，
才能将 Pod 调度到候选节点上。

<!--
If you specify multiple terms in `nodeSelectorTerms` associated with `nodeAffinity`
types, then the Pod can be scheduled onto a node if one of the specified terms
can be satisfied (terms are ORed).
-->
如果你在与 nodeAffinity 类型关联的 nodeSelectorTerms 中指定多个条件，
只要其中一个 `nodeSelectorTerms` 满足（各个条件按逻辑或操作组合）的话，Pod 就可以被调度到节点上。

<!--
If you specify multiple expressions in a single `matchExpressions` field associated with a
term in `nodeSelectorTerms`, then the Pod can be scheduled onto a node only
if all the expressions are satisfied (expressions are ANDed).
-->
如果你在与 `nodeSelectorTerms` 中的条件相关联的单个 `matchExpressions` 字段中指定多个表达式，
则只有当所有表达式都满足（各表达式按逻辑与操作组合）时，Pod 才能被调度到节点上。
{{< /note >}}

<!--
See [Assign Pods to Nodes using Node Affinity](/docs/tasks/configure-pod-container/assign-pods-nodes-using-node-affinity/)
for more information.
-->
参阅[使用节点亲和性来为 Pod 指派节点](/zh-cn/docs/tasks/configure-pod-container/assign-pods-nodes-using-node-affinity/)，
以了解进一步的信息。

<!--
#### Node affinity weight

You can specify a `weight` between 1 and 100 for each instance of the
`preferredDuringSchedulingIgnoredDuringExecution` affinity type. When the
scheduler finds nodes that meet all the other scheduling requirements of the Pod, the
scheduler iterates through every preferred rule that the node satisfies and adds the
value of the `weight` for that expression to a sum.
-->
#### 节点亲和性权重   {#node-affinity-weight}

你可以为 `preferredDuringSchedulingIgnoredDuringExecution` 亲和性类型的每个实例设置
`weight` 字段，其取值范围是 1 到 100。
当调度器找到能够满足 Pod 的其他调度请求的节点时，调度器会遍历节点满足的所有的偏好性规则，
并将对应表达式的 `weight` 值加和。

<!--
The final sum is added to the score of other priority functions for the node.
Nodes with the highest total score are prioritized when the scheduler makes a
scheduling decision for the Pod.

For example, consider the following Pod spec:
-->
最终的加和值会添加到该节点的其他优先级函数的评分之上。
在调度器为 Pod 作出调度决定时，总分最高的节点的优先级也最高。

例如，考虑下面的 Pod 规约：

{{< codenew file="pods/pod-with-affinity-anti-affinity.yaml" >}}

<!--
If there are two possible nodes that match the
`preferredDuringSchedulingIgnoredDuringExecution` rule, one with the
`label-1:key-1` label and another with the `label-2:key-2` label, the scheduler
considers the `weight` of each node and adds the weight to the other scores for
that node, and schedules the Pod onto the node with the highest final score.
-->
如果存在两个候选节点，都满足 `preferredDuringSchedulingIgnoredDuringExecution` 规则，
其中一个节点具有标签 `label-1:key-1`，另一个节点具有标签 `label-2:key-2`，
调度器会考察各个节点的 `weight` 取值，并将该权重值添加到节点的其他得分值之上，

{{< note >}}
<!--
If you want Kubernetes to successfully schedule the Pods in this example, you
must have existing nodes with the `kubernetes.io/os=linux` label.
-->
如果你希望 Kubernetes 能够成功地调度此例中的 Pod，你必须拥有打了
`kubernetes.io/os=linux` 标签的节点。
{{< /note >}}

<!--
#### Node affinity per scheduling profile
-->
#### 逐个调度方案中设置节点亲和性    {#node-affinity-per-scheduling-profile}

{{< feature-state for_k8s_version="v1.20" state="beta" >}}

<!--
When configuring multiple [scheduling profiles](/docs/reference/scheduling/config/#multiple-profiles), you can associate
a profile with a node affinity, which is useful if a profile only applies to a specific set of nodes.
To do so, add an `addedAffinity` to the `args` field of the [`NodeAffinity` plugin](/docs/reference/scheduling/config/#scheduling-plugins)
in the [scheduler configuration](/docs/reference/scheduling/config/). For example:
-->
在配置多个[调度方案](/zh-cn/docs/reference/scheduling/config/#multiple-profiles)时，
你可以将某个方案与节点亲和性关联起来，如果某个调度方案仅适用于某组特殊的节点时，
这样做是很有用的。
要实现这点，可以在[调度器配置](/zh-cn/docs/reference/scheduling/config/)中为
[`NodeAffinity` 插件](/zh-cn/docs/reference/scheduling/config/#scheduling-plugins)的
`args` 字段添加 `addedAffinity`。例如：

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
这里的 `addedAffinity` 除遵从 Pod 规约中设置的节点亲和性之外，
还适用于将 `.spec.schedulerName` 设置为 `foo-scheduler`。
换言之，为了匹配 Pod，节点需要满足 `addedAffinity` 和 Pod 的 `.spec.NodeAffinity`。

<!--
Since the `addedAffinity` is not visible to end users, its behavior might be
unexpected to them. Use node labels that have a clear correlation to the
scheduler profile name.
-->
由于 `addedAffinity` 对最终用户不可见，其行为可能对用户而言是出乎意料的。
应该使用与调度方案名称有明确关联的节点标签。

{{< note >}}
<!--
The DaemonSet controller, which [creates Pods for DaemonSets](/docs/concepts/workloads/controllers/daemonset/#how-daemon-pods-are-scheduled),
does not support scheduling profiles. When the DaemonSet controller creates
Pods, the default Kubernetes scheduler places those Pods and honors any
`nodeAffinity` rules in the DaemonSet controller.
-->
DaemonSet 控制器[为 DaemonSet 创建 Pod](/zh-cn/docs/concepts/workloads/controllers/daemonset/#how-daemon-pods-are-scheduled)，
但该控制器不理会调度方案。
DaemonSet 控制器创建 Pod 时，默认的 Kubernetes 调度器负责放置 Pod，
并遵从 DaemonSet 控制器中设置的 `nodeAffinity` 规则。
{{< /note >}}

<!--
### Inter-pod affinity and anti-affinity

Inter-pod affinity and anti-affinity allow you to constrain which nodes your
Pods can be scheduled on based on the labels of **Pods** already running on that
node, instead of the node labels.
-->
### Pod 间亲和性与反亲和性  {#inter-pod-affinity-and-anti-affinity}

Pod 间亲和性与反亲和性使你可以基于已经在节点上运行的 **Pod** 的标签来约束
Pod 可以调度到的节点，而不是基于节点上的标签。

<!--
Inter-pod affinity and anti-affinity rules take the form "this
Pod should (or, in the case of anti-affinity, should not) run in an X if that X
is already running one or more Pods that meet rule Y", where X is a topology
domain like node, rack, cloud provider zone or region, or similar and Y is the
rule Kubernetes tries to satisfy.
-->
Pod 间亲和性与反亲和性的规则格式为“如果 X 上已经运行了一个或多个满足规则 Y 的 Pod，
则这个 Pod 应该（或者在反亲和性的情况下不应该）运行在 X 上”。
这里的 X 可以是节点、机架、云提供商可用区或地理区域或类似的拓扑域，
Y 则是 Kubernetes 尝试满足的规则。

<!--
You express these rules (Y) as [label selectors](/docs/concepts/overview/working-with-objects/labels/#label-selectors)
with an optional associated list of namespaces. Pods are namespaced objects in
Kubernetes, so Pod labels also implicitly have namespaces. Any label selectors
for Pod labels should specify the namespaces in which Kubernetes should look for those
labels.
-->
你通过[标签选择算符](/zh-cn/docs/concepts/overview/working-with-objects/labels/#label-selectors)
的形式来表达规则（Y），并可根据需要指定选关联的名字空间列表。
Pod 在 Kubernetes 中是名字空间作用域的对象，因此 Pod 的标签也隐式地具有名字空间属性。
针对 Pod 标签的所有标签选择算符都要指定名字空间，Kubernetes
会在指定的名字空间内寻找标签。

<!--
You express the topology domain (X) using a `topologyKey`, which is the key for
the node label that the system uses to denote the domain. For examples, see
[Well-Known Labels, Annotations and Taints](/docs/reference/labels-annotations-taints/).
-->
你会通过 `topologyKey` 来表达拓扑域（X）的概念，其取值是系统用来标示域的节点标签键。
相关示例可参见[常用标签、注解和污点](/zh-cn/docs/reference/labels-annotations-taints/)。

{{< note >}}
<!--
Inter-pod affinity and anti-affinity require substantial amount of
processing which can slow down scheduling in large clusters significantly. We do
not recommend using them in clusters larger than several hundred nodes.
-->
Pod 间亲和性和反亲和性都需要相当的计算量，因此会在大规模集群中显著降低调度速度。
我们不建议在包含数百个节点的集群中使用这类设置。
{{< /note >}}

{{< note >}}
<!--
Pod anti-affinity requires nodes to be consistently labelled, in other words,
every node in the cluster must have an appropriate label matching `topologyKey`.
If some or all nodes are missing the specified `topologyKey` label, it can lead
to unintended behavior.
-->
Pod 反亲和性需要节点上存在一致性的标签。换言之，
集群中每个节点都必须拥有与 `topologyKey` 匹配的标签。
如果某些或者所有节点上不存在所指定的 `topologyKey` 标签，调度行为可能与预期的不同。
{{< /note >}}

<!--
#### Types of inter-pod affinity and anti-affinity

Similar to [node affinity](#node-affinity) are two types of Pod affinity and
anti-affinity as follows:
-->
#### Pod 间亲和性与反亲和性的类型

与[节点亲和性](#node-affinity)类似，Pod 的亲和性与反亲和性也有两种类型：

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
例如，你可以使用 `requiredDuringSchedulingIgnoredDuringExecution` 亲和性来告诉调度器，
将两个服务的 Pod 放到同一个云提供商可用区内，因为它们彼此之间通信非常频繁。
类似地，你可以使用 `preferredDuringSchedulingIgnoredDuringExecution`
反亲和性来将同一服务的多个 Pod 分布到多个云提供商可用区中。

<!--
To use inter-pod affinity, use the `affinity.podAffinity` field in the Pod spec.
For inter-pod anti-affinity, use the `affinity.podAntiAffinity` field in the Pod
spec.
-->
要使用 Pod 间亲和性，可以使用 Pod 规约中的 `.affinity.podAffinity` 字段。
对于 Pod 间反亲和性，可以使用 Pod 规约中的 `.affinity.podAntiAffinity` 字段。

<!--
#### Pod affinity example {#an-example-of-a-pod-that-uses-pod-affinity}

Consider the following Pod spec:
-->
#### Pod 亲和性示例   {#an-example-of-a-pod-that-uses-pod-affinity}

考虑下面的 Pod 规约：

{{< codenew file="pods/pod-with-pod-affinity.yaml" >}}

<!--
This example defines one Pod affinity rule and one Pod anti-affinity rule. The
Pod affinity rule uses the "hard"
`requiredDuringSchedulingIgnoredDuringExecution`, while the anti-affinity rule
uses the "soft" `preferredDuringSchedulingIgnoredDuringExecution`.
-->
本示例定义了一条 Pod 亲和性规则和一条 Pod 反亲和性规则。Pod 亲和性规则配置为
`requiredDuringSchedulingIgnoredDuringExecution`，而 Pod 反亲和性配置为
`preferredDuringSchedulingIgnoredDuringExecution`。

<!--
The affinity rule says that the scheduler can only schedule a Pod onto a node if
the node is in the same zone as one or more existing Pods with the label
`security=S1`. More precisely, the scheduler must place the Pod on a node that has the
`topology.kubernetes.io/zone=V` label, as long as there is at least one node in
that zone that currently has one or more Pods with the Pod label `security=S1`.
-->
亲和性规则表示，仅当节点和至少一个已运行且有 `security=S1` 的标签的
Pod 处于同一区域时，才可以将该 Pod 调度到节点上。
更确切的说，调度器必须将 Pod 调度到具有 `topology.kubernetes.io/zone=V`
标签的节点上，并且集群中至少有一个位于该可用区的节点上运行着带有
`security=S1` 标签的 Pod。

<!--
The anti-affinity rule says that the scheduler should try to avoid scheduling
the Pod onto a node that is in the same zone as one or more Pods with the label
`security=S2`. More precisely, the scheduler should try to avoid placing the Pod on a node that has the
`topology.kubernetes.io/zone=R` label if there are other nodes in the
same zone currently running Pods with the `Security=S2` Pod label.
-->
反亲和性规则表示，如果节点处于 Pod 所在的同一可用区且至少一个 Pod 具有
`security=S2` 标签，则该 Pod 不应被调度到该节点上。
更确切地说， 如果同一可用区中存在其他运行着带有 `security=S2` 标签的 Pod 节点，
并且节点具有标签 `topology.kubernetes.io/zone=R`，Pod 不能被调度到该节点上。

<!--
To get yourself more familiar with the examples of Pod affinity and anti-affinity,
refer to the [design proposal](https://git.k8s.io/design-proposals-archive/scheduling/podaffinity.md).
-->
查阅[设计文档](https://git.k8s.io/design-proposals-archive/scheduling/podaffinity.md)
以进一步熟悉 Pod 亲和性与反亲和性的示例。

<!--
You can use the `In`, `NotIn`, `Exists` and `DoesNotExist` values in the
`operator` field for Pod affinity and anti-affinity.

In principle, the `topologyKey` can be any allowed label key with the following
exceptions for performance and security reasons:
-->
你可以针对 Pod 间亲和性与反亲和性为其 `operator` 字段使用 `In`、`NotIn`、`Exists`、
`DoesNotExist` 等值。

原则上，`topologyKey` 可以是任何合法的标签键。出于性能和安全原因，`topologyKey`
有一些限制：

<!--
- For Pod affinity and anti-affinity, an empty `topologyKey` field is not allowed in both `requiredDuringSchedulingIgnoredDuringExecution`
  and `preferredDuringSchedulingIgnoredDuringExecution`.
- For `requiredDuringSchedulingIgnoredDuringExecution` Pod anti-affinity rules,
  the admission controller `LimitPodHardAntiAffinityTopology` limits
  `topologyKey` to `kubernetes.io/hostname`. You can modify or disable the
  admission controller if you want to allow custom topologies.
-->
- 对于 Pod 亲和性而言，在 `requiredDuringSchedulingIgnoredDuringExecution`
  和 `preferredDuringSchedulingIgnoredDuringExecution` 中，`topologyKey`
  不允许为空。
- 对于 `requiredDuringSchedulingIgnoredDuringExecution` 要求的 Pod 反亲和性，
  准入控制器 `LimitPodHardAntiAffinityTopology` 要求 `topologyKey` 只能是
  `kubernetes.io/hostname`。如果你希望使用其他定制拓扑逻辑，
  你可以更改准入控制器或者禁用之。

<!--
In addition to `labelSelector` and `topologyKey`, you can optionally specify a list
of namespaces which the `labelSelector` should match against using the
`namespaces` field at the same level as `labelSelector` and `topologyKey`.
If omitted or empty, `namespaces` defaults to the namespace of the Pod where the
affinity/anti-affinity definition appears.
-->
除了 `labelSelector` 和 `topologyKey`，你也可以指定 `labelSelector`
要匹配的命名空间列表，方法是在 `labelSelector` 和 `topologyKey`
所在层同一层次上设置 `namespaces`。
如果 `namespaces` 被忽略或者为空，则默认为 Pod 亲和性/反亲和性的定义所在的命名空间。

<!--
#### Namespace selector
-->
#### 名字空间选择算符  {#namespace-selector}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

<!--
You can also select matching namespaces using `namespaceSelector`, which is a label query over the set of namespaces.
The affinity term is applied to namespaces selected by both `namespaceSelector` and the `namespaces` field.
Note that an empty `namespaceSelector` ({}) matches all namespaces, while a null or empty `namespaces` list and
null `namespaceSelector` matches the namespace of the Pod where the rule is defined.
-->
用户也可以使用 `namespaceSelector` 选择匹配的名字空间，`namespaceSelector`
是对名字空间集合进行标签查询的机制。
亲和性条件会应用到 `namespaceSelector` 所选择的名字空间和 `namespaces` 字段中所列举的名字空间之上。
注意，空的 `namespaceSelector`（`{}`）会匹配所有名字空间，而 null 或者空的
`namespaces` 列表以及 null 值 `namespaceSelector` 意味着“当前 Pod 的名字空间”。

<!--
#### More practical use-cases

Inter-pod affinity and anti-affinity can be even more useful when they are used with higher
level collections such as ReplicaSets, StatefulSets, Deployments, etc. These
rules allow you to configure that a set of workloads should
be co-located in the same defined topology; for example, preferring to place two related
Pods onto the same node.
-->
#### 更实际的用例

Pod 间亲和性与反亲和性在与更高级别的集合（例如 ReplicaSet、StatefulSet、
Deployment 等）一起使用时，它们可能更加有用。
这些规则使得你可以配置一组工作负载，使其位于所定义的同一拓扑中；
例如优先将两个相关的 Pod 置于相同的节点上。

<!--
For example: imagine a three-node cluster. You use the cluster to run a web application
and also an in-memory cache (such as Redis). For this example, also assume that latency between
the web application and the memory cache should be as low as is practical. You could use inter-pod
affinity and anti-affinity to co-locate the web servers with the cache as much as possible.
-->
以一个三节点的集群为例。你使用该集群运行一个带有内存缓存（例如 Redis）的 Web 应用程序。
在此例中，还假设 Web 应用程序和内存缓存之间的延迟应尽可能低。
你可以使用 Pod 间的亲和性和反亲和性来尽可能地将该 Web 服务器与缓存并置。

<!--
In the following example Deployment for the Redis cache, the replicas get the label `app=store`. The
`podAntiAffinity` rule tells the scheduler to avoid placing multiple replicas
with the `app=store` label on a single node. This creates each cache in a
separate node.
-->
在下面的 Redis 缓存 Deployment 示例中，副本上设置了标签 `app=store`。
`podAntiAffinity` 规则告诉调度器避免将多个带有 `app=store` 标签的副本部署到同一节点上。
因此，每个独立节点上会创建一个缓存实例。

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
下例的 Deployment 为 Web 服务器创建带有标签 `app=web-store` 的副本。
Pod 亲和性规则告诉调度器将每个副本放到存在标签为 `app=store` 的 Pod 的节点上。
Pod 反亲和性规则告诉调度器决不要在单个节点上放置多个 `app=web-store` 服务器。

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
创建前面两个 Deployment 会产生如下的集群布局，每个 Web 服务器与一个缓存实例并置，
并分别运行在三个独立的节点上。

|    node-1     |    node-2     |    node-3     |
|:-------------:|:-------------:|:-------------:|
| *webserver-1* | *webserver-2* | *webserver-3* |
|   *cache-1*   |   *cache-2*   |   *cache-3*   |

<!--
The overall effect is that each cache instance is likely to be accessed by a single client, that
is running on the same node. This approach aims to minimize both skew (imbalanced load) and latency.
-->
总体效果是每个缓存实例都非常可能被在同一个节点上运行的某个客户端访问。
这种方法旨在最大限度地减少偏差（负载不平衡）和延迟。

<!--
You might have other reasons to use Pod anti-affinity.
See the [ZooKeeper tutorial](/docs/tutorials/stateful-application/zookeeper/#tolerating-node-failure)
for an example of a StatefulSet configured with anti-affinity for high
availability, using the same technique as this example.
-->
你可能还有使用 Pod 反亲和性的一些其他原因。
参阅 [ZooKeeper 教程](/zh-cn/docs/tutorials/stateful-application/zookeeper/#tolerating-node-failure)
了解一个 StatefulSet 的示例，该 StatefulSet 配置了反亲和性以实现高可用，
所使用的是与此例相同的技术。

<!--
## nodeName

`nodeName` is a more direct form of node selection than affinity or
`nodeSelector`. `nodeName` is a field in the Pod spec. If the `nodeName` field
is not empty, the scheduler ignores the Pod and the kubelet on the named node
tries to place the Pod on that node. Using `nodeName` overrules using
`nodeSelector` or affinity and anti-affinity rules.
-->
## nodeName

`nodeName` 是比亲和性或者 `nodeSelector` 更为直接的形式。`nodeName` 是 Pod
规约中的一个字段。如果 `nodeName` 字段不为空，调度器会忽略该 Pod，
而指定节点上的 kubelet 会尝试将 Pod 放到该节点上。
使用 `nodeName` 规则的优先级会高于使用 `nodeSelector` 或亲和性与非亲和性的规则。

<!--
Some of the limitations of using `nodeName` to select nodes are:

- If the named node does not exist, the Pod will not run, and in
  some cases may be automatically deleted.
- If the named node does not have the resources to accommodate the
  Pod, the Pod will fail and its reason will indicate why,
  for example OutOfmemory or OutOfcpu.
- Node names in cloud environments are not always predictable or stable.
-->
使用 `nodeName` 来选择节点的方式有一些局限性：

- 如果所指代的节点不存在，则 Pod 无法运行，而且在某些情况下可能会被自动删除。
- 如果所指代的节点无法提供用来运行 Pod 所需的资源，Pod 会失败，
  而其失败原因中会给出是否因为内存或 CPU 不足而造成无法运行。
- 在云环境中的节点名称并不总是可预测的，也不总是稳定的。

{{< note >}}
<!--
`nodeName` is intended for use by custom schedulers or advanced use cases where
you need to bypass any configured schedulers. Bypassing the schedulers might lead to
failed Pods if the assigned Nodes get oversubscribed. You can use [node affinity](#node-affinity) or a the [`nodeselector` field](#nodeselector) to assign a Pod to a specific Node without bypassing the schedulers.
-->
`nodeName` 旨在供自定义调度程序或需要绕过任何已配置调度程序的高级场景使用。
如果已分配的 Node 负载过重，绕过调度程序可能会导致 Pod 失败。
你可以使用[节点亲和性](#node-affinity)或 [`nodeselector` 字段](#nodeselector)将
Pod 分配给特定 Node，而无需绕过调度程序。
{{</ note >}}

<!--
Here is an example of a Pod spec using the `nodeName` field:
-->
下面是一个使用 `nodeName` 字段的 Pod 规约示例：

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
上面的 Pod 只能运行在节点 `kube-01` 之上。

<!--
## Pod topology spread constraints

You can use _topology spread constraints_ to control how {{< glossary_tooltip text="Pods" term_id="Pod" >}}
are spread across your cluster among failure-domains such as regions, zones, nodes, or among any other
topology domains that you define. You might do this to improve performance, expected availability, or
overall utilization.

Read [Pod topology spread constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
to learn more about how these work.
-->
## Pod 拓扑分布约束 {#pod-topology-spread-constraints}

你可以使用 **拓扑分布约束（Topology Spread Constraints）** 来控制
{{< glossary_tooltip text="Pod" term_id="Pod" >}} 在集群内故障域之间的分布，
故障域的示例有区域（Region）、可用区（Zone）、节点和其他用户自定义的拓扑域。
这样做有助于提升性能、实现高可用或提升资源利用率。

阅读 [Pod 拓扑分布约束](/zh-cn/docs/concepts/scheduling-eviction/topology-spread-constraints/)
以进一步了解这些约束的工作方式。

## {{% heading "whatsnext" %}}

<!--
- Read more about [taints and tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/) .
- Read the design docs for [node affinity](https://git.k8s.io/design-proposals-archive/scheduling/nodeaffinity.md)
  and for [inter-pod affinity/anti-affinity](https://git.k8s.io/design-proposals-archive/scheduling/podaffinity.md).
- Learn about how the [topology manager](/docs/tasks/administer-cluster/topology-manager/) takes part in node-level
  resource allocation decisions.
- Learn how to use [nodeSelector](/docs/tasks/configure-pod-container/assign-pods-nodes/).
- Learn how to use [affinity and anti-affinity](/docs/tasks/configure-pod-container/assign-pods-nodes-using-node-affinity/).
-->
- 进一步阅读[污点与容忍度](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)文档。
- 阅读[节点亲和性](https://git.k8s.io/design-proposals-archive/scheduling/nodeaffinity.md)
  和[Pod 间亲和性与反亲和性](https://git.k8s.io/design-proposals-archive/scheduling/podaffinity.md)
  的设计文档。
- 了解[拓扑管理器](/zh-cn/docs/tasks/administer-cluster/topology-manager/)如何参与节点层面资源分配决定。
- 了解如何使用 [nodeSelector](/zh-cn/docs/tasks/configure-pod-container/assign-pods-nodes/)。
* 了解如何使用[亲和性和反亲和性](/zh-cn/docs/tasks/configure-pod-container/assign-pods-nodes-using-node-affinity/)。
