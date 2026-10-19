---
title: 编组调度（Gang Scheduling）
content_type: concept
weight: 70
---
<!--
title: Gang Scheduling
content_type: concept
weight: 70
-->

<!-- overview -->
{{< feature-state feature_gate_name="GenericWorkload" >}}

<!--
Gang scheduling ensures that a group of Pods are scheduled on an "all-or-nothing" basis.
If the cluster cannot accommodate the entire group (or a defined minimum number of Pods, specified by `minCount`),
none of the Pods are bound to a node.
-->
编组调度（Gang Scheduling）确保一组 Pod 以 **全有或全无（all-or-nothing）** 的方式进行调度。
如果集群无法容纳整个组（或某确定的最小 Pod 数量，由 `minCount` 指定），则不会将任何 Pod 绑定到节点上。

{{< note >}}
<!--
While the scheduler never admits fewer Pods than the configured `minCount` during initial placement, the actual runtime
count of scheduled Pods can drop below this threshold if running Pods are later deleted or evicted, or if the
`minCount` requirement increases. When this happens, the scheduler will only place additional Pods if the
combined total of already scheduled Pods and newly feasible unscheduled Pods reaches or exceeds `minCount`.
-->
尽管调度器在初始放置阶段绝不会接纳少于所配置 `minCount` 的 Pod，
但如果运行中的 Pod 后续被删除或驱逐，或者 `minCount` 要求被调高，
已调度的 Pod 实际运行时数量可能会下降到该阈值之下。发生这种情况时，
调度器只有在已调度的 Pod 与新可行的未调度 Pod 的合计数量达到或超过
`minCount` 时，才会放置额外的 Pod。
{{< /note >}}

<!--
This feature depends on the [PodGroup API](/docs/concepts/workloads/podgroup-api/).
Ensure the [`GenericWorkload`](/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload)
feature gate and the `scheduling.k8s.io/v1beta1`
{{< glossary_tooltip text="API group" term_id="api-group" >}} are enabled in the cluster.
-->
此特性依赖于 [PodGroup API](/zh-cn/docs/concepts/workloads/podgroup-api/)。确保在集群中启用
[`GenericWorkload`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload)
特性门控以及 `scheduling.k8s.io/v1beta1`
{{< glossary_tooltip text="API 组" term_id="api-group" >}}。

<!-- body -->

<!--
## How it works

When the `GangScheduling` plugin is enabled, the scheduler alters the lifecycle for Pods belonging
to a [PodGroup](/docs/concepts/workloads/podgroup-api/) that has a `gang`
[scheduling policy](/docs/concepts/workloads/workload-api/policies/).
The process follows these steps for each PodGroup:
-->
## 工作原理   {#how-it-works}

当 `GangScheduling` 插件被启用时，调度器修改
具有 `gang` [调度策略](/zh-cn/docs/concepts/workloads/workload-api/policies/)的
[PodGroup](/zh-cn/docs/concepts/workloads/podgroup-api/) 内 Pod 的生命周期。
每个 PodGroup 的处理过程都遵循以下步骤：

<!--
1. The scheduler holds Pods in the `PreEnqueue` phase until:
   * The referenced PodGroup object exists.
   * The number of Pods created for the PodGroup (both already scheduled and unscheduled) is at least equal to `minCount`.

   The PodGroup does not enter the active scheduling queue until both conditions are met.
-->
1. 调度器在 `PreEnqueue` 阶段暂存 Pod，直到满足以下条件：
   * 引用的 PodGroup 对象存在。
   * 为 PodGroup 创建的 Pod 数量（包括已调度和未调度的）至少等于 `minCount`。

   只有同时满足这两个条件，PodGroup 才会进入活跃调度队列。

<!--
2. Once the quorum is met, the scheduler attempts to find placements for all unscheduled Pods in the group.
   It utilizes the [PodGroup scheduling](/docs/concepts/scheduling-eviction/podgroup-scheduling/) cycle to make a single,
   atomic scheduling decision. The `GangScheduling` plugin implements a `PlacementFeasible` extension point that is invoked for ach
   evaluated Pod during the cycle. This is used to determine whether the `minCount` constraint is satisfied
   by comparing the number of successfully placed Pods (including those already scheduled in previous cycles) against the `minCount` value.
