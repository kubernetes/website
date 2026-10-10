---
layout: blog
title: "Kubernetes v1.32：QueueingHint 为优化 Pod 调度带来了新的可能"
date: 2024-12-12
slug: scheduler-queueinghint
Author: >
  [Kensei Nakada](https://github.com/sanposhiho) (Tetrate.io)
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---

<!--
layout: blog
title: "Kubernetes v1.32: QueueingHint Brings a New Possibility to Optimize Pod Scheduling"
date: 2024-12-12
slug: scheduler-queueinghint
Author: >
  [Kensei Nakada](https://github.com/sanposhiho) (Tetrate.io)
-->

<!--
The Kubernetes [scheduler](/docs/concepts/scheduling-eviction/kube-scheduler/) is the core
component that selects the nodes on which new Pods run. The scheduler processes
these new Pods **one by one**. Therefore, the larger your clusters, the more important
the throughput of the scheduler becomes.

Over the years, Kubernetes SIG Scheduling has improved the throughput
of the scheduler in multiple enhancements. This blog post describes a major improvement to the
scheduler in Kubernetes v1.32: a 
[scheduling context element](/docs/concepts/scheduling-eviction/scheduling-framework/#extension-points)
named _QueueingHint_. This page provides background knowledge of the scheduler and explains how
QueueingHint improves scheduling throughput.
-->
Kubernetes [调度器](/zh-cn/docs/concepts/scheduling-eviction/kube-scheduler/)是为新
Pod 选择运行节点的核心组件，调度器会**逐一**处理这些新 Pod。
因此，集群规模越大，调度器的吞吐量就越重要。

多年来，Kubernetes SIG Scheduling 通过多次增强改进了调度器的吞吐量。
本博客文章描述了 Kubernetes v1.32 中对调度器的一项重大改进：
一个名为 **QueueingHint** 的[调度上下文元素](/zh-cn/docs/concepts/scheduling-eviction/scheduling-framework/#extension-points)。
本页面提供了关于调度器的背景知识，并解释了 QueueingHint 如何提升调度吞吐量。

<!--
## Scheduling queue

The scheduler stores all unscheduled Pods in an internal component called the _scheduling queue_. 

The scheduling queue consists of the following data structures:
- **ActiveQ**: holds newly created Pods or Pods that are ready to be retried for scheduling.
- **BackoffQ**: holds Pods that are ready to be retried but are waiting for a backoff period to end. The
   backoff period depends on the number of unsuccessful scheduling attempts performed by the scheduler on that Pod.
- **Unschedulable Pod Pool**: holds Pods that the scheduler won't attempt to schedule for one of the
   following reasons:
   - The scheduler previously attempted and was unable to schedule the Pods. Since that attempt, the cluster
      hasn't changed in a way that could make those Pods schedulable.
   - The Pods are blocked from entering the scheduling cycles by PreEnqueue Plugins, 
for example, they have a [scheduling gate](/docs/concepts/scheduling-eviction/pod-scheduling-readiness/#configuring-pod-schedulinggates),
and get blocked by the scheduling gate plugin.
-->
## 调度队列

调度器将所有未调度的 Pod 存储在一个名为**调度队列**的内部组件中。

调度队列由以下数据结构组成：

- **ActiveQ**：保存新创建的 Pod 或准备重试调度的 Pod。
- **BackoffQ**：保存准备重试但正在等待退避期结束的 Pod。退避期取决于调度器对该 Pod 执行的不成功调度尝试次数。
- **无法调度的 Pod 池**：保存调度器不会尝试调度的 Pod，原因可能包括以下几点：
  - 调度器之前尝试调度这些 Pod 但未能成功。自那次尝试以来，集群没有发生任何使得这些 Pod 可以被调度的变化。
  - 这些 Pod 被 [PreEnqueue 插件](/zh-cn/docs/concepts/scheduling-eviction/pod-scheduling-readiness/#configuring-pod-schedulinggates)阻止进入调度周期，
    例如，它们具有一个[调度门控](/zh-cn/docs/concepts/scheduling-eviction/pod-scheduling-readiness/#configuring-pod-schedulinggates)，并被调度门控插件阻止。

<!--
## Scheduling framework and plugins

The Kubernetes scheduler is implemented following the Kubernetes
[scheduling framework](/docs/concepts/scheduling-eviction/scheduling-framework/).

And, all scheduling features are implemented as plugins
(e.g., [Pod affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)
is implemented in the `InterPodAffinity` plugin.)
-->
## 调度框架和插件

Kubernetes 调度器的实现遵循 Kubernetes 的[调度框架](/zh-cn/docs/concepts/scheduling-eviction/scheduling-framework/)。

并且，所有的调度特性都是以插件的形式实现的
（例如，[Pod 亲和性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)是在
`InterPodAffinity` 插件中实现的。）

<!--
The scheduler processes pending Pods in phases called _cycles_ as follows:
1. **Scheduling cycle**: the scheduler takes pending Pods from the activeQ component of the scheduling
    queue  _one by one_. For each Pod, the scheduler runs the filtering/scoring logic from every scheduling plugin. The
    scheduler then decides on the best node for the Pod, or decides that the Pod can't be scheduled at that time.
    
    If the scheduler decides that a Pod can't be scheduled, that Pod enters the Unschedulable Pod Pool
    component of the scheduling queue. However, if the scheduler decides to place the Pod on a node, 
    the Pod goes to the binding cycle.
    
1. **Binding cycle**: the scheduler communicates the node placement decision to the Kubernetes API
    server. This operation bounds the Pod to the selected node. 
-->
调度器按照称为**周期**的阶段来处理待调度的 Pod，具体如下：

1. **调度周期（Scheduling cycle）**：调度器从调度队列的 activeQ 组件中**逐一**取出待调度的 Pod。
   对于每个 Pod，调度器会运行来自每个调度插件的过滤/评分逻辑。然后，调度器决定最适合该 Pod 的节点，
   或者决定当前无法调度该 Pod。

   如果调度器决定一个 Pod 无法被调度，该 Pod 将进入调度队列的无法调度的 Pod
   池（Unschedulable Pod Pool）组件。然而，如果调度器决定将 Pod 放置到某个节点上，
   该 Pod 将进入绑定周期（Binding cycle）。

2. **绑定周期（Binding cycle）**：调度器将节点分配决策传达给 Kubernetes API 服务器。
   这一操作将 Pod 绑定到选定的节点。

<!--
Aside from some exceptions, most unscheduled Pods enter the unschedulable pod pool after each scheduling
cycle. The Unschedulable Pod Pool component is crucial because of how the scheduling cycle processes Pods one by one. If the scheduler had to constantly retry placing unschedulable Pods, instead of offloading those
Pods to the Unschedulable Pod Pool, multiple scheduling cycles would be wasted on those Pods.
-->
除了少数例外情况，大多数未调度的 Pod 在每次调度周期后都会进入无法调度的 Pod 池。
无法调度的 Pod 池组件至关重要，因为调度周期是逐个处理 Pod 的。
如果调度器需要不断重试放置那些无法调度的 Pod，而不是将这些 Pod 分载到无法调度的 Pod 池中，
将会在这些 Pod 上浪费很多调度周期。

<!--
## Improvements to retrying Pod scheduling with QueuingHint

Unschedulable Pods only move back into the ActiveQ or BackoffQ components of the scheduling
queue if changes in the cluster might allow the scheduler to place those Pods on nodes. 

Prior to v1.32, each plugin registered which cluster changes could solve their failures, an object creation, update, or deletion in the cluster (called _cluster events_),
with `EnqueueExtensions` (`EventsToRegister`),
and the scheduling queue retries a pod with an event that is registered by a plugin that rejected the pod in a previous scheduling cycle.

Additionally, we had an internal feature called `preCheck`, which helped further filtering of events for efficiency, based on Kubernetes core scheduling constraints;
For example, `preCheck` could filter out node-related events when the node status is `NotReady`. 
-->
## 使用 QueueingHint 改进 Pod 调度重试

无法调度的 Pod 仅在集群发生可能允许调度器将这些 Pod 放置到节点上的变化时，
才会重新移入调度队列的 ActiveQ 或 BackoffQ 组件。

在 v1.32 之前，每个插件通过 `EnqueueExtensions`（`EventsToRegister`）注册哪些集群变化
（称为**集群事件**，即集群中的对象创建、更新或删除）可以解决其失败情况。当某个插件在之前的调度周期中拒绝了某个 Pod 后，
调度队列会在出现该插件注册的事件时重试该 Pod 的调度。

此外，我们还拥有一个名为 `preCheck` 的内部特性，它基于 Kubernetes 核心调度约束进一步过滤事件以提高效率；
例如，`preCheck` 可以在节点状态为 `NotReady` 时过滤掉与节点相关的事件。

<!--
However, we had two issues for those approaches:
- Requeueing with events was too broad, could lead to scheduling retries for no reason.
   - A new scheduled Pod _might_ solve the `InterPodAffinity`'s failure, but not all of them do.
For example, if a new Pod is created, but without a label matching `InterPodAffinity` of the unschedulable pod, the pod wouldn't be schedulable.
- `preCheck` relied on the logic of in-tree plugins and was not extensible to custom plugins,
like in issue [#110175](https://github.com/kubernetes/kubernetes/issues/110175).
-->
然而，这些方法存在两个问题：

- 基于事件的重新排队过于宽泛，可能会导致毫无来由的调度重试。
  - 新调度的 Pod **可能**解决 `InterPodAffinity` 失败的问题，但并非所有新 Pod 都能做到。
    例如，如果创建了一个新的 Pod，但该 Pod 没有与无法调度的 Pod 的 `InterPodAffinity` 匹配的标签，
    则该 Pod 仍然无法被调度。
- `preCheck` 依赖于 in-tree 插件的逻辑，并且不适用于自定义插件，如在问题
  [#110175](https://github.com/kubernetes/kubernetes/issues/110175) 中所述。

<!--
Here QueueingHints come into play; 
a QueueingHint subscribes to a particular kind of cluster event, and make a decision about whether each incoming event could make the Pod schedulable.

For example, consider a Pod named `pod-a` that has a required Pod affinity. `pod-a` was rejected in
the scheduling cycle by the `InterPodAffinity` plugin because no node had an existing Pod that matched
the Pod affinity specification for `pod-a`.
-->
在这里，QueueingHints 发挥了作用；QueueingHint 订阅特定类型的集群事件，并决定每个传入的事件是否可以使 Pod 变得可调度。

例如，考虑一个名为 `pod-a` 的 Pod，它具有必需的 Pod 亲和性。`pod-a` 在调度周期中被
`InterPodAffinity` 插件拒绝，因为没有节点上有现有的 Pod 符合 `pod-a` 的 Pod 亲和性规约。

<!--
{{< figure src="queueinghint1.svg" alt="A diagram showing the scheduling queue and pod-a rejected by InterPodAffinity plugin" caption="A diagram showing the scheduling queue and pod-a rejected by InterPodAffinity plugin" >}}

`pod-a` moves into the Unschedulable Pod Pool. The scheduling queue records which plugin caused
the scheduling failure for the Pod. For `pod-a`, the scheduling queue records that the `InterPodAffinity`
plugin rejected the Pod.
-->
{{< figure src="queueinghint1.svg" alt="显示调度队列和被 InterPodAffinity 插件拒绝的 pod-a 的图示" caption="显示调度队列和被 InterPodAffinity 插件拒绝的 pod-a 的图示" >}}

`pod-a` 移入无法调度的 Pod 池 (Unschedulable Pod Pool)。调度队列记录了导致 Pod
调度失败的插件。对于 `pod-a`，调度队列记录了 `InterPodAffinity` 插件拒绝了该 Pod。


<!--
`pod-a` will never be schedulable until the InterPodAffinity failure is resolved. 
There're some scenarios that the failure could be resolved, one example is an existing running pod gets a label update and becomes matching a Pod affinity.
For this scenario, the `InterPodAffinity` plugin's `QueuingHint` callback function checks every Pod label update that occurs in the cluster. 
Then, if a Pod gets a label update that matches the Pod affinity requirement of `pod-a`, the `InterPodAffinity`,
plugin's `QueuingHint` prompts the scheduling queue to move `pod-a` back into the ActiveQ or
the BackoffQ component.

{{< figure src="queueinghint2.svg" alt="A diagram showing the scheduling queue and pod-a being moved by InterPodAffinity QueueingHint" caption="A diagram showing the scheduling queue and pod-a being moved by InterPodAffinity QueueingHint" >}}
-->
`pod-a` 在 `InterPodAffinity` 失败被解决之前将永远不会被调度。
有一些情景可以解决这一失败，例如，一个现有的运行中的 Pod 获取了标签更新并符合 Pod 亲和性要求。
在这种情况下，`InterPodAffinity` 插件的 `QueuingHint` 回调函数会检查集群中发生的每一个 Pod 标签更新。
然后，如果一个 Pod 的标签更新符合 `pod-a` 的 Pod 亲和性要求，`InterPodAffinity` 插件的
`QueuingHint` 会提示调度队列将 `pod-a` 重新移入 ActiveQ 或 BackoffQ 组件。

{{< figure src="queueinghint2.svg" alt="显示调度队列和由 InterPodAffinity QueuingHint 移动的 pod-a 的图示" caption="显示调度队列和由 InterPodAffinity QueuingHint 移动的 pod-a 的图示" >}}

<!--
## QueueingHint's history and what's new in v1.32

At SIG Scheduling, we have been working on the development of QueueingHint since
Kubernetes v1.28.

While QueuingHint isn't user-facing, we implemented the `SchedulerQueueingHints` feature gate as a
safety measure when we originally added this feature. In v1.28, we implemented QueueingHints with a
few in-tree plugins experimentally, and made the feature gate enabled by default.
-->
## QueueingHint 的历史及 v1.32 中的新变化

在 SIG Scheduling，我们自 Kubernetes v1.28 开始就致力于 QueueingHint 的开发。

尽管 QueueingHint 并不是面向用户的特性，我们在最初添加此特性时还是实现了 `SchedulerQueueingHints`
特性门控作为安全措施。在 v1.28 中，我们实验性地为几个 in-tree 插件实现了 QueueingHints，并将该特性门控默认启用。

<!--
However, users reported a memory leak, and consequently we disabled the feature gate in a
patch release of v1.28.  From v1.28 until v1.31, we kept working on the QueueingHint implementation
within the rest of the in-tree plugins and fixing bugs.

In v1.32, we made this feature enabled by default again. We finished implementing QueueingHints
in all plugins and also identified the cause of the memory leak!

We thank all the contributors who participated in the development of this feature and those who reported and investigated the earlier issues.
-->
然而，用户报告了一个内存泄漏问题，因此我们在 v1.28 的一个补丁版本中禁用了该特性门控。从 v1.28 到 v1.31，
我们一直在其余的 in-tree 插件中继续开发 QueueingHint，并修复相关 bug。

在 v1.32 中，我们再次默认启用了这一特性。我们完成了所有插件中 QueueingHints 的实现，并且找到了内存泄漏的原因！

我们感谢所有参与此特性开发的贡献者，以及那些报告和调查早期问题的用户。

<!--
## Getting involved

These features are managed by Kubernetes [SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling).

Please join us and share your feedback.
-->
## 参与其中

这些特性由 Kubernetes [SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling) 管理。

请加入我们并分享你的反馈。

<!--
## How can I learn more?

- [KEP-4247: Per-plugin callback functions for efficient requeueing in the scheduling queue](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/4247-queueinghint/README.md)
-->
## 如何了解更多？

- [KEP-4247：为调度队列中的高效重新排队实现每插件回调函数](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/4247-queueinghint/README.md)
