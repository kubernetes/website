---
approvers:
- davidopp
- kevin-wangzefeng
- bsalamat
cn-approvers:
- linyouchong
title: Taint 和 Toleration
---

<!--
---
approvers:
- davidopp
- kevin-wangzefeng
- bsalamat
  title: Taints and Tolerations
---
-->

<!--
Node affinity, described [here](/docs/concepts/configuration/assign-pod-node/#node-affinity-beta-feature),
is a property of *pods* that *attracts* them to a set of nodes (either as a
preference or a hard requirement). Taints are the opposite -- they allow a
*node* to *repel* a set of pods.
-->
节点亲和性（详见[这里](/docs/concepts/configuration/assign-pod-node/#node-affinity-beta-feature)），是 *pod* 的一种属性（偏好或硬性要求），它使 *pod* 被吸引到一类特定的节点。Taint 则相反，它使 *节点* 能够 *排斥* 一类特定的 pod。

<!--
Taints and tolerations work together to ensure that pods are not scheduled
onto inappropriate nodes. One or more taints are applied to a node; this
marks that the node should not accept any pods that do not tolerate the taints.
Tolerations are applied to pods, and allow (but do not require) the pods to schedule
onto nodes with matching taints.
-->
Taint 和 toleration 相互配合，可以用来避免 pod 被分配到不合适的节点上。每个节点上都可以应用一个或多个 taint ，这表示对于那些不能容忍这些 taint 的 pod，是不会被该节点接受的。如果将 toleration 应用于 pod 上，则表示这些 pod 可以（但不要求）被调度到具有匹配 taint 的节点上。

* TOC
{:toc}

<!--

## Concepts

-->

## 概念

<!--
You add a taint to a node using [kubectl taint](/docs/user-guide/kubectl/{{page.version}}/#taint).
For example,
-->
您可以使用 [kubectl taint](/docs/user-guide/kubectl/{{page.version}}/#taint) 命令给一个节点增加一个 taint。比如，

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
给节点 `node1` 增加一个 taint，它的 key 是 `key`，value 是 `value`，effect 是 `NoSchedule`。这表示只有拥有和这个 taint 相匹配的 toleration 的 pod 才能够被分配到 `node1` 这个节点。您可以在 PodSpec 中定义 pod 的 toleration。下面两个 toleration 均与上面例子中使用 `kubectl taint` 命令创建的 taint 相匹配，因此如果一个 pod 拥有其中的任何一个 toleration 都能够被分配到 `node1` ：

```yaml
tolerations:
- key: "key"
  operator: "Equal"
  value: "value"
  effect: "NoSchedule"
```

```yaml
tolerations:
- key: "key"
  operator: "Exists"
  effect: "NoSchedule"
```

<!--
A toleration "matches" a taint if the keys are the same and the effects are the same, and:

- the `operator` is `Exists` (in which case no `value` should be specified), or
- the `operator` is `Equal` and the `value`s are equal

`Operator` defaults to `Equal` if not specified.
-->
一个 toleration 和一个 taint 相“匹配”是指它们有一样的 key 和 effect ，并且：

- 如果 `operator` 是 `Exists` （此时 toleration 不能指定 `value`），或者
- 如果 `operator` 是 `Equal` ，则它们的 `value` 应该相等

<!--
**NOTE:** There are two special cases:

- An empty `key` with operator `Exists` matches all keys, values and effects which means this
  will tolerate everything.
  -->

**注意：** 存在两种特殊情况：

- 如果一个 toleration 的 `key` 为空且 operator 为 `Exists` ，表示这个 toleration 与任意的 key 、 value 和 effect 都匹配，即这个 toleration 能容忍任意 taint。

```yaml
tolerations:
- operator: "Exists"
```

<!--

- An empty `effect` matches all effects with key `key`.
  -->
- 如果一个 toleration 的 `effect` 为空，则 `key` 值与之相同的相匹配 taint 的 `effect` 可以是任意值。

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
上述例子使用到的 `effect` 的一个值 `NoSchedule`，您也可以使用另外一个值 `PreferNoSchedule`。这是“优化”或“软”版本的 `NoSchedule`  ——系统会*尽量*避免将 pod 调度到存在其不能容忍 taint 的节点上，但这不是强制的。`effect` 的值还可以设置为 `NoExecute` ，下文会详细描述这个值。

<!--
You can put multiple taints on the same node and multiple tolerations on the same pod.
The way Kubernetes processes multiple taints and tolerations is like a filter: start
with all of a node's taints, then ignore the ones for which the pod has a matching toleration; the
remaining un-ignored taints have the indicated effects on the pod. In particular,
-->
您可以给一个节点添加多个 taint ，也可以给一个 pod 添加多个 toleration。Kubernetes 处理多个 taint 和 toleration 的过程就像一个过滤器：从一个节点的所有 taint 开始遍历，过滤掉那些 pod 中存在与之相匹配的 toleration 的 taint。余下未被过滤的 taint 的 effect 值决定了 pod 是否会被分配到该节点，特别是以下情况：

<!--

- if there is at least one un-ignored taint with effect `NoSchedule` then Kubernetes will not schedule
  the pod onto that node
- if there is no un-ignored taint with effect `NoSchedule` but there is at least one un-ignored taint with
  effect `PreferNoSchedule` then Kubernetes will *try* to not schedule the pod onto the node
- if there is at least one un-ignored taint with effect `NoExecute` then the pod will be evicted from
  the node (if it is already running on the node), and will not be
  scheduled onto the node (if it is not yet running on the node).
  -->
- 如果未被过滤的 taint 中存在一个以上 effect 值为 `NoSchedule` 的 taint，则 Kubernetes 不会将 pod 分配到该节点。
- 如果未被过滤的 taint 中不存在 effect 值为 `NoSchedule` 的 taint，但是存在 effect 值为 `PreferNoSchedule` 的 taint，则 Kubernetes 会*尝试*将 pod 分配到该节点。
- 如果未被过滤的 taint 中存在一个以上 effect 值为 `NoExecute` 的 taint，则 Kubernetes 不会将 pod 分配到该节点（如果 pod 还未在节点上运行），或者将 pod 从该节点驱逐（如果 pod 已经在节点上运行）。

<!--
For example, imagine you taint a node like this
-->
例如，假设您给一个节点添加了如下的 taint

```shell
kubectl taint nodes node1 key1=value1:NoSchedule
kubectl taint nodes node1 key1=value1:NoExecute
kubectl taint nodes node1 key2=value2:NoSchedule
```

<!--
And a pod has two tolerations:
-->
然后存在一个 pod，它有两个 toleration

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
在这个例子中，上述 pod 不会被分配到上述节点，因为其没有 toleration 和第三个 taint 相匹配。但是如果在给节点添加 上述 taint 之前，该 pod 已经在上述节点运行，那么它还可以继续运行在该节点上，因为第三个 taint 是三个 taint 中唯一不能被这个 pod 容忍的。

<!--
Normally, if a taint with effect `NoExecute` is added to a node, then any pods that do
not tolerate the taint will be evicted immediately, and any pods that do tolerate the
taint will never be evicted. However, a toleration with `NoExecute` effect can specify
an optional `tolerationSeconds` field that dictates how long the pod will stay bound
to the node after the taint is added. For example,
-->
通常情况下，如果给一个节点添加了一个 effect 值为 `NoExecute` 的 taint，则任何不能忍受这个 taint 的 pod 都会马上被驱逐，任何可以忍受这个 taint 的 pod 都不会被驱逐。但是，如果 pod 存在一个 effect 值为 `NoExecute` 的 toleration 指定了可选属性 `tolerationSeconds` 的值，则表示在给节点添加了上述 taint 之后，pod 还能继续在节点上运行的时间。例如，

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
这表示如果这个 pod 正在运行，然后一个匹配的 taint 被添加到其所在的节点，那么 pod 还将继续在节点上运行 3600 秒，然后被驱逐。如果在此之前上述 taint 被删除了，则 pod 不会被驱逐。

<!--

## Example Use Cases

-->

## 使用例子

<!--
Taints and tolerations are a flexible way to steer pods *away* from nodes or evict
pods that shouldn't be running. A few of the use cases are
-->
通过 taint 和 toleration ，可以灵活地让 pod *避开*某些节点或者将 pod 从某些节点驱逐。下面是几个使用例子：

<!--

- **Dedicated Nodes**: If you want to dedicate a set of nodes for exclusive use by
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
- **专用节点**：如果您想将某些节点专门分配给特定的一组用户使用，您可以给这些节点添加一个 taint（即，
  `kubectl taint nodes nodename dedicated=groupName:NoSchedule`），然后给这组用户的 pod 添加一个相对应的 toleration（通过编写一个自定义的[admission controller](/docs/admin/admission-controllers/)，很容易就能做到）。拥有上述 toleration 的 pod 就能够被分配到上述专用节点，同时也能够被分配到集群中的其它节点。如果您希望这些 pod 只能被分配到上述专用节点，那么您还需要给这些专用节点另外添加一个和上述 taint 类似的 label （例如：`dedicated=groupName`），同时 还要在上述 admission controller 中给 pod 增加节点亲和性要求上述 pod 只能被分配到添加了 `dedicated=groupName` 标签的节点上。

<!--

- **Nodes with Special Hardware**: In a cluster where a small subset of nodes have specialized
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
- **配备了特殊硬件的节点**：在部分节点配备了特殊硬件（比如 GPU）的集群中，我们希望不使用这类硬件的 pod 不要被分配到这些特殊节点，以便为后继需要这类硬件的 pod 保留资源。要达到这个目的，可以先给配备了特殊硬件的节点添加 taint（例如 `kubectl taint nodes nodename special=true:NoSchedule` or `kubectl taint nodes nodename special=true:PreferNoSchedule`)，然后给使用了这类特殊硬件的 pod 添加一个相匹配的 toleration。和专用节点的例子类似，添加这个 toleration 的最简单的方法是使用自定义 [admission controller](/docs/admin/admission-controllers/)。比如，admission controller 可以从 pod 的一些特点判断出该 pod 应该被允许分配到一些特殊节点，然后 admission controller 就给 pod 添加对应的 toleration。为了保证使用了特殊硬件的 pod *只*被分配到配备了特殊硬件的节点，您还需要做一些额外的工作，比如，您可以使用[opaque integer resources](/docs/concepts/configuration/manage-compute-resources-container/#opaque-integer-resources-alpha-feature)表示这类特殊资源，然后在 PodSpec 中申请使用它；或者您也可以给配备了特殊硬件的节点添加 label，然后给需要特殊硬件的 pod 配置节点亲和性。

<!--

- **Taint based Evictions (alpha feature)**: A per-pod-configurable eviction behavior
  when there are node problems, which is described in the next section.
  -->
- **基于 taint 的驱逐 （alpha 特性）**: 这是在每个 pod 中配置的在节点出现问题时的驱逐行为，接下来的章节会描述这个特性

<!--

## Taint based Evictions

-->

## 基于 taint 的驱逐

<!--
Earlier we mentioned the `NoExecute` taint effect, which affects pods that are already
running on the node as follows

- pods that do not tolerate the taint are evicted immediately
- pods that tolerate the taint without specifying `tolerationSeconds` in
  their toleration specification remain bound forever
- pods that tolerate the taint with a specified `tolerationSeconds` remain
  bound for the specified amount of time
  -->
  前文我们提到过 taint 的 effect 值 `NoExecute`  ，它会影响已经在节点上运行的 pod
- 如果 pod 不能忍受effect 值为 `NoExecute` 的 taint，那么 pod 将马上被驱逐
- 如果 pod 能够忍受effect 值为 `NoExecute` 的 taint，但是在 toleration 定义中没有指定 `tolerationSeconds`，则 pod 还会一直在这个节点上运行。
- 如果 pod 能够忍受effect 值为 `NoExecute` 的 taint，而且指定了 `tolerationSeconds`，则 pod 还能在这个节点上继续运行这个指定的时间长度。

<!--
The above behavior is a beta feature. In addition, Kubernetes 1.6 has alpha
support for representing node problems. In other words, the node controller
automatically taints a node when certain condition is true. The built-in taints
currently include:

- `node.kubernetes.io/not-ready`: Node is not ready. This corresponds to
  the NodeCondition `Ready` being "`False`".
- `node.alpha.kubernetes.io/unreachable`: Node is unreachable from the node
  controller. This corresponds to the NodeCondition `Ready` being "`Unknown`".
- `node.kubernetes.io/out-of-disk`: Node becomes out of disk.
- `node.kubernetes.io/memory-pressure`: Node has memory pressure.
- `node.kubernetes.io/disk-pressure`: Node has disk pressure.
- `node.kubernetes.io/network-unavailable`: Node's network is unavailable.
- `node.cloudprovider.kubernetes.io/uninitialized`: When kubelet is started
  with "external" cloud provider, it sets this taint on a node to mark it
  as unusable. When a controller from the cloud-controller-manager initializes
  this node, kubelet removes this taint.
  -->
  上述特性行为目前处于 beta 阶段。此外，Kubernetes 1.6 已经支持（alpha阶段）节点问题的表示。换句话说，当某种条件为真时，node controller会自动给节点添加一个 taint。当前内置的 taint 包括：
- `node.kubernetes.io/not-ready`：节点未准备好。这相当于节点状态 `Ready` 的值为 "`False`"。
- `node.alpha.kubernetes.io/unreachable`：node controller 访问不到节点. 这相当于节点状态 `Ready` 的值为 "`Unknown`"。
- `node.kubernetes.io/out-of-disk`：节点磁盘耗尽。
- `node.kubernetes.io/memory-pressure`：节点存在内存压力。
- `node.kubernetes.io/disk-pressure`：节点存在磁盘压力。
- `node.kubernetes.io/network-unavailable`：节点网络不可用。
- `node.cloudprovider.kubernetes.io/uninitialized`：如果 kubelet 启动时指定了一个 "外部" cloud provider，它将给当前节点添加一个 taint 将其标志为不可用。在 cloud-controller-manager 的一个 controller 初始化这个节点后，kubelet 将删除这个 taint。

<!--
When the `TaintBasedEvictions` alpha feature is enabled (you can do this by
including `TaintBasedEvictions=true` in `--feature-gates` for Kubernetes controller manager,
such as `--feature-gates=FooBar=true,TaintBasedEvictions=true`), the taints are automatically
added by the NodeController (or kubelet) and the normal logic for evicting pods from nodes
based on the Ready NodeCondition is disabled.
(Note: To maintain the existing [rate limiting](/docs/concepts/architecture/nodes/)
behavior of pod evictions due to node problems, the system actually adds the taints
in a rate-limited way. This prevents massive pod evictions in scenarios such
as the master becoming partitioned from the nodes.)
This alpha feature, in combination with `tolerationSeconds`, allows a pod
to specify how long it should stay bound to a node that has one or both of these problems.
-->
在启用了 `TaintBasedEvictions` 这个 alpha 功能特性后（在 Kubernetes controller manager 的 `--feature-gates` 参数中包含`TaintBasedEvictions=true` 开启这个功能特性，例如：`--feature-gates=FooBar=true,TaintBasedEvictions=true`），NodeController (或 kubelet)会自动给节点添加这类 taint，上述基于节点状态 Ready 对 pod 进行驱逐的逻辑会被禁用。
（注意：为了保证由于节点问题引起的 pod 驱逐[rate limiting](/docs/concepts/architecture/nodes/)行为正常，系统实际上会以 rate-limited 的方式添加 taint。在像 master 和 node 通讯中断等场景下，这避免了 pod 被大量驱逐。使用这个 alpha 功能特性，结合 `tolerationSeconds` ，pod 就可以指定当节点出现一个或全部上述问题时还将在这个节点上运行多长的时间。

<!--
For example, an application with a lot of local state might want to stay
bound to node for a long time in the event of network partition, in the hope
that the partition will recover and thus the pod eviction can be avoided.
The toleration the pod would use in that case would look like
-->
比如，一个使用了很多本地状态的应用程序在网络断开时，仍然希望停留在当前节点上运行一段较长的时间，愿意等待网络恢复以避免被驱逐。在这种情况下，pod 的 toleration 可能是下面这样的：

```yaml
tolerations:
- key: "node.alpha.kubernetes.io/unreachable"
  operator: "Exists"
  effect: "NoExecute"
  tolerationSeconds: 6000
```

<!--
Note that Kubernetes automatically adds a toleration for
`node.kubernetes.io/not-ready` with `tolerationSeconds=300`
unless the pod configuration provided
by the user already has a toleration for `node.kubernetes.io/not-ready`.
Likewise it adds a toleration for
`node.alpha.kubernetes.io/unreachable` with `tolerationSeconds=300`
unless the pod configuration provided
by the user already has a toleration for `node.alpha.kubernetes.io/unreachable`.
-->
注意，Kubernetes 会自动给 pod 添加一个 key 为 `node.kubernetes.io/not-ready` 的 toleration 并配置 `tolerationSeconds=300`，除非用户提供的 pod 配置中已经已存在了 key 为 `node.kubernetes.io/not-ready` 的 toleration。同样，Kubernetes 会给 pod 添加一个 key 为 `node.kubernetes.io/unreachable` 的 toleration 并配置 `tolerationSeconds=300`，除非用户提供的 pod 配置中已经已存在了 key 为 `node.kubernetes.io/unreachable` 的 toleration。

<!--
These automatically-added tolerations ensure that
the default pod behavior of remaining bound for 5 minutes after one of these
problems is detected is maintained.
The two default tolerations are added by the [DefaultTolerationSeconds
admission controller](https://git.k8s.io/kubernetes/plugin/pkg/admission/defaulttolerationseconds).
-->
这种自动添加 toleration 机制保证了在其中一种问题被检测到时 pod 默认能够继续停留在当前节点运行 5 分钟。这两个默认 toleration 是由 [DefaultTolerationSeconds
admission controller](https://git.k8s.io/kubernetes/plugin/pkg/admission/defaulttolerationseconds)添加的。

<!--
[DaemonSet](/docs/concepts/workloads/controllers/daemonset/) pods are created with
`NoExecute` tolerations for the following taints with no `tolerationSeconds`:

- `node.alpha.kubernetes.io/unreachable`
- `node.kubernetes.io/not-ready`

This ensures that DaemonSet pods are never evicted due to these problems,
which matches the behavior when this feature is disabled.
-->
[DaemonSet](/docs/concepts/workloads/controllers/daemonset/) 中的 pod 被创建时，针对以下 taint 自动添加的 `NoExecute` 的 toleration 将不会指定 `tolerationSeconds`：

- `node.alpha.kubernetes.io/unreachable`
- `node.kubernetes.io/not-ready`

这保证了出现上述问题时 DaemonSet 中的 pod 永远不会被驱逐，这和 `TaintBasedEvictions` 这个特性被禁用后的行为是一样的。

<!--

## Taint Nodes by Condition

-->

## 基于节点状态添加 taint

<!--
Version 1.8 introduces an alpha feature that causes the node controller to create taints corresponding to
Node conditions. When this feature is enabled (you can do this by including `TaintNodesByCondition=true` in the `--feature-gates` command line flag to the scheduler, such as
`--feature-gates=FooBar=true,TaintNodesByCondition=true`), the scheduler does not check Node conditions; instead the scheduler checks taints. This assures that Node conditions don't affect what's scheduled onto the Node. The user can choose to ignore some of the Node's problems (represented as Node conditions) by adding appropriate Pod tolerations.
-->
1.8 版本引入了一个 alpha 功能特性，该特性使 node controller 根据节点状态创建相应的 taint。当启用了该功能特性（您可以通过在 scheduler 的命令行参数 `--feature-gates` 中包含 `TaintNodesByCondition=true` 来开启这个功能，例如 `--feature-gates=FooBar=true,TaintNodesByCondition=true`），scheduler 不会检查节点状态；scheduler 检查的是 taint。这保证了节点状态不会影响到哪些 pod 会被分配到节点。用户可以通过给 pod 添加适当的 toleration 来忽略节点的一些故障（表示为节点状态）。

<!--
To make sure that turning on this feature doesn't break DaemonSets, starting in version 1.8, the  DaemonSet controller automatically adds the following `NoSchedule` tolerations to all daemons:

- `node.kubernetes.io/memory-pressure`
- `node.kubernetes.io/disk-pressure`
- `node.kubernetes.io/out-of-disk` (*only for critical pods*)
  -->
为了保证开启这个功能特性不会对 DaemonSet 造成破坏，从 1.8 版本开始，DaemonSet controller 会自动地给所有的 daemon 添加如下 effect 为 `NoSchedule` 的 toleration：
- `node.kubernetes.io/memory-pressure`
- `node.kubernetes.io/disk-pressure`
- `node.kubernetes.io/out-of-disk` (*只适合 critical pod*)

<!--
The above settings ensure backward compatibility, but we understand they may not fit all user's needs, which is why
cluster admin may choose to add arbitrary tolerations to DaemonSets.
-->
上述设置确保了向后兼容，但我们需要明白它们可能不符合所有用户的需求，这就是为什么集群管理员还可以选择自由的向 DaemonSet 添加 toleration。
