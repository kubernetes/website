---
title: 污点和容忍度
content_type: concept
weight: 50
---
<!--
reviewers:
- davidopp
- kevin-wangzefeng
- bsalamat
title: Taints and Tolerations
content_type: concept
weight: 50
-->

<!-- overview -->
<!--
[_Node affinity_](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)
is a property of {{< glossary_tooltip text="Pods" term_id="pod" >}} that *attracts* them to
a set of {{< glossary_tooltip text="nodes" term_id="node" >}} (either as a preference or a
hard requirement). _Taints_ are the opposite -- they allow a node to repel a set of pods.
-->
[节点亲和性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)
是 {{< glossary_tooltip text="Pod" term_id="pod" >}} 的一种属性，它使 Pod
被吸引到一类特定的{{< glossary_tooltip text="节点" term_id="node" >}}
（这可能出于一种偏好，也可能是硬性要求）。
**污点（Taint）** 则相反——它使节点能够排斥一类特定的 Pod。

<!--
_Tolerations_ are applied to pods. Tolerations allow the scheduler to schedule pods with matching
taints. Tolerations allow scheduling but don't guarantee scheduling: the scheduler also
[evaluates other parameters](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
as part of its function.

Taints and tolerations work together to ensure that pods are not scheduled
onto inappropriate nodes. One or more taints are applied to a node; this
marks that the node should not accept any pods that do not tolerate the taints.
-->
**容忍度（Toleration）** 是应用于 Pod 上的。容忍度允许调度器调度带有对应污点的 Pod。
容忍度允许调度但并不保证调度：作为其功能的一部分，
调度器也会[评估其他参数](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)。

污点和容忍度（Toleration）相互配合，可以用来避免 Pod 被分配到不合适的节点上。
每个节点上都可以应用一个或多个污点，这表示对于那些不能容忍这些污点的 Pod，
是不会被该节点接受的。

<!-- body -->

<!--
## Concepts

You add a taint to a node using [kubectl taint](/docs/reference/generated/kubectl/kubectl-commands#taint).
For example,
-->
## 概念  {#concepts}

你可以使用命令 [kubectl taint](/docs/reference/generated/kubectl/kubectl-commands#taint)
给节点增加一个污点。比如：

```shell
kubectl taint nodes node1 key1=value1:NoSchedule
```

<!--
places a taint on node `node1`. The taint has key `key1`, value `value1`, and taint effect `NoSchedule`.
This means that no pod will be able to schedule onto `node1` unless it has a matching toleration.

To remove the taint added by the command above, you can run:
-->
给节点 `node1` 增加一个污点，它的键名是 `key1`，键值是 `value1`，效果是 `NoSchedule`。
这表示只有拥有和这个污点相匹配的容忍度的 Pod 才能够被分配到 `node1` 这个节点。

若要移除上述命令所添加的污点，你可以执行：

```shell
kubectl taint nodes node1 key1=value1:NoSchedule-
```

<!--
You specify a toleration for a pod in the PodSpec. Both of the following tolerations "match" the
taint created by the `kubectl taint` line above, and thus a pod with either toleration would be able
to schedule onto `node1`:
-->
你可以在 Pod 规约中为 Pod 设置容忍度。
下面两个容忍度均与上面例子中使用 `kubectl taint` 命令创建的污点相匹配，
因此如果一个 Pod 拥有其中的任何一个容忍度，都能够被调度到 `node1`：

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
The default Kubernetes scheduler takes taints and tolerations into account when
selecting a node to run a particular Pod. However, if you manually specify the
`.spec.nodeName` for a Pod, that action bypasses the scheduler; the Pod is then
bound onto the node where you assigned it, even if there are `NoSchedule`
taints on that node that you selected.
If this happens and the node also has a `NoExecute` taint set, the kubelet will
eject the Pod unless there is an appropriate tolerance set.
-->
默认的 Kubernetes 调度器在选择一个节点来运行特定的 Pod 时会考虑污点和容忍度。
然而，如果你手动为一个 Pod 指定了 `.spec.nodeName`，那么选节点操作会绕过调度器；
这个 Pod 将会绑定到你指定的节点上，即使你选择的节点上有 `NoSchedule` 的污点。
如果这种情况发生，且节点上还设置了 `NoExecute` 的污点，kubelet 会将 Pod 驱逐出去，除非有适当的容忍度设置。

<!--
Here's an example of a pod that has some tolerations defined:
-->
下面是一个定义了一些容忍度的 Pod 的例子：

{{% code_sample file="pods/pod-with-toleration.yaml" %}}

<!--
The default value for `operator` is `Equal`.
-->
`operator` 的默认值是 `Equal`。

<!--
A toleration "matches" a taint if the keys are the same and the effects are the same, and:

* the `operator` is `Exists` (in which case no `value` should be specified), or
* the `operator` is `Equal` and the values should be equal.
-->
一个容忍度和一个污点相“匹配”是指它们有一样的键名和效果，并且：

* 如果 `operator` 是 `Exists`（此时容忍度不能指定 `value`），或者
* 如果 `operator` 是 `Equal`，则它们的值应该相等。

{{< note >}}
<!--
There are two special cases:

An empty `key` with operator `Exists` matches all keys, values and effects which means this
will tolerate everything.

An empty `effect` matches all effects with key `key1`.
-->
存在两种特殊情况：

如果一个容忍度的 `key` 为空且 `operator` 为 `Exists`，
表示这个容忍度与任意的 key、value 和 effect 都匹配，即这个容忍度能容忍任何污点。

如果 `effect` 为空，则可以与所有键名 `key1` 的效果相匹配。
{{< /note >}}

<!--
The above example used the `effect` of `NoSchedule`. Alternatively, you can use the `effect` of `PreferNoSchedule`.
-->
上述例子中 `effect` 使用的值为 `NoSchedule`，你也可以使用另外一个值 `PreferNoSchedule`。

<!--
The allowed values for the `effect` field are:
-->
`effect` 字段的允许值包括：

<!--
`NoExecute`
: This affects pods that are already running on the node as follows:
  * Pods that do not tolerate the taint are evicted immediately
  * Pods that tolerate the taint without specifying `tolerationSeconds` in
    their toleration specification remain bound forever
  * Pods that tolerate the taint with a specified `tolerationSeconds` remain
    bound for the specified amount of time. After that time elapses, the node
    lifecycle controller evicts the Pods from the node.
-->
`NoExecute`
: 这会影响已在节点上运行的 Pod，具体影响如下：
  * 如果 Pod 不能容忍这类污点，会马上被驱逐。
  * 如果 Pod 能够容忍这类污点，但是在容忍度定义中没有指定 `tolerationSeconds`，
    则 Pod 还会一直在这个节点上运行。
  * 如果 Pod 能够容忍这类污点，而且指定了 `tolerationSeconds`，
    则 Pod 还能在这个节点上继续运行这个指定的时间长度。
    这段时间过去后，节点生命周期控制器从节点驱除这些 Pod。

<!--
`NoSchedule`
: No new Pods will be scheduled on the tainted node unless they have a matching
  toleration. Pods currently running on the node are **not** evicted.
-->
`NoSchedule`
: 除非具有匹配的容忍度规约，否则新的 Pod 不会被调度到带有污点的节点上。
  当前正在节点上运行的 Pod **不会**被驱逐。

<!--
`PreferNoSchedule`
: `PreferNoSchedule` is a "preference" or "soft" version of `NoSchedule`.
  The control plane will *try* to avoid placing a Pod that does not tolerate
  the taint on the node, but it is not guaranteed.
-->
`PreferNoSchedule`
: `PreferNoSchedule` 是“偏好”或“软性”的 `NoSchedule`。
  控制平面将**尝试**避免将不能容忍污点的 Pod 调度到的节点上，但不能保证完全避免。

<!--
You can put multiple taints on the same node and multiple tolerations on the same pod.
The way Kubernetes processes multiple taints and tolerations is like a filter: start
with all of a node's taints, then ignore the ones for which the pod has a matching toleration; the
remaining un-ignored taints have the indicated effects on the pod. In particular,
-->
你可以给一个节点添加多个污点，也可以给一个 Pod 添加多个容忍度设置。
Kubernetes 处理多个污点和容忍度的过程就像一个过滤器：从一个节点的所有污点开始遍历，
过滤掉那些 Pod 中存在与之相匹配的容忍度的污点。余下未被过滤的污点的 effect 值决定了
Pod 是否会被分配到该节点。需要注意以下情况：

<!--
* if there is at least one un-ignored taint with effect `NoSchedule` then Kubernetes will not schedule
the pod onto that node
* if there is no un-ignored taint with effect `NoSchedule` but there is at least one un-ignored taint with
effect `PreferNoSchedule` then Kubernetes will *try* to not schedule the pod onto the node
* if there is at least one un-ignored taint with effect `NoExecute` then the pod will be evicted from
the node (if it is already running on the node), and will not be
scheduled onto the node (if it is not yet running on the node).
-->
* 如果未被忽略的污点中存在至少一个 effect 值为 `NoSchedule` 的污点，
  则 Kubernetes 不会将 Pod 调度到该节点。
* 如果未被忽略的污点中不存在 effect 值为 `NoSchedule` 的污点，
  但是存在至少一个 effect 值为 `PreferNoSchedule` 的污点，
  则 Kubernetes 会**尝试**不将 Pod 调度到该节点。
* 如果未被忽略的污点中存在至少一个 effect 值为 `NoExecute` 的污点，
  则 Kubernetes 不会将 Pod 调度到该节点（如果 Pod 还未在节点上运行），
  并且会将 Pod 从该节点驱逐（如果 Pod 已经在节点上运行）。

<!--
For example, imagine you taint a node like this
-->
例如，假设你给一个节点添加了如下污点：

```shell
kubectl taint nodes node1 key1=value1:NoSchedule
kubectl taint nodes node1 key1=value1:NoExecute
kubectl taint nodes node1 key2=value2:NoSchedule
```

<!--
And a pod has two tolerations:
-->
假定某个 Pod 有两个容忍度：

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
在这种情况下，上述 Pod 不会被调度到上述节点，因为其没有容忍度和第三个污点相匹配。
但是如果在给节点添加上述污点之前，该 Pod 已经在上述节点运行，
那么它还可以继续运行在该节点上，因为第三个污点是三个污点中唯一不能被这个 Pod 容忍的。

<!--
Normally, if a taint with effect `NoExecute` is added to a node, then any pods that do
not tolerate the taint will be evicted immediately, and pods that do tolerate the
taint will never be evicted. However, a toleration with `NoExecute` effect can specify
an optional `tolerationSeconds` field that dictates how long the pod will stay bound
to the node after the taint is added. For example,
-->
通常情况下，如果给一个节点添加了一个 effect 值为 `NoExecute` 的污点，
则任何不能容忍这个污点的 Pod 都会马上被驱逐，任何可以容忍这个污点的 Pod 都不会被驱逐。
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

Taints and tolerations are a flexible way to steer pods *away* from nodes or evict
pods that shouldn't be running. A few of the use cases are
-->
## 使用例子  {#example-use-cases}

通过污点和容忍度，可以灵活地让 Pod **避开**某些节点或者将 Pod 从某些节点驱逐。
下面是几个使用例子：

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
* **专用节点**：如果想将某些节点专门分配给特定的一组用户使用，你可以给这些节点添加一个污点（即，
  `kubectl taint nodes nodename dedicated=groupName:NoSchedule`），
  然后给这组用户的 Pod 添加一个相对应的容忍度
  （通过编写一个自定义的[准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)，
  很容易就能做到）。
  拥有上述容忍度的 Pod 就能够被调度到上述专用节点，同时也能够被调度到集群中的其它节点。
  如果你希望这些 Pod 只能被调度到上述专用节点，
  那么你还需要给这些专用节点另外添加一个和上述污点类似的 label（例如：`dedicated=groupName`），
  同时还要在上述准入控制器中给 Pod 增加节点亲和性要求，要求上述 Pod 只能被调度到添加了
  `dedicated=groupName` 标签的节点上。

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
Resources](/docs/concepts/configuration/manage-resources-containers/#extended-resources)
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
  我们希望不需要这类硬件的 Pod 不要被调度到这些特殊节点，以便为后继需要这类硬件的 Pod 保留资源。
  要达到这个目的，可以先给配备了特殊硬件的节点添加污点
  （例如 `kubectl taint nodes nodename special=true:NoSchedule` 或
  `kubectl taint nodes nodename special=true:PreferNoSchedule`），
  然后给使用了这类特殊硬件的 Pod 添加一个相匹配的容忍度。
  和专用节点的例子类似，添加这个容忍度的最简单的方法是使用自定义
  [准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)。
  比如，我们推荐使用[扩展资源](/zh-cn/docs/concepts/configuration/manage-resources-containers/#extended-resources)
  来表示特殊硬件，给配置了特殊硬件的节点添加污点时包含扩展资源名称，
  然后运行一个 [ExtendedResourceToleration](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#extendedresourcetoleration)
  准入控制器。此时，因为节点已经被设置污点了，没有对应容忍度的 Pod 不会被调度到这些节点。
  但当你创建一个使用了扩展资源的 Pod 时，`ExtendedResourceToleration` 准入控制器会自动给
  Pod 加上正确的容忍度，这样 Pod 就会被自动调度到这些配置了特殊硬件的节点上。
  这种方式能够确保配置了特殊硬件的节点专门用于运行需要这些硬件的 Pod，
  并且你无需手动给这些 Pod 添加容忍度。

<!--
* **Taint based Evictions**: A per-pod-configurable eviction behavior
when there are node problems, which is described in the next section.
-->
* **基于污点的驱逐**：这是在每个 Pod 中配置的在节点出现问题时的驱逐行为，
  接下来的章节会描述这个特性。

<!--
## Taint based Evictions
-->
## 基于污点的驱逐   {#taint-based-evictions}

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

<!--
The node controller automatically taints a Node when certain conditions
are true. The following taints are built in:

 * `node.kubernetes.io/not-ready`: Node is not ready. This corresponds to
   the NodeCondition `Ready` being "`False`".
 * `node.kubernetes.io/unreachable`: Node is unreachable from the node
   controller. This corresponds to the NodeCondition `Ready` being "`Unknown`".
 * `node.kubernetes.io/memory-pressure`: Node has memory pressure.
 * `node.kubernetes.io/disk-pressure`: Node has disk pressure.
 * `node.kubernetes.io/pid-pressure`: Node has PID pressure.
 * `node.kubernetes.io/network-unavailable`: Node's network is unavailable.
 * `node.kubernetes.io/unschedulable`: Node is unschedulable.
 * `node.cloudprovider.kubernetes.io/uninitialized`: When the kubelet is started
    with an "external" cloud provider, this taint is set on a node to mark it
    as unusable. After a controller from the cloud-controller-manager initializes
    this node, the kubelet removes this taint.
-->
当某种条件为真时，节点控制器会自动给节点添加一个污点。当前内置的污点包括：

* `node.kubernetes.io/not-ready`：节点未准备好。这相当于节点状况 `Ready` 的值为 "`False`"。
* `node.kubernetes.io/unreachable`：节点控制器访问不到节点. 这相当于节点状况 `Ready`
  的值为 "`Unknown`"。
* `node.kubernetes.io/memory-pressure`：节点存在内存压力。
* `node.kubernetes.io/disk-pressure`：节点存在磁盘压力。
* `node.kubernetes.io/pid-pressure`：节点的 PID 压力。
* `node.kubernetes.io/network-unavailable`：节点网络不可用。
* `node.kubernetes.io/unschedulable`：节点不可调度。
* `node.cloudprovider.kubernetes.io/uninitialized`：如果 kubelet 启动时指定了一个“外部”云平台驱动，
  它将给当前节点添加一个污点将其标志为不可用。在 cloud-controller-manager
  的一个控制器初始化这个节点后，kubelet 将删除这个污点。

<!--
In case a node is to be drained, the node controller or the kubelet adds relevant taints
with `NoExecute` effect. This effect is added by default for the
`node.kubernetes.io/not-ready` and `node.kubernetes.io/unreachable` taints.
If the fault condition returns to normal, the kubelet or node
controller can remove the relevant taint(s).
-->
在节点被排空时，节点控制器或者 kubelet 会添加带有 `NoExecute` 效果的相关污点。
此效果被默认添加到 `node.kubernetes.io/not-ready` 和 `node.kubernetes.io/unreachable` 污点中。
如果异常状态恢复正常，kubelet 或节点控制器能够移除相关的污点。

<!--
In some cases when the node is unreachable, the API server is unable to communicate
with the kubelet on the node. The decision to delete the pods cannot be communicated to
the kubelet until communication with the API server is re-established. In the meantime,
the pods that are scheduled for deletion may continue to run on the partitioned node.
-->
在某些情况下，当节点不可达时，API 服务器无法与节点上的 kubelet 进行通信。
在与 API 服务器的通信被重新建立之前，删除 Pod 的决定无法传递到 kubelet。
同时，被调度进行删除的那些 Pod 可能会继续运行在分区后的节点上。

{{< note >}}
<!--
The control plane limits the rate of adding new taints to nodes. This rate limiting
manages the number of evictions that are triggered when many nodes become unreachable at
once (for example: if there is a network disruption).
-->
控制面会限制向节点添加新污点的速率。这一速率限制可以管理多个节点同时不可达时
（例如出现网络中断的情况），可能触发的驱逐的数量。
{{< /note >}}

<!--
You can specify `tolerationSeconds` for a Pod to define how long that Pod stays bound
to a failing or unresponsive Node.
-->
你可以为 Pod 设置 `tolerationSeconds`，以指定当节点失效或者不响应时，
Pod 维系与该节点间绑定关系的时长。

<!--
For example, you might want to keep an application with a lot of local state
bound to node for a long time in the event of network partition, hoping
that the partition will recover and thus the pod eviction can be avoided.
The toleration you set for that Pod might look like:
-->
比如，你可能希望在出现网络分裂事件时，对于一个与节点本地状态有着深度绑定的应用而言，
仍然停留在当前节点上运行一段较长的时间，以等待网络恢复以避免被驱逐。
你为这种 Pod 所设置的容忍度看起来可能是这样：

```yaml
tolerations:
- key: "node.kubernetes.io/unreachable"
  operator: "Exists"
  effect: "NoExecute"
  tolerationSeconds: 6000
```

{{< note >}}
<!--
Kubernetes automatically adds a toleration for
`node.kubernetes.io/not-ready` and `node.kubernetes.io/unreachable`
with `tolerationSeconds=300`,
unless you, or a controller, set those tolerations explicitly.

These automatically-added tolerations mean that Pods remain bound to
Nodes for 5 minutes after one of these problems is detected.
-->
Kubernetes 会自动给 Pod 添加针对 `node.kubernetes.io/not-ready` 和
`node.kubernetes.io/unreachable` 的容忍度，且配置 `tolerationSeconds=300`，
除非用户自身或者某控制器显式设置此容忍度。

这些自动添加的容忍度意味着 Pod 可以在检测到对应的问题之一时，在 5
分钟内保持绑定在该节点上。
{{< /note >}}

<!--
[DaemonSet](/docs/concepts/workloads/controllers/daemonset/) pods are created with
`NoExecute` tolerations for the following taints with no `tolerationSeconds`:

* `node.kubernetes.io/unreachable`
* `node.kubernetes.io/not-ready`

This ensures that DaemonSet pods are never evicted due to these problems.
-->
[DaemonSet](/zh-cn/docs/concepts/workloads/controllers/daemonset/) 中的 Pod 被创建时，
针对以下污点自动添加的 `NoExecute` 的容忍度将不会指定 `tolerationSeconds`：

* `node.kubernetes.io/unreachable`
* `node.kubernetes.io/not-ready`

这保证了出现上述问题时 DaemonSet 中的 Pod 永远不会被驱逐。

<!--
## Taint Nodes by Condition

The control plane, using the node {{<glossary_tooltip text="controller" term_id="controller">}},
automatically creates taints with a `NoSchedule` effect for
[node conditions](/docs/concepts/scheduling-eviction/node-pressure-eviction/#node-conditions).
-->
## 基于节点状态添加污点  {#taint-nodes-by-condition}

控制平面使用节点{{<glossary_tooltip text="控制器" term_id="controller">}}自动创建
与[节点状况](/zh-cn/docs/concepts/scheduling-eviction/node-pressure-eviction/#node-conditions)
对应的、效果为 `NoSchedule` 的污点。

<!--
The scheduler checks taints, not node conditions, when it makes scheduling
decisions. This ensures that node conditions don't directly affect scheduling.
For example, if the `DiskPressure` node condition is active, the control plane
adds the `node.kubernetes.io/disk-pressure` taint and does not schedule new pods
onto the affected node. If the `MemoryPressure` node condition is active, the
control plane adds the `node.kubernetes.io/memory-pressure` taint.
-->
调度器在进行调度时检查污点，而不是检查节点状况。这确保节点状况不会直接影响调度。
例如，如果 `DiskPressure` 节点状况处于活跃状态，则控制平面添加
`node.kubernetes.io/disk-pressure` 污点并且不会调度新的 Pod 到受影响的节点。
如果 `MemoryPressure` 节点状况处于活跃状态，则控制平面添加
`node.kubernetes.io/memory-pressure` 污点。

<!--
You can ignore node conditions for newly created pods by adding the corresponding
Pod tolerations. The control plane also adds the `node.kubernetes.io/memory-pressure`
toleration on pods that have a {{< glossary_tooltip text="QoS class" term_id="qos-class" >}}
other than `BestEffort`. This is because Kubernetes treats pods in the `Guaranteed`
or `Burstable` QoS classes (even pods with no memory request set) as if they are
able to cope with memory pressure, while new `BestEffort` pods are not scheduled
onto the affected node.
-->
对于新创建的 Pod，可以通过添加相应的 Pod 容忍度来忽略节点状况。
控制平面还在具有除 `BestEffort` 之外的
{{<glossary_tooltip text="QoS 类" term_id="qos-class" >}}的 Pod 上添加
`node.kubernetes.io/memory-pressure` 容忍度。
这是因为 Kubernetes 将 `Guaranteed` 或 `Burstable` QoS 类中的 Pod（甚至没有设置内存请求的 Pod）
视为能够应对内存压力，而新创建的 `BestEffort` Pod 不会被调度到受影响的节点上。

<!--
The DaemonSet controller automatically adds the following `NoSchedule`
tolerations to all daemons, to prevent DaemonSets from breaking.

  * `node.kubernetes.io/memory-pressure`
  * `node.kubernetes.io/disk-pressure`
  * `node.kubernetes.io/pid-pressure` (1.14 or later)
  * `node.kubernetes.io/unschedulable` (1.10 or later)
  * `node.kubernetes.io/network-unavailable` (*host network only*)
-->
DaemonSet 控制器自动为所有守护进程添加如下 `NoSchedule` 容忍度，以防 DaemonSet 崩溃：

* `node.kubernetes.io/memory-pressure`
* `node.kubernetes.io/disk-pressure`
* `node.kubernetes.io/pid-pressure`（1.14 或更高版本）
* `node.kubernetes.io/unschedulable`（1.10 或更高版本）
* `node.kubernetes.io/network-unavailable`（**只适合主机网络配置**）

<!--
Adding these tolerations ensures backward compatibility. You can also add
arbitrary tolerations to DaemonSets.
-->
添加上述容忍度确保了向后兼容，你也可以选择自由向 DaemonSet 添加容忍度。

## {{% heading "whatsnext" %}}

<!--
* Read about [Node-pressure Eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/)
  and how you can configure it
* Read about [Pod Priority](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
-->
* 阅读[节点压力驱逐](/zh-cn/docs/concepts/scheduling-eviction/node-pressure-eviction/)，
  以及如何配置其行为
* 阅读 [Pod 优先级](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)