-->
2. 当达到额定数量（quorum）后，调度器尝试为组中的所有未调度 Pod 寻找可调度的节点。
   它利用了 [PodGroup 调度](/zh-cn/docs/concepts/scheduling-eviction/podgroup-scheduling/) 
   周期来做出单一的、原子性的调度决定。
   `GangScheduling` 插件实现了一个 `PlacementFeasible` 扩展点，
   它会在每个调度周期内针对每一个被评估的 Pod 被调用。该扩展点用于通过比较已成功放置的
   Pod 数量（包括先前周期中已经调度的 Pod）与 `minCount` 的值，来判断 `minCount` 约束是否得到满足。

<!--
3. If the scheduler finds valid placements for at least the `minCount` number of Pods,
   it allows those successfully placed Pods to be bound to their assigned nodes.
   If it cannot find enough placements to satisfy the `minCount` requirement, none of the Pods are scheduled.
   Instead, they are moved to the unschedulable queue to wait for cluster resources to free up,
   allowing other workloads to be scheduled in the meantime.
-->
3. 如果调度器为至少 `minCount` 数量的 Pod 找到了有效的放置位置，
   它允许这些成功放置的 Pod 绑定到它们被分配的节点上。
   如果它无法找到足够的放置位置来满足 `minCount` 要求，则不会调度这些 Pod。
   相反，这些 Pod 会被移入不可调度的队列，等待集群资源释放，同时允许其他工作负载被调度。

<!--
## Hierarchical gang scheduling with CompositePodGroups
-->
## 层级 Gang 调度与 CompositePodGroups

{{< feature-state feature_gate_name="CompositePodGroup" >}}

