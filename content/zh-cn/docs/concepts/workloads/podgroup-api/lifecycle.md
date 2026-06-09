---
title: PodGroup 生命周期
content_type: concept
weight: 10
---

<!--
title: PodGroup Lifecycle
content_type: concept
weight: 10
-->

<!-- overview -->

{{< feature-state feature_gate_name="GenericWorkload" >}}

<!--
A [PodGroup](/docs/concepts/workloads/podgroup-api/) is scheduled as a unit and protected
from premature deletion while its Pods are still running.
-->
[PodGroup](/zh-cn/docs/concepts/workloads/podgroup-api/) 作为一个单元进行调度，
并在 Pod 仍在运行时受到保护，防止提前删除。

<!-- body -->

<!--
## Ownership and lifecycle
-->
## 所有权和生命周期   {#ownership-and-lifecycle}

<!--
`PodGroups` are owned by the workload controller that created them (for example, a Job)
via standard `ownerReferences`. When the owning object is deleted, `PodGroups` are
automatically garbage collected.
-->
`PodGroup` 由创建它们的工作负载控制器（例如 Job）通过标准的 `ownerReferences` 拥有。
当拥有对象被删除时，`PodGroup` 会自动被垃圾回收。

<!--
`PodGroup` names must be unique within a namespace and must be valid
[DNS subdomains](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
PodGroup 名称在名字空间内必须是唯一的，并且必须是有效的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

<!--
## Creation ordering
-->
## 创建顺序   {#creation-ordering}

<!--
Controllers must create objects in this order:
-->
控制器必须按以下顺序创建对象：

<!--
1. `Workload` — the scheduling policy template.
2. `PodGroup` — the runtime instance.
3. `Pods` — with `spec.schedulingGroup.podGroupName` pointing to the `PodGroup`.
-->
1. `Workload` — 调度策略模板。
2. `PodGroup` — 运行时实例。
3. `Pod` — 其 `spec.schedulingGroup.podGroupName` 指向 `PodGroup`。

<!--
If a `PodGroup` includes a `podGroupTemplateRef` that points to a `Workload` that does
not exist (or is being deleted), the API server rejects the `PodGroup` creation request.
The referenced `Workload` must exist before the `PodGroup` can be created.
-->
如果 `PodGroup` 包含一个指向不存在（或正在被删除）的 `Workload` 的 `podGroupTemplateRef`，
API 服务器会拒绝 `PodGroup` 创建请求。
引用的 `Workload` 必须在 `PodGroup` 创建之前存在。

<!--
If a `Pod` references a `PodGroup` that does not yet exist, the `Pod` remains pending.
The scheduler automatically queues the `Pod` for scheduling once the `PodGroup` is created.
-->
如果 `Pod` 引用了不存在的 `PodGroup`，则该 `Pod` 保持 pending 状态。
一旦 `PodGroup` 被创建，调度器会自动将 `Pod` 加入调度队列。

<!--
## Deletion protection
-->
## 删除保护   {#deletion-protection}

<!--
A `PodGroup` cannot be fully deleted while any of its Pods are still running.
A dedicated finalizer ensures that deletion is blocked until all `Pods` referencing the
`PodGroup` have reached a terminal phase (`Succeeded` or `Failed`).
-->
当 PodGroup 的任何 Pod 仍在运行时，不能完全删除该 PodGroup。
一个专门的 finalizer 确保在所有引用该 PodGroup 的 Pod 达到终止阶段（`Succeeded` 或 `Failed`）之前阻止删除。

<!--
## Controller-managed and user-managed PodGroups
-->
## 控制器管理的 PodGroup 和用户管理的 PodGroup   {#controller-managed-and-user-managed-podgroups}

<!--
In most cases, workload controllers (for example, Job) create `PodGroups` automatically
(controller-managed). The controller determines the `podGroupName` for each Pod
at creation time, similar to how a `DaemonSet` sets node affinity per Pod.
-->
在大多数情况下，工作负载控制器（例如 Job）自动创建 `PodGroup`（控制器管理）。
控制器在创建时为每个 Pod 确定 `podGroupName`，
类似于 `DaemonSet` 为每个 Pod 设置节点亲和性的方式。

<!--
If you need more control over naming and lifecycle, you can create `PodGroup` objects directly and set
`spec.schedulingGroup.podGroupName` in your Pod templates yourself
(user-managed). This gives you full control over `PodGroup` creation and naming.
-->
如果你需要对命名和生命周期进行更多控制，可以直接创建 `PodGroup` 对象，
并在 Pod 模板中自己设置 `spec.schedulingGroup.podGroupName`（用户管理）。
这使你可以完全控制 `PodGroup` 的创建和命名。

<!--
## Limitations
-->
## 限制   {#limitations}

<!--
* All Pods in a `PodGroup` must use the same `.spec.schedulerName`.
  If a mismatch is detected, the scheduler rejects all Pods in the group as unschedulable.
-->
* `PodGroup` 中的所有 Pod 必须使用相同的 `.spec.schedulerName`。
  如果检测到不匹配，调度器会拒绝组中的所有 Pod 为不可调度。

<!--
* The `spec.schedulingPolicy.gang.minCount` field on a PodGroup is immutable.
  Once created, you cannot change the minimum number of Pods that must be schedulable for the group to be admitted.
-->
* PodGroup 上的 `spec.schedulingPolicy.gang.minCount` 字段是不可变的。
  创建后，你无法更改组准入所需的可调度 Pod 最小数量。

<!--
* The `spec.schedulingGroup` field on a Pod is immutable.
  Once set, a Pod cannot move to a different PodGroup.
-->
* Pod 上的 `spec.schedulingGroup` 字段是不可变的。
  设置后，Pod 无法移动到不同的 PodGroup 中。

<!--
* The maximum number of `PodGroupTemplates` in a single `Workload` is 8.
-->
* 单个 `Workload` 中 `PodGroupTemplates` 的最大数量为 8。

<!--
* The `PodGroupScheduled` condition reflects the outcome of the initial scheduling
  attempt only. Once the condition is set to `True`, the scheduler does not update it
  if Pods later fail, are evicted, or stop running.
-->
* `PodGroupScheduled` 状况仅反映初始调度尝试的结果。
  一旦状况设置为 `True`，即使后续 Pod 后续失败、被驱逐或停止运行，调度器也不会更新它。

## {{% heading "whatsnext" %}}

<!--
* Learn about the [PodGroup API](/docs/concepts/workloads/podgroup-api/) overview and structure.
* Learn about the [Workload API](/docs/concepts/workloads/workload-api/) that provides `PodGroupTemplates`.
* See how Pods reference their PodGroup via the [scheduling group](/docs/concepts/workloads/pods/scheduling-group/) field.
* Understand the [gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/) algorithm.
* Read [PodGroup scheduling policies](/docs/concepts/workloads/workload-api/policies/) for details on `basic` and `gang`.
-->
* 了解 [PodGroup API](/zh-cn/docs/concepts/workloads/podgroup-api/) 概览和结构。
* 了解提供 `PodGroupTemplates` 的[工作负载 API](/zh-cn/docs/concepts/workloads/workload-api/)。
* 查看 Pod 如何通过[调度组](/zh-cn/docs/concepts/workloads/pods/scheduling-group/)字段引用其 PodGroup。
* 理解 [Gang 调度](/zh-cn/docs/concepts/scheduling-eviction/gang-scheduling/) 算法。
* 阅读 [PodGroup 调度策略](/zh-cn/docs/concepts/workloads/workload-api/policies/)了解更多关于 `basic` 和 `Gang` 的详细信息。
