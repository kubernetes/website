---
cn-approvers:
- tianshapjq
assignees:
- davidopp
- kevin-wangzefeng
- bsalamat
title: 分配 Pod 到 Node 上
redirect_from:
- "/docs/user-guide/node-selection/"
- "/docs/user-guide/node-selection/index.html"
---
<!--
---
assignees:
- davidopp
- kevin-wangzefeng
- bsalamat
title: Assigning Pods to Nodes
redirect_from:
- "/docs/user-guide/node-selection/"
- "/docs/user-guide/node-selection/index.html"
---
-->

<!--
You can constrain a [pod](/docs/concepts/workloads/pods/pod/) to only be able to run on particular [nodes](/docs/concepts/nodes/node/) or to prefer to
run on particular nodes. There are several ways to do this, and they all use
[label selectors](/docs/user-guide/labels/) to make the selection.
Generally such constraints are unnecessary, as the scheduler will automatically do a reasonable placement
(e.g. spread your pods across nodes, not place the pod on a node with insufficient free resources, etc.)
but there are some circumstances where you may want more control on a node where a pod lands, e.g. to ensure
that a pod ends up on a machine with an SSD attached to it, or to co-locate pods from two different
services that communicate a lot into the same availability zone.

You can find all the files for these examples [in our docs
repo here](https://github.com/kubernetes/kubernetes.github.io/tree/{{page.docsbranch}}/docs/user-guide/node-selection).
-->

您可以限制 [pod](/docs/concepts/workloads/pods/pod/) 只能在特定 [node](/docs/concepts/nodes/node/) 上运行，或者更倾向于在某些特定 node 上运行。 有几种方法可以做到这一点，他们都使用 [label selectors](/docs/user-guide/labels/) 进行选择。
一般来说，这种约束是不必要的，因为 scheduler 会自动进行合理的安排（例如，将 pod 分布在所有 node 上，而不是将 pod 分配到空闲资源不足的 node 上，等等）
但是在某些情况下，您可能需要对 node 有更多的控制权，例如，确保一个 pod 调度到安装有 SSD 的机器上，或者将来自两个不同服务并且需要大量通信的 pod 分配到同一个可用区域内。

您可以 [在我们的 docs 库中](https://github.com/kubernetes/kubernetes.github.io/tree/{{page.docsbranch}}/docs/user-guide/node-selection) 找到这些示例文件。

* TOC
{:toc}


## nodeSelector

<!--
`nodeSelector` is the simplest form of constraint.
`nodeSelector` is a field of PodSpec. It specifies a map of key-value pairs. For the pod to be eligible
to run on a node, the node must have each of the indicated key-value pairs as labels (it can have
additional labels as well). The most common usage is one key-value pair.
-->
`nodeSelector` 是最简单的控制方式。
`nodeSelector` 是 PodSpec 中的一个字段，它指定了键-值对的映射。如果想要 pod 能够运行在某个 node 上，那么这个 node 必须具有所有指定的键-值对的标签（node 也能拥有其它标签）。最常用的方式是单键-值对。

<!--
Let's walk through an example of how to use `nodeSelector`.
-->
我们来看一个如何使用 `nodeSelector` 的例子。

<!--
### Step Zero: Prerequisites
-->
### 第零步：前提条件

<!--
This example assumes that you have a basic understanding of Kubernetes pods and that you have [turned up a Kubernetes cluster](https://github.com/kubernetes/kubernetes#documentation).
-->
该示例假设您已经对 Kubernetes pod 有一个基本的了解，并且您已经 [启动了一个 Kubernetes 集群](https://github.com/kubernetes/kubernetes#documentation)。

<!--
### Step One: Attach label to the node
-->
### 第一步：附加标签到 node 上

<!--
Run `kubectl get nodes` to get the names of your cluster's nodes. Pick out the one that you want to add a label to, and then run `kubectl label nodes <node-name> <label-key>=<label-value>` to add a label to the node you've chosen. For example, if my node name is 'kubernetes-foo-node-1.c.a-robinson.internal' and my desired label is 'disktype=ssd', then I can run `kubectl label nodes kubernetes-foo-node-1.c.a-robinson.internal disktype=ssd`.
-->
运行 `kubectl get nodes` 来获得您集群所有 node 的名称。选择想要附加标签的 node，然后运行 `kubectl label nodes <node-name> <label-key>=<label-value>` 来把标签附加到您选择的 node 上。例如，如果您的 node 名称是 'kubernetes-foo-node-1.c.a-robinson.internal'，并且希望附加的标签为 'disktype=ssd'，那么您可以运行 `kubectl label nodes kubernetes-foo-node-1.c.a-robinson.internal disktype=ssd`。

<!--
If this fails with an "invalid command" error, you're likely using an older version of kubectl that doesn't have the `label` command. In that case, see the [previous version](https://github.com/kubernetes/kubernetes/blob/a053dbc313572ed60d89dae9821ecab8bfd676dc/examples/node-selection/README.md) of this guide for instructions on how to manually set labels on a node.
-->
如果上述命令失败并且出现 "invalid command" 错误，那么可能是因为您使用了没有 label 命令的早期 kubectl 版本。如果是这种情况，请参阅 [之前的版本](https://github.com/kubernetes/kubernetes/blob/a053dbc313572ed60d89dae9821ecab8bfd676dc/examples/node-selection/README.md) 来获得如何手动设置 node 标签的教程。

<!--
Also, note that label keys must be in the form of DNS labels (as described in the [identifiers doc](https://git.k8s.io/community/contributors/design-proposals/identifiers.md)), meaning that they are not allowed to contain any upper-case letters.
-->
另外请注意，标签键必须采用 DNS 标签的形式（如在 [identifiers doc](https://git.k8s.io/community/contributors/design-proposals/identifiers.md) 中所述），也就是标签键中不能包含任何的大写字符。

<!--
You can verify that it worked by re-running `kubectl get nodes --show-labels` and checking that the node now has a label.
-->
您可以通过运行 `kubectl get nodes --show-labels` 来验证上述命令是否正确运行，并且验证 node 是否已经有了标签。

<!--
### Step Two: Add a nodeSelector field to your pod configuration
-->
### 第二步：在您的 pod 配置中增加一个 nodeSelector 字段

<!--
Take whatever pod config file you want to run, and add a nodeSelector section to it, like this. For example, if this is my pod config:
-->
使用任意一个您想要运行的 pod 配置文件，然后添加一个 nodeSelector。如以下的示例：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    env: test
spec:
  containers:
  - name: nginx
    image: nginx
```

<!--
Then add a nodeSelector like so:
-->
然后添加一个 nodeSelector 如下：

{% include code.html language="yaml" file="pod.yaml" ghlink="/docs/concepts/configuration/pod.yaml" %}

<!--
When you then run `kubectl create -f pod.yaml`, the pod will get scheduled on the node that you attached the label to! You can verify that it worked by running `kubectl get pods -o wide` and looking at the "NODE" that the pod was assigned to.
-->
当您运行 `kubectl create -f pod.yaml` 后，这个 pod 就会被调度到附加了相应标签的 node 上了！您可以通过运行 `kubectl get pods -o wide` 然后查看 pod 被分配到的 "NODE" 来验证是否成功执行。

<!--
## Interlude: built-in node labels
-->
## 插曲：内置的 node 标签

<!--
In addition to labels you [attach yourself](#step-one-attach-label-to-the-node), nodes come pre-populated
with a standard set of labels. As of Kubernetes v1.4 these labels are
-->
除了 [自己打标签](#step-one-attach-label-to-the-node)，node 已经预先附加了一个标准标签集。在 Kubernetes 1.4 版本中，这些标签有

* `kubernetes.io/hostname`
* `failure-domain.beta.kubernetes.io/zone`
* `failure-domain.beta.kubernetes.io/region`
* `beta.kubernetes.io/instance-type`
* `beta.kubernetes.io/os`
* `beta.kubernetes.io/arch`

<!--
## Affinity and anti-affinity
-->
## 亲和性（Affinity）和反亲和性（Anti-affinity）

<!--
`nodeSelector` provides a very simple way to constrain pods to nodes with particular labels. The affinity/anti-affinity
feature, currently in beta, greatly expands the types of constraints you can express. The key enhancements are
-->
`nodeSelector` 提供了一个非常简单的方法来将 pod 约束到具有特定标签的节点。而亲和性/反亲和性特性（目前处于 beta 阶段），极大地扩展了您可以表达的约束类型。关键的改进有

<!--
1. the language is more expressive (not just "AND of exact match")
2. you can indicate that the rule is "soft"/"preference" rather than a hard requirement, so if the scheduler
   can't satisfy it, the pod will still be scheduled
3. you can constrain against labels on other pods running on the node (or other topological domain),
   rather than against labels on the node itself, which allows rules about which pods can and cannot be co-located
-->
1. 表达语言更丰富（不仅仅是 "AND 精确匹配"）
2. 你可以指定规则是 “软”/“偏好” 的，而不是一个硬性要求，所以即使 scheduler 不能满足它的规则，pod 仍然会被调度
3. 您可以针对 node 上正在运行的其它 pod （或者其它的拓扑域）制定标签，而不仅仅是 node 自身，这就能指定哪些 pod 能够（或者不能够）落在同一节点。

<!--
The affinity feature consists of two types of affinity, "node affinity" and "inter-pod affinity/anti-affinity."
Node affinity is like the existing `nodeSelector` (but with the first two benefits listed above),
while inter-pod affinity/anti-affinity constrains against pod labels rather than node labels, as
described in the third item listed above, in addition to having the first and second properties listed above.

`nodeSelector` continues to work as usual, but will eventually be deprecated, as node affinity can express
everything that `nodeSelector` can express.
-->
亲和性特性包含了两种类型的亲和性，"node 亲和性" 和 "pod 间的亲和性/反亲和性"。
Node 亲和性类似于已有的 `nodeSelector`，但是拥有上述的第一和第二个优点。Pod 间的亲和性/反亲和性以 pod 标签作为约束，而不仅仅是 node 标签，就像上述第三点所述，它同时也拥有上述第一和第二个特性。

`nodeSelector` 将会像往常一样继续工作，但最终将被弃用，因为 node 亲和性可以表达 `nodeSelector` 能够表达的所有约束。

<!--
### Node affinity (beta feature)
-->
### Node 亲和性（beta 特性）

<!--
Node affinity was introduced as alpha in Kubernetes 1.2.
Node affinity is conceptually similar to `nodeSelector` -- it allows you to constrain which nodes your
pod is eligible to schedule on, based on labels on the node.
-->
Node 亲和性在 Kubernetes 1.2 版本中作为 alpha 特性引入。
Node 亲和性在概念上类似于 `nodeSelector` -- 它能够基于 node 标签约束哪些 pod 能够被分配到 node 上。

<!--
There are currently two types of node affinity, called `requiredDuringSchedulingIgnoredDuringExecution` and
`preferredDuringSchedulingIgnoredDuringExecution`. You can think of them as "hard" and "soft" respectively,
in the sense that the former specifies rules that *must* be met for a pod to schedule onto a node (just like
`nodeSelector` but using a more expressive syntax), while the latter specifies *preferences* that the scheduler
will try to enforce but will not guarantee. The "IgnoredDuringExecution" part of the names means that, similar
to how `nodeSelector` works, if labels on a node change at runtime such that the affinity rules on a pod are no longer
met, the pod will still continue to run on the node. In the future we plan to offer
`requiredDuringSchedulingRequiredDuringExecution` which will be just like `requiredDuringSchedulingIgnoredDuringExecution`
except that it will evict pods from nodes that cease to satisfy the pods' node affinity requirements.
-->
目前有两种类型的 node 亲和性，叫做 `requiredDuringSchedulingIgnoredDuringExecution` 和 `preferredDuringSchedulingIgnoredDuringExecution`。您可以认为它们分别是 "硬性" 和 "软性" 的，即前者要求 pod *必须* 满足指定的规则才能调度到 node 上（就像 `nodeSelector`，但使用更具表达性的语法），后者指定 *偏向*，即让 scheduler 尝试但是不保证完全满足规则。与 `nodeSelector` 工作方式类似，名称中的 "IgnoredDuringExecution" 部分意味着，如果一个 node 的标签在运行时发生改变，从而导致 pod 的亲和性规则不再被满足时，pod 也仍然会继续运行在 node 上。以后我们计划提供 `requiredDuringSchedulingRequiredDuringExecution`，这类似于 `requiredDuringSchedulingIgnoredDuringExecution`，但是它会从不再满足 pod 的 node 亲和性的 node 上驱逐 Pod。

<!--
Thus an example of `requiredDuringSchedulingIgnoredDuringExecution` would be "only run the pod on nodes with Intel CPUs"
and an example `preferredDuringSchedulingIgnoredDuringExecution` would be "try to run this set of pods in availability
zone XYZ, but if it's not possible, then allow some to run elsewhere".

Node affinity is specified as field `nodeAffinity` of field `affinity` in the PodSpec.

Here's an example of a pod that uses node affinity:
-->
因此 `requiredDuringSchedulingIgnoredDuringExecution` 的一个例子是 "只能在有 Intel CPU 的 node 上运行 pod"，`preferredDuringSchedulingIgnoredDuringExecution` 的例子是 "尝试在可用域 XYZ 的范围内运行 pod，但是如果不满足，那么也允许在其它地方运行 pod"。

{% include code.html language="yaml" file="pod-with-node-affinity.yaml" ghlink="/docs/concepts/configuration/pod-with-node-affinity.yaml" %}

<!--
This node affinity rule says the pod can only be placed on a node with a label whose key is
`kubernetes.io/e2e-az-name` and whose value is either `e2e-az1` or `e2e-az2`. In addition,
among nodes that meet that criteria, nodes with a label whose key is `another-node-label-key` and whose
value is `another-node-label-value` should be preferred.
-->
这个 node 亲和性规则意思是，pod 只能被调度在标签满足 key 为 `kubernetes.io/e2e-az-name` 并且 value 为 `e2e-az1` 或者 `e2e-az2` 的 node 上。另外，在满足条件的所有 node 中，更倾向于拥有 key 为 `another-node-label-key` 并且 value 为 `another-node-label-value` 的标签的 node。

<!--
You can see the operator `In` being used in the example. The new node affinity syntax supports the following operators: `In`, `NotIn`, `Exists`, `DoesNotExist`, `Gt`, `Lt`.
There is no explicit "node anti-affinity" concept, but `NotIn` and `DoesNotExist` give that behavior.

If you specify both `nodeSelector` and `nodeAffinity`, *both* must be satisfied for the pod
to be scheduled onto a candidate node.
-->
您可以在例子中看到 `In` 运算符。新的 node 亲和性语法支持以下运算符：`In`、`NotIn`、`Exists`、`DoesNotExist`、`Gt` 和 `Lt`。
实际上并没有明确的 "node 反亲和性" 概念，不过 `NotIn` 和 `DoesNotExist` 提供了这种行为。

如果您指定了 `nodeSelector` 和 `nodeAffinity`，那么 pod 必须满足这 *两个* 规则才能调度到候选节点上。

<!--
If you specify multiple `nodeSelectorTerms` associated with `nodeAffinity` types, then the pod can be scheduled onto a node **if one of** the `nodeSelectorTerms` is satisfied.

If you specify multiple `matchExpressions` associated with `nodeSelectorTerms`, then the pod can be scheduled onto a node **only if all** `matchExpressions` can be satisfied.

For more information on node affinity, see the design doc
[here](https://git.k8s.io/community/contributors/design-proposals/nodeaffinity.md).
-->
如果您在 `nodeAffinity` 类型中指定了多个 `nodeSelectorTerms`，那么 pod 将会被调度到 **只要满足其中一个** `nodeSelectorTerms` 的 node 上。

如果您在 `nodeSelectorTerms` 中指定了多个 `matchExpressions`，那么 pod 将会被调度到 **满足所有** `matchExpressions` 的 node 上。

如果需要了解更多关于 node 亲和性的信息，请 [点击这里](https://git.k8s.io/community/contributors/design-proposals/nodeaffinity.md) 查看设计文档。

<!--
### Inter-pod affinity and anti-affinity (beta feature)
-->
### pod 间的亲和性和反亲和性（beta 特性）

<!--
Inter-pod affinity and anti-affinity were introduced in Kubernetes 1.4.
Inter-pod affinity and anti-affinity allow you to constrain which nodes your pod is eligible to schedule on *based on
labels on pods that are already running on the node* rather than based on labels on nodes. The rules are of the form "this pod should (or, in the case of
anti-affinity, should not) run in an X if that X is already running one or more pods that meet rule Y." Y is expressed
as a LabelSelector with an associated list of namespaces (or "all" namespaces); unlike nodes, because pods are namespaced
(and therefore the labels on pods are implicitly namespaced),
a label selector over pod labels must specify which namespaces the selector should apply to. Conceptually X is a topology domain
like node, rack, cloud provider zone, cloud provider region, etc. You express it using a `topologyKey` which is the
key for the node label that the system uses to denote such a topology domain, e.g. see the label keys listed above
in the section [Interlude: built-in node labels](#interlude-built-in-node-labels).
-->
在 Kubernetes 1.4 版本中引入了 Pod 间的亲和性和反亲和性。
Pod 间的亲和性和反亲和性允许您 *根据已经在 node 上运行的 pod 的标签* 来限制 pod 调度在哪个 node 上，而不是基于 node 上的标签。这些规则的形式是 "如果 X 已经运行一个或多个符合规则 Y 的 pod，那么这个 pod 应该（如果是反亲和性，则是不应该）运行在 X 上"。这里 Y 指具有关联命名空间列表的 LabelSelector（或者关联 "all" 命名空间）；和 node 不同，由于 pod 都是有命名空间的（因此 pod 上的标签都隐式具有命名空间），所以基于 pod 标签的标签选择器（label selector）必须指定命名空间。概念上，X 是一个拓扑域，类似于 node、rack、cloud provider zone 和 cloud provider region 等等。您可以使用 `topologyKey` 来表示这个 X，`topologyKey` 是系统用来表示这个拓扑域的 node 标签，例如，查看上述 [插曲：内置的 node 标签](#interlude-built-in-node-labels) 中列出的标签 key。

<!--
As with node affinity, there are currently two types of pod affinity and anti-affinity, called `requiredDuringSchedulingIgnoredDuringExecution` and
`preferredDuringSchedulingIgnoredDuringExecution` which denote "hard" vs. "soft" requirements.
See the description in the node affinity section earlier.
An example of `requiredDuringSchedulingIgnoredDuringExecution` affinity would be "co-locate the pods of service A and service B
in the same zone, since they communicate a lot with each other"
and an example `preferredDuringSchedulingIgnoredDuringExecution` anti-affinity would be "spread the pods from this service across zones"
(a hard requirement wouldn't make sense, since you probably have more pods than zones).
-->
和 node 亲和性一样，目前有两种类型的 pod 亲和性和反亲和性，叫做 `requiredDuringSchedulingIgnoredDuringExecution` 和 `preferredDuringSchedulingIgnoredDuringExecution`，分别表示 "硬性" 和 "软性" 的要求。可以查看上述的 node 亲和性描述。
`requiredDuringSchedulingIgnoredDuringExecution` 的一个例子是，"将服务 A 和服务 B 的 pod 调度到同一个域内，因为这些服务相互之间有大量通信"。`preferredDuringSchedulingIgnoredDuringExecution` 反亲和性的一个例子是 "在整个域内平均分布这个服务的所有 pod"（这里如果用一个硬性的要求是不可行的，因为您可能要创建比域更多的 pod）。

<!--
Inter-pod affinity is specified as field `podAffinity` of field `affinity` in the PodSpec.
And inter-pod anti-affinity is specified as field `podAntiAffinity` of field `affinity` in the PodSpec.

Here's an example of a pod that uses pod affinity:
-->
在 PodSpec 中，通过 `affinity` 中的 `podAffinity` 字段指定 Pod 间的亲和性。
并且在 PodSpec 中，通过 `affinity` 中的 `podAntiAffinity` 字段 指定Pod 间的反亲和性。

以下是一个使用 pod 亲和性的 pod 示例：

{% include code.html language="yaml" file="pod-with-pod-affinity.yaml" ghlink="/docs/concepts/configuration/pod-with-pod-affinity.yaml" %}

<!--
The affinity on this pod defines one pod affinity rule and one pod anti-affinity rule. In this example, the
`podAffinity` is `requiredDuringSchedulingIgnoredDuringExecution`
while the `podAntiAffinity` is `preferredDuringSchedulingIgnoredDuringExecution`. The
pod affinity rule says that the pod can schedule onto a node only if that node is in the same zone
as at least one already-running pod that has a label with key "security" and value "S1". (More precisely, the pod is eligible to run
on node N if node N has a label with key `failure-domain.beta.kubernetes.io/zone` and some value V
such that there is at least one node in the cluster with key `failure-domain.beta.kubernetes.io/zone` and
value V that is running a pod that has a label with key "security" and value "S1".) The pod anti-affinity
rule says that the pod prefers to not schedule onto a node if that node is already running a pod with label
having key "security" and value "S2". (If the `topologyKey` were `failure-domain.beta.kubernetes.io/zone` then
it would mean that the pod cannot schedule onto a node if that node is in the same zone as a pod with
label having key "security" and value "S2".) See the [design doc](https://git.k8s.io/community/contributors/design-proposals/podaffinity.md).
for many more examples of pod affinity and anti-affinity, both the `requiredDuringSchedulingIgnoredDuringExecution`
flavor and the `preferredDuringSchedulingIgnoredDuringExecution` flavor.
-->
该 pod 亲和性示例定义了一个 pod 亲和性规则和一个 pod 反亲和性规则。在这个示例中，`podAffinity` 使用的是 `requiredDuringSchedulingIgnoredDuringExecution` 而 `podAntiAffinity` 使用 `preferredDuringSchedulingIgnoredDuringExecution`。这个 pod 亲和性规则说的是这个 pod 所在的 node 必须满足一个条件：node 必须和至少一个拥有 key 为 "security" 并且 value 为 "S1" 标签的运行中 pod 同一个域（更确切地说，pod 能够落在的 node N 必须满足：N 有一个 key 为 `failure-domain.beta.kubernetes.io/zone` 并且 value 为某个值 V 的标签，这样集群中就至少有一个 node 拥有这个标签，并且有一个 key 为 "security" 并且 value 为 "S1" 的标签的 pod 在之上运行）。pod 反亲和性规则说的是，如果 node 正在运行的 pod 带有 key 为 "security" 并且 value 为 "S2" 的标签，那么倾向于不把 pod 调度到该 node 上（如果 `topologyKey` 是 `failure-domain.beta.kubernetes.io/zone` 的话，表示如果 node 正在运行的 pod 拥有 key 为 "security" 并且 value 为 "S2" 的标签，那么这个 pod 就不能调度到该 node 上）。请参阅 [设计文档](https://git.k8s.io/community/contributors/design-proposals/podaffinity.md) 来获得更多 pod 亲和性和反亲和性的示例，同时也提供了 `requiredDuringSchedulingIgnoredDuringExecution` 和 `preferredDuringSchedulingIgnoredDuringExecution` 的示例。

<!--
The legal operators for pod affinity and anti-affinity are `In`, `NotIn`, `Exists`, `DoesNotExist`.
-->
pod 亲和性和反亲和性的合法操作是 `In`、`NotIn`、`Exists` 和 `DoesNotExist`。

<!--
In principle, the `topologyKey` can be any legal label-key. However,
for performance and security reasons, there are some constraints on topologyKey:
-->
原则上，`topologyKey` 可以是任何合法的标签 key。然而，出于性能和安全原因，对 topologyKey 有一些限制：

<!--
1. For affinity and for `RequiredDuringScheduling` pod anti-affinity,
empty `topologyKey` is not allowed.
2. For `RequiredDuringScheduling` pod anti-affinity, the admission controller `LimitPodHardAntiAffinityTopology` was introduced to limit `topologyKey` to `kubernetes.io/hostname`. If you want to make it available for custom topologies, you may modify the admission controller, or simply disable it.
3. For `PreferredDuringScheduling` pod anti-affinity, empty `topologyKey` is interpreted as "all topologies" ("all topologies" here is now limited to the combination of `kubernetes.io/hostname`, `failure-domain.beta.kubernetes.io/zone` and `failure-domain.beta.kubernetes.io/region`).
4. Except for the above cases, the `topologyKey` can be any legal label-key.
-->
1. 对于亲和性和 `RequiredDuringScheduling` 的 pod 反亲和性，不允许 `topologyKey` 为空。
2. 对于 `RequiredDuringScheduling` 的 pod 反亲和性，引入 `LimitPodHardAntiAffinityTopology` 准入控制器来限制 `topologyKey` 只能是 `kubernetes.io/hostname`。如果要使其适用于自定义拓扑结构，则可以修改准入控制器，或者直接禁用它。
3. 对于 `PreferredDuringScheduling` 的 pod 反亲和性，空的 `topologyKey` 将被理解为 "所有的拓扑结构"（这里的 "所有的拓扑结构" 仅限于 `kubernetes.io/hostname`、`failure-domain.beta.kubernetes.io/zone` 和 `failure-domain.beta.kubernetes.io/region` 的组合）。
4. 除上述情况外，`topologyKey` 可以是任何合法的标签 key。

<!--
In addition to `labelSelector` and `topologyKey`, you can optionally specify a list `namespaces`
of namespaces which the `labelSelector` should match against (this goes at the same level of the definition as `labelSelector` and `topologyKey`).
If omitted, it defaults to the namespace of the pod where the affinity/anti-affinity definition appears.
If defined but empty, it means "all namespaces."
-->
除了 `labelSelector` 和 `topologyKey` 外，您可以选择指定一个 `labelSelector` 应该匹配的 `namespaces` 列表（这与 `labelSelector` 和 `topologyKey` 的定义级别相同）。
如果省略的话，默认为拥有亲和性（或反亲和性）的 pod 所属的命名空间。如果定义了但是值为空，则表示使用 "all" 命名空间。

<!--
All `matchExpressions` associated with `requiredDuringSchedulingIgnoredDuringExecution` affinity and anti-affinity
must be satisfied for the pod to schedule onto a node. 
-->
如果是 `requiredDuringSchedulingIgnoredDuringExecution` 的亲和性和反亲和性，那么 pod 必须满足所有相关的 `matchExpressions` 才能调度到 node 上。

<!--
For more information on inter-pod affinity/anti-affinity, see the design doc
[here](https://git.k8s.io/community/contributors/design-proposals/podaffinity.md).
-->
请 [点击这里](https://git.k8s.io/community/contributors/design-proposals/podaffinity.md) 查看设计文档，以获得更多 pod 间亲和性/反亲和性的信息。

<!--
## Taint and toleration (beta feature)
-->
## Taint 和 toleration（beta 特性）

<!--
Node affinity, described earlier, is a property of *pods* that *attracts* them to a set
of nodes (either as a preference or a hard requirement). Taints are the opposite --
they allow a *node* to *repel* a set of pods.
-->
Node 亲和性，根据之前的描述，是 *pod* 的一个属性，将其 *吸引* 到一个 node 集上（以倾向性或硬性要求的形式）。Taint 则刚好相反 -- 它们允许一个 *node* *排斥* 一些 pod。

<!--
Taints and tolerations work together to ensure that pods are not scheduled
onto inappropriate nodes. One or more taints are applied to a node; this
marks that the node should not accept any pods that do not tolerate the taints.
Tolerations are applied to pods, and allow (but do not require) the pods to schedule
onto nodes with matching taints.
-->
Taint 和 toleration 一起工作，以确保 pod 不会被调度到不适当的 node 上。如果一个或多个 taint 应用于一个 node，这表示该节点不应该接受任何不能容忍 taint 的 pod。
Toleration 应用到 pod 上，则表示允许（但不要求）pod 调度到具有匹配 taint 的 node 上。

<!--
You add a taint to a node using [kubectl taint](/docs/user-guide/kubectl/v1.7/#taint).
For example,
-->
您可以通过使用 [kubectl taint](/docs/user-guide/kubectl/v1.7/#taint) 命令来给 node 添加一个 taint。例如，

```shell
kubectl taint nodes node1 key=value:NoSchedule
```

<!--
places a taint on node `node1`. The taint has key `key`, value `value`, and taint effect `NoSchedule`.
This means that no pod will be able to schedule onto `node1` unless it has a matching toleration.
You specify a toleration for a pod in the PodSpec. Both of the following tolerations "match" the
taint created by the `kubectl taint` line above, and thus a pod with either toleration would be able
to schedule onto `node1`:
-->
在节点 `node1` 上增加一个 taint。这个 taint 的 key 为 `key` 且 value 为 `value`，并且这个 taint 的作用是 `NoSchedule`。
这表示除非 pod 拥有一个匹配的 toleration，否则它将无法调度到 `node1` 上。
您需要在 pod 的 PodSpec 指定一个 toleration。以下两个 toleration 都能 "匹配" 上述 `kubectl taint` 创建出来的 taint，因此拥有以下任一 toleration 的 pod 都能调度到 `node1` 上：

```yaml
tolerations: 
- key: "key"
  operator: "Equal"
  value: "value"
  effect: "NoSchedule"
```

```yaml
tolerations: 
- key: key
  operator: Exists
  value: value
  effect: NoSchedule
```

<!--
A toleration "matches" a taint if the `key`s are the same and the `effect`s are the same, and:

* the `operator` is `Exists` (in which case no `value` should be specified), or
* the `operator` is `Equal` and the `value`s are equal

`Operator` defaults to `Equal` if not specified.
-->
一个 toleration 能够 "匹配" 一个 taint 除了需要所有的 `key` 和所有的 `effect` 都相等之外，还需要：

* `operator` 是 `Exists`（这种情况下就不用指定 `value`），或者
* `operator` 是 `Equal` 并且所有的 `value` 都相等

如果不指定的话 `Operator` 默认为 `Equal`。

<!--
**NOTE:** There are two special cases:

* An empty `key` with operator `Exists` matches all keys, values and effects which means this
will tolerate everything.
-->
**注意：** 有两种特殊情况：

* `key` 为空并且 operator 为 `Exists` 表示能够匹配所有的 key、value 和 effect，也就是这能容忍所有情况。

```yaml
tolerations:
- operator: "Exists"
```

<!--
* An empty `effect` matches all effects with key `key`.
-->
* 一个空的 `effect` 能够匹配所有 key 为 `key` 的 effect。

```yaml
tolerations:
- key: "key"
  operator: "Exists"
```

<!--
The above example used `effect` of `NoSchedule`. Alternatively, you can use `effect` of `PreferNoSchedule`.
This is a "preference" or "soft" version of `NoSchedule` -- the system will *try* to avoid placing a
pod that does not tolerate the taint on the node, but it is not required. The third kind of `effect` is
`NoExecute`, described later.
-->
以上示例使用了 `effect` 中的 `NoSchedule`。另外，您也可以使用 `effect` 中的 `PreferNoSchedule`。
这是 `NoSchedule` 的一个 "偏向性" 或者 "软性" 的版本 -- 系统将会 *尝试* 避免将一个无法容忍 taint 的 pod 调度到 node 上，但这不是必须的。第三种 `effect` 的类型是 `NoExecute`，接下来会进行讲解。

<!--
You can put multiple taints on the same node and multiple tolerations on the same pod.
The way Kubernetes processes multiple taints and tolerations is like a filter: start
with all of a node's taints, then ignore the ones for which the pod has a matching toleration; the
remaining un-ignored taints have the indicated effects on the pod. In particular,
-->
您可以添加多个 taint 到一个 node 上，也能添加多个 toleration 到一个 pod 上。
Kubernetes 以过滤器的形式来处理多个 taint 和 toleration 的情况：从 node 的所有 taint 开始，如果 pod 拥有匹配的 toleration 则将 taint 忽略掉；最后剩下的没有被忽略的 taint 将作用于这个 pod。特别是，

<!--
* if there is at least one un-ignored taint with effect `NoSchedule` then Kubernetes will not schedule
the pod onto that node
* if there is no un-ignored taint with effect `NoSchedule` but there is at least one un-ignored taint with
effect `PreferNoSchedule` then Kubernetes will *try* to not schedule the pod onto the node
* if there is at least one un-ignored taint with effect `NoExecute` then the pod will be evicted from
the node (if it is already running on the node), and will not be
scheduled onto the node (if it is not yet running on the node).
-->
* 如果最后剩下的 taint 中有至少一个带有 effect 为 `NoSchedule`，那么 Kubernetes 将不会把这个 pod 调度到这个 node
* 如果最后剩下的 taint 中没有带有 effect 为 `NoSchedule` 但是有至少一个 taint 带有 effect 为 `PreferNoSchedule`，那么 Kubernetes 将会 *尝试* 避免将 pod 调度到这个 node 上
* 如果最后剩下的 taint 中有至少一个带有 effect 为 `NoExecute`，那么将会把 pod 从这个 node 上驱逐（如果 pod 已经运行在 node 上），或者不会将其调度到这个 node 上（如果 pod 还没有运行在 node 上）。

<!--
For example, imagine you taint a node like this
-->
例如，假设您给一个 node 添加了如下 taint

```shell
kubectl taint nodes node1 key1=value1:NoSchedule
kubectl taint nodes node1 key1=value1:NoExecute
kubectl taint nodes node1 key2=value2:NoSchedule
```

<!--
And a pod has two tolerations:
-->
并且有一个 pod 拥有如下两个 toleration：

```yaml
tolerations: 
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoSchedule"
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoExecute"
```

<!--
In this case, the pod will not be able to schedule onto the node, because there is no
toleration matching the third taint. But it will be able to continue running if it is
already running on the node when the taint is added, because the third taint is the only
one of the three that is not tolerated by the pod.
-->
在这种情况下，这个 pod 将不会调度到这个 node 上，因为没有 toleration 能够匹配第三个 taint。
但是如果 pod 已经运行在 node 上，那么当添加 taint 后它也会继续运行，因为第三个 taint 是三个 taint 中唯一不被 pod 所容忍的，而且这个 taint 是 NoSchedule。

<!--
Normally, if a taint with effect `NoExecute` is added to a node, then any pods that do
not tolerate the taint will be evicted immediately, and any pods that do tolerate the
taint will never be evicted. However, a toleration with `NoExecute` effect can specify
an optional `tolerationSeconds` field that dictates how long the pod will stay bound
to the node after the taint is added. For example,
-->
通常来说，如果一个 node 添加了一个 effect 为 `NoExecute` 的 taint，那么任何不能容忍这个 taint 的 pod 都会被驱逐，并且任何能够容忍这个 taint 的 pod 将永远不会被驱逐。
但是，一个 effect 为 `NoExecute` 的 toleration 能够指定一个附加的字段 `tolerationSeconds`，用来指定在 node 添加了 taint 后，pod 能够停留在 node 上的时间。例如，

```yaml
tolerations: 
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoExecute"
  tolerationSeconds: 3600
```

<!--
means that if this pod is running and a matching taint is added to the node, then
the pod will stay bound to the node for 3600 seconds, and then be evicted. If the
taint is removed before that time, the pod will not be evicted.
-->
表示如果这个 pod 已经运行在 node 上并且 node 添加了一个匹配的 taint，那么这个 pod 将会在 node 上停留 3600 秒，然后才会被驱逐。
但是如果 taint 在这个时间前被移除，那么这个 pod 将不会被驱逐。

<!--
### Example use cases
-->
### 使用示例

<!--
Taints and tolerations are a flexible way to steer pods away from nodes or evict
pods that shouldn't be running. A few of the use cases are
-->
Taint 和 toleration 是一种用来引导 pod 远离 node 或者驱逐不应该运行的 pod 的灵活的方法。使用示例有

<!--
* **dedicated nodes**: If you want to dedicate a set of nodes for exclusive use by
a particular set of users, you can add a taint to those nodes (say, 
`kubectl taint nodes nodename dedicated=groupName:NoSchedule`) and then add a corresponding
toleration to their pods (this would be done most easily by writing a custom
[admission controller](/docs/admin/admission-controllers/)).
The pods with the tolerations will then be allowed to use the tainted (dedicated) nodes as
well as any other nodes in the cluster. If you want to dedicate the nodes to them *and*
ensure they *only* use the dedicated nodes, then you should additionally add a label similar
to the taint to the same set of nodes (e.g. `dedicated=groupName`), and the admission
controller should additionally add a node affinity to require that the pods can only schedule
onto nodes labeled with `dedicated=groupName`.
-->
* **专用的 node**：如果您想要设置一些 node 为专用的，以让特定的用户才能使用，您可以给这些 node 添加一个 taint（比如说，`kubectl taint nodes nodename dedicated=groupName:NoSchedule`），然后添加一个对应的 toleration 到它们的 pod 上（这个通过编写一个自定义的 [准入控制器](/docs/admin/admission-controllers/) 会比较容易实现）。具有这些 toleration 的 pod 将被允许使用已添加 taint 的 node（专用的），同时也能使用集群中的其它 node。如果您想要让 node 只能被特定的 pod 使用 *并且* 保证这些 pod *只能* 使用这些专用的 node，那么您应该额外添加一个和 taint 类似的 label 到这些 node 集上（例如，`dedicated=groupName`），然后准入控制器也应该额外添加一个 node 亲和性以让 pod 只能调度到具有 `dedicated=groupName` 标签的 node 上。

<!--
* **nodes with special hardware**: In a cluster where a small subset of nodes have specialized
hardware (for example GPUs), it is desirable to keep pods that don't need the specialized
hardware off of those nodes, thus leaving room for later-arriving pods that do need the
specialized hardware. This can be done by tainting the nodes that have the specialized
hardware (e.g. `kubectl taint nodes nodename special=true:NoSchedule` or
`kubectl taint nodes nodename special=true:PreferNoSchedule`) and adding a corresponding
toleration to pods that use the special hardware. As in the dedicated nodes use case,
it is probably easiest to apply the tolerations using a custom
[admission controller](/docs/admin/admission-controllers/)).
For example, the admission controller could use
some characteristic(s) of the pod to determine that the pod should be allowed to use
the special nodes and hence the admission controller should add the toleration.
To ensure that the pods that need
the special hardware *only* schedule onto the nodes that have the special hardware, you will need some
additional mechanism, e.g. you could represent the special resource using
[opaque integer resources](/docs/concepts/configuration/manage-compute-resources-container/#opaque-integer-resources-alpha-feature)
and request it as a resource in the PodSpec, or you could label the nodes that have
the special hardware and use node affinity on the pods that need the hardware.
-->
* **具有特殊硬件的 node**：在一个集群中有一小部分 node 有专门的硬件（例如 GPU），理想情况下应该让不需要这些专门硬件的 pod 避开这些节点，这样才能为后续的需要专门硬件的 pod 留有充足的空间。可以通过给具有特殊硬件的 node 添加 taint（例如，`kubectl taint nodes nodename special=true:NoSchedule` 或者
`kubectl taint nodes nodename special=true:PreferNoSchedule`），然后给需要这些特殊硬件的 pod 添加一个对应的 toleration。就如上述专用的 node 示例，通过 [准入控制器](/docs/admin/admission-controllers/) 来使用 toleration 会比较容易。
例如，准入控制器可以使用 pod 的一些特性来确保 pod 能够使用这些特殊的 node，因此准入控制器应该添加 toleration。您需要一些额外的机制，来确保需要特殊硬件的 pod *只能* 被调度到具有特殊硬件的 node 上，例如，您可以使用 [不透明的整数资源](/docs/concepts/configuration/manage-compute-resources-container/#opaque-integer-resources-alpha-feature) 来表示这些特殊资源，然后在 PodSpec 中像其它资源一样进行请求；或者您也可以给具有特殊硬件的 node 添加标签，然后在需要这些硬件的 pod 上使用 node 亲和性。

<!--
* **per-pod-configurable eviction behavior when there are node problems (alpha feature)**,
which is described in the next section.
-->
将在下一章节中介绍 * **当 node 出现问题时 pod 的驱逐行为（alpha 特性）**

<!--
### Per-pod-configurable eviction behavior when there are node problems (alpha feature)
-->
### 当 node 出现问题时 pod 的驱逐行为（alpha 特性）

<!--
Earlier we mentioned the `NoExecute` taint effect, which affects pods that are already
running on the node as follows
-->
上述章节我们提到了 `NoExecute` taint 的效果，它将对正在运行的 pod 产生如下影响

<!--
 * pods that do not tolerate the taint are evicted immediately
 * pods that tolerate the taint without specifying `tolerationSeconds` in
   their toleration specification remain bound forever
 * pods that tolerate the taint with a specified `tolerationSeconds` remain
   bound for the specified amount of time
-->
 * 不能容忍对应 taint 的 pod 将立即被驱逐
 * 能够容忍对应 taint 但是没有在 toleration specification 中指定 `tolerationSeconds` 则继续保持在原节点上
 * 能够容忍对应 taint 并且指定 `tolerationSeconds` 则在原节点上保持指定的时间

<!--
The above behavior is a beta feature. In addition, Kubernetes 1.6 has alpha
support for representing node problems (currently only "node unreachable" and
"node not ready", corresponding to the NodeCondition "Ready" being "Unknown" or
"False" respectively) as taints. When the `TaintBasedEvictions` alpha feature
is enabled (you can do this by including `TaintBasedEvictions=true` in `--feature-gates`, such as
`--feature-gates=FooBar=true,TaintBasedEvictions=true`), the taints are automatically
added by the NodeController and the normal logic for evicting pods from nodes
based on the Ready NodeCondition is disabled.
(Note: To maintain the existing [rate limiting](/docs/concepts/architecture/nodes/)
behavior of pod evictions due to node problems, the system actually adds the taints
in a rate-limited way. This prevents massive pod evictions in scenarios such
as the master becoming partitioned from the nodes.)
This alpha feature, in combination with `tolerationSeconds`, allows a pod
to specify how long it should stay bound to a node that has one or both of these problems.
-->
上述行为是一个 beta 版本特性。另外，Kubernetes 1.6 版本为 "用 taint 来表达 node 问题（目前只有 "node unreachable" 和 "node not ready"，分别对应 NodeCondition 从 "Ready" 变为 "Unknown" 或者 "False"）" 提供了 alpha 支持。当 `TaintBasedEvictions` 这个 alpha 特性被启用后（您可以通过在 `--feature-gates` 中包含 `TaintBasedEvictions=true` 来实现，例如 `--feature-gates=FooBar=true,TaintBasedEvictions=true`），NodeController 将会自动添加 taint 并且禁用基于 Ready NodeCondition 的正常驱逐 pod 的流程。
（注意：为了维持现有的 [rate limiting](/docs/concepts/architecture/nodes/) 在 node 出现问题时驱逐 pod 的默认行为，系统实际上以 rate-limited 的方式添加 taint。这可以防止当 master 和 node 相互不可达时大量 pod 被驱逐的情况。）
这个 alpha 特性，结合 `tolerationSeconds`，允许 pod 指定在出现这些问题时它将要在 node 上停留多长时间。

<!--
For example, an application with a lot of local state might want to stay
bound to node for a long time in the event of network partition, in the hope
that the partition will recover and thus the pod eviction can be avoided.
The toleration the pod would use in that case would look like
-->
例如，一个拥有大量本地状态的应用程序可能希望在网络出现问题时能够在 node 上停留较长时间，以期待网络能够自动恢复从而避免 pod 被驱逐。
这种情况下 pod 的 toleration 将如下所示

```yaml
tolerations: 
- key: "node.alpha.kubernetes.io/unreachable"
  operator: "Exists"
  effect: "NoExecute"
  tolerationSeconds: 6000
```

<!--
(For the node not ready case, change the key to `node.alpha.kubernetes.io/notReady`.)
-->
（对于 node not ready 的情况，修改 key 为 `node.alpha.kubernetes.io/notReady`。）

<!--
Note that Kubernetes automatically adds a toleration for
`node.alpha.kubernetes.io/notReady` with `tolerationSeconds=300`
unless the pod configuration provided
by the user already has a toleration for `node.alpha.kubernetes.io/notReady`.
Likewise it adds a toleration for
`node.alpha.kubernetes.io/unreachable` with `tolerationSeconds=300`
unless the pod configuration provided
by the user already has a toleration for `node.alpha.kubernetes.io/unreachable`.
-->
请注意，Kubernetes 自动为 pod 添加 key 为 `node.alpha.kubernetes.io/notReady` 并且 `tolerationSeconds=300` 的 toleration，除非用户提供的 pod 配置中为 `node.alpha.kubernetes.io/notReady` 指定另外的 toleration。
同样地，Kubernetes 也自动为 pod 添加 key 为 `node.alpha.kubernetes.io/unreachable` 并且 `tolerationSeconds=300` 的 toleration，除非用户提供的 pod 配置中为 `node.alpha.kubernetes.io/unreachable` 指定另外的 toleration。

<!--
These automatically-added tolerations ensure that
the default pod behavior of remaining bound for 5 minutes after one of these
problems is detected is maintained.
The two default tolerations are added by the [DefaultTolerationSeconds
admission controller](https://git.k8s.io/kubernetes/plugin/pkg/admission/defaulttolerationseconds).
-->
这些自动添加的 toleration 确保在 node 出现这些问题后，为 pod 提供一个继续在 node 上停留5分钟的默认行为。
这两个默认的 toleration 是通过 [DefaultTolerationSeconds admission controller](https://git.k8s.io/kubernetes/plugin/pkg/admission/defaulttolerationseconds) 添加的。

<!--
[DaemonSet](/docs/concepts/workloads/controllers/daemonset/) pods are created with
`NoExecute` tolerations for `node.alpha.kubernetes.io/unreachable` and `node.alpha.kubernetes.io/notReady`
with no `tolerationSeconds`. This ensures that DaemonSet pods are never evicted due
to these problems, which matches the behavior when this feature is disabled.
-->
[DaemonSet](/docs/concepts/workloads/controllers/daemonset/) 的 pod 会添加两个 toleration：`node.alpha.kubernetes.io/unreachable` 和 `node.alpha.kubernetes.io/notReady`，两个 toleration 的 effect 都是 `NoExecute` 并且都不指定 `tolerationSeconds`。这确保在出现这些问题时，DaemonSet 的 pod 将永远不被驱逐，这也符合这个特性被禁用时的行为。
