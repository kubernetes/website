---
title: 污点和容忍度
content_type: concept
weight: 40
---

<!-- overview -->
<!--
Node affinity, described [here](/docs/concepts/configuration/assign-pod-node/#node-affinity-beta-feature),
is a property of {{< glossary_tooltip text="Pods" term_id="pod" >}} that *attracts* them to
a set of {{< glossary_tooltip text="nodes" term_id="node" >}} (either as a preference or a 
hard requirement). Taints are the opposite -they allow a node to repel a set of pods.
-->
节点亲和性（详见[这里](/zh/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)）
是 {{< glossary_tooltip text="Pod" term_id="pod" >}} 的一种属性，它使 Pod
被吸引到一类特定的{{< glossary_tooltip text="节点" term_id="node" >}}。
这可能出于一种偏好，也可能是硬性要求。
Taint（污点）则相反，它使节点能够排斥一类特定的 Pod。

<!--
_Tolerations_ are applied to pods, and allow (but do not require) the pods to schedule
onto nodes with matching taints.

Taints and tolerations work together to ensure that pods are not scheduled
onto inappropriate nodes. One or more taints are applied to a node; this
marks that the node should not accept any pods that do not tolerate the taints.
-->
容忍度（Tolerations）是应用于 Pod 上的，允许（但并不要求）Pod
调度到带有与之匹配的污点的节点上。

污点和容忍度（Toleration）相互配合，可以用来避免 Pod 被分配到不合适的节点上。
每个节点上都可以应用一个或多个污点，这表示对于那些不能容忍这些污点的 Pod，是不会被该节点接受的。

<!-- body -->

<!--
## Concepts
-->
## 概念

<!--
You add a taint to a node using [kubectl taint](/docs/reference/generated/kubectl/kubectl-commands#taint).
For example,
-->
您可以使用命令 [kubectl taint](/docs/reference/generated/kubectl/kubectl-commands#taint) 给节点增加一个污点。比如，

```shell
kubectl taint nodes node1 key1=value1:NoSchedule
```

<!--
places a taint on node `node1`. The taint has key `key1`, value `value1`, and taint effect `NoSchedule`.
This means that no pod will be able to schedule onto `node1` unless it has a matching toleration.

```shell
kubectl taint nodes node1 key:NoSchedule
```

To remove the taint added by the command above, you can run:
```shell
kubectl taint nodes node1 key1=value1:NoSchedule-
```
-->
给节点 `node1` 增加一个污点，它的键名是 `key1`，键值是 `value1`，效果是 `NoSchedule`。
这表示只有拥有和这个污点相匹配的容忍度的 Pod 才能够被分配到 `node1` 这个节点。

若要移除上述命令所添加的污点，你可以执行：

```shell
kubectl taint nodes node1 key:NoSchedule-
```

<!--
You specify a toleration for a pod in the PodSpec. Both of the following tolerations "match" the
taint created by the `kubectl taint` line above, and thus a pod with either toleration would be able
to schedule onto `node1`:
-->
您可以在 PodSpec 中定义 Pod 的容忍度。
下面两个容忍度均与上面例子中使用 `kubectl taint` 命令创建的污点相匹配，
因此如果一个 Pod 拥有其中的任何一个容忍度都能够被分配到 `node1` ：

```yaml
tolerations:
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoSchedule"
```

```yaml
tolerations:
- key: "key1"
  operator: "Exists"
  effect: "NoSchedule"
```

<!--
Here’s an example of a pod that uses tolerations:
-->
这里是一个使用了容忍度的 Pod：

{{< codenew file="pods/pod-with-toleration.yaml" >}}

<!--
The default value for `operator` is `Equal`.
-->
`operator` 的默认值是 `Equal`。

<!--
A toleration "matches" a taint if the keys are the same and the effects are the same, and:

* the `operator` is `Exists` (in which case no `value` should be specified), or
* the `operator` is `Equal` and the `value`s are equal
-->
一个容忍度和一个污点相“匹配”是指它们有一样的键名和效果，并且：

* 如果 `operator` 是 `Exists` （此时容忍度不能指定 `value`），或者
* 如果 `operator` 是 `Equal` ，则它们的 `value` 应该相等

<!--
There are two special cases:

An empty `key` with operator `Exists` matches all keys, values and effects which means this
will tolerate everything.

An empty `effect` matches all effects with key `key1`.
-->
{{< note >}}
存在两种特殊情况：

如果一个容忍度的 `key` 为空且 operator 为 `Exists`，
表示这个容忍度与任意的 key 、value 和 effect 都匹配，即这个容忍度能容忍任意 taint。

如果 `effect` 为空，则可以与所有键名 `key` 的效果相匹配。
{{< /note >}}

<!--
The above example used `effect` of `NoSchedule`. Alternatively, you can use `effect` of `PreferNoSchedule`.
This is a "preference" or "soft" version of `NoSchedule` - the system will *try* to avoid placing a
pod that does not tolerate the taint on the node, but it is not required. The third kind of `effect` is
`NoExecute`, described later.
-->
上述例子使用到的 `effect` 的一个值 `NoSchedule`，您也可以使用另外一个值 `PreferNoSchedule`。
这是“优化”或“软”版本的 `NoSchedule` —— 系统会 *尽量* 避免将 Pod 调度到存在其不能容忍污点的节点上，
但这不是强制的。`effect` 的值还可以设置为 `NoExecute`，下文会详细描述这个值。

<!--
You can put multiple taints on the same node and multiple tolerations on the same pod.
The way Kubernetes processes multiple taints and tolerations is like a filter: start
with all of a node's taints, then ignore the ones for which the pod has a matching toleration; the
remaining un-ignored taints have the indicated effects on the pod. In particular,
-->
您可以给一个节点添加多个污点，也可以给一个 Pod 添加多个容忍度设置。
Kubernetes 处理多个污点和容忍度的过程就像一个过滤器：从一个节点的所有污点开始遍历，
过滤掉那些 Pod 中存在与之相匹配的容忍度的污点。余下未被过滤的污点的 effect 值决定了
Pod 是否会被分配到该节点，特别是以下情况：

<!--

* if there is at least one un-ignored taint with effect `NoSchedule` then Kubernetes will not schedule
the pod onto that node
* if there is no un-ignored taint with effect `NoSchedule` but there is at least one un-ignored taint with
effect `PreferNoSchedule` then Kubernetes will *try* to not schedule the pod onto the node
* if there is at least one un-ignored taint with effect `NoExecute` then the pod will be evicted from
the node (if it is already running on the node), and will not be
scheduled onto the node (if it is not yet running on the node).
-->
* 如果未被过滤的污点中存在至少一个 effect 值为 `NoSchedule` 的污点，
  则 Kubernetes 不会将 Pod 分配到该节点。
* 如果未被过滤的污点中不存在 effect 值为 `NoSchedule` 的污点，
  但是存在 effect 值为 `PreferNoSchedule` 的污点，
  则 Kubernetes 会 *尝试* 不将 Pod 分配到该节点。
* 如果未被过滤的污点中存在至少一个 effect 值为 `NoExecute` 的污点，
  则 Kubernetes 不会将 Pod 分配到该节点（如果 Pod 还未在节点上运行），
  或者将 Pod 从该节点驱逐（如果 Pod 已经在节点上运行）。

<!--
For example, imagine you taint a node like this
-->
例如，假设您给一个节点添加了如下污点

```shell
kubectl taint nodes node1 key1=value1:NoSchedule
kubectl taint nodes node1 key1=value1:NoExecute
kubectl taint nodes node1 key2=value2:NoSchedule
```

<!--
And a pod has two tolerations:
-->
假定有一个 Pod，它有两个容忍度：

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
在这种情况下，上述 Pod 不会被分配到上述节点，因为其没有容忍度和第三个污点相匹配。
但是如果在给节点添加上述污点之前，该 Pod 已经在上述节点运行，
那么它还可以继续运行在该节点上，因为第三个污点是三个污点中唯一不能被这个 Pod 容忍的。

<!--
Normally, if a taint with effect `NoExecute` is added to a node, then any pods that do
not tolerate the taint will be evicted immediately, and any pods that do tolerate the
taint will never be evicted. However, a toleration with `NoExecute` effect can specify
an optional `tolerationSeconds` field that dictates how long the pod will stay bound
to the node after the taint is added. For example,
-->
通常情况下，如果给一个节点添加了一个 effect 值为 `NoExecute` 的污点，
则任何不能忍受这个污点的 Pod 都会马上被驱逐，
任何可以忍受这个污点的 Pod 都不会被驱逐。
但是，如果 Pod 存在一个 effect 值为 `NoExecute` 的容忍度指定了可选属性
`tolerationSeconds` 的值，则表示在给节点添加了上述污点之后，
Pod 还能继续在节点上运行的时间。例如，

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
这表示如果这个 Pod 正在运行，同时一个匹配的污点被添加到其所在的节点，
那么 Pod 还将继续在节点上运行 3600 秒，然后被驱逐。
如果在此之前上述污点被删除了，则 Pod 不会被驱逐。

<!--
## Example Use Cases
-->
## 使用例子

<!--
Taints and tolerations are a flexible way to steer pods *away* from nodes or evict
pods that shouldn't be running. A few of the use cases are
-->
通过污点和容忍度，可以灵活地让 Pod *避开* 某些节点或者将 Pod 从某些节点驱逐。下面是几个使用例子：

<!--
* **Dedicated Nodes**: If you want to dedicate a set of nodes for exclusive use by
a particular set of users, you can add a taint to those nodes (say,
`kubectl taint nodes nodename dedicated=groupName:NoSchedule`) and then add a corresponding
toleration to their pods (this would be done most easily by writing a custom
[admission controller](/docs/reference/access-authn-authz/admission-controllers/)).
The pods with the tolerations will then be allowed to use the tainted (dedicated) nodes as
well as any other nodes in the cluster. If you want to dedicate the nodes to them *and*
ensure they *only* use the dedicated nodes, then you should additionally add a label similar
to the taint to the same set of nodes (e.g. `dedicated=groupName`), and the admission
controller should additionally add a node affinity to require that the pods can only schedule
onto nodes labeled with `dedicated=groupName`.
-->
* **专用节点**：如果您想将某些节点专门分配给特定的一组用户使用，您可以给这些节点添加一个污点（即，
  `kubectl taint nodes nodename dedicated=groupName:NoSchedule`），
  然后给这组用户的 Pod 添加一个相对应的 toleration（通过编写一个自定义的
  [准入控制器](/zh/docs/reference/access-authn-authz/admission-controllers/)，很容易就能做到）。
  拥有上述容忍度的 Pod 就能够被分配到上述专用节点，同时也能够被分配到集群中的其它节点。
  如果您希望这些 Pod 只能被分配到上述专用节点，那么您还需要给这些专用节点另外添加一个和上述
 污点类似的 label （例如：`dedicated=groupName`），同时 还要在上述准入控制器中给 Pod
  增加节点亲和性要求上述 Pod 只能被分配到添加了 `dedicated=groupName` 标签的节点上。

<!--
* **Nodes with Special Hardware**: In a cluster where a small subset of nodes have specialized
hardware (for example GPUs), it is desirable to keep pods that don't need the specialized
hardware off of those nodes, thus leaving room for later-arriving pods that do need the
specialized hardware. This can be done by tainting the nodes that have the specialized
hardware (e.g. `kubectl taint nodes nodename special=true:NoSchedule` or
`kubectl taint nodes nodename special=true:PreferNoSchedule`) and adding a corresponding
toleration to pods that use the special hardware. As in the dedicated nodes use case,
it is probably easiest to apply the tolerations using a custom
[admission controller](/docs/reference/access-authn-authz/admission-controllers/).
For example, it is recommended to use [Extended
Resources](/docs/concepts/configuration/manage-compute-resources-container/#extended-resources)
to represent the special hardware, taint your special hardware nodes with the
extended resource name and run the
[ExtendedResourceToleration](/docs/reference/access-authn-authz/admission-controllers/#extendedresourcetoleration)
admission controller. Now, because the nodes are tainted, no pods without the
toleration will schedule on them. But when you submit a pod that requests the
extended resource, the `ExtendedResourceToleration` admission controller will
automatically add the correct toleration to the pod and that pod will schedule
on the special hardware nodes. This will make sure that these special hardware
nodes are dedicated for pods requesting such hardware and you don't have to
manually add tolerations to your pods.
-->
* **配备了特殊硬件的节点**：在部分节点配备了特殊硬件（比如 GPU）的集群中，
  我们希望不需要这类硬件的 Pod 不要被分配到这些特殊节点，以便为后继需要这类硬件的 Pod 保留资源。
  要达到这个目的，可以先给配备了特殊硬件的节点添加 taint
  （例如 `kubectl taint nodes nodename special=true:NoSchedule` 或
  `kubectl taint nodes nodename special=true:PreferNoSchedule`)，
  然后给使用了这类特殊硬件的 Pod 添加一个相匹配的 toleration。
  和专用节点的例子类似，添加这个容忍度的最简单的方法是使用自定义
  [准入控制器](/zh/docs/reference/access-authn-authz/admission-controllers/)。
  比如，我们推荐使用[扩展资源](/zh/docs/concepts/configuration/manage-resources-containers/#extended-resources)
  来表示特殊硬件，给配置了特殊硬件的节点添加污点时包含扩展资源名称，
  然后运行一个 [ExtendedResourceToleration](/zh/docs/reference/access-authn-authz/admission-controllers/#extendedresourcetoleration)
  准入控制器。此时，因为节点已经被设置污点了，没有对应容忍度的 Pod
  会被调度到这些节点。但当你创建一个使用了扩展资源的 Pod 时，
  `ExtendedResourceToleration` 准入控制器会自动给 Pod 加上正确的容忍度，
  这样 Pod 就会被自动调度到这些配置了特殊硬件件的节点上。
  这样就能够确保这些配置了特殊硬件的节点专门用于运行需要使用这些硬件的 Pod，
  并且您无需手动给这些 Pod 添加容忍度。

<!--
* **Taint based Evictions**: A per-pod-configurable eviction behavior
when there are node problems, which is described in the next section.
-->
* **基于污点的驱逐**: 这是在每个 Pod 中配置的在节点出现问题时的驱逐行为，接下来的章节会描述这个特性。

<!--
## Taint based Evictions
-->
## 基于污点的驱逐  {#taint-based-evictions}

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

<!--
The `NoExecute` taint effect, which affects pods that are already
running on the node as follows

 * pods that do not tolerate the taint are evicted immediately
 * pods that tolerate the taint without specifying `tolerationSeconds` in
   their toleration specification remain bound forever
 * pods that tolerate the taint with a specified `tolerationSeconds` remain
   bound for the specified amount of time
-->
前文提到过污点的 effect 值 `NoExecute`会影响已经在节点上运行的 Pod

 * 如果 Pod 不能忍受 effect 值为 `NoExecute` 的污点，那么 Pod 将马上被驱逐
 * 如果 Pod 能够忍受 effect 值为 `NoExecute` 的污点，但是在容忍度定义中没有指定
   `tolerationSeconds`，则 Pod 还会一直在这个节点上运行。
 * 如果 Pod 能够忍受 effect 值为 `NoExecute` 的污点，而且指定了 `tolerationSeconds`，
   则 Pod 还能在这个节点上继续运行这个指定的时间长度。

<!--
The node controller automatically taints a node when certain conditions are
true. The following taints are built in:

 * `node.kubernetes.io/not-ready`: Node is not ready. This corresponds to
   the NodeCondition `Ready` being "`False`".
 * `node.kubernetes.io/unreachable`: Node is unreachable from the node
   controller. This corresponds to the NodeCondition `Ready` being "`Unknown`".
 * `node.kubernetes.io/out-of-disk`: Node becomes out of disk.
 * `node.kubernetes.io/memory-pressure`: Node has memory pressure.
 * `node.kubernetes.io/disk-pressure`: Node has disk pressure.
 * `node.kubernetes.io/network-unavailable`: Node's network is unavailable.
 * `node.kubernetes.io/unschedulable`: Node is unschedulable.
 * `node.cloudprovider.kubernetes.io/uninitialized`: When the kubelet is started
    with "external" cloud provider, this taint is set on a node to mark it
    as unusable. After a controller from the cloud-controller-manager initializes
    this node, the kubelet removes this taint.
  -->
当某种条件为真时，节点控制器会自动给节点添加一个污点。当前内置的污点包括：

 * `node.kubernetes.io/not-ready`：节点未准备好。这相当于节点状态 `Ready` 的值为 "`False`"。
 * `node.kubernetes.io/unreachable`：节点控制器访问不到节点. 这相当于节点状态 `Ready` 的值为 "`Unknown`"。
 * `node.kubernetes.io/out-of-disk`：节点磁盘耗尽。
 * `node.kubernetes.io/memory-pressure`：节点存在内存压力。
 * `node.kubernetes.io/disk-pressure`：节点存在磁盘压力。
 * `node.kubernetes.io/network-unavailable`：节点网络不可用。
 * `node.kubernetes.io/unschedulable`: 节点不可调度。
 * `node.cloudprovider.kubernetes.io/uninitialized`：如果 kubelet 启动时指定了一个 "外部" 云平台驱动，
   它将给当前节点添加一个污点将其标志为不可用。在 cloud-controller-manager
   的一个控制器初始化这个节点后，kubelet 将删除这个污点。

<!--
In case a node is to be evicted, the node controller or the kubelet adds relevant taints
with `NoExecute` effect. If the fault condition returns to normal the kubelet or node
controller can remove the relevant taint(s).
-->
在节点被驱逐时，节点控制器或者 kubelet 会添加带有 `NoExecute` 效应的相关污点。
如果异常状态恢复正常，kubelet 或节点控制器能够移除相关的污点。

<!--
To maintain the existing [rate limiting](/docs/concepts/architecture/nodes/)
behavior of pod evictions due to node problems, the system actually adds the taints
in a rate-limited way. This prevents massive pod evictions in scenarios such
as the master becoming partitioned from the nodes.
-->
{{< note >}}
为了保证由于节点问题引起的 Pod 驱逐
[速率限制](/zh/docs/concepts/architecture/nodes/)行为正常，
系统实际上会以限定速率的方式添加污点。在像主控节点与工作节点间通信中断等场景下，
这样做可以避免 Pod 被大量驱逐。
{{< /note >}}

<!--
This feature, in combination with `tolerationSeconds`, allows a pod
to specify how long it should stay bound to a node that has one or both of these problems.
-->
使用这个功能特性，结合 `tolerationSeconds`，Pod 就可以指定当节点出现一个
或全部上述问题时还将在这个节点上运行多长的时间。

<!--
For example, an application with a lot of local state might want to stay
bound to node for a long time in the event of network partition, in the hope
that the partition will recover and thus the pod eviction can be avoided.
The toleration the pod would use in that case would look like
-->
比如，一个使用了很多本地状态的应用程序在网络断开时，仍然希望停留在当前节点上运行一段较长的时间，
愿意等待网络恢复以避免被驱逐。在这种情况下，Pod 的容忍度可能是下面这样的：

```yaml
tolerations:
- key: "node.kubernetes.io/unreachable"
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
`node.kubernetes.io/unreachable` with `tolerationSeconds=300`
unless the pod configuration provided
by the user already has a toleration for `node.kubernetes.io/unreachable`.
-->

{{< note >}}
Kubernetes 会自动给 Pod 添加一个 key 为 `node.kubernetes.io/not-ready` 的容忍度
并配置 `tolerationSeconds=300`，除非用户提供的 Pod 配置中已经已存在了 key 为 
`node.kubernetes.io/not-ready` 的容忍度。

同样，Kubernetes 会给 Pod 添加一个 key 为 `node.kubernetes.io/unreachable` 的容忍度
并配置 `tolerationSeconds=300`，除非用户提供的 Pod 配置中已经已存在了 key 为
`node.kubernetes.io/unreachable` 的容忍度。
{{< /note >}}

<!--
These automatically-added tolerations mean that Pods remain bound to
Nodes for 5 minutes after one of these problems is detected.
-->
这种自动添加的容忍度意味着在其中一种问题被检测到时 Pod
默认能够继续停留在当前节点运行 5 分钟。

<!--
[DaemonSet](/docs/concepts/workloads/controllers/daemonset/) pods are created with
`NoExecute` tolerations for the following taints with no `tolerationSeconds`:

  * `node.kubernetes.io/unreachable`
  * `node.kubernetes.io/not-ready`

This ensures that DaemonSet pods are never evicted due to these problems.
-->
[DaemonSet](/zh/docs/concepts/workloads/controllers/daemonset/) 中的 Pod 被创建时，
针对以下污点自动添加的 `NoExecute` 的容忍度将不会指定 `tolerationSeconds`：

  * `node.kubernetes.io/unreachable`
  * `node.kubernetes.io/not-ready`

这保证了出现上述问题时 DaemonSet 中的 Pod 永远不会被驱逐。

<!--
## Taint Nodes by Condition
-->
## 基于节点状态添加污点

<!--
The node lifecycle controller automatically creates taints corresponding to
Node conditions with `NoSchedule` effect.
Similarly the scheduler does not check Node conditions; instead the scheduler checks taints. This assures that Node conditions don't affect what's scheduled onto the Node. The user can choose to ignore some of the Node's problems (represented as Node conditions) by adding appropriate Pod tolerations.

The DaemonSet controller automatically adds the
following `NoSchedule` tolerations to all daemons, to prevent DaemonSets from
breaking.

  * `node.kubernetes.io/memory-pressure`
  * `node.kubernetes.io/disk-pressure`
  * `node.kubernetes.io/out-of-disk` (*only for critical pods*)
  * `node.kubernetes.io/unschedulable` (1.10 or later)
  * `node.kubernetes.io/network-unavailable` (*host network only*)
-->
Node 生命周期控制器会自动创建与 Node 条件相对应的带有 `NoSchedule` 效应的污点。
同样，调度器不检查节点条件，而是检查节点污点。这确保了节点条件不会影响调度到节点上的内容。
用户可以通过添加适当的 Pod 容忍度来选择忽略某些 Node 的问题(表示为 Node 的调度条件)。

DaemonSet 控制器自动为所有守护进程添加如下 `NoSchedule` 容忍度以防 DaemonSet 崩溃：

  * `node.kubernetes.io/memory-pressure`
  * `node.kubernetes.io/disk-pressure`
  * `node.kubernetes.io/out-of-disk` (*只适合关键 Pod*)
  * `node.kubernetes.io/unschedulable` (1.10 或更高版本)
  * `node.kubernetes.io/network-unavailable` (*只适合主机网络配置*)

<!--
Adding these tolerations ensures backward compatibility. You can also add
arbitrary tolerations to DaemonSets.
-->

添加上述容忍度确保了向后兼容，您也可以选择自由向 DaemonSet 添加容忍度。

## {{% heading "whatsnext" %}}

<!--
* Read about [out of resource handling](/docs/tasks/administer-cluster/out-of-resource/) and how you can configure it
* Read about [pod priority](/docs/concepts/configuration/pod-priority-preemption/)
-->
* 阅读[资源耗尽的处理](/zh/docs/tasks/administer-cluster/out-of-resource/)，以及如何配置其行为
* 阅读 [Pod 优先级](/zh/docs/concepts/configuration/pod-priority-preemption/)


