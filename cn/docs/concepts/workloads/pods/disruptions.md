---
assignees:
- erictune
- foxish
- davidopp
title: Disruption(中断)
redirect_from:
- "/docs/admin/disruptions/"
- "/docs/admin/disruptions.html"
- "/docs/tasks/configure-pod-container/configure-pod-disruption-budget/"
- "/docs/tasks/administer-cluster/configure-pod-disruption-budget/"
---

{% capture overview %}

<!--

This guide is for application owners who want to build
highly available applications, and thus need to understand
what types of Disruptions can happen to Pods.

It is also for Cluster Administrators who want to perform automated
cluster actions, like upgrading and autoscaling clusters.

-->

本指南适用于要构建高可用应用程序的所有者，因此他们需要了解 Pod 可能发生什么类型的中断。

也适用于要执行自动集群操作的集群管理员，如升级和集群自动扩容。

{% endcapture %}

{:toc}

{% capture body %}

<!--

## Voluntary and Involuntary Disruptions

Pods do not disappear until someone (a person or a controller) destroys them, or
there is an unavoidable hardware or system software error.

We call these unavoidable cases *involuntary disruptions* to
an application.  Examples are:

- a hardware failure of the physical machine backing the node
- cluster administrator deletes VM (instance) by mistake
- cloud provider or hypervisor failure makes VM disappear
- a kernel panic
- if the node to disappears from the cluster due to cluster network partition
- eviction of a pod due to the node being [out-of-resources](/docs/tasks/administer-cluster/out-of-resource.md).

-->

## 自愿中断和非自愿中断

Pod 不会消失，直到有人（人类或控制器）将其销毁，或者当出现不可避免的硬件或系统软件错误。

我们把这些不可避免的情况称为应用的非自愿性中断。例如：

 - 后端节点物理机的硬件故障
 - 集群管理员错误地删除虚拟机（实例）
 - 云提供商或管理程序故障使虚拟机消失
 - 内核恐慌（kernel panic）
 - 节点由于集群网络分区而从集群中消失
 - 由于节点[资源不足](/docs/tasks/administer-cluster/out-of-resource.md)而将容器逐出
<!--

Except for the out-of-resources condition, all these conditions
should be familiar to most users; they are are not specific
to Kubernetes.

We call other cases *voluntary disruptions*.  These include both
actions initiated by the application owner and those initiated by a Cluster
Administrator.  Typical application owner actions include:

- deleting the deployment or other controller that manages the pod
- updating a deployment's pod template causing a restart
- directly deleting a pod (e.g. by accident)

-->

除资源不足的情况外，大多数用户应该都熟悉以下这些情况；它们不是特定于 Kubernetes 的。

我们称这些情况为”自愿中断“。包括由应用程序所有者发起的操作和由集群管理员发起的操作。典型的应用程序所有者操作包括：

- 删除管理该 pod 的 Deployment 或其他控制器
- 更新了 Deployment 的 pod 模板导致 pod 重启
- 直接删除 pod（意外删除）

<!--

Cluster Administrator actions include:

