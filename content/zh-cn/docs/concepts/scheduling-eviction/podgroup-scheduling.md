---
title: PodGroup 调度
content_type: concept
weight: 80
---
<!--
title: PodGroup Scheduling
content_type: concept
weight: 80
-->

{{< feature-state feature_gate_name="GenericWorkload" >}}

<!--
The standard Kubernetes scheduler evaluates Pods sequentially. When multiple workloads, such as machine learning training jobs,
are submitted concurrently, this sequential evaluation can lead to resource deadlocks.
For example, two competing workloads might each schedule a subset of their Pods,
consuming cluster capacity but leaving neither workload with enough resources to fully start.

The PodGroup scheduling cycle evaluates a group of Pods as a single unit.
The scheduler attempts to find placements for all Pods in the group simultaneously.
If it cannot find sufficient resources to satisfy the entire group's requirements, none of the Pods are bound.
-->
标准的 Kubernetes 调度器按顺序逐个评估 Pod。当多个工作负载（例如机器学习训练作业）被并发提交时，
这种顺序评估可能导致资源死锁。例如，两个相互竞争的工作负载可能各自调度了其 Pod 的一个子集，
消耗了集群容量，但两个工作负载都没有足够的资源来完全启动。

PodGroup 调度周期将一组 Pod 作为单个单元进行评估。调度器尝试同时为组中的所有 Pod 寻找放置位置。
如果它无法找到足够的资源来满足整个组的需求，则不会绑定任何 Pod。

<!--
Additionally, treating the group as a unified entity establishes a foundational architecture
that simplifies the implementation of other group-based scheduling features.

This feature depends on the [Workload API](/docs/concepts/workloads/workload-api/).
Ensure the [`GenericWorkload`](/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload)
feature gate and the `scheduling.k8s.io/v1alpha1`
{{< glossary_tooltip text="API group" term_id="api-group" >}} are enabled in the cluster.
-->
此外，将组视为一个统一实体建立了一种基础架构，简化了其他基于组的调度特性的实现。

此特性依赖于 [Workload API](/zh-cn/docs/concepts/workloads/workload-api/)。
确保在集群中启用了
[`GenericWorkload`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload)
特性门控以及 `scheduling.k8s.io/v1alpha1` {{< glossary_tooltip text="API 组" term_id="api-group" >}}。

<!-- body -->

<!--
## PodGroup scheduling cycle

To support scheduling a group of Pods together, the kube-scheduler uses the **PodGroup scheduling cycle**.
Instead of processing Pods individually and holding them at a `WaitOnPermit` gate,
the scheduler evaluates the entire group of pending Pods belonging to a specific PodGroup collectively.
Rather than executing separate scheduling cycles for each Pod,
it evaluates feasibility for the entire group and moves directly to the binding phase afterwards.

When the scheduler pops a Pod belonging to a PodGroup, it retrieves all other queued Pods in that group.
It then sorts them deterministically based on priority and the time they were initially observed by the scheduler,
and initiates the PodGroup scheduling cycle as follows:
-->
## PodGroup 调度周期   {#podgroup-scheduling-cycle}

为了支持将一组 Pod 一起调度，kube-scheduler 使用了 **PodGroup 调度周期**。
调度器不再逐个处理 Pod 并将其阻塞在 `WaitOnPermit` 门控处，
而是集体评估属于特定 PodGroup 的整个悬决 Pod 组。
它不再为每个 Pod 执行单独的调度周期，而是评估整个组的可行性，随后直接进入绑定阶段。

当调度器弹出一个属于某 PodGroup 的 Pod 时，它会检索该组中所有其他排队的 Pod。
然后，它根据优先级和调度器最初观察到这些 Pod 的时间对它们进行确定性排序，
并按如下方式启动 PodGroup 调度周期：

<!--
1. **Snapshotting the cluster state:** When the scheduler begins evaluating a PodGroup,
   it takes a single snapshot of the cluster state that lasts for the entire duration of the cycle.
   This ensures the evaluation remains consistent for the whole group and prevents race conditions with other events.

