---
title: 干扰
content_type: concept
weight: 60
---

<!--
---
reviewers:
- erictune
- foxish
- davidopp
title: Disruptions
content_type: concept
weight: 60
---
-->

<!-- overview -->
<!--
This guide is for application owners who want to build
highly available applications, and thus need to understand
what types of Disruptions can happen to Pods.
-->

本指南针对的是希望构建高可用性应用程序的应用所有者，他们有必要了解可能发生在 pod 上的干扰类型。

<!--
It is also for Cluster Administrators who want to perform automated
cluster actions, like upgrading and autoscaling clusters.
-->

文档同样适用于想要执行自动化集群操作（例如升级和自动扩展集群）的集群管理员。




<!-- body -->

<!--
## Voluntary and Involuntary Disruptions
-->

## 自愿干扰和非自愿干扰

<!--
Pods do not disappear until someone (a person or a controller) destroys them, or
there is an unavoidable hardware or system software error.
-->

Pod 不会消失，除非有人（用户或控制器）将其销毁，或者出现了不可避免的硬件或软件系统错误。

<!--
We call these unavoidable cases *involuntary disruptions* to
an application.  Examples are:
-->

我们把这些不可避免的情况称为应用的*非自愿干扰*。例如：

<!--
- a hardware failure of the physical machine backing the node
- cluster administrator deletes VM (instance) by mistake
- cloud provider or hypervisor failure makes VM disappear
- a kernel panic
- the node disappears from the cluster due to cluster network partition
- eviction of a pod due to the node being [out-of-resources](/docs/tasks/administer-cluster/out-of-resource/).
-->

- 节点下层物理机的硬件故障
- 集群管理员错误地删除虚拟机（实例）
- 云提供商或虚拟机管理程序中的故障导致的虚拟机消失
- 内核错误
- 节点由于集群网络隔离从集群中消失
- 由于节点[资源不足](/docs/tasks/administer-cluster/out-of-resource/)导致 pod 被驱逐。

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

我们称其他情况为*自愿干扰*。包括由应用程序所有者发起的操作和由集群管理员发起的操作。典型的应用程序所有者的操
作包括：

<!--
- deleting the deployment or other controller that manages the pod
- updating a deployment's pod template causing a restart
- directly deleting a pod (e.g. by accident)
-->

- 删除 deployment 或其他管理 pod 的控制器
- 更新了 deployment 的 pod 模板导致 pod 重启
- 直接删除 pod（例如，因为误操作）

<!--
Cluster Administrator actions include:
-->

集群管理员操作包括：

