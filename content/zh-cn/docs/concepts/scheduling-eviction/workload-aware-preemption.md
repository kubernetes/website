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
{{< feature-state feature_gate_name="GenericWorkload">}}

{{< note >}}
<!--
In v1.36, the workload-aware preemption logic was gated by
`WorkloadAwarePreemption` feature gate. This feature gate was merged into
`GenericWorkload` feature gate in v1.37.
-->
在 v1.36 中，工作负载感知的抢占逻辑由 `WorkloadAwarePreemption` 特性门控控制。
此特性门控在 v1.37 中被合并到 `GenericWorkload` 特性门控中。
{{< /note >}}

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
This feature is coupled with [Gang Scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/)
and depends on the [Workload API](/docs/concepts/workloads/workload-api/).
Ensure the [`scheduling.k8s.io/v1beta1`]{{< glossary_tooltip text="API group" term_id="api-group" >}} is enabled in the cluster.
-->
此特性与[编组调度](/zh-cn/docs/concepts/scheduling-eviction/gang-scheduling/)耦合，
并依赖于 [Workload API](/zh-cn/docs/concepts/workloads/workload-api/)。
确保集群中启用了 [`scheduling.k8s.io/v1beta1`]{{< glossary_tooltip text="API 组" term_id="api-group" >}}。

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

<!--
4. Performance and optimality considerations: For the performance reasons,
   the workload-aware preemption first simulates removal all potential victims and 
   runs the scheduling once. It then tries to reprieve as many victims as possible
   for selected placement. This trade off means that there may exists an alternative placement
   causing less preemptions, but it is not selected by the scheduler due to performance reasons.
-->
4. 性能与最优性考量：出于性能原因，工作负载感知的抢占首先模拟移除所有潜在被抢占者并运行一次调度。
   然后它尝试为选定的放置方案尽可能多地豁免被抢占者。这种权衡意味着可能存在导致更少抢占的替代放置方案，
   但由于性能原因，调度器不会选择它。

{{< note >}}
<!--
When scheduling a single Pod, the default pod preemption applies.
In v1.36, when the scheduler performs a default preemption for a single Pod
and it attempts to preempt a Pod belonging to a PodGroup, it does **not**
respect the `priority` or `disruptionMode` fields of that PodGroup. 
This limitation no longer applies in v1.37.
-->
当调度单个 Pod 时，适用默认的 Pod 抢占机制。
在 v1.36 中，当调度器为单个 Pod 执行默认抢占并尝试抢占属于某个 PodGroup 的 Pod 时，
它**不会**考虑该 PodGroup 的 `priority` 或 `disruptionMode` 字段。
此限制不再适用于 v1.37。
{{< /note >}}

<!--
### Reprieval algorithm

When running workload-aware preemption, the scheduler runs the simulation where it removes potential preemption victims
and runs the pod group scheduling algorithm. It then tries to reprieve as many victims as possible for returned placement.
To do that, the scheduler reuses the CycleStates from pod group scheduling. For each of the potential victims,
sorted by their importance, the scheduler:
-->
### 豁免算法   {#reprieval-algorithm}

在运行工作负载感知的抢占时，调度器会运行模拟，移除潜在的抢占被抢占者并运行 PodGroup 调度算法。
然后它尝试为返回的放置方案尽可能多地豁免被抢占者。为此，调度器会复用 PodGroup 调度的 CycleStates。
对于每个按重要性排序的潜在被抢占者，调度器：

<!--
1. Adds victim pods back to their nodes and CycleStates of preemptor pods.
2. For each pod in the PodGroup (in the same order as in scheduling algorithm):
   * Runs Filter plugins for the pod on its proposed node
   * Adds the pod to its proposed node
   * Runs Reserve plugins for the pod on its proposed node
-->
1. 将被抢占者的 Pod 重新添加到其节点和抢占者 Pod 的 CycleStates 中。
2. 对于 PodGroup 中的每个 Pod（按与调度算法相同的顺序）：

   * 在其建议的节点上为该 Pod 运行 Filter 插件
   * 将该 Pod 添加到其建议的节点上
   * 在其建议的节点上为该 Pod 运行 Reserve 插件

<!--
If for each pod, the Filtering passes, the victim pods are kept on their nodes.

If filtering fails for at least one pod, victim pods are removed from CycleStates and node.
-->
如果对于每个 Pod，Filtering 都通过，则被抢占者的 Pod 保留在其节点上。

