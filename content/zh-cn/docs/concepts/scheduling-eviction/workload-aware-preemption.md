---
title: 工作负载感知的抢占
content_type: concept
weight: 80
---
<!--
title: Workload-Aware Preemption
content_type: concept
weight: 80
-->

<!-- overview -->
{{< feature-state feature_gate_name="WorkloadAwarePreemption">}}

<!--
Workload-aware preemption introduces a preemption mechanism specifically designed for PodGroups.
When a PodGroup cannot be scheduled, the scheduler utilizes a preemption logic that tries to
make scheduling of this PodGroup possible. This approach is used exclusively during PodGroup scheduling
and replaces the default preemption mechanism for pods from a given PodGroup.

When this feature is enabled, the scheduler treats the PodGroup as a single preemptor unit,
rather than evaluating individual pods from a PodGroup in isolation. To make room for the pending pods in the group,
it searches for victims across the entire cluster,
and knows how to treat and preempt other PodGroups as victims according to their disruption modes.
-->
工作负载感知的抢占引入了一种专门为 PodGroup 设计的抢占机制。
当 PodGroup 无法被调度时，调度器会使用抢占逻辑，尝试使该 PodGroup 的调度成为可能。
此方法仅在 PodGroup 调度期间使用，并替代给定 PodGroup 中 Pod 的默认抢占机制。

当此特性被启用时，调度器将 PodGroup 视为单个抢占者单元，而不是孤立地评估 PodGroup 中的各个 Pod。
为了给组中悬决的 Pod 腾出空间，它会在整个集群中搜索被抢占者，
并知道如何根据其他 PodGroup 的干扰模式将其作为被抢占者来处理和抢占。

<!--
This feature depends on the [Gang Scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/)
and the [Workload API](/docs/concepts/workloads/workload-api/).
Ensure the [`GenericWorkload`](/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload)
and [`GangScheduling`](/docs/reference/command-line-tools-reference/feature-gates/#GangScheduling) feature gates
and the `scheduling.k8s.io/v1alpha2` {{< glossary_tooltip text="API group" term_id="api-group" >}} are enabled in the cluster.
-->
此特性依赖于[编组调度](/zh-cn/docs/concepts/scheduling-eviction/gang-scheduling/)和
[Workload API](/zh-cn/docs/concepts/workloads/workload-api/)。确保在集群中启用了
[`GenericWorkload`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload)
和 [`GangScheduling`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#GangScheduling)
特性门控以及 `scheduling.k8s.io/v1alpha2` {{< glossary_tooltip text="API 组" term_id="api-group" >}}。

<!-- body -->

<!--
## How it works

The workload-aware preemption process follows the same principles
as [default preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption)
with a few differences:
-->
## 工作原理   {#how-it-works}

工作负载感知的抢占过程遵循与[默认抢占](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption)相同的原则，
但存在以下差异：

<!--
1. Cluster-wide domain: Instead of evaluating preemption node by node,
   the scheduler evaluates the entire cluster as a single domain.
   It selects a set of victims across multiple nodes that can be removed
   to make enough room for the preemptor PodGroup to be scheduled.
-->
1. 集群范围域：调度器不会逐个节点地评估抢占，而是将整个集群作为单个域进行评估。
   它会在多个节点间选择一组可以被移除的被抢占者，从而为抢占者 PodGroup 腾出足够的调度空间。

<!--
2. Victim importance hierarchy: The scheduler decides which preemption units
   (individual pods or PodGroups) are more critical and should be spared from preemption
   using a strict hierarchy:
   * Priority: Higher priority units are always more important.
   * Workload type: PodGroups are considered more important than individual Pods of the same priority.
   * Group size (PodGroups): If both units are PodGroups,
     the one with more members (larger size) is considered more important.
   * Start time: Units that started earlier are more important.
-->
2. 被抢占者重要性层级：调度器使用严格的层级来决定哪些抢占单元（单个 Pod 或 PodGroup）更为关键、应当被豁免抢占：

   * 优先级：优先级更高的单元总是更重要。
   * 工作负载类型：在相同优先级下，PodGroup 比单个 Pod 更重要。
   * 组大小（PodGroup）：如果两个单元都是 PodGroup，成员更多（规模更大）的那个被认为更重要。
   * 启动时间：更早启动的单元更重要。

<!--
3. Pod group priority and disruption: The scheduler considers the specific
   [priority and disruption mode](/docs/concepts/workloads/workload-api/disruption-and-priority/) of a PodGroup
   to evaluate if and how its pods can be preempted during preemption events.
-->
3. PodGroup 优先级和干扰：调度器会考虑 PodGroup
   特定的[优先级和干扰模式](/zh-cn/docs/concepts/workloads/workload-api/disruption-and-priority/)，
   以评估在抢占事件中其 Pod 是否以及如何能被抢占。

{{< note >}}
<!--
When scheduling a single Pod, the default pod preemption applies.
As of 1.36, when the scheduler performs a default preemption for a single Pod
and it attempts to preempt a Pod belonging to a PodGroup, it does **not**
respect the `priority` or `disruptionMode` fields of that PodGroup.
-->
当调度单个 Pod 时，适用默认的 Pod 抢占机制。
从 1.36 版本开始，当调度器为单个 Pod 执行默认抢占并尝试抢占属于某个 PodGroup 的 Pod 时，
它**不会**考虑该 PodGroup 的 `priority` 或 `disruptionMode` 字段。
{{< /note >}}

## {{% heading "whatsnext" %}}

<!--
* Learn more about [PodGroup Priority and Disruption](/docs/concepts/workloads/workload-api/disruption-and-priority/).
* Learn about the [Workload API](/docs/concepts/workloads/workload-api/).
* Read more about [Gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/).
-->
* 进一步了解 [PodGroup 优先级和干扰](/zh-cn/docs/concepts/workloads/workload-api/disruption-and-priority/)。
* 了解 [Workload API](/zh-cn/docs/concepts/workloads/workload-api/)。
* 进一步阅读[编组调度](/zh-cn/docs/concepts/scheduling-eviction/gang-scheduling/)。
