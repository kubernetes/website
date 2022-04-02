---
title: 将 Pod 分配给节点
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
(for example, spreading your Pods across nodes so as not place Pods on a node with insufficient free resources).
However, there are some circumstances where you may want to control which node
the Pod deploys to, for example, to ensure that a Pod ends up on a node with an SSD attached to it, or to co-locate Pods from two different
services that communicate a lot into the same availability zone.
-->
你可以约束一个 {{< glossary_tooltip text="Pod" term_id="pod" >}} 只能在特定的
{{< glossary_tooltip text="节点" term_id="node" >}} 上运行。
有几种方法可以实现这点，推荐的方法都是用
[标签选择算符](/zh/docs/concepts/overview/working-with-objects/labels/)来进行选择。
通常这样的约束不是必须的，因为调度器将自动进行合理的放置（比如，将 Pod 分散到节点上，
而不是将 Pod 放置在可用资源不足的节点上等等）。但在某些情况下，你可能需要进一步控制
Pod 停靠的节点，例如，确保 Pod 最终落在连接了 SSD 的机器上，或者将来自两个不同的服务
且有大量通信的 Pods 被放置在同一个可用区。

<!-- body -->

<!--
You can use any of the following methods to choose where Kubernetes schedules
specific Pods:

  * [nodeSelector](#nodeselector) field matching against [node labels](#built-in-node-labels)
  * [Affinity and anti-affinity](#affinity-and-anti-affinity)
  * [nodeName](#nodename) field
-->

你可以使用以下任何一种方法来把 Pod 调度到 Kubernetes 的特定节点。

  * [nodeSelector](#nodeselector) 字段与 [node labels](#built-in-node-labels) 匹配
  * [亲和性与反亲和性](#affinity-and-anti-affinity)
  * [nodeName](#nodename) 字段

<!--
## Node labels {#built-in-node-labels}

Like many other Kubernetes objects, nodes have
[labels](/docs/concepts/overview/working-with-objects/labels/). You can [attach labels manually](/docs/tasks/configure-pod-container/assign-pods-nodes/#add-a-label-to-a-node).
Kubernetes also populates a standard set of labels on all nodes in a cluster. See [Well-Known Labels, Annotations and Taints](/docs/reference/labels-annotations-taints/)
for a list of common node labels.

{{<note>}}
The value of these labels is cloud provider specific and is not guaranteed to be reliable.
For example, the value of `kubernetes.io/hostname` may be the same as the node name in some environments
and a different value in other environments.
{{</note>}}
-->

## 节点标签 {#built-in-node-labels}

类似于 Kubernetes 的其它对象，节点拥有
[标签](/docs/concepts/overview/working-with-objects/labels/)。你可以 [手动附加标签](/docs/tasks/configure-pod-container/assign-pods-nodes/#add-a-label-to-a-node)。
Kubernetes 还在集群中的所有节点上填充了一套标准的标签。常见节点标签列表见
[常见的标签、注释和污点](/docs/reference/labels-annotations-taints/)

{{<note>}}
这些标签的价值是由云提供商特定的，不保证可靠。
例如，`kubernetes.io/hostname` 的值在某些环境中可能与节点名称相同，而在其他环境中则是不同的值。
{{</note>}}

<!--
### Node isolation/restriction

Adding labels to nodes allows you to target Pods for scheduling on specific
nodes or groups of nodes. You can use this functionality to ensure that specific
Pods only run on nodes with certain isolation, security, or regulatory
properties.

If you use labels for node isolation, choose label keys that the {{<glossary_tooltip text="kubelet" term_id="kubelet">}}
cannot modify. This prevents a compromised node from setting those labels on
itself so that the scheduler schedules workloads onto the compromised node.

The [`NodeRestriction` admission plugin](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)
prevents the kubelet from setting or modifying labels with a
`node-restriction.kubernetes.io/` prefix.

To make use of that label prefix for node isolation:

1. Ensure you are using the [Node authorizer](/docs/reference/access-authn-authz/node/) and have _enabled_ the `NodeRestriction` admission plugin.
2. Add labels with the `node-restriction.kubernetes.io/` prefix to your nodes, and use those labels in your [node selectors](#nodeselector).
   For example, `example.com.node-restriction.kubernetes.io/fips=true` or `example.com.node-restriction.kubernetes.io/pci-dss=true`.

-->

### 节点隔离/限制

向节点添加标签允许你在特定的节点或节点组上针对 Pods 进行调度。
你可以使用这个功能来确保特定的 Pods 只在具有某些隔离、安全或监管属性的节点上运行。

如果你使用标签进行节点隔离，选择 {{<glossary_tooltip text="kubelet" term_id="kubelet">}} 不能修改的标签键。
这可以防止被破坏的节点在自己身上设置这些标签，从而使调度器将工作负载调度到被破坏的节点上。

[`NodeRestriction`](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)
插件防止 kubelet 设置或修改带有 `node-restriction.kubernetes.io/`前缀的标签。

使用该标签前缀进行节点隔离：

1. 确保你正在使用 [节点授权器](/docs/reference/access-authn-authz/node/)，并且已经 _启用_ 了 `NodeRestriction` 插件。
2. 为你的节点添加带有 `node-restriction.kubernetes.io/` 前缀的标签，并在 [节点选择器](#nodeselector) 中使用这些标签。
   比如:

   `example.com.node-restriction.kubernetes.io/fips=true` 或 `example.com.node-restriction.kubernetes.io/pci-dss=true`。

## nodeSelector

<!--
`nodeSelector` is the simplest recommended form of node selection constraint.
You can add the `nodeSelector` field to your Pod specification and specify the
[node labels](#built-in-node-labels) you want the target node to have.
Kubernetes only schedules the Pod onto nodes that have each of the labels you
specify.
-->

`nodeSelector` 是节点选择约束的最简单推荐形式。
你可以在你的Pod规范中添加`nodeSelector`字段，并指定你希望目标节点拥有的 [节点标签](#built-in-node-labels)。
Kubernetes 只将 Pod 调度到拥有你指定的每个标签的节点上。

<!--
## Affinity and anti-affinity

`nodeSelector` is the simplest way to constrain Pods to nodes with specific
labels. Affinity and anti-affinity expands the types of constraints you can
define. Some of the benefits of affinity and anti-affinity include：

* The affinity/anti-affinity language is more expressive. `nodeSelector` only
  selects nodes with all the specified labels. Affinity/anti-affinity gives you
  more control over the selection logic.
* You can indicate that a rule is *soft* or *preferred*, so that the scheduler
  still schedules the Pod even if it can't find a matching node.
* You can constrain a Pod using labels on other Pods running on the node (or other topological domain),
  instead of just node labels, which allows you to define rules for which Pods
  can be co-located on a node.
-->
## 亲和性与反亲和性

`nodeSelector` 提供了一种非常简单的方法来将 Pod 约束到具有特定标签的节点上。
亲和性/反亲和性扩展了你可以定义的约束类型。亲和性/反亲和性的一些好处包括：

* 亲和性/反亲和性的语言表达能力更强。`nodeSelector` 只选择具有所有指定标签的节点。
  亲和性/反亲和性让你对选择逻辑有更多控制。
* 你可以指定一个规则是 *soft* 或 *preferred*，以便调度器在找不到匹配的节点时也会调度这个 Pod。
* 你可以使用在节点（或其他拓扑域）上运行的其他 Pod 的标签来约束一个 Pod。而不仅仅是节点标签，
  这允许你定义那些允许多个 Pod 在一个节点上共处的规则。

<!--
### Node affinity

Node affinity is conceptually similar to `nodeSelector`， allowing you to constrain which nodes your
Pod can be scheduled on based on node labels. There are two types of node
affinity:
-->
### 节点亲和性   {#node-affinity}

节点亲和性概念上类似于 `nodeSelector`，它允许你限制你的 Pod 根据节点标签来安排。
有两种类型的节点亲和性。
<!--
  * `requiredDuringSchedulingIgnoredDuringExecution`: The scheduler can't
    schedule the Pod unless the rule is met. This functions like `nodeSelector`,
    but with a more expressive syntax.
  * `preferredDuringSchedulingIgnoredDuringExecution`: The scheduler tries to
    find a node that meets the rule. If a matching node is not available, the
    scheduler still schedules the Pod.
-->

  * `requiredDuringSchedulingIgnoredDuringExecution`: 除非满足规则，否则调度器不能调度 Pod。
    这个方法类似 `nodeSelector`，但是该方法拥有更多的表达语法。
  * `preferredDuringSchedulingIgnoredDuringExecution`: 调度器试图找到一个符合该规则的节点。
    如果没有匹配的节点，调度器仍然会对Pod进行调度。

<!--
{{<note>}}
In the preceding types, `IgnoredDuringExecution` means that if the node labels
change after Kubernetes schedules the Pod, the Pod continues to run.
{{</note>}}
-->
{{<note>}}
在前面的类型中，`IgnoredDuringExecution` 意味着如果节点标签发生变化，该 Pod 将继续运行。
{{</note>}}

<!--
You can specify node affinities using the `.spec.affinity.nodeAffinity` field in
your Pod spec.

For example, consider the following Pod spec:

{{<codenew file="pods/pod-with-node-affinity.yaml">}}

In this example, the following rules apply:

  * The node *must* have a label with the key `kubernetes.io/e2e-az-name` and
    the value is either `e2e-az1` or `e2e-az2`.
  * The node *preferably* has a label with the key `another-node-label-key` and
    the value `another-node-label-value`.
-->

你可以使用 Pod 规约中的`.spec.affinity.nodeAffinity` 字段指定节点亲和力。

例如，考虑以下 Pod 规约：

{{<codenew file="pods/pod-with-node-affinity.yaml">}}

在这个例子中，适用以下规则：

  * 该节点 *必须* 有一个键为 `kubernetes.io/e2e-az-name`，值为
    `e2e-az1` 或 `e2e-az2` 的标签。
  * 该节点 *最好* 有一个标签，其键为 `another-note-label-key`，值为 `another-note-label-value`。

<!--
Node affinity is specified as field `nodeAffinity` of field `affinity` in the PodSpec.
-->
节点亲和性通过 PodSpec 的 `affinity` 字段下的 `nodeAffinity` 字段进行指定。

<!--
Here's an example of a pod that uses node affinity:
-->
下面是一个使用节点亲和性的 Pod 的实例：

{{< codenew file="pods/pod-with-node-affinity.yaml" >}}

<!--
This node affinity rule says the pod can only be placed on a node with a label whose key is
`kubernetes.io/e2e-az-name` and whose value is either `e2e-az1` or `e2e-az2`. In addition,
among nodes that meet that criteria, nodes with a label whose key is `another-node-label-key` and whose
value is `another-node-label-value` should be preferred.
-->
此节点亲和性规则表示，Pod 只能放置在具有标签键 `kubernetes.io/e2e-az-name`
且标签值为 `e2e-az1` 或 `e2e-az2` 的节点上。
另外，在满足这些标准的节点中，具有标签键为 `another-node-label-key`
且标签值为 `another-node-label-value` 的节点应该优先使用。

<!--
You can see the operator `In` being used in the example. The new node affinity syntax supports the following operators: `In`, `NotIn`, `Exists`, `DoesNotExist`, `Gt`, `Lt`.
You can use `NotIn` and `DoesNotExist` to achieve node anti-affinity behavior, or use
[node taints](/docs/concepts/scheduling-eviction/taint-and-toleration/) to repel pods from specific nodes.
-->
你可以在上面的例子中看到 `In` 操作符的使用。新的节点亲和性语法支持下面的操作符：
`In`，`NotIn`，`Exists`，`DoesNotExist`，`Gt`，`Lt`。
你可以使用 `NotIn` 和 `DoesNotExist` 来实现节点反亲和性行为，或者使用
[节点污点](/zh/docs/concepts/scheduling-eviction/taint-and-toleration/)
将 Pod 从特定节点中驱逐。

<!--
If you specify both `nodeSelector` and `nodeAffinity`, *both* must be satisfied for the pod
to be scheduled onto a candidate node.

If you specify multiple `nodeSelectorTerms` associated with `nodeAffinity` types, then the pod can be scheduled onto a node **if one of** the `nodeSelectorTerms` is satisfied.
-->
如果你同时指定了 `nodeSelector` 和 `nodeAffinity`，*两者*必须都要满足，
才能将 Pod 调度到候选节点上。

如果你指定了多个与 `nodeAffinity` 类型关联的 `nodeSelectorTerms`，则
**如果其中一个** `nodeSelectorTerms` 满足的话，pod将可以调度到节点上。

<!--
If you specify multiple `matchExpressions` associated with `nodeSelectorTerms`, then the pod can be scheduled onto a node **only if all** `matchExpressions` can be satisfied.

If you remove or change the label of the node where the pod is scheduled, the pod won't be removed. In other words, the affinity selection works only at the time of scheduling the pod.
-->

如果你指定了多个与 `nodeSelectorTerms` 关联的 `matchExpressions`，则
**只有当所有** `matchExpressions` 满足的话，Pod 才会可以调度到节点上。

如果你修改或删除了 pod 所调度到的节点的标签，Pod 不会被删除。
换句话说，亲和性选择只在 Pod 调度期间有效。

<!--
The `weight` field in `preferredDuringSchedulingIgnoredDuringExecution` is in the range 1-100. For each node that meets all of the scheduling requirements (resource request, RequiredDuringScheduling affinity expressions, etc.), the scheduler will compute a sum by iterating through the elements of this field and adding "weight" to the sum if the node matches the corresponding MatchExpressions. This score is then combined with the scores of other priority functions for the node. The node(s) with the highest total score are the most preferred.
-->
`preferredDuringSchedulingIgnoredDuringExecution` 中的 `weight` 字段值的
范围是 1-100。
对于每个符合所有调度要求（资源请求、RequiredDuringScheduling 亲和性表达式等）
的节点，调度器将遍历该字段的元素来计算总和，并且如果节点匹配对应的
MatchExpressions，则添加“权重”到总和。
然后将这个评分与该节点的其他优先级函数的评分进行组合。
总分最高的节点是最优选的。

<!--
#### Node affinity per scheduling profile
-->
#### 逐个调度方案中设置节点亲和性    {#node-affinity-per-scheduling-profile}

{{< feature-state for_k8s_version="v1.20" state="beta" >}}

<!--
When configuring multiple [scheduling profiles](/docs/reference/scheduling/config/#multiple-profiles), you can associate
a profile with a Node affinity, which is useful if a profile only applies to a specific set of Nodes.
To do so, add an `addedAffinity` to the args of the [`NodeAffinity` plugin](/docs/reference/scheduling/config/#scheduling-plugins)
in the [scheduler configuration](/docs/reference/scheduling/config/). For example:
-->
在配置多个[调度方案](/zh/docs/reference/scheduling/config/#multiple-profiles)时，
你可以将某个方案与节点亲和性关联起来，如果某个调度方案仅适用于某组
特殊的节点时，这样做是很有用的。
要实现这点，可以在[调度器配置](/zh/docs/reference/scheduling/config/)中为
[`NodeAffinity` 插件](/zh/docs/reference/scheduling/config/#scheduling-plugins)
添加 `addedAffinity` 参数。
例如：

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
That is, in order to match the Pod, Nodes need to satisfy `addedAffinity` and the Pod's `.spec.NodeAffinity`.

Since the `addedAffinity` is not visible to end users, its behavior might be unexpected to them. We
recommend to use node labels that have clear correlation with the profile's scheduler name.
-->
这里的 `addedAffinity` 除遵从 Pod 规约中设置的节点亲和性之外，还
适用于将 `.spec.schedulerName` 设置为 `foo-scheduler`。

<!--
The DaemonSet controller, which [creates Pods for DaemonSets](/docs/concepts/workloads/controllers/daemonset/#scheduled-by-default-scheduler)
is not aware of scheduling profiles. For this reason, it is recommended that you keep a scheduler profile, such as the
`default-scheduler`, without any `addedAffinity`. Then, the Daemonset's Pod template should use this scheduler name.
Otherwise, some Pods created by the Daemonset controller might remain unschedulable.
-->
{{< note >}}
DaemonSet 控制器[为 DaemonSet 创建 Pods](/zh/docs/concepts/workloads/controllers/daemonset/#scheduled-by-default-scheduler)，
但该控制器不理会调度方案。因此，建议你保留一个调度方案，例如
`default-scheduler`，不要在其中设置 `addedAffinity`。
这样，DaemonSet 的 Pod 模板将会使用此调度器名称。
否则，DaemonSet 控制器所创建的某些 Pods 可能持续处于不可调度状态。
{{< /note >}}

<!--
### Inter-pod affinity and anti-affinity

Inter-pod affinity and anti-affinity allow you to constrain which nodes your pod is eligible to be scheduled *based on
labels on pods that are already running on the node* rather than based on labels on nodes. The rules are of the form
"this pod should (or, in the case of anti-affinity, should not) run in an X if that X is already running one or more pods that meet rule Y".
Y is expressed as a LabelSelector with an optional associated list of namespaces; unlike nodes, because pods are namespaced
(and therefore the labels on pods are implicitly namespaced),
a label selector over pod labels must specify which namespaces the selector should apply to. Conceptually X is a topology domain
like node, rack, cloud provider zone, cloud provider region, etc. You express it using a `topologyKey` which is the
key for the node label that the system uses to denote such a topology domain, e.g. see the label keys listed above
in the section [Interlude: built-in node labels](#built-in-node-labels).
-->
### pod 间亲和性与反亲和性  {#inter-pod-affinity-and-anti-affinity}

Pod 间亲和性与反亲和性使你可以 *基于已经在节点上运行的 Pod 的标签* 来约束
Pod 可以调度到的节点，而不是基于节点上的标签。
规则的格式为“如果 X 节点上已经运行了一个或多个 满足规则 Y 的 Pod，
则这个 Pod 应该（或者在反亲和性的情况下不应该）运行在 X 节点”。
Y 表示一个具有可选的关联命令空间列表的 LabelSelector；
与节点不同，因为 Pod 是命名空间限定的（因此 Pod 上的标签也是命名空间限定的），
因此作用于 Pod 标签的标签选择算符必须指定选择算符应用在哪个命名空间。
从概念上讲，X 是一个拓扑域，如节点、机架、云供应商可用区、云供应商地理区域等。
你可以使用 `topologyKey` 来表示它，`topologyKey` 是节点标签的键以便系统
用来表示这样的拓扑域。
请参阅上面[插曲：内置的节点标签](#built-in-node-labels)部分中列出的标签键。

{{< note >}}
<!--
Inter-pod affinity and anti-affinity require substantial amount of
processing which can slow down scheduling in large clusters significantly. We do
not recommend using them in clusters larger than several hundred nodes.
-->
Pod 间亲和性与反亲和性需要大量的处理，这可能会显著减慢大规模集群中的调度。
我们不建议在超过数百个节点的集群中使用它们。
{{< /note >}}

{{< note >}}
<!--
Pod anti-affinity requires nodes to be consistently labelled, i.e. every node in the cluster must have an appropriate label matching `topologyKey`. If some or all nodes are missing the specified `topologyKey` label, it can lead to unintended behavior.
-->
Pod 反亲和性需要对节点进行一致的标记，即集群中的每个节点必须具有适当的标签能够匹配
`topologyKey`。如果某些或所有节点缺少指定的 `topologyKey` 标签，可能会导致意外行为。
{{< /note >}}

<!--
As with node affinity, there are currently two types of pod affinity and anti-affinity, called `requiredDuringSchedulingIgnoredDuringExecution` and
`preferredDuringSchedulingIgnoredDuringExecution` which denote "hard" vs. "soft" requirements.
See the description in the node affinity section earlier.
An example of `requiredDuringSchedulingIgnoredDuringExecution` affinity would be "co-locate the pods of service A and service B
in the same zone, since they communicate a lot with each other"
and an example `preferredDuringSchedulingIgnoredDuringExecution` anti-affinity would be "spread the pods from this service across zones"
(a hard requirement wouldn't make sense, since you probably have more pods than zones).
-->
与节点亲和性一样，当前有两种类型的 Pod 亲和性与反亲和性，即
`requiredDuringSchedulingIgnoredDuringExecution` 和
`preferredDuringSchedulingIgnoredDuringExecution`，分别表示“硬性”与“软性”要求。
请参阅前面节点亲和性部分中的描述。
`requiredDuringSchedulingIgnoredDuringExecution` 亲和性的一个示例是
“将服务 A 和服务 B 的 Pod 放置在同一区域，因为它们之间进行大量交流”，而
`preferredDuringSchedulingIgnoredDuringExecution` 反亲和性的示例将是
“将此服务的 pod 跨区域分布”（硬性要求是说不通的，因为你可能拥有的
Pod 数多于区域数）。

<!--
Inter-pod affinity is specified as field `podAffinity` of field `affinity` in the PodSpec.
And inter-pod anti-affinity is specified as field `podAntiAffinity` of field `affinity` in the PodSpec.
-->
Pod 间亲和性通过 PodSpec 中 `affinity` 字段下的 `podAffinity` 字段进行指定。
而 Pod 间反亲和性通过 PodSpec 中 `affinity` 字段下的 `podAntiAffinity` 字段进行指定。

<!--
#### An example of a pod that uses pod affinity:
-->
### Pod 使用 pod 亲和性 的示例：

{{< codenew file="pods/pod-with-pod-affinity.yaml" >}}

<!--
The affinity on this pod defines one pod affinity rule and one pod anti-affinity rule. In this example, the
`podAffinity` is `requiredDuringSchedulingIgnoredDuringExecution`
while the `podAntiAffinity` is `preferredDuringSchedulingIgnoredDuringExecution`. The
pod affinity rule says that the pod can be scheduled onto a node only if that node is in the same zone
as at least one already-running pod that has a label with key "security" and value "S1". (More precisely, the pod is eligible to run
on node N if node N has a label with key `topology.kubernetes.io/zone` and some value V
such that there is at least one node in the cluster with key `topology.kubernetes.io/zone` and
value V that is running a pod that has a label with key "security" and value "S1".) The pod anti-affinity
rule says that the pod should not be scheduled onto a node if that node is in the same zone as a pod with
label having key "security" and value "S2". (If the `topologyKey` were `topology.kubernetes.io/zone` then
it would mean that the pod cannot be scheduled onto a node if that node is in the same zone as a pod with
label having key "security" and value "S2".) See the
[design doc](https://git.k8s.io/community/contributors/design-proposals/scheduling/podaffinity.md)
for many more examples of pod affinity and anti-affinity, both the `requiredDuringSchedulingIgnoredDuringExecution`
flavor and the `preferredDuringSchedulingIgnoredDuringExecution` flavor.
-->
在这个 Pod 的亲和性配置定义了一条 Pod 亲和性规则和一条 Pod 反亲和性规则。
在此示例中，`podAffinity` 配置为 `requiredDuringSchedulingIgnoredDuringExecution`，
然而 `podAntiAffinity` 配置为 `preferredDuringSchedulingIgnoredDuringExecution`。
Pod 亲和性规则表示，仅当节点和至少一个已运行且有键为“security”且值为“S1”的标签
的 Pod 处于同一区域时，才可以将该 Pod 调度到节点上。
（更确切的说，如果节点 N 具有带有键 `topology.kubernetes.io/zone` 和某个值 V 的标签，
则 Pod 有资格在节点 N 上运行，以便集群中至少有一个节点具有键
`topology.kubernetes.io/zone` 和值为 V 的节点正在运行具有键“security”和值
“S1”的标签的 pod。）
Pod 反亲和性规则表示，如果节点处于 Pod 所在的同一可用区且具有键“security”和值“S2”的标签，
则该 pod 不应将其调度到该节点上。
（如果 `topologyKey` 为 `topology.kubernetes.io/zone`，则意味着当节点和具有键
“security”和值“S2”的标签的 Pod 处于相同的区域，Pod 不能被调度到该节点上。）
查阅[设计文档](https://git.k8s.io/community/contributors/design-proposals/scheduling/podaffinity.md)
以获取 Pod 亲和性与反亲和性的更多样例，包括
`requiredDuringSchedulingIgnoredDuringExecution`
和 `preferredDuringSchedulingIgnoredDuringExecution` 两种配置。

<!--
The legal operators for pod affinity and anti-affinity are `In`, `NotIn`, `Exists`, `DoesNotExist`.

In principle, the `topologyKey` can be any legal label-key. However,
for performance and security reasons, there are some constraints on topologyKey:
-->
Pod 亲和性与反亲和性的合法操作符有 `In`，`NotIn`，`Exists`，`DoesNotExist`。

原则上，`topologyKey` 可以是任何合法的标签键。
然而，出于性能和安全原因，topologyKey 受到一些限制：

<!--
1. For pod affinity, empty `topologyKey` is not allowed in both
`requiredDuringSchedulingIgnoredDuringExecution`
and `preferredDuringSchedulingIgnoredDuringExecution`.
2. For pod anti-affinity, empty `topologyKey` is also not allowed in both `requiredDuringSchedulingIgnoredDuringExecution`
and `preferredDuringSchedulingIgnoredDuringExecution`.
3. For `requiredDuringSchedulingIgnoredDuringExecution` pod anti-affinity, the admission controller `LimitPodHardAntiAffinityTopology` was introduced to limit `topologyKey` to `kubernetes.io/hostname`. If you want to make it available for custom topologies, you may modify the admission controller, or disable it.
4. Except for the above cases, the `topologyKey` can be any legal label-key.
-->
1. 对于 Pod 亲和性而言，在 `requiredDuringSchedulingIgnoredDuringExecution`
   和 `preferredDuringSchedulingIgnoredDuringExecution` 中，`topologyKey` 不允许为空。
2. 对于 Pod 反亲和性而言，`requiredDuringSchedulingIgnoredDuringExecution`
   和 `preferredDuringSchedulingIgnoredDuringExecution` 中，`topologyKey`
   都不可以为空。
3. 对于 `requiredDuringSchedulingIgnoredDuringExecution` 要求的 Pod 反亲和性，
   准入控制器 `LimitPodHardAntiAffinityTopology` 被引入以确保 `topologyKey`
   只能是 `kubernetes.io/hostname`。如果你希望 `topologyKey` 也可用于其他定制
   拓扑逻辑，你可以更改准入控制器或者禁用之。
4. 除上述情况外，`topologyKey` 可以是任何合法的标签键。

<!--
In addition to `labelSelector` and `topologyKey`, you can optionally specify a list `namespaces`
of namespaces which the `labelSelector` should match against (this goes at the same level of the definition as `labelSelector` and `topologyKey`).
If omitted or empty, it defaults to the namespace of the pod where the affinity/anti-affinity definition appears.
-->
除了 `labelSelector` 和 `topologyKey`，你也可以指定表示命名空间的
`namespaces` 队列，`labelSelector` 也应该匹配它
（这个与 `labelSelector` 和 `topologyKey` 的定义位于相同的级别）。
如果忽略或者为空，则默认为 Pod 亲和性/反亲和性的定义所在的命名空间。

<!--
All `matchExpressions` associated with `requiredDuringSchedulingIgnoredDuringExecution` affinity and anti-affinity
must be satisfied for the pod to be scheduled onto a node.
-->
所有与 `requiredDuringSchedulingIgnoredDuringExecution` 亲和性与反亲和性
关联的 `matchExpressions` 必须满足，才能将 pod 调度到节点上。

<!--
#### Namespace selector
-->
#### 名字空间选择算符

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

<!--
Users can also select matching namespaces using `namespaceSelector`, which is a label query over the set of namespaces.
The affinity term is applied to the union of the namespaces selected by `namespaceSelector` and the ones listed in the `namespaces` field.
Note that an empty `namespaceSelector` ({}) matches all namespaces, while a null or empty `namespaces` list and
null `namespaceSelector` means "this pod's namespace".
-->
用户也可以使用 `namespaceSelector` 选择匹配的名字空间，`namespaceSelector`
是对名字空间集合进行标签查询的机制。
亲和性条件会应用到 `namespaceSelector` 所选择的名字空间和 `namespaces` 字段中
所列举的名字空间之上。
注意，空的 `namespaceSelector`（{}）会匹配所有名字空间，而 null 或者空的
`namespaces` 列表以及 null 值 `namespaceSelector` 意味着“当前 Pod 的名字空间”。

<!--
This feature is beta and enabled by default. You can disable it via the
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
`PodAffinityNamespaceSelector` in both kube-apiserver and kube-scheduler.
-->
此功能特性是 Beta 版本的，默认是被启用的。你可以通过针对 kube-apiserver 和
kube-scheduler 设置
[特性门控](/zh/docs/reference/command-line-tools-reference/feature-gates/)
`PodAffinityNamespaceSelector` 来禁用此特性。

<!--
#### More Practical Use-cases

Interpod Affinity and AntiAffinity can be even more useful when they are used with higher
level collections such as ReplicaSets, StatefulSets, Deployments, etc.  One can easily configure that a set of workloads should
be co-located in the same defined topology, eg., the same node.
-->
#### 更实际的用例

Pod 间亲和性与反亲和性在与更高级别的集合（例如 ReplicaSets、StatefulSets、
Deployments 等）一起使用时，它们可能更加有用。
可以轻松配置一组应位于相同定义拓扑（例如，节点）中的工作负载。

<!--
##### Always co-located in the same node

In a three node cluster, a web application has in-memory cache such as redis. We want the web-servers to be co-located with the cache as much as possible.
-->
##### 始终放置在相同节点上

在三节点集群中，一个 web 应用程序具有内存缓存，例如 redis。
我们希望 web 服务器与缓存尽可能放置在同一节点上。

<!--
Here is the yaml snippet of a simple redis deployment with three replicas and selector label `app=store`. The deployment has `PodAntiAffinity` configured to ensure the scheduler does not co-locate replicas on a single node.
-->
下面是一个简单 redis Deployment 的 YAML 代码段，它有三个副本和选择器标签 `app=store`。
Deployment 配置了 `PodAntiAffinity`，用来确保调度器不会将所有副本调度到同一节点上。

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
The below yaml snippet of the webserver deployment has `podAntiAffinity` and `podAffinity` configured. This informs the scheduler that all its replicas are to be co-located with pods that have selector label `app=store`. This will also ensure that each web-server replica does not co-locate on a single node.
-->
下面 webserver Deployment 的 YAML 代码段中配置了 `podAntiAffinity` 和 `podAffinity`。
这将通知调度器将 web-server 的所有副本与具有 `app=store` 选择器标签的 Pod 放置在一起。
同时这还确保了不会有两个 web 服务器的副本被调度到同一节点上。

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
If we create the above two deployments, our three node cluster should look like below.
-->
如果我们创建了上面的两个 Deployment，我们的三节点集群将如下表所示。

|       node-1         |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
| *webserver-1*        |   *webserver-2*     |    *webserver-3*   |
|  *cache-1*           |     *cache-2*       |     *cache-3*      |

<!--
As you can see, all the 3 replicas of the `web-server` are automatically co-located with the cache as expected.
-->
如你所见，`web-server` 的三个副本都按照预期那样自动放置在同一位置。

```
kubectl get pods -o wide
```

<!--
The output is similar to this:
-->
输出类似于如下内容：

```
NAME                           READY     STATUS    RESTARTS   AGE       IP           NODE
redis-cache-1450370735-6dzlj   1/1       Running   0          8m        10.192.4.2   kube-node-3
redis-cache-1450370735-j2j96   1/1       Running   0          8m        10.192.2.2   kube-node-1
redis-cache-1450370735-z73mh   1/1       Running   0          8m        10.192.3.1   kube-node-2
web-server-1287567482-5d4dz    1/1       Running   0          7m        10.192.2.3   kube-node-1
web-server-1287567482-6f7v5    1/1       Running   0          7m        10.192.4.3   kube-node-3
web-server-1287567482-s330j    1/1       Running   0          7m        10.192.3.2   kube-node-2
```

<!--
##### Never co-located in the same node

The above example uses `PodAntiAffinity` rule with `topologyKey: "kubernetes.io/hostname"` to deploy the redis cluster so that
no two instances are located on the same host.
See [ZooKeeper tutorial](/docs/tutorials/stateful-application/zookeeper/#tolerating-node-failure)
for an example of a StatefulSet configured with anti-affinity for high availability, using the same technique.
-->
##### 永远不放置在相同节点

上面的例子使用 `PodAntiAffinity` 规则和 `topologyKey: "kubernetes.io/hostname"`
来部署 redis 集群以便在同一主机上没有两个实例。
参阅 [ZooKeeper 教程](/zh/docs/tutorials/stateful-application/zookeeper/#tolerating-node-failure)，
以获取配置反亲和性来达到高可用性的 StatefulSet 的样例（使用了相同的技巧）。

## nodeName

<!--
`nodeName` is the simplest form of node selection constraint, but due
to its limitations it is typically not used.  `nodeName` is a field of
PodSpec.  If it is non-empty, the scheduler ignores the pod and the
kubelet running on the named node tries to run the pod.  Thus, if
`nodeName` is provided in the PodSpec, it takes precedence over the
above methods for node selection.
-->
`nodeName` 是节点选择约束的最简单方法，但是由于其自身限制，通常不使用它。
`nodeName` 是 PodSpec 的一个字段。
如果它不为空，调度器将忽略 Pod，并且给定节点上运行的 kubelet 进程尝试执行该 Pod。
因此，如果 `nodeName` 在 PodSpec 中指定了，则它优先于上面的节点选择方法。

<!--
Some of the limitations of using `nodeName` to select nodes are:

- If the named node does not exist, the pod will not be run, and in
  some cases may be automatically deleted.
- If the named node does not have the resources to accommodate the
  pod, the pod will fail and its reason will indicate why,
  e.g. OutOfmemory or OutOfcpu.
- Node names in cloud environments are not always predictable or
  stable.
-->
使用 `nodeName` 来选择节点的一些限制：

- 如果指定的节点不存在，
- 如果指定的节点没有资源来容纳 Pod，Pod 将会调度失败并且其原因将显示为，
  比如 OutOfmemory 或 OutOfcpu。
- 云环境中的节点名称并非总是可预测或稳定的。

<!--
Here is an example of a pod config file using the `nodeName` field:
-->
下面的是使用 `nodeName` 字段的 Pod 配置文件的例子：

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
The above pod will run on the node kube-01.
-->
上面的 pod 将运行在 kube-01 节点上。

## {{% heading "whatsnext" %}}

<!--
[Taints](/docs/concepts/scheduling-eviction/taint-and-toleration/) allow a Node to *repel* a set of Pods.
-->
[污点](/zh/docs/concepts/scheduling-eviction/taint-and-toleration/)
允许节点*排斥*一组 Pod。

<!--
The design documents for
[node affinity](https://git.k8s.io/community/contributors/design-proposals/scheduling/nodeaffinity.md)
and for [inter-pod affinity/anti-affinity](https://git.k8s.io/community/contributors/design-proposals/scheduling/podaffinity.md) contain extra background information about these features.
-->
[节点亲和性](https://git.k8s.io/community/contributors/design-proposals/scheduling/nodeaffinity.md)与
[pod 间亲和性/反亲和性](https://git.k8s.io/community/contributors/design-proposals/scheduling/podaffinity.md)
的设计文档包含这些功能的其他背景信息。

<!--
Once a Pod is assigned to a Node, the kubelet runs the Pod and allocates node-local resources.
The [topology manager](/docs/tasks/administer-cluster/topology-manager/) can take part in node-level
resource allocation decisions.
-->
一旦 Pod 分配给 节点，kubelet 应用将运行该 pod 并且分配节点本地资源。
[拓扑管理器](/zh/docs/tasks/administer-cluster/topology-manager/)
可以参与到节点级别的资源分配决定中。