<!--
- [Draining a node](/docs/tasks/administer-cluster/safely-drain-node/) for repair or upgrade.
- Draining a node from a cluster to scale the cluster down (learn about
[Cluster Autoscaling](/docs/tasks/administer-cluster/cluster-management/#cluster-autoscaler)
).
- Removing a pod from a node to permit something else to fit on that node.
-->

- [排空（drain）节点](/docs/tasks/administer-cluster/safely-drain-node/)进行修复或升级。
- 从集群中排空节点以缩小集群（了解[集群自动扩缩](/docs/tasks/administer-cluster/cluster-management/#cluster-autoscaler)）。
- 从节点中移除一个 pod，以允许其他 pod 使用该节点。

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

咨询集群管理员或联系云提供商，或者查询发布文档，以确定是否为集群启用了任何资源干扰源。如果没有启用，可以不用创建 Pod Disruption Budgets（Pod 干扰预算）

{{< caution >}}

<!--
Not all voluntary disruptions are constrained by Pod Disruption Budgets. For example,
deleting deployments or pods bypasses Pod Disruption Budgets.
-->

并非所有的自愿干扰都会受到 pod 干扰预算的限制。例如，删除 deployment 或 pod 的删除操作就会跳过 pod 干扰预算检查。

{{< /caution >}}

<!--
## Dealing with Disruptions
-->

## 处理干扰

<!--
Here are some ways to mitigate involuntary disruptions:
-->

以下是减轻非自愿干扰的一些方法：

<!--
- Ensure your pod [requests the resources](/docs/tasks/configure-pod-container/assign-cpu-ram-container) it needs.
- Replicate your application if you need higher availability.  (Learn about running replicated
[stateless](/docs/tasks/run-application/run-stateless-application-deployment/)
and [stateful](/docs/tasks/run-application/run-replicated-stateful-application/) applications.)
- For even higher availability when running replicated applications,
spread applications across racks (using
[anti-affinity](/docs/user-guide/node-selection/#inter-pod-affinity-and-anti-affinity-beta-feature))
or across zones (if using a
[multi-zone cluster](/docs/setup/multiple-zones).)
-->

- 确保 pod[请求所需资源](/docs/tasks/configure-pod-container/assign-cpu-ram-container)。
- 如果需要更高的可用性，请复制应用程序。（了解有关运行多副本的[无状态](/docs/tasks/run-application/run-stateless-application-deployment/)和[有状态](/docs/tasks/run-application/run-replicated-stateful-application/)应用程序的信息。）
- 为了在运行复制应用程序时获得更高的可用性，请跨机架（使用[反亲和性](/docs/user-guide/node-selection/#inter-pod-affinity-and-anti-affinity-beta-feature)）或跨区域（如果使用[多区域集群](/docs/setup/multiple-zones)）扩展应用程序。

<!--
The frequency of voluntary disruptions varies.  On a basic Kubernetes cluster, there are
no voluntary disruptions at all.  However, your cluster administrator or hosting provider
may run some additional services which cause voluntary disruptions. For example,
rolling out node software updates can cause voluntary disruptions. Also, some implementations
of cluster (node) autoscaling may cause voluntary disruptions to defragment and compact nodes.
Your cluster administrator or hosting provider should have documented what level of voluntary
disruptions, if any, to expect.
-->

自愿干扰的频率各不相同。在一个基本的 Kubernetes 集群中，根本没有自愿干扰。然而，集群管理
或托管提供商可能运行一些可能导致自愿干扰的额外服务。例如，节点软
更新可能导致自愿干扰。另外，集群（节点）自动缩放的某些
现可能导致碎片整理和紧缩节点的自愿干扰。集群
理员或托管提供商应该已经记录了各级别的自愿干扰（如果有的话）。

<!--
Kubernetes offers features to help run highly available applications at the same
time as frequent voluntary disruptions.  We call this set of features
*Disruption Budgets*.
-->

Kubernetes 提供特性来满足在出现频繁自愿干扰的同时运行高可用的应用程序。我们称这些特性为*干扰预算*

<!--
## How Disruption Budgets Work
-->

## 干扰预算工作原理

<!--
An Application Owner can create a `PodDisruptionBudget` object (PDB) for each application.
A PDB limits the number of pods of a replicated application that are down simultaneously from
voluntary disruptions.  For example, a quorum-based application would
like to ensure that the number of replicas running is never brought below the
number needed for a quorum. A web front end might want to
ensure that the number of replicas serving load never falls below a certain
percentage of the total.
-->

应用程序所有者可以为每个应用程序创建 `PodDisruptionBudget` 对象（PDB）。PDB 将限制在同一时间因自愿干扰导致的复制应用程序中宕机的 pod 数量。例如，基于定额的应用程序希望确保运行的副本数
永远不会低于仲裁所需的数量。Web 前端可能希望确保提供负载的副本数量永远不会低于总数的某个百分比。

<!--
Cluster managers and hosting providers should use tools which
respect Pod Disruption Budgets by calling the [Eviction API](/docs/tasks/administer-cluster/safely-drain-node/#the-eviction-api)
instead of directly deleting pods or deployments.  Examples are the `kubectl drain` command
and the Kubernetes-on-GCE cluster upgrade script (`cluster/gce/upgrade.sh`).
-->

集群管理员和托管提供商应该使用遵循 Pod Disruption Budgets 的接口（通过调用[驱逐 API](/docs/tasks/administer-cluster/safely-drain-node/#the-eviction-api)），而不是直接删除 pod 或 deployment。示例包括 `kubectl drain` 命令和 Kubernetes-on-GCE 集群升级脚本（`cluster/gce/upgrade.sh`）。

<!--
When a cluster administrator wants to drain a node
they use the `kubectl drain` command.  That tool tries to evict all
the pods on the machine.  The eviction request may be temporarily rejected,
and the tool periodically retries all failed requests until all pods
are terminated, or until a configurable timeout is reached.
-->

当集群管理员想排空一个节点时，可以使用 `kubectl drain` 命令。该命令试图驱逐机器上的所有 pod。驱逐请求可能会暂时被拒绝，且该工具定时重试失败的请求直到所有的 pod 都被终止，或者达到配置的超时时间。

<!--
A PDB specifies the number of replicas that an application can tolerate having, relative to how
many it is intended to have.  For example, a Deployment which has a `.spec.replicas: 5` is
supposed to have 5 pods at any given time.  If its PDB allows for there to be 4 at a time,
then the Eviction API will allow voluntary disruption of one, but not two pods, at a time.
-->

PDB 指定应用程序可以容忍的副本数量（相当于应该有多少副本）。例如，具有 `.spec.replicas: 5` 的 deployment 在任何时间都应该有 5 个 pod。如果 PDB 允许其在某一时刻有 4 个副本，那么驱逐 API 将允许同一时刻仅有一个而不是两个 pod 自愿干扰。

<!--
The group of pods that comprise the application is specified using a label selector, the same
as the one used by the application's controller (deployment, stateful-set, etc).
-->

使用标签选择器来指定构成应用程序的一组 pod，这与应用程序的控制器（deployment，stateful-set 等）选择 pod 的逻辑一样。

<!--
The "intended" number of pods is computed from the `.spec.replicas` of the pods controller.
The controller is discovered from the pods using the `.metadata.ownerReferences` of the object.
-->

Pod 控制器的 `.spec.replicas` 计算“预期的” pod 数量。根据 pod 对象的 `.metadata.ownerReferences` 字段来发现控制器。

<!--
PDBs cannot prevent [involuntary disruptions](#voluntary-and-involuntary-disruptions) from
occurring, but they do count against the budget.
-->

PDB 不能阻止[非自愿干扰](#voluntary-and-involuntary-disruptions)的发生，但是确实会计入
算。

<!--
Pods which are deleted or unavailable due to a rolling upgrade to an application do count
against the disruption budget, but controllers (like deployment and stateful-set)
are not limited by PDBs when doing rolling upgrades -- the handling of failures
during application updates is configured in the controller spec.
(Learn about [updating a deployment](/docs/concepts/workloads/controllers/deployment/#updating-a-deployment).)
-->

由于应用程序的滚动升级而被删除或不可用的 pod 确实会计入干扰预算，但是控制器（如 deployment 和 stateful-set）在进行滚动升级时不受 PDB
的限制。应用程序更新期间的故障处理是在控制器的 spec 中配置的。（了解[更新 deployment](/docs/concepts/workloads/controllers/deployment/#updating-a-deployment)。）

<!--
When a pod is evicted using the eviction API, it is gracefully terminated (see
`terminationGracePeriodSeconds` in [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core).)
-->

当使用驱逐 API 驱逐 pod 时，pod 会被优雅地终止（参考 [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core) 中的 `terminationGracePeriodSeconds`）。

<!--
## PDB Example
-->

## PDB 例子

<!--
Consider a cluster with 3 nodes, `node-1` through `node-3`.
The cluster is running several applications.  One of them has 3 replicas initially called
`pod-a`, `pod-b`, and `pod-c`.  Another, unrelated pod without a PDB, called `pod-x`, is also shown.
Initially, the pods are laid out as follows:
-->

假设集群有 3 个节点，`node-1` 到 `node-3`。集群上运行了一些应用。其中一个应用有 3 个副本，分别是 `pod-a`，`pod-b` 和 `pod-c`。另外，还有一个不带 PDB 的无关 pod `pod-x` 也同样显示。最初，所有的 pod 分布如下：


|       node-1         |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
| pod-a  *available*   | pod-b *available*   | pod-c *available*  |
| pod-x  *available*   |                     |                    |

<!--
All 3 pods are part of a deployment, and they collectively have a PDB which requires
there be at least 2 of the 3 pods to be available at all times.
-->

3 个 pod 都是 deployment 的一部分，并且共同拥有同一个 PDB，要求 3 个 pod 中至少有 2 个 pod 始终处于可用状态。

<!--
For example, assume the cluster administrator wants to reboot into a new kernel version to fix a bug in the kernel.
The cluster administrator first tries to drain `node-1` using the `kubectl drain` command.
That tool tries to evict `pod-a` and `pod-x`.  This succeeds immediately.
Both pods go into the `terminating` state at the same time.
This puts the cluster in this state:
-->

例如，假设集群管理员想要重启系统，升级内核版本来修复内核中的 bug。集群管理员首先使用 `kubectl drain` 命令尝试排空 `node-1` 节点。命令尝试驱逐 `pod-a` 和 `pod-x`。操作立即就成功了。两个 pod 同时进入 `terminating` 状态。这时的集群处于下面的状态：

|   node-1 *draining*  |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
| pod-a  *terminating* | pod-b *available*   | pod-c *available*  |
| pod-x  *terminating* |                     |                    |

<!--
The deployment notices that one of the pods is terminating, so it creates a replacement
called `pod-d`.  Since `node-1` is cordoned, it lands on another node.  Something has
also created `pod-y` as a replacement for `pod-x`.
-->

Deployment 控制器观察到其中一个 pod 正在终止，因此它创建了一个替代 pod `pod-d`。由于 `node-1` 被封锁（cordon），`pod-d` 落在另一个节点上。同样其他控制器也创建了 `pod-y` 作为 `pod-x` 的替代品。

<!--
(Note: for a StatefulSet, `pod-a`, which would be called something like `pod-0`, would need
to terminate completely before its replacement, which is also called `pod-0` but has a
different UID, could be created.  Otherwise, the example applies to a StatefulSet as well.)
-->

（注意：对于 StatefulSet 来说，`pod-a`（也称为 `pod-0`）需要在替换 pod 创建之前完全终止，替代它的也称为 `pod-0`，但是具有不同的 UID。反之，样例也适用于 StatefulSet。）

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

在某一时刻，pod 被终止，集群如下所示：

|    node-1 *drained*  |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
|                      | pod-b *available*   | pod-c *available*  |
|                      | pod-d *starting*    | pod-y              |

<!--
At this point, if an impatient cluster administrator tries to drain `node-2` or
`node-3`, the drain command will block, because there are only 2 available
pods for the deployment, and its PDB requires at least 2.  After some time passes, `pod-d` becomes available.
-->

此时，如果一个急躁的集群管理员试图排空（drain）`node-2` 或 `node-3`，drain 命令将被阻塞，因为对于 deployment 来说只有 2 个可用的 pod，并且它的 PDB 至少需要 2 个。经过一段时间，`pod-d` 变得可用。

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

现在，集群管理员试图排空（drain）`node-2`。drain 命令将尝试按照某种顺序驱逐两个 pod，假设先是 `pod-b`，然后是 `pod-d`。命令成功驱逐 `pod-b`，但是当它尝试驱逐 `pod-d`时将被拒绝，因为对于 deployment 来说只剩一个可用的 pod 了。

<!--
The deployment creates a replacement for `pod-b` called `pod-e`.
Because there are not enough resources in the cluster to schedule
`pod-e` the drain will again block.  The cluster may end up in this
state:
-->

Deployment 创建 `pod-b` 的替代 pod `pod-e`。因为集群中没有足够的资源来调度 `pod-e`，drain 命令再次阻塞。集群最终将是下面这种状态：

|    node-1 *drained*  |       node-2        |       node-3       | *no node*          |
|:--------------------:|:-------------------:|:------------------:|:------------------:|
|                      | pod-b *available*   | pod-c *available*  | pod-e *pending*    |
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

- 应用程序需要多少个副本
- 优雅关闭应用实例需要多长时间
- 启动应用新实例需要多长时间
- 控制器的类型
- 集群的资源能力

<!--
## Separating Cluster Owner and Application Owner Roles
-->

## 分离集群所有者和应用所有者角色

<!--
Often, it is useful to think of the Cluster Manager
and Application Owner as separate roles with limited knowledge
of each other.   This separation of responsibilities
may make sense in these scenarios:
-->

通常，将集群管理者和应用所有者视为彼此了解有限的独立角色是很有用的。这种责任分离在下面这些场景下是有意义的：

<!--
- when there are many application teams sharing a Kubernetes cluster, and
  there is natural specialization of roles
- when third-party tools or services are used to automate cluster management
-->

- 当有许多应用程序团队共用一个 Kubernetes 集群，并且有自然的专业角色
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
-->

## 如何在集群上执行干扰操作

<!--
If you are a Cluster Administrator, and you need to perform a disruptive action on all
the nodes in your cluster, such as a node or system software upgrade, here are some options:
-->

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
   -  没有停机时间，但是对于重复的节点和人工协调成本可能是昂贵的。
- 编写可容忍干扰的应用程序和使用 PDB。
   - 不停机。
   - 最小的资源重复。
   - 允许更多的集群管理自动化。
   - 编写可容忍干扰的应用程序是棘手的，但对于支持容忍自愿干扰所做的工作，和支持自动扩缩和容忍非
   愿干扰所做工作相比，有大量的重叠




## {{% heading "whatsnext" %}}


<!--
* Follow steps to protect your application by [configuring a Pod Disruption Budget](/docs/tasks/run-application/configure-pdb/).
-->

* 参考[配置 Pod 干扰预算](/docs/tasks/run-application/configure-pdb/)中的方法来保护你的
用。

<!--
* Learn more about [draining nodes](/docs/tasks/administer-cluster/safely-drain-node/)
-->

* 了解更多关于[排空节点](/docs/tasks/administer-cluster/safely-drain-node/)的信息。


