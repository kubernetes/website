---
title: CompositePodGroup 生命周期
content_type: concept
weight: 10
---
<!--
title: CompositePodGroup Lifecycle
content_type: concept
weight: 10
-->

<!-- overview -->
{{< feature-state feature_gate_name="CompositePodGroup" >}}

<!--
A [CompositePodGroup](/docs/concepts/workloads/compositepodgroup-api/) represents a non-leaf node
in a multi-level `PodGroup` hierarchy. Unlike `PodGroup` resources, `CompositePodGroup` resources do
not directly contain Pods. Instead, they maintain a hierarchy of descendant `CompositePodGroup` and
`PodGroup` objects and carry scheduling policies that apply to its children groups.
-->
`CompositePodGroup` 表示多级 `PodGroup` 层级结构中的一个非叶节点。
与 `PodGroup` 资源不同，`CompositePodGroup` 资源不直接包含 Pod。
相反，它们维护由后代 `CompositePodGroup` 和 `PodGroup` 对象构成的层级结构，
并承载适用于其子组的调度策略。

<!-- body -->

<!--
## Ownership and garbage collection

A `CompositePodGroup` object, together with its descendant `CompositePodGroup` and `PodGroup`
resources, is owned by the workload controller that created it via Kubernetes `ownerReferences`.
When the owning workload object gets deleted, cascading garbage collection automatically deletes the
associated group hierarchy.
-->
## 属主关系与垃圾收集   {#ownership-and-garbage-collection}

一个 `CompositePodGroup` 对象及其后代 `CompositePodGroup` 和 `PodGroup` 资源，
归属于创建它的工作负载控制器（通过 Kubernetes 的 `ownerReferences` 建立属主关系）。
当拥有它的工作负载对象被删除时，级联垃圾收集会自动删除关联的组层级结构。