2. **Finding feasible placements:** The scheduler runs the [PodGroup scheduling algorithm](#podgroup-scheduling-algorithm)
   to find valid Node placements for the Pods in the group.
-->
1. **对集群状态进行快照：** 当调度器开始评估 PodGroup 时，它会为整个周期拍摄一次集群状态快照。
   这确保了对整个组的评估保持一致，并防止与其他事件发生竞争状况。

2. **寻找可行的放置位置：** 调度器运行
   [PodGroup 调度算法](#podgroup-scheduling-algorithm)来为组中的 Pod 寻找有效的节点放置位置。

<!--
3. **Atomic decision:** Depending on the algorithm's outcome, the scheduling decision
   is applied atomically for the entire PodGroup.

   * **Success:** If the scheduler finds sufficient resources and valid placements for the Pods
     (e.g., satisfying the `minCount` constraint for [gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/)),
     those Pods proceed directly to the binding cycle with their selected nodes.
     Any remaining unschedulable Pods are returned to the scheduling queue to wait for available resources
     so they can join the already scheduled Pods. 
     
     Furthermore, if new Pods are added to a PodGroup after others have already been scheduled,
     the cycle evaluates the new Pods while accounting for the existing ones.

   * **Failure:** If the scheduler cannot find enough resources to make the PodGroup feasible
     (e.g., failing to meet the `minCount` constraint), the entire PodGroup is considered unschedulable.
     No Pods are bound, but instead, all are returned to the scheduling queue.
     Standard scheduling backoff logic applies, allowing the PodGroup to be retried later.

By using this single-cycle approach, the scheduler avoids inefficient bottlenecks
where partially scheduled groups reserve cluster capacity while waiting indefinitely for the rest of their group to fit.
-->
3. **原子性决策：** 根据算法的结果，调度决策以原子方式应用于整个 PodGroup。

   * **成功：** 如果调度器找到了足够的资源和有效的 Pod 放置位置
     （例如，满足 [Gang 调度](/zh-cn/docs/concepts/scheduling-eviction/gang-scheduling/)的 `minCount` 约束），
     这些 Pod 将带着其选定的节点直接进入绑定周期。任何剩余的不可调度 Pod 将被返回到调度队列，等待可用资源，
     以便它们可以加入已被调度的 Pod。

     此外，如果在其他 Pod 已经被调度后有新的 Pod 被添加到 PodGroup，该周期将在考虑已存在 Pod 的同时评估新 Pod。

   * **失败：** 如果调度器无法找到足够的资源使 PodGroup 可行
     （例如，未能满足 `minCount` 约束），则整个 PodGroup 被视为不可调度。
     不会绑定任何 Pod，所有 Pod 都会被返回到调度队列。标准的调度退避逻辑适用，允许 PodGroup 稍后重试。

通过使用这种单周期方法，调度器避免了低效的瓶颈，即部分调度的组在无限期等待其余组员适配的同时占用了集群容量。

<!--
## PodGroup scheduling algorithm

The default PodGroup scheduling algorithm relies heavily on the baseline Pod-based scheduling algorithm.
It iterates over the Pods and performs the following for each:
-->
## PodGroup 调度算法   {#podgroup-scheduling-algorithm}

默认的 PodGroup 调度算法在很大程度上依赖于基于 Pod 的基线调度算法。它遍历所有 Pod，并对每个 Pod 执行以下操作：

<!--
1. Finds a feasible node using the standard per-Pod filtering and scoring phases.
   
   * If the Pod fits, it is temporarily assumed and reserved on the selected node until the end of the scheduling algorithm.
   * If the Pod cannot fit, the scheduler attempts preemption by running the `PostFilter` extension point.

2. Checks whether the schedulable Pods meet the group's scheduling criteria
   (e.g., the `minCount` for [gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/)) using the `Permit` extension point.
   If it returns a `Success` status for any Pod, the PodGroup is deemed feasible.
   If the algorithm processes all Pods without achieving a `Success` status, the PodGroup is considered unschedulable.
-->
1. 使用标准的逐 Pod 过滤和评分阶段寻找可行的节点。

   * 如果 Pod 适配，则假定它暂时被保留在所选节点上，直到调度算法结束。
   * 如果 Pod 无法适配，调度器会通过运行 `PostFilter` 扩展点来尝试抢占。

2. 使用 `Permit` 扩展点检查可调度的 Pod 是否满足组的调度标准
   （例如，[Gang 调度](/zh-cn/docs/concepts/scheduling-eviction/gang-scheduling/)的 `minCount`）。
   如果它对任何 Pod 返回 `Success` 状态，则 PodGroup 被视为可行。
   如果算法处理完所有 Pod 都未达到 `Success` 状态，则 PodGroup 被视为不可调度。

<!--
## Placement scheduling algorithm
{{< feature-state feature_gate_name="TopologyAwareWorkloadScheduling" >}}

Placement scheduling algorithm is an alternative PodGroup scheduling algorithm, which uses
[scheduling plugins](/docs/reference/scheduling/config/#scheduling-plugins) to find the optimal
placement for the considered PodGroup. Users can accommodate the algorithm to their specific needs
by using and configuring plugins.

The algorithm proceeds in three main phases for a given PodGroup:
-->
## 放置调度算法   {#placement-scheduling-algorithm}

{{< feature-state feature_gate_name="TopologyAwareWorkloadScheduling" >}}

放置调度算法是一种替代的 PodGroup 调度算法，
它使用[调度插件](/zh-cn/docs/reference/scheduling/config/#scheduling-plugins)来为所考虑的 PodGroup
寻找最优放置位置。用户可以通过使用和配置插件来使算法适应其特定需求。

对于给定的 PodGroup，该算法分三个主要阶段进行：

<!--
### Phase 1: Candidate placement generation

Generates candidate *placements* (subsets of nodes, that are theoretically feasible for PodGroup
assignment), for example based on the PodGroup's scheduling constraints (which can be defined
in the PodGroup object).

This phase executes as extension point: `PlacementGeneratePlugin`.
-->
### 阶段 1：候选放置生成   {#phase-1-candidate-placement-generation}

生成候选**放置位置**（节点子集，理论上可用于 PodGroup 分配），
例如基于 PodGroup 的调度约束（可在 PodGroup 对象中定义）。

此阶段作为扩展点执行：`PlacementGeneratePlugin`。

<!--
### Phase 2: Pod-level filtering and feasibility check

Validates each proposed placement, by running a default PodGroup scheduling algorithm, to see if
the required number of Pods from the PodGroup can fit. If they can, the placement is marked as feasible.
-->
### 阶段 2：Pod 级别过滤和可行性检查   {#phase-2-pod-level-filtering-and-feasibility-check}

通过运行默认的 PodGroup 调度算法来验证每个提议的放置位置，
查看 PodGroup 中所需数量的 Pod 是否能适配。如果可以，则该放置位置被标记为可行。

<!--
### Phase 3:  Placement scoring and selection

Scores all feasible placements to select the optimal domain for the PodGroup.

This phase executes as extension point: `PlacementScorePlugin`.
-->
### 阶段 3：放置评分和选择   {#phase-3-placement-scoring-and-selection}

对所有可行的放置位置进行评分，以为 PodGroup 选择最优域。

此阶段作为扩展点执行：`PlacementScorePlugin`。

<!--
### Limitations

The PodGroup scheduling algorithm relies on specific Pod sorting and may fail to find a valid placement
that could have been discovered by processing the group's Pods in a different order. In particular:

* For basic **homogeneous** Pod groups (i.e., those where all Pods have identical scheduling requirements
  and lack inter-Pod dependencies like affinity, anti-affinity, or topology spread constraints),
  the algorithm is expected to find a placement if one exists.

* For **heterogeneous** Pod groups, finding a valid placement is not guaranteed.

* For Pod groups with **inter-Pod dependencies**, finding a valid placement is not guaranteed.
-->
### 局限性   {#limitations}

PodGroup 调度算法依赖于特定的 Pod 排序，可能无法找到通过以不同顺序处理组中的 Pod 本可发现的有效放置位置。具体来说：

* 对于基本的**同质** Pod 组（即所有 Pod 具有相同调度需求，
  且缺乏 Pod 间依赖关系（如亲和性、反亲和性或拓扑分布约束）的 Pod 组），
  如果存在放置位置，算法预期能够找到。

* 对于**异质** Pod 组，不保证能找到有效的放置位置。

* 对于具有 **Pod 间依赖关系**的 Pod 组，不保证能找到有效的放置位置。

<!--
In addition to the above, for cases involving **intra-group dependencies**
(e.g., when the schedulability of one Pod depends on another group member via inter-Pod affinity),
this algorithm may fail to find a placement regardless of cluster state due to its deterministic processing order.

For consistent behavior throughout the entire cycle, the algorithm requires that all Pods belonging to a single PodGroup
share the same `.spec.schedulerName`. This requirement is validated before the cycle starts,
and the PodGroup is rejected if the constraint is not met.
-->
除上述情况外，对于涉及**组内依赖**的情况（例如，当一个 Pod 的可调度性通过 Pod 间亲和性依赖于另一个组成员时），
由于其确定性的处理顺序，无论集群状态如何，此算法都可能无法找到放置位置。

为了在整个周期内保持一致的行为，该算法要求属于单个 PodGroup 的所有 Pod
共享相同的 `.spec.schedulerName`。此要求在周期开始前进行验证，如果不满足此约束，PodGroup 将被拒绝。

<!--
## PodGroup conditions

After a PodGroup scheduling cycle completes, the scheduler updates conditions on the
PodGroup's `status.conditions`:

* `PodGroupScheduled`: reports whether the PodGroup has been successfully scheduled.
* `DisruptionTarget`: indicates the PodGroup is about to be terminated due to a
  disruption such as preemption.
-->
## PodGroup 状况   {#podgroup-conditions}

PodGroup 调度周期完成后，调度器会更新 PodGroup 的 `status.conditions` 上的状况：

* `PodGroupScheduled`：报告 PodGroup 是否已被成功调度。
* `DisruptionTarget`：指示 PodGroup 即将因中断（如抢占）而被终止。

<!--
### `PodGroupScheduled`

When the scheduling cycle succeeds, the condition is set to `True` with reason
`Scheduled`. For `gang` policy PodGroups, this means at least `minCount` Pods were
placed.

When scheduling fails, the condition is set to `False` with one of the following
reasons:

* `Unschedulable` — the group could not be placed due to resource constraints,
  affinity or anti-affinity rules, or insufficient capacity for the gang.
* `SchedulerError` — scheduling failed because of an internal scheduler error
  (for example, while parsing scheduling constraints such as `nodeAffinity`).
-->
### `PodGroupScheduled`

当调度周期成功时，该状况被设置为 `True`，原因为
`Scheduled`。对于 `gang` 策略的 PodGroup，这意味着至少放置了 `minCount` 个 Pod。

当调度失败时，该状况被设置为 `False`，原因为以下之一：

* `Unschedulable` — 由于资源约束、亲和性或反亲和性规则，或编组容量不足，组无法被放置。
* `SchedulerError` — 由于调度器内部错误导致调度失败（例如，在解析 `nodeAffinity` 等调度约束时）。

<!--
### `DisruptionTarget`

When the scheduler preempts a PodGroup to make room for higher-priority PodGroups or
Pods, it sets this condition to `True` with reason `PreemptionByScheduler`.

You can check conditions with:
-->
### `DisruptionTarget`   {#disruptiontarget}

当调度器抢占 PodGroup 以便为更高优先级的 PodGroup 或
Pod 腾出空间时，它会将此状况设置为 `True`，原因为 `PreemptionByScheduler`。

你可以使用以下命令检查状况：

```shell
kubectl get podgroup <name> -o jsonpath='{.status.conditions}'
```

## {{% heading "whatsnext" %}}

<!--
* Learn about the [Workload API](/docs/concepts/workloads/workload-api/).
* See how to [reference a Workload](/docs/concepts/workloads/pods/workload-reference/) in a Pod.
* Read about [gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/).
-->
* 了解 [Workload API](/zh-cn/docs/concepts/workloads/workload-api/)。
* 了解如何在 Pod 中[引用 Workload](/zh-cn/docs/concepts/workloads/pods/workload-reference/)。
* 进一步阅读 [Gang 调度](/zh-cn/docs/concepts/scheduling-eviction/gang-scheduling/)。