<!--
When the [`CompositePodGroup`](/docs/reference/command-line-tools-reference/feature-gates/#CompositePodGroup)
feature gate and the `scheduling.k8s.io/v1alpha3` {{< glossary_tooltip text="API group" term_id="api-group" >}}
are enabled, gang scheduling extends its support to `CompositePodGroups`.

Contrary to `PodGroups` that group Pods, `CompositePodGroups` group child groups together - either
`PodGroups` or other `CompositePodGroups`. `CompositePodGroup` specifies a scheduling policy that
applies to its child groups during scheduling:

* `gang` policy with a `minGroupCount` field, specifying the minimum number of child groups (either
  `CompositePodGroup` or `PodGroup` objects) that must be scheduled together as a single unit
  atomically.
* `basic` policy which indicates that child groups can be scheduled independently.
-->
当启用 [`CompositePodGroup`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#CompositePodGroup)
特性门控和 `scheduling.k8s.io/v1alpha3`{{</* glossary_tooltip text="API 组（API Group）" term_id="api-group" */>}}时，
Gang Scheduling 将其支持范围扩展到 `CompositePodGroup`。

`PodGroup` 将多个 Pod 编为一组，而 `CompositePodGroup` 则与之不同——它将子组编为一组，
这些子组既可以是 `PodGroup`，也可以是其他 `CompositePodGroup`。
`CompositePodGroup` 指定一个调度策略，该策略会在调度期间应用于其子组：

* `gang` 策略，附带 `minGroupCount` 字段，用于指定必须作为一个整体被原子调度的最少子组数量（这些子组可以是
  `CompositePodGroup` 或 `PodGroup` 对象）。
* `basic` 策略，表示各子组可以彼此独立地进行调度。

<!--
`gang` policy is useful for multi-component workloads that require all-or-nothing scheduling across
multiple child groups, ensuring that a minimum number of child groups are scheduled together. An
example workload with such needs is replicated AI training.

`basic` policy can be used for workloads that comprise multiple groups of Pods each of which can be
scheduled as an independent gang, e.g. for AI inference workloads.
-->
`gang` 策略适用于那些需要在多个子组之间进行"全有或全无"式调度的多组件工作负载，
确保最少数量的子组被一同调度。具有此类需求的工作负载示例包括多副本的 AI 训练任务。

`basic` 策略可用于由多组 Pod 组成、且每组都可以作为独立的 Gang 单独调度的工作负载，例如 AI 推理工作负载。

<!--
### Hierarchical quorum

The `GangScheduling` plugin holds the root `CompositePodGroup` from entering the active scheduling
queue in the `PreEnqueue` phase until it satisfies the **hierarchical quorum**. This quorum is
evaluated bottom-up, from leaf `PodGroup` objects up to the root `CompositePodGroup`:

- A leaf `PodGroup` **satisfies quorum** if and only if the `PodGroup` object exists and can
  potentially meet its scheduling policy criteria:
  - For a `gang` policy: at least `minCount` of its constituent Pods have been created.
  - For a `basic` policy: at least one of its constituent Pods has been created.
- A `CompositePodGroup` **satisfies quorum** if and only if the `CompositePodGroup` object exists
  and can potentially meet its scheduling policy criteria:
  - For a `gang` policy: at least `minGroupCount` of its direct child groups satisfy quorum.
  - For a `basic` policy: at least one of its direct child groups satisfies quorum.
- The overall **hierarchical quorum** is satisfied if and only if the root `CompositePodGroup`
  satisfies the quorum.
-->
### 分层仲裁（Hierarchical Quorum）

`GangScheduling` 插件会在 `PreEnqueue` 阶段阻止根 `CompositePodGroup` 进入活动调度队列，
直到其满足**层级法定人数**为止。该法定人数的评估是自底向上进行的，
从作为叶节点的 `PodGroup` 对象一直向上评估到根 `CompositePodGroup`：

- 叶子 `PodGroup` **满足法定人数**当且仅当该 `PodGroup` 对象存在，并且有可能满足其调度策略条件：
  - 对于 `gang` 策略：其组成 Pod 中至少有 `minCount` 个已被创建。
  - 对于 `basic` 策略：其组成 Pod 中至少有 1 个已被创建。

- `CompositePodGroup` **满足法定人数**当且仅当该 `CompositePodGroup` 对象存在，并且有可能满足其调度策略条件：
  - 对于 `gang` 策略：其直接子组中至少有 `minGroupCount` 个满足法定人数。
  - 对于 `basic` 策略：其直接子组中至少有 1 个满足法定人数。

- 整体的**层级法定人数**得到满足，当且仅当根 `CompositePodGroup` 满足法定人数。

<!--
Ultimately, a root `CompositePodGroup` is admitted into the active scheduling queue if and only if
it satisfies the hierarchical quorum and there is at least one pending Pod that belongs to one of
its descendant `PodGroups`.
-->
最终，一个根 `CompositePodGroup` 会被接纳进入活动调度队列，当且仅当其满足层级法定人数，
并且至少存在一个属于其某个后代 `PodGroup` 的悬决 Pending Pod。

<!--
### Placement feasibility

The `GangScheduling` plugin's `PlacementFeasible` method supports evaluation for both
`PodGroups` and `CompositePodGroups`. It is invoked by the scheduling cycle before starting child
evaluation and after evaluating each child group of a `CompositePodGroup`.

By taking into account the number of child groups that were successfully scheduled and the child
groups that were not evaluated in the scheduling cycle just yet, `PlacementFeasible` determines
whether the group's policy constraint is still achievable, allowing the scheduling cycle to abort
the evaluation of the `CompositePodGroup` early if its underlying scheduling policy cannot be
satisfied anymore.
-->
### 放置可行性

`GangScheduling` 插件的 `PlacementFeasible` 方法支持对 `PodGroup` 和 `CompositePodGroup`
进行评估。该方法会在调度周期开始子组评估之前，以及对 `CompositePodGroup`
的每一个子组评估完成之后被调度周期调用。

通过综合考虑已成功调度的子组数量以及本调度周期内尚未评估的子组数量，`PlacementFeasible`
会判断该组的策略约束是否仍然有达成的可能。如果 `CompositePodGroup` 的底层调度策略已经无法再被满足，
调度周期便可以提前中止对该 `CompositePodGroup` 的评估。

## {{% heading "whatsnext" %}}

<!--
* Learn about the [PodGroup API](/docs/concepts/workloads/podgroup-api/) and its [lifecycle](/docs/concepts/workloads/podgroup-api/lifecycle/).
* Read about the [CompositePodGroup API](/docs/concepts/workloads/compositepodgroup-api/).
* Read about [PodGroup scheduling policies](/docs/concepts/workloads/workload-api/policies/).
* Read about [PodGroup scheduling](/docs/concepts/scheduling-eviction/podgroup-scheduling/).
-->
* 了解 [PodGroup API](/zh-cn/docs/concepts/workloads/podgroup-api/)
  及其[生命周期](/zh-cn/docs/concepts/workloads/podgroup-api/lifecycle/)。
* 阅读关于 [CompositePodGroup API](/docs/concepts/workloads/compositepodgroup-api/) 的内容。
* 阅读关于 [PodGroup 调度策略](/zh-cn/docs/concepts/workloads/workload-api/policies/)的信息。
* 阅读关于 [PodGroup 调度](/zh-cn/docs/concepts/scheduling-eviction/podgroup-scheduling/)的信息。