<!--
`CompositePodGroup` names must be unique within a namespace and must be valid
[DNS subdomains](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
`CompositePodGroup` 名称在名字空间内必须唯一，且必须是合法的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

<!--
## Creation ordering

To ensure proper hierarchy resolution and scheduling, workload controllers create resources in a
top-down order:
-->
## 创建顺序   {#creation-ordering}

为确保正确的层级解析和调度，工作负载控制器按自顶向下的顺序创建资源：

<!--
1. **`Workload`**: Defines static templates (`CompositePodGroupTemplates` and `PodGroupTemplates`).
2. **Root `CompositePodGroup`**: Created with `spec.workloadRef` pointing to the root template in
   the `Workload`.
3. **Descendant `CompositePodGroups` and `PodGroups`**: Created top-down. Each child group specifies
   its parent by using `spec.parentCompositePodGroupName` and its template using `spec.workloadRef`.
4. **`Pods`**: Created with `spec.schedulingGroup.podGroupName` pointing to their leaf `PodGroup`.
-->
1. **`Workload`**：定义静态模板（`CompositePodGroupTemplates` 和 `PodGroupTemplates`）。
2. **根级 `CompositePodGroup`**：创建时用 `spec.workloadRef` 指向 `Workload` 中的根模板。
3. **后代 `CompositePodGroup` 和 `PodGroup`**：按自顶向下的顺序创建。每个子组通过
   `spec.parentCompositePodGroupName` 指定其父组，并通过 `spec.workloadRef` 指定其模板。
4. **`Pods`**：创建时用 `spec.schedulingGroup.podGroupName` 指向其所属的叶子 `PodGroup`。

<!--
If a group references a parent `CompositePodGroup` that does not exist, or if a Pod references
a `PodGroup` that has not yet been created, the scheduler holds off scheduling until all parent
resources in the hierarchy exist.
-->
如果某个组引用的父 `CompositePodGroup` 不存在，或者某个 Pod 引用的 `PodGroup` 尚未创建，
则调度器会暂缓调度，直到层级结构中的所有父资源都存在为止。

<!--
## Limitations and validation rules

- **Consistent scheduler name**: All Pods across an entire `CompositePodGroup` hierarchy must use
  the same `spec.schedulerName`. If a mismatch is detected, the scheduler rejects the hierarchy as
  unschedulable.
- **Consistent priority**: All Pods across an entire `CompositePodGroup` hierarchy must specify the
  same value of `spec.priority` which must be equal to the priority specified by the root group. If
  a mismatch is detected, the scheduler rejects the hierarchy as unschedulable.
-->
## 限制与验证规则   {#limitations-and-validation-rules}

- **一致的调度器名称**：整个 `CompositePodGroup` 层级结构中的所有 Pod 必须使用相同的
  `spec.schedulerName`。如果检测到不一致，调度器会将该层级结构视为不可调度而拒绝。
- **一致的优先级**：整个 `CompositePodGroup` 层级结构中的所有 Pod 必须指定相同的
  `spec.priority` 值，且该值必须等于根组指定的优先级。如果检测到不一致，
  调度器会将该层级结构视为不可调度而拒绝。

<!--
- **Consistent preemption policy**: All Pods across an entire `CompositePodGroup` hierarchy must use
  the same `spec.preemptionPolicy`. In addition, when the
  [PodGroupPreemptionPolicy](/docs/reference/command-line-tools-reference/feature-gates/podgroup-preemption-policy/)
  feature gate is enabled, the root group's preemption policy must be equal to the one specified by
  the Pods. If a mismatch is detected, the scheduler rejects the hierarchy as unschedulable.
-->
- **一致的抢占策略**：整个 `CompositePodGroup` 层级结构中的所有 Pod 必须使用相同的
  `spec.preemptionPolicy`。此外，当启用
  [PodGroupPreemptionPolicy](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#PodGroupPreemptionPolicy)
  特性门控时，根组的抢占策略必须与 Pod 指定的策略一致。如果检测到不一致，
  调度器会将该层级结构视为不可调度而拒绝。

<!--
- **Maximum nesting depth**: The group-template hierarchy supports a maximum depth of 4 levels.
- **List item limit**: The maximum number of child `CompositePodGroupTemplates` and
  `PodGroupTemplates` at any level of a `Workload` is 8.
- **Immutable gang group count**: The `spec.schedulingPolicy.gang.minGroupCount` field on a
  `CompositePodGroup` is immutable after creation.
- **Immutable hierarchy references**: `spec.parentCompositePodGroupName` on groups and
  `spec.schedulingGroup` on Pods are immutable once set.
-->
- **最大嵌套深度**：组模板层级结构最多支持 4 级嵌套。
- **列表项数量上限**：`Workload` 任意层级下的子 `CompositePodGroupTemplates` 和
  `PodGroupTemplates` 数量上限为 8。
- **不可变的 gang 组数量**：`CompositePodGroup` 上的
  `spec.schedulingPolicy.gang.minGroupCount` 字段在创建后不可变。
- **不可变的层级引用**：组上的 `spec.parentCompositePodGroupName` 和 Pod 上的
  `spec.schedulingGroup` 一经设置便不可变。

## {{% heading "whatsnext" %}}

<!--
* Read the [CompositePodGroup API](/docs/concepts/workloads/compositepodgroup-api/) overview.
* Learn about the [Workload API](/docs/concepts/workloads/workload-api/) and template definitions.
* See how leaf groups are structured in the [PodGroup API](/docs/concepts/workloads/podgroup-api/).
* Read about [PodGroup scheduling policies](/docs/concepts/workloads/workload-api/policies/).
* Learn about [Workload-aware preemption](/docs/concepts/scheduling-eviction/workload-aware-preemption/).
-->
* 阅读 [CompositePodGroup API](/zh-cn/docs/concepts/workloads/compositepodgroup-api/) 概览。
* 了解 [Workload API](/zh-cn/docs/concepts/workloads/workload-api/) 和模板定义。
* 查看 [PodGroup API](/zh-cn/docs/concepts/workloads/podgroup-api/) 中叶子组的结构。
* 阅读 [PodGroup 调度策略](/zh-cn/docs/concepts/workloads/workload-api/policies/)。
* 了解[工作负载感知抢占](/zh-cn/docs/concepts/scheduling-eviction/workload-aware-preemption/)。
