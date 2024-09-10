---
title: 干扰（Disruptions）
content_type: concept
weight: 70
---

<!--
reviewers:
- erictune
- foxish
- davidopp
title: Disruptions
content_type: concept
weight: 70
-->

<!-- overview -->
<!--
This guide is for application owners who want to build
highly available applications, and thus need to understand
what types of disruptions can happen to Pods.
-->
本指南针对的是希望构建高可用性应用的应用所有者，他们有必要了解可能发生在 Pod 上的干扰类型。

<!--
It is also for cluster administrators who want to perform automated
cluster actions, like upgrading and autoscaling clusters.
-->
文档同样适用于想要执行自动化集群操作（例如升级和自动扩展集群）的集群管理员。

<!-- body -->

<!--
## Voluntary and involuntary disruptions

Pods do not disappear until someone (a person or a controller) destroys them, or
there is an unavoidable hardware or system software error.
-->
## 自愿干扰和非自愿干扰     {#voluntary-and-involuntary-disruptions}

Pod 不会消失，除非有人（用户或控制器）将其销毁，或者出现了不可避免的硬件或软件系统错误。

<!--
We call these unavoidable cases *involuntary disruptions* to
an application.  Examples are:
-->
我们把这些不可避免的情况称为应用的**非自愿干扰（Involuntary Disruptions）**。例如：

<!--
- a hardware failure of the physical machine backing the node
- cluster administrator deletes VM (instance) by mistake
- cloud provider or hypervisor failure makes VM disappear
- a kernel panic
- the node disappears from the cluster due to cluster network partition
- eviction of a pod due to the node being [out-of-resources](/docs/concepts/scheduling-eviction/node-pressure-eviction/).
-->

- 节点下层物理机的硬件故障
- 集群管理员错误地删除虚拟机（实例）
- 云提供商或虚拟机管理程序中的故障导致的虚拟机消失
- 内核错误
- 节点由于集群网络隔离从集群中消失
- 由于节点[资源不足](/zh-cn/docs/concepts/scheduling-eviction/node-pressure-eviction/)导致 pod 被驱逐。

<!--
Except for the out-of-resources condition, all these conditions
should be familiar to most users; they are not specific
to Kubernetes.
-->
除了资源不足的情况，大多数用户应该都熟悉这些情况；它们不是特定于 Kubernetes 的。

<!--
We call other cases *voluntary disruptions*.  These include both
actions initiated by the application owner and those initiated by a Cluster
Administrator.  Typical application owner actions include:
-->
我们称其他情况为**自愿干扰（Voluntary Disruptions）**。
包括由应用所有者发起的操作和由集群管理员发起的操作。
典型的应用所有者的操作包括：

<!--
- deleting the deployment or other controller that manages the pod
- updating a deployment's pod template causing a restart
- directly deleting a pod (e.g. by accident)
-->
- 删除 Deployment 或其他管理 Pod 的控制器
- 更新了 Deployment 的 Pod 模板导致 Pod 重启
- 直接删除 Pod（例如，因为误操作）

<!--
Cluster administrator actions include:

- [Draining a node](/docs/tasks/administer-cluster/safely-drain-node/) for repair or upgrade.
- Draining a node from a cluster to scale the cluster down (learn about
[Cluster Autoscaling](https://github.com/kubernetes/autoscaler/#readme)).
- Removing a pod from a node to permit something else to fit on that node.
-->
集群管理员操作包括：

- [排空（drain）节点](/zh-cn/docs/tasks/administer-cluster/safely-drain-node/)进行修复或升级。
- 从集群中排空节点以缩小集群（了解[集群自动扩缩](https://github.com/kubernetes/autoscaler/#readme)）。
- 从节点中移除一个 Pod，以允许其他 Pod 使用该节点。

<!--
These actions might be taken directly by the cluster administrator, or by automation
run by the cluster administrator, or by your cluster hosting provider.
-->
这些操作可能由集群管理员直接执行，也可能由集群管理员所使用的自动化工具执行，或者由集群托管提供商自动执行。

<!--
Ask your cluster administrator or consult your cloud provider or distribution documentation
to determine if any sources of voluntary disruptions are enabled for your cluster.
If none are enabled, you can skip creating Pod Disruption Budgets.
-->
咨询集群管理员或联系云提供商，或者查询发布文档，以确定是否为集群启用了任何资源干扰源。
如果没有启用，可以不用创建 Pod Disruption Budgets（Pod 干扰预算）

{{< caution >}}
<!--
Not all voluntary disruptions are constrained by Pod Disruption Budgets. For example,
deleting deployments or pods bypasses Pod Disruption Budgets.
-->
并非所有的自愿干扰都会受到 Pod 干扰预算的限制。
例如，删除 Deployment 或 Pod 的删除操作就会跳过 Pod 干扰预算检查。
{{< /caution >}}

<!--
## Dealing with disruptions

Here are some ways to mitigate involuntary disruptions:
-->
## 处理干扰   {#dealing-with-disruptions}

以下是减轻非自愿干扰的一些方法：

<!--
- Ensure your pod [requests the resources](/docs/tasks/configure-pod-container/assign-memory-resource) it needs.
- Replicate your application if you need higher availability.  (Learn about running replicated
  [stateless](/docs/tasks/run-application/run-stateless-application-deployment/)
  and [stateful](/docs/tasks/run-application/run-replicated-stateful-application/) applications.)
- For even higher availability when running replicated applications,
  spread applications across racks (using
  [anti-affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity))
  or across zones (if using a
  [multi-zone cluster](/docs/setup/multiple-zones).)
-->
- 确保 Pod 在请求中给出[所需资源](/zh-cn/docs/tasks/configure-pod-container/assign-memory-resource/)。
- 如果需要更高的可用性，请复制应用。
  （了解有关运行多副本的[无状态](/zh-cn/docs/tasks/run-application/run-stateless-application-deployment/)
  和[有状态](/zh-cn/docs/tasks/run-application/run-replicated-stateful-application/)应用的信息。）
- 为了在运行复制应用时获得更高的可用性，请跨机架（使用
  [反亲和性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)）
  或跨区域（如果使用[多区域集群](/zh-cn/docs/setup/best-practices/multiple-zones/)）扩展应用。

<!--
The frequency of voluntary disruptions varies.  On a basic Kubernetes cluster, there are
no automated voluntary disruptions (only user-triggered ones).  However, your cluster administrator or hosting provider
may run some additional services which cause voluntary disruptions. For example,
rolling out node software updates can cause voluntary disruptions. Also, some implementations
of cluster (node) autoscaling may cause voluntary disruptions to defragment and compact nodes.
Your cluster administrator or hosting provider should have documented what level of voluntary
disruptions, if any, to expect. Certain configuration options, such as
[using PriorityClasses](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
in your pod spec can also cause voluntary (and involuntary) disruptions.
-->
自愿干扰的频率各不相同。在一个基本的 Kubernetes 集群中，没有自愿干扰（只有用户触发的干扰）。
然而，集群管理员或托管提供商可能运行一些可能导致自愿干扰的额外服务。例如，节点软
更新可能导致自愿干扰。另外，集群（节点）自动缩放的某些
实现可能导致碎片整理和紧缩节点的自愿干扰。集群
管理员或托管提供商应该已经记录了各级别的自愿干扰（如果有的话）。
有些配置选项，例如在 pod spec 中
[使用 PriorityClasses](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)
也会产生自愿（和非自愿）的干扰。

<!--
## Pod disruption budgets

Kubernetes offers features to help you run highly available applications even when you
introduce frequent voluntary disruptions.

As an application owner, you can create a PodDisruptionBudget (PDB) for each application.
A PDB limits the number of Pods of a replicated application that are down simultaneously from
voluntary disruptions. For example, a quorum-based application would
like to ensure that the number of replicas running is never brought below the
number needed for a quorum. A web front end might want to
ensure that the number of replicas serving load never falls below a certain
percentage of the total.
-->
## 干扰预算   {#pod-disruption-budgets}

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

即使你会经常引入自愿性干扰，Kubernetes 提供的功能也能够支持你运行高度可用的应用。

作为一个应用的所有者，你可以为每个应用创建一个 `PodDisruptionBudget`（PDB）。
PDB 将限制在同一时间因自愿干扰导致的多副本应用中发生宕机的 Pod 数量。
例如，基于票选机制的应用希望确保运行中的副本数永远不会低于票选所需的数量。
Web 前端可能希望确保提供负载的副本数量永远不会低于总数的某个百分比。

<!--
Cluster managers and hosting providers should use tools which
respect PodDisruptionBudgets by calling the [Eviction API](/docs/tasks/administer-cluster/safely-drain-node/#eviction-api)
instead of directly deleting pods or deployments.
-->
集群管理员和托管提供商应该使用遵循 PodDisruptionBudgets 的接口
（通过调用[Eviction API](/zh-cn/docs/tasks/administer-cluster/safely-drain-node/#the-eviction-api)），
而不是直接删除 Pod 或 Deployment。

<!--
For example, the `kubectl drain` subcommand lets you mark a node as going out of
service. When you run `kubectl drain`, the tool tries to evict all of the Pods on
the Node you're taking out of service. The eviction request that `kubectl` submits on
your behalf may be temporarily rejected, so the tool periodically retries all failed
requests until all Pods on the target node are terminated, or until a configurable timeout
is reached.
-->
例如，`kubectl drain` 命令可以用来标记某个节点即将停止服务。
运行 `kubectl drain` 命令时，工具会尝试驱逐你所停服的节点上的所有 Pod。
`kubectl` 代表你所提交的驱逐请求可能会暂时被拒绝，
所以该工具会周期性地重试所有失败的请求，
直到目标节点上的所有的 Pod 都被终止，或者达到配置的超时时间。

<!--
A PDB specifies the number of replicas that an application can tolerate having, relative to how
many it is intended to have.  For example, a Deployment which has a `.spec.replicas: 5` is
supposed to have 5 pods at any given time.  If its PDB allows for there to be 4 at a time,
then the Eviction API will allow voluntary disruption of one (but not two) pods at a time.
-->
PDB 指定应用可以容忍的副本数量（相当于应该有多少副本）。
例如，具有 `.spec.replicas: 5` 的 Deployment 在任何时间都应该有 5 个 Pod。
如果 PDB 允许其在某一时刻有 4 个副本，那么驱逐 API 将允许同一时刻仅有一个（而不是两个）Pod 自愿干扰。

<!--
The group of pods that comprise the application is specified using a label selector, the same
as the one used by the application's controller (deployment, stateful-set, etc).
-->
使用标签选择器来指定构成应用的一组 Pod，这与应用的控制器（Deployment、StatefulSet 等）
选择 Pod 的逻辑一样。

<!--
The "intended" number of pods is computed from the `.spec.replicas` of the workload resource
that is managing those pods. The control plane discovers the owning workload resource by
examining the `.metadata.ownerReferences` of the Pod.
-->
Pod 的“预期”数量由管理这些 Pod 的工作负载资源的 `.spec.replicas` 参数计算出来的。
控制平面通过检查 Pod 的
`.metadata.ownerReferences` 来发现关联的工作负载资源。

<!--
[Involuntary disruptions](#voluntary-and-involuntary-disruptions) cannot be prevented by PDBs; however they
do count against the budget.
-->

PDB 无法防止[非自愿干扰](#voluntary-and-involuntary-disruptions)；
但它们确实计入预算。

<!--
Pods which are deleted or unavailable due to a rolling upgrade to an application do count
against the disruption budget, but workload resources (such as Deployment and StatefulSet)
are not limited by PDBs when doing rolling upgrades. Instead, the handling of failures
during application updates is configured in the spec for the specific workload resource.
-->
由于应用的滚动升级而被删除或不可用的 Pod 确实会计入干扰预算，
但是工作负载资源（如 Deployment 和 StatefulSet）
在进行滚动升级时不受 PDB 的限制。
应用更新期间的故障处理方式是在对应的工作负载资源的 `spec` 中配置的。

<!--
It is recommended to set `AlwaysAllow` [Unhealthy Pod Eviction Policy](/docs/tasks/run-application/configure-pdb/#unhealthy-pod-eviction-policy)
to your PodDisruptionBudgets to support eviction of misbehaving applications during a node drain.
The default behavior is to wait for the application pods to become [healthy](/docs/tasks/run-application/configure-pdb/#healthiness-of-a-pod)
before the drain can proceed.
-->
建议在你的 PodDisruptionBudget 中将
[不健康 Pod 驱逐策略](/zh-cn/docs/tasks/run-application/configure-pdb/#unhealthy-pod-eviction-policy)
设置为 `AlwaysAllow` 以支持在节点腾空期间驱逐行为不当的应用程序。
默认行为是等待应用程序 Pod 变得
[健康](/zh-cn/docs/tasks/run-application/configure-pdb/#healthiness-of-a-pod)，然后才能继续执行腾空。

<!--
When a pod is evicted using the eviction API, it is gracefully
[terminated](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination), honoring the
`terminationGracePeriodSeconds` setting in its [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core).
-->
当使用驱逐 API 驱逐 Pod 时，Pod 会被体面地
[终止](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)，期间会
参考 [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
中的 `terminationGracePeriodSeconds` 配置值。

<!--
## PodDisruptionBudget example {#pdb-example}

Consider a cluster with 3 nodes, `node-1` through `node-3`.
The cluster is running several applications.  One of them has 3 replicas initially called
`pod-a`, `pod-b`, and `pod-c`.  Another, unrelated pod without a PDB, called `pod-x`, is also shown.
Initially, the pods are laid out as follows:
-->
## PodDisruptionBudget 例子   {#pdb-example}

假设集群有 3 个节点，`node-1` 到 `node-3`。集群上运行了一些应用。
其中一个应用有 3 个副本，分别是 `pod-a`，`pod-b` 和 `pod-c`。
另外，还有一个不带 PDB 的无关 pod `pod-x` 也同样显示出来。
最初，所有的 Pod 分布如下：

|       node-1         |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
| pod-a  *available*   | pod-b *available*   | pod-c *available*  |
| pod-x  *available*   |                     |                    |

<!--
All 3 pods are part of a deployment, and they collectively have a PDB which requires
there be at least 2 of the 3 pods to be available at all times.
-->
3 个 Pod 都是 deployment 的一部分，并且共同拥有同一个 PDB，要求 3 个 Pod 中至少有 2 个 Pod 始终处于可用状态。

<!--
For example, assume the cluster administrator wants to reboot into a new kernel version to fix a bug in the kernel.
The cluster administrator first tries to drain `node-1` using the `kubectl drain` command.
That tool tries to evict `pod-a` and `pod-x`.  This succeeds immediately.
Both pods go into the `terminating` state at the same time.
This puts the cluster in this state:
-->

例如，假设集群管理员想要重启系统，升级内核版本来修复内核中的缺陷。
集群管理员首先使用 `kubectl drain` 命令尝试腾空 `node-1` 节点。
命令尝试驱逐 `pod-a` 和 `pod-x`。操作立即就成功了。
两个 Pod 同时进入 `terminating` 状态。这时的集群处于下面的状态：

|   node-1 *draining*  |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
| pod-a  *terminating* | pod-b *available*   | pod-c *available*  |
| pod-x  *terminating* |                     |                    |

<!--
The deployment notices that one of the pods is terminating, so it creates a replacement
called `pod-d`.  Since `node-1` is cordoned, it lands on another node.  Something has
also created `pod-y` as a replacement for `pod-x`.
-->
Deployment 控制器观察到其中一个 Pod 正在终止，因此它创建了一个替代 Pod `pod-d`。
由于 `node-1` 被封锁（cordon），`pod-d` 落在另一个节点上。
同样其他控制器也创建了 `pod-y` 作为 `pod-x` 的替代品。

<!--
(Note: for a StatefulSet, `pod-a`, which would be called something like `pod-0`, would need
to terminate completely before its replacement, which is also called `pod-0` but has a
different UID, could be created.  Otherwise, the example applies to a StatefulSet as well.)
-->
（注意：对于 StatefulSet 来说，`pod-a`（也称为 `pod-0`）需要在替换 Pod 创建之前完全终止，
替代它的也称为 `pod-0`，但是具有不同的 UID。除此之外，此示例也适用于 StatefulSet。）

<!--
Now the cluster is in this state:
-->
当前集群的状态如下：

|   node-1 *draining*  |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
| pod-a  *terminating* | pod-b *available*   | pod-c *available*  |
| pod-x  *terminating* | pod-d *starting*    | pod-y              |

<!--
At some point, the pods terminate, and the cluster looks like this:
-->
在某一时刻，Pod 被终止，集群如下所示：

|    node-1 *drained*  |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
|                      | pod-b *available*   | pod-c *available*  |
|                      | pod-d *starting*    | pod-y              |

<!--
At this point, if an impatient cluster administrator tries to drain `node-2` or
`node-3`, the drain command will block, because there are only 2 available
pods for the deployment, and its PDB requires at least 2.  After some time passes, `pod-d` becomes available.
-->
此时，如果一个急躁的集群管理员试图排空（drain）`node-2` 或 `node-3`，drain 命令将被阻塞，
因为对于 Deployment 来说只有 2 个可用的 Pod，并且它的 PDB 至少需要 2 个。
经过一段时间，`pod-d` 变得可用。

<!--
The cluster state now looks like this:
-->
集群状态如下所示：

|    node-1 *drained*  |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
|                      | pod-b *available*   | pod-c *available*  |
|                      | pod-d *available*   | pod-y              |

<!--
Now, the cluster administrator tries to drain `node-2`.
The drain command will try to evict the two pods in some order, say
`pod-b` first and then `pod-d`.  It will succeed at evicting `pod-b`.
But, when it tries to evict `pod-d`, it will be refused because that would leave only
one pod available for the deployment.
-->
现在，集群管理员试图排空（drain）`node-2`。
drain 命令将尝试按照某种顺序驱逐两个 Pod，假设先是 `pod-b`，然后是 `pod-d`。
命令成功驱逐 `pod-b`，但是当它尝试驱逐 `pod-d`时将被拒绝，因为对于
Deployment 来说只剩一个可用的 Pod 了。

<!--
The deployment creates a replacement for `pod-b` called `pod-e`.
Because there are not enough resources in the cluster to schedule
`pod-e` the drain will again block.  The cluster may end up in this
state:
-->
Deployment 创建 `pod-b` 的替代 Pod `pod-e`。
因为集群中没有足够的资源来调度 `pod-e`，drain 命令再次阻塞。集群最终将是下面这种状态：

|    node-1 *drained*  |       node-2        |       node-3       | *no node*          |
|:--------------------:|:-------------------:|:------------------:|:------------------:|
|                      | pod-b *terminating* | pod-c *available*  | pod-e *pending*    |
|                      | pod-d *available*   | pod-y              |                    |

<!--
At this point, the cluster administrator needs to
add a node back to the cluster to proceed with the upgrade.
-->
此时，集群管理员需要增加一个节点到集群中以继续升级操作。

<!--
You can see how Kubernetes varies the rate at which disruptions
can happen, according to:
-->
可以看到 Kubernetes 如何改变干扰发生的速率，根据：

<!--
- how many replicas an application needs
- how long it takes to gracefully shutdown an instance
- how long it takes a new instance to start up
- the type of controller
- the cluster's resource capacity
-->
- 应用需要多少个副本
- 优雅关闭应用实例需要多长时间
- 启动应用新实例需要多长时间
- 控制器的类型
- 集群的资源能力

<!--
## Pod disruption conditions {#pod-disruption-conditions}
-->
## Pod 干扰状况 {#pod-disruption-conditions}

{{< feature-state for_k8s_version="v1.26" state="beta" >}}

{{< note >}}
<!-- 
In order to use this behavior, you must have the `PodDisruptionConditions`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
enabled in your cluster.
-->
要使用此行为，你必须在集群中启用 `PodDisruptionConditions`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。
{{< /note >}}

<!--
When enabled, a dedicated Pod `DisruptionTarget` [condition](/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions) is added to indicate
that the Pod is about to be deleted due to a {{<glossary_tooltip term_id="disruption" text="disruption">}}.
The `reason` field of the condition additionally
indicates one of the following reasons for the Pod termination:
-->
启用后，会给 Pod 添加一个 `DisruptionTarget`
[状况](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions)，
用来表明该 Pod 因为发生{{<glossary_tooltip term_id="disruption" text="干扰">}}而被删除。
状况中的 `reason` 字段进一步给出 Pod 终止的原因，如下：

<!--
`PreemptionByScheduler`
: Pod is due to be {{<glossary_tooltip term_id="preemption" text="preempted">}} by a scheduler in order to accommodate a new Pod with a higher priority. For more information, see [Pod priority preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/).
-->
`PreemptionByScheduler`
: Pod 将被调度器{{<glossary_tooltip term_id="preemption" text="抢占">}}，
目的是接受优先级更高的新 Pod。
要了解更多的相关信息，请参阅 [Pod 优先级和抢占](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)。

<!--
`DeletionByTaintManager`
: Pod is due to be deleted by Taint Manager (which is part of the node lifecycle controller within `kube-controller-manager`) due to a `NoExecute` taint that the Pod does not tolerate; see {{<glossary_tooltip term_id="taint" text="taint">}}-based evictions.
-->
`DeletionByTaintManager`
: 由于 Pod 不能容忍 `NoExecute` 污点，Pod 将被
Taint Manager（`kube-controller-manager` 中节点生命周期控制器的一部分）删除；
请参阅基于{{<glossary_tooltip term_id="taint" text="污点">}}的驱逐。

<!--
`EvictionByEvictionAPI`
: Pod has been marked for {{<glossary_tooltip term_id="api-eviction" text="eviction using the Kubernetes API">}}.
-->
`EvictionByEvictionAPI`
: Pod 已被标记为{{<glossary_tooltip term_id="api-eviction" text="通过 Kubernetes API 驱逐">}}。

<!--
`DeletionByPodGC`
: Pod, that is bound to a no longer existing Node, is due to be deleted by [Pod garbage collection](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection).
-->
`DeletionByPodGC`
: 绑定到一个不再存在的 Node 上的 Pod 将被
[Pod 垃圾收集](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)删除。

<!--
`TerminationByKubelet`
: Pod has been terminated by the kubelet, because of either {{<glossary_tooltip term_id="node-pressure-eviction" text="node pressure eviction">}} or the [graceful node shutdown](/docs/concepts/architecture/nodes/#graceful-node-shutdown).
-->
`TerminationByKubelet`
: Pod
由于{{<glossary_tooltip term_id="node-pressure-eviction" text="节点压力驱逐">}}或[节点体面关闭](/zh-cn/docs/concepts/architecture/nodes/#graceful-node-shutdown)而被
kubelet 终止。

<!--
In all other disruption scenarios, like eviction due to exceeding
[Pod container limits](/docs/concepts/configuration/manage-resources-containers/),
Pods don't receive the `DisruptionTarget` condition because the disruptions were
probably caused by the Pod and would reoccur on retry.
-->
在所有其他中断场景中，例如由于超出
[Pod 容器限制]而被驱逐，`DisruptionTarget` 状况不会被添加到 Pod 上，
因为中断可能是由 Pod 引起的，并且会在重试时再次发生。

{{< note >}}
<!-- 
A Pod disruption might be interrupted. The control plane might re-attempt to
continue the disruption of the same Pod, but it is not guaranteed. As a result,
the `DisruptionTarget` condition might be added to a Pod, but that Pod might then not actually be
deleted. In such a situation, after some time, the
Pod disruption condition will be cleared.
-->
Pod 的干扰可能会被中断。控制平面可能会重新尝试继续干扰同一个 Pod，但这没办法保证。
因此，`DisruptionTarget` 状况可能会被添加到 Pod 上，
但该 Pod 实际上可能不会被删除。
在这种情况下，一段时间后，Pod 干扰状况将被清除。
{{< /note >}}

<!--
When the `PodDisruptionConditions` feature gate is enabled,
along with cleaning up the pods, the Pod garbage collector (PodGC) will also mark them as failed if they are in a non-terminal
phase (see also [Pod garbage collection](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)).
-->
当 `PodDisruptionConditions` 特性门控被启用时，在清理 Pod 的同时，如果这些 Pod 处于非终止阶段，
则 Pod 垃圾回收器 (PodGC) 也会将这些 Pod 标记为失效
（另见 [Pod 垃圾回收](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)）。

<!--
When using a Job (or CronJob), you may want to use these Pod disruption conditions as part of your Job's
[Pod failure policy](/docs/concepts/workloads/controllers/job#pod-failure-policy).
-->
使用 Job（或 CronJob）时，你可能希望将这些 Pod 干扰状况作为 Job
[Pod 失效策略](/zh-cn/docs/concepts/workloads/controllers/job#pod-failure-policy)的一部分。

<!--
## Separating Cluster Owner and Application Owner Roles

Often, it is useful to think of the Cluster Manager
and Application Owner as separate roles with limited knowledge
of each other.   This separation of responsibilities
may make sense in these scenarios:
-->
## 分离集群所有者和应用所有者角色   {#separating-cluster-owner-and-application-owner-roles}

通常，将集群管理者和应用所有者视为彼此了解有限的独立角色是很有用的。这种责任分离在下面这些场景下是有意义的：

<!--
- when there are many application teams sharing a Kubernetes cluster, and
  there is natural specialization of roles
- when third-party tools or services are used to automate cluster management
-->
- 当有许多应用团队共用一个 Kubernetes 集群，并且有自然的专业角色
- 当第三方工具或服务用于集群自动化管理

<!--
Pod Disruption Budgets support this separation of roles by providing an
interface between the roles.
-->
Pod 干扰预算通过在角色之间提供接口来支持这种分离。

<!--
If you do not have such a separation of responsibilities in your organization,
you may not need to use Pod Disruption Budgets.
-->
如果你的组织中没有这样的责任分离，则可能不需要使用 Pod 干扰预算。

<!--
## How to perform Disruptive Actions on your Cluster

If you are a Cluster Administrator, and you need to perform a disruptive action on all
the nodes in your cluster, such as a node or system software upgrade, here are some options:
-->
## 如何在集群上执行干扰性操作   {#how-to-perform-disruptive-actions-on-your-cluster}

如果你是集群管理员，并且需要对集群中的所有节点执行干扰操作，例如节点或系统软件升级，则可以使用以下选项

<!--
- Accept downtime during the upgrade.
- Failover to another complete replica cluster.
   -  No downtime, but may be costly both for the duplicated nodes
     and for human effort to orchestrate the switchover.
- Write disruption tolerant applications and use PDBs.
   - No downtime.
   - Minimal resource duplication.
   - Allows more automation of cluster administration.
   - Writing disruption-tolerant applications is tricky, but the work to tolerate voluntary
     disruptions largely overlaps with work to support autoscaling and tolerating
     involuntary disruptions.
-->
- 接受升级期间的停机时间。
- 故障转移到另一个完整的副本集群。
  - 没有停机时间，但是对于重复的节点和人工协调成本可能是昂贵的。
- 编写可容忍干扰的应用和使用 PDB。
  - 不停机。
  - 最小的资源重复。
  - 允许更多的集群管理自动化。
  - 编写可容忍干扰的应用是棘手的，但对于支持容忍自愿干扰所做的工作，和支持自动扩缩和容忍非
    自愿干扰所做工作相比，有大量的重叠

## {{% heading "whatsnext" %}}

<!--
* Follow steps to protect your application by [configuring a Pod Disruption Budget](/docs/tasks/run-application/configure-pdb/).

* Learn more about [draining nodes](/docs/tasks/administer-cluster/safely-drain-node/)

* Learn about [updating a deployment](/docs/concepts/workloads/controllers/deployment/#updating-a-deployment)
  including steps to maintain its availability during the rollout.
-->
* 参考[配置 Pod 干扰预算](/zh-cn/docs/tasks/run-application/configure-pdb/)中的方法来保护你的应用。

* 进一步了解[排空节点](/zh-cn/docs/tasks/administer-cluster/safely-drain-node/)的信息。

* 了解[更新 Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/#updating-a-deployment)
  的过程，包括如何在其进程中维持应用的可用性