- [Draining a node](/docs//tasks/administer-cluster/safely-drain-node.md) for repair or upgrade.
- Draining a node from a cluster to scale the cluster down (learn about
  [Cluster Autoscaling](/docs/tasks/administer-cluster/cluster-management/#cluster-autoscaler)
  ).
- Removing a pod from a node to permit something else to fit on that node.

-->

集群管理员操作包括：
- [排空（drain）节点](/docs//tasks/administer-cluster/safely-drain-node.md)进行修复或升级。
- 从集群中排空节点以缩小集群（了解[集群自动调节](/docs/tasks/administer-cluster/cluster-management/#cluster-autoscaler)）。
- 从节点中移除一个 pod，以允许其他 pod 使用该节点。

<!--

These actions might be taken directly by the cluster administrator, or by automation
run by the cluster administrator, or by your cluster hosting provider.

Ask your cluster administrator or consult your cloud provider or distribution documentation
to determine if any sources of voluntary disruptions are enabled for your cluster.
If none are enabled, you can skip creating Pod Disruption Budgets.

-->

这些操作可能由集群管理员直接执行，也可能由集群管理员或集群托管提供商自动执行。

询问您的集群管理员或咨询您的云提供商或发行文档，以确定是否为您的集群启用了任何自动中断源。如果没有启用，您可以跳过创建 Pod Disruption Budget（Pod 中断预算）。

<!--

## Dealing with Disruptions

Here are some ways to mitigate involuntary disruptions:

- Ensure your pod [requests the resources](/docs/tasks/configure-pod-container/assign-cpu-ram-container) it needs.
- Replicate your application if you need higher availability.  (Learn about running replicated
  [stateless](/docs/tasks/run-application/run-stateless-application-deployment.md)
  and [stateful](/docs/tasks/run-application/run-replicated-stateful-application.md) applications.)
- For even higher availability when running replicated applications,
  spread applications across racks (using
  [anti-affinity](/docs/user-guide/node-selection/#inter-pod-affinity-and-anti-affinity-beta-feature))
  or across zones (if using a
  [multi-zone cluster](/docs/admin/multiple-zones).)

-->

## 处理中断

以下是一些减轻非自愿性中断的方法：

- 确保您的 pod [请求所需的资源](/docs/tasks/configure-pod-container/assign-cpu-ram-container)。
- 如果您需要更高的可用性，请复制您的应用程序。 （了解有关运行复制的[无状态](/docs/tasks/run-application/run-stateless-application-deployment.md)和[有状态](/docs/tasks/run-application/run-replicated-stateful-application.md)应用程序的信息。）
- 为了在运行复制应用程序时获得更高的可用性，请跨机架（使用[反亲和性](/docs/user-guide/node-selection/#inter-pod-affinity-and-anti-affinity-beta-feature)）或跨区域（如果使用[多区域集群](/docs/admin/multiple-zones)）分布应用程序。

<!--

The frequency of voluntary disruptions varies.  On a basic Kubernetes cluster, there are
no voluntary disruptions at all.  However, your cluster administrator or hosting provider
may run some additional services which cause voluntary disruptions.  For example,
rolling out node software updates can cause voluntary updates.  Also, some implementations
of cluster (node) autoscaling may cause voluntary disruptions to defragment and compact nodes.
You cluster administrator or hosting provider should have documented what level of voluntary
disruptions, if any, to expect.

Kubernetes offers features to help run highly available applications at the same
time as frequent voluntary disruptions.  We call this set of features
*Disruption Budgets*.

-->

自愿中断的频率各不相同。在 Kubernetes 集群上，根本没有自愿的中断。但是，您的集群管理员或托管提供商可能会运行一些导致自愿中断的附加服务。例如，节点软件更新可能导致自愿更新。另外，集群（节点）自动缩放的某些实现可能会导致碎片整理和紧缩节点的自愿中断。您的集群管理员或主机提供商应该已经记录了期望的自愿中断级别（如果有的话）。

Kubernetes 提供的功能可以满足在频繁地自动中断的同时运行高可用的应用程序。我们称之为“中断预算”。

<!--


## How Disruption Budgets Work

An Application Owner can create a `PodDisruptionBudget` object (PDB) for each application.
A PDB limits the number pods of a replicated application that are down simultaneously from
voluntary disruptions.  For example, a quorum-based application would
like to ensure that the number of replicas running is never brought below the
number needed for a quorum. A web front end might want to
ensure that the number of replicas serving load never falls below a certain
percentage of the total.  

Cluster managers and hosting providers should use tools which
respect Pod Disruption Budgets by calling the [Eviction API](/docs/tasks/administer-cluster/safely-drain-node/#the-eviction-api)
instead of directly deleting pods.  Examples are the `kubectl drain` command
and the Kubernetes-on-GCE cluster upgrade script (`cluster/gce/upgrade.sh`).

When a cluster administrator wants to drain a node
they use the `kubectl drain` command.  That tool tries to evict all
the pods on the machine.  The eviction request may be temporarily rejected,
and the tool periodically retries all failed requests until all pods
are terminated, or until a configurable timeout is reached.

A PDB specifies the number of replicas that an application can tolerate having, relative to how
many it is intended to have.  For example, a Deployment which has a `spec.replicas: 5` is
supposed to have 5 pods at any given time.  If its PDB allows for there to be 4 at a time,
then the Eviction API will allow voluntary disruption of one, but not two pods, at a time.

The group of pods that comprise the application is specified using a label selector, the same
as the one used by the application's controller (deployment, stateful-set, etc).

The "intended" number of pods is computed from the `.spec.replicas` of the pods controller.
The controller is discovered from the pods using the `.metadata.ownerReferences` of the object.

PDBs cannot prevent [involuntary disruptions](#voluntary-and-involuntary-disruptions) from
occuring, but they do count against the budget.

Pods which are deleted or unavailable due to a rolling upgrade to an application do count
against the disruption budget, but controllers (like deployment and stateful-set)
are not limited by PDBs when doing rolling upgrades -- the handling of failures
during application updates is configured in the controller spec.
(Learn about [updating a deployment](/docs/concepts/cluster-administration/manage-deployment/#updating-your-application-without-a-service-outage).)

When a pod is evicted using the eviction API, it is gracefully terminated (see
`terminationGracePeriodSeconds` in [PodSpec](/docs/resources-reference/v1.6/#podspec-v1-core).)

-->

## 中断预算的工作原理

应用程序所有者可以为每个应用程序创建一个 `PodDisruptionBudget` 对象（PDB）。 PDB 将限制在同一时间自愿中断的复制应用程序中宕机的 Pod 的数量。例如，基于定额的应用程序希望确保运行的副本数量永远不会低于仲裁所需的数量。Web 前端可能希望确保提供负载的副本的数量永远不会低于总数的某个百分比。

集群管理器和托管提供商应使用遵循 `Pod Disruption Budgets` 的工具，方法是调用[Eviction API](/docs/tasks/administer-cluster/safely-drain-node/#the-eviction-api)而不是直接删除 Pod。例如 `kubectl drain` 命令和 Kubernetes-on-GCE 集群升级脚本（`cluster/gce/upgrade.sh`）。

当集群管理员想要排空节点时，可以使用 `kubectl drain` 命令。该命令会试图驱逐机器上的所有 pod。驱逐请求可能会暂时被拒绝，并且该工具会定期重试所有失败的请求，直到所有的 pod 都被终止，或者直到达到配置的超时时间。

PDB 指定应用程序可以容忍的副本的数量，相对于应该有多少副本。例如，具有 `spec.replicas：5` 的 Deployment 在任何给定的时间都应该有 5 个 Pod。如果其 PDB 允许在某一时刻有 4 个副本，那么驱逐 API 将只允许仅有一个而不是两个 Pod 自愿中断。

使用标签选择器来指定应用程序的一组 pod，这与应用程序的控制器（Deployment、StatefulSet 等）使用的相同。

Pod 控制器的 `.spec.replicas` 计算“预期的” pod 数量。使用对象的 `.metadata.ownerReferences` 值从控制器获取。

PDB 不能阻止[非自愿中断](#voluntary-and-involuntary-disruptions)的发生，但是它们确实会影响预算。

由于应用程序的滚动升级而被删除或不可用的 Pod 确实会计入中断预算，但控制器（如 Deployment 和 StatefulSet）在进行滚动升级时不受 PDB 的限制——在应用程序更新期间的故障处理是在控制器的规格（spec）中配置（了解[更新 Deployment](/docs/concepts/cluster-administration/manage-deployment/#updating-your-application-without-a-service-outage)）。

使用驱逐 API 驱逐 pod 时，pod 会被优雅地终止（请参阅 [PodSpec](/docs/resources-reference/v1.6/#podspec-v1-core) 中的 `terminationGracePeriodSeconds`）。

<!--

## PDB Example

Consider a cluster with 3 nodes, `node-1` through `node-3`.
The cluster is running several applications.  One of them has 3 replicas initially called
`pod-a`, `pod-b`, and `pod-c`.  Another, unrelated pod without a PDB, called `pod-x`, is also shown.
Initially, the pods are laid out as follows:

-->

## PDB 示例

假设集群有3个节点，`node-1` 到 `node-3`。集群中运行了一些应用，其中一个应用有3个副本，分别是 `pod-a`、`pod-b` 和 `pod-c`。另外，还有一个与它相关的不具有 PDB 的 pod，我们称为之为 `pod-x`。最初，所有 Pod 的分布如下：

|       node-1       |      node-2       |      node-3       |
| :----------------: | :---------------: | :---------------: |
| pod-a  *available* | pod-b *available* | pod-c *available* |
| pod-x  *available* |                   |                   |

<!--

All 3 pods are part of an deployment, and they collectively have a PDB which requires
there be at least 2 of the 3 pods to be available at all times.

For example, assume the cluster administrator wants to reboot into a new kernel version to fix a bug in the kernel.
The cluster administrator first tries to drain `node-1` using the `kubectl drain` command.
That tool tries to evict `pod-a` and `pod-x`.  This succeeds immediately.
Both pods go into the `terminating` state at the same time.
This puts the cluster in this state:

-->

所有的3个 pod 都是 Deployment 中的一部分，并且它们共同拥有一个 PDB，要求至少有3个 pod 中的2个始终处于可用状态。

例如，假设集群管理员想要重启系统，升级内核版本来修复内核中的错误。集群管理员首先使用 `kubectl drain` 命令尝试排除 `node-1`。该工具试图驱逐 `pod-a` 和 `pod-x`。这立即成功。两个 Pod 同时进入终止状态。这时的集群处于这种状态：

|  node-1 *draining*   |      node-2       |      node-3       |
| :------------------: | :---------------: | :---------------: |
| pod-a  *terminating* | pod-b *available* | pod-c *available* |
| pod-x  *terminating* |                   |                   |

<!--

The deployment notices that one of the pods is terminating, so it creates a replacement
called `pod-d`.  Since `node-1` is cordoned, it lands on another node.  Something has
also created `pod-y` as a replacement for `pod-x`.

(Note: for a StatefulSet, `pod-a`, which would be called something like `pod-1`, would need
to terminate completely before its replacement, which is also called `pod-1` but has a
different UID, could be created.  Otherwise, the example applies to a StatefulSet as well.)

Now the cluster is in this state:

-->

Deployment 注意到其中有一个 pod 处于正在终止，因此会创建了一个 `pod-d` 来替换。由于 `node-1` 被封锁（cordon），它落在另一个节点上。同时其它控制器也创建了 `pod-y` 作为 `pod-x` 的替代品。

（注意：对于 `StatefulSet`，`pod-a` 将被称为 `pod-1`，需要在替换之前完全终止，替代它的也称为 `pod-1`，但是具有不同的 UID，可以创建。否则，示例也适用于 StatefulSet。）

当前集群的状态如下：

|  node-1 *draining*   |      node-2       |      node-3       |
| :------------------: | :---------------: | :---------------: |
| pod-a  *terminating* | pod-b *available* | pod-c *available* |
| pod-x  *terminating* | pod-d *starting*  |       pod-y       |

<!--

At some point, the pods terminate, and the cluster look like this:

-->

在某一时刻，pod 被终止，集群看起来像下面这样子：

| node-1 *drained* |      node-2       |      node-3       |
| :--------------: | :---------------: | :---------------: |
|                  | pod-b *available* | pod-c *available* |
|                  | pod-d *starting*  |       pod-y       |

<!--

At this point, if an impatient cluster administrator tries to drain `node-2` or
`node-3`, the drain command will block, because there are only 2 available
pods for the deployment, and its PDB requires at least 2.  After some time

asses, `pod-d` becomes available.

The cluster state now looks like this:

-->

此时，如果一个急躁的集群管理员试图排空（drain）`node-2` 或 `node-3`，drain 命令将被阻塞，因为对于 Deployment 只有2个可用的 pod，并且其 PDB 至少需要2个。经过一段时间，`pod-d` 变得可用。

| node-1 *drained* |      node-2       |      node-3       |
| :--------------: | :---------------: | :---------------: |
|                  | pod-b *available* | pod-c *available* |
|                  | pod-d *available* |       pod-y       |

<!--

Now, the cluster admin tries to drain `node-2`.
The drain command will try to evict the two pods in some order, say 
`pod-b` first and then `pod-d`.  It will succeed at evicting `pod-b`.
But, when it tries to evict `pod-d`, it will be refused because that would leave only
one pod available for the deployment.

The deployment creates a replacement for `pod-b` called `pod-e`.
However, not there are not enough resources in the cluster to schedule
`pod-e`.  So, the drain  then the drain will block.  The cluster may end up in this
state:

-->

现在，集群管理员尝试排空 `node-2`。drain 命令将尝试按照某种顺序驱逐两个 pod，假设先是 `pod-b`，然后再 `pod-d`。它将成功驱逐 `pod-b`。但是，当它试图驱逐 `pod-d` 时，将被拒绝，因为这样对 Deployment 来说将只剩下一个可用的 pod。

Deployment 将创建一个名为 `pod-e` 的 `pod-b` 的替代品。但是，集群中没有足够的资源来安排 `pod-e`。那么，drain 命令就会被阻塞。集群最终可能是这种状态：

| node-1 *drained* |      node-2       |      node-3       |    *no node*    |
| :--------------: | :---------------: | :---------------: | :-------------: |
|                  | pod-b *available* | pod-c *available* | pod-e *pending* |
|                  | pod-d *available* |       pod-y       |                 |

<!--

At this point, the cluster administrator needs to
add a node back to the cluster to proceed with the upgrade.

You can see how Kubernetes varies the rate at which disruptions
can happen, according to:

- how many replicas an application needs
- how long it takes to gracefully shutdown an instance
- how long it takes a new instance to start up
- the type of controller
- the cluster's resource capacity

-->

此时，集群管理员需要向集群中添加回一个节点以继续升级操作。

您可以看到 Kubernetes 如何改变中断发生的速率，根据：

- 应用程序需要多少副本
- 正常关闭实例需要多长时间
- 启动新实例需要多长时间
- 控制器的类型
- 集群的资源能力

<!--

## Separating Cluster Owner and Application Owner Roles

Often, it is useful to think of the Cluster Manager
and Application Owner as separate roles with limited knowledge
of each other.   This separation of responsibilities
may make sense in these scenarios:

- when there are many application teams sharing a Kubernetes cluster, and 
  there is natural specialization of roles
- when third-party tools or services are used to automate cluster management

Pod Disruption Budgets support this separation of roles by providing an
interface between the roles.

If you do not have such a separation of responsibilities in your organization,
you may not need to use Pod Disruption Budgets.

-->

## 分离集群所有者和应用程序所有者角色

将集群管理者和应用程序所有者视为彼此知识有限的独立角色通常是很有用的。这种责任分离在这些情况下可能是有意义的：

- 当有许多应用程序团队共享一个 Kubernetes 集群，并且有自然的专业角色
- 使用第三方工具或服务来自动化集群管理

Pod Disruption Budget（Pod 中断预算） 通过在角色之间提供接口来支持这种角色分离。

如果您的组织中没有这样的职责分离，则可能不需要使用 Pod 中断预算。

<!--

## How to perform Disruptive Actions on your Cluster

If you are a Cluster Administrator, and you need to perform a disruptive action on all
the nodes in your cluster, such as a node or system software upgrade, here are some options:

- Accept downtime during the upgrade. 
- Fail over to another complete replica cluster.
   -  No downtime, but may be costly both for the duplicated nodes,
     and for human effort to orchestrate the switchover.
- Write disruption tolerant applications and use PDBs.
   - No downtime.
   - Minimal resource duplication.
   - Allows more automation of cluster administration.
   - Writing disruption-tolerant applications is tricky, but the work to tolerate voluntary
     disruptions largely overlaps with work to support autoscaling and tolerating
     involuntary disruptions.

-->

## 如何在集群上执行中断操作

如果您是集群管理员，要对集群的所有节点执行中断操作，例如节点或系统软件升级，则可以使用以下选择：

- 在升级期间接受停机时间。
- 故障转移到另一个完整的副本集群。
  - 没有停机时间，但是对于重复的节点和人工协调成本可能是昂贵的。
- 编写可容忍中断的应用程序和使用 PDB。
  - 没有停机时间。
  - 最小的资源重复。
  - 允许更多的集群管理自动化。
  - 编写可容忍中断的应用程序是很棘手的，但对于可容忍自愿中断，和支持自动调整以容忍非自愿中断，两者在工作上有大量的重叠。

{% endcapture %}

{% capture whatsnext %}

<!--

* Follow steps to protect your application by [configuring a Pod Disruption Budget](/docs/tasks/run-application//configure-pdb.md).
* Learn more about [draining nodes](/docs/tasks/administer-cluster//safely-drain-node.md)

-->

- 通过配置[Pod Disruption Budget（Pod 中断预算）](/docs/tasks/run-application//configure-pdb.md)来执行保护应用程序的步骤。
- 了解更多关于[排空节点](/docs/tasks/administer-cluster//safely-drain-node.md)的信息。

{% endcapture %} 


{% include templates/concept.md %}