如果至少有一个 Pod 的 Filtering 失败，则被抢占者的 Pod 将从 CycleStates 和节点中移除。

<!--
In both cases the scheduler preemptor pods are removed from their nodes and their Unreserve is called,
so the next reprieval attempt can validate scheduling of PodGroup. The scheduler then proceeds with
another potential victim until all victims are processed.
-->
在两种情况下，调度器都会将抢占者 Pod 从其节点上移除并调用其 Unreserve，
以便下一次豁免尝试可以验证 PodGroup 的调度。然后调度器继续处理另一个潜在被抢占者，
直到所有被抢占者都被处理完毕。

<!--
### Preemption for CompositePodGroups
-->
### CompositePodGroup 的抢占   {#preemption-for-compositepodgroups}

{{< feature-state feature_gate_name="CompositePodGroup" >}}

<!--
When the [`CompositePodGroup`](/docs/reference/command-line-tools-reference/feature-gates/#CompositePodGroup)
feature gate and the `scheduling.k8s.io/v1alpha3` {{< glossary_tooltip text="API group" term_id="api-group" >}}
are enabled, workload-aware preemption provides support for `CompositePodGroups` as well.
-->
当 [`CompositePodGroup`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#CompositePodGroup)
特性门控和 `scheduling.k8s.io/v1alpha3` {{< glossary_tooltip text="API 组" term_id="api-group" >}}启用时，
工作负载感知的抢占也为 `CompositePodGroup` 提供支持。

<!--
The underlying preemption mechanism is the same as for `PodGroups` - if the scheduler needs to free
up capacity to place the root `CompositePodGroup`, it evaluates preemption for the entire group
hierarchy, rather than for individual pods.

`CompositePodGroups` can be selected as preemption victims as well. The victim selection process is
adjusted to take `CompositePodGroups` into account in the following way:
-->
底层的抢占机制与 `PodGroup` 相同——如果调度器需要释放容量来放置根 `CompositePodGroup`，
它会对整个组层级进行抢占评估，而不是针对单个 Pod。

`CompositePodGroup` 也可以被选为抢占被抢占者。被抢占者选择过程经过调整，以按以下方式考虑 `CompositePodGroup`：

<!--
1. Victim importance hierarchy:
   - `CompositePodGroups` are considered more important than standalone `PodGroups` of the same
     priority.
   - For two `CompositePodGroups` of the same priority, the one with more members (larger size) is
     considered more important.
-->
1. 被抢占者重要性层级：

   - 在相同优先级下，`CompositePodGroup` 比独立的 `PodGroup` 更重要。
   - 对于两个相同优先级的 `CompositePodGroup`，成员更多（规模更大）的那个被认为更重要。

<!--
2. Disruption mode: Similar to `PodGroups`, `CompositePodGroups` specify
   [disruption mode](/docs/concepts/workloads/workload-api/disruption-and-priority/) that determines
   how its child groups should be treated during preemption.
-->
2. 干扰模式：与 `PodGroup` 类似，`CompositePodGroup`
   指定了[干扰模式](/zh-cn/docs/concepts/workloads/workload-api/disruption-and-priority/)，
   用于决定在抢占期间其子组应如何被处理。

<!--
Besides workload-aware preemption, `CompositePodGroups` can be selected as preemption victims by
default Pod preemption during Pod scheduling cycle, alongside `PodGroups` and Pods. Default Pod
preemption shares the victim importance hierarchy logic with the workload-aware preemption and
respects the `disruptionMode` field of `CompositePodGroups`.
-->
除了工作负载感知的抢占外，在 Pod 调度周期中，`CompositePodGroup` 也可以被默认 Pod 抢占选为被抢占者，
与 `PodGroup` 和 Pod 并列。默认 Pod 抢占与工作负载感知的抢占共享被抢占者重要性层级逻辑，
并尊重 `CompositePodGroup` 的 `disruptionMode` 字段。

## {{% heading "whatsnext" %}}

<!--
* Learn more about [PodGroup Priority and Disruption](/docs/concepts/workloads/workload-api/disruption-and-priority/).
* Learn about the [Workload API](/docs/concepts/workloads/workload-api/).
* Read more about [Gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/).
-->
* 进一步了解 [PodGroup 优先级和干扰](/zh-cn/docs/concepts/workloads/workload-api/disruption-and-priority/)。
* 了解 [Workload API](/zh-cn/docs/concepts/workloads/workload-api/)。
* 进一步阅读[编组调度](/zh-cn/docs/concepts/scheduling-eviction/gang-scheduling/)。
