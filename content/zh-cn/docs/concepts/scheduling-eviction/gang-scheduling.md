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
{{< feature-state feature_gate_name="GangScheduling" >}}

<!--
Gang scheduling ensures that a group of Pods are scheduled on an "all-or-nothing" basis.
If the cluster cannot accommodate the entire group (or a defined minimum number of Pods),
none of the Pods are bound to a node.

This feature depends on the [Workload API](/docs/concepts/workloads/workload-api/).
Ensure the [`GenericWorkload`](/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload)
feature gate and the `scheduling.k8s.io/v1alpha1`
{{< glossary_tooltip text="API group" term_id="api-group" >}} are enabled in the cluster.
-->
编组调度（Gang Scheduling）确保一组 Pod 以 **全有或全无（all-or-nothing）** 的方式进行调度。
如果集群无法容纳整个组（或某确定的最小 Pod 数量），则不会将任何 Pod 绑定到节点上。

此特性依赖于 [Workload API](/zh-cn/docs/concepts/workloads/workload-api/)。确保在集群中启用
[`GenericWorkload`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload)
特性门控以及 `scheduling.k8s.io/v1alpha1`
{{< glossary_tooltip text="API 组" term_id="api-group" >}}。

<!-- body -->

<!--
## How it works

When the `GangScheduling` plugin is enabled, the scheduler alters the lifecycle for Pods belonging
to a `gang` [pod group policy](/docs/concepts/workloads/workload-api/policies/) within
a [Workload](/docs/concepts/workloads/workload-api/).
The process follows these steps independently for each pod group and its replica key:
-->
## 工作原理   {#how-it-works}

当 `GangScheduling` 插件被启用时，调度器修改
[Workload](/zh-cn/docs/concepts/workloads/workload-api/) 内属于某个 `gang`
[Pod 组策略](/zh-cn/docs/concepts/workloads/workload-api/policies/)的 Pod 的生命周期。
此过程会针对每个 Pod 组及其副本键独立执行，具体步骤如下：

<!--
1. The scheduler holds Pods in the `PreEnqueue` phase until:
   * The referenced Workload object is created.
   * The referenced pod group exists in a Workload.
   * The number of Pods that have been created for the specific group
     is at least equal to the `minCount`.

   Pods do not enter the active scheduling queue until all of these conditions are met.
-->
1. 调度器在 `PreEnqueue` 阶段暂存 Pod，直到满足以下条件：
   * 被引用的 Workload 对象已创建。
   * 被引用的 Pod 组已存在于 Workload 中。
   * 为特定 Pod 组创建的 Pod 数量不少于 `minCount`。

   只有满足上述所有条件之后，Pod 才会进入活动的调度队列。

<!--
2. Once the quorum is met, the scheduler attempts to find placements for all Pods in the group.
   All assigned Pods wait at the `WaitOnPermit` gate during this process.
   Note that in the Alpha phase of this feature, finding a placement is based on pod-by-pod scheduling,
   rather than a single-cycle approach.
-->
2. 当达到额定数量（quorum）后，调度器尝试为组中的所有 Pod 寻找可调度的节点。
   在此过程中，所有已分配的 Pod 都会在 `WaitOnPermit` 阶段等待。
   需要注意的是，此特性目前处于 Alpha 阶段，调度决策仍然基于逐个 Pod 的调度方式，
   而不是在单个调度周期内完成。

<!--
3. If the scheduler finds valid placements for at least `minCount` Pods,
   it allows all of them to be bound to their assigned nodes. If it cannot find placements for the entire group
   within a fixed timeout of 5 minutes, none of the Pods are scheduled.
   Instead, they are moved to the unschedulable queue to wait for cluster resources to free up,
   allowing other workloads to be scheduled in the meantime.
-->
3. 如果调度器为至少 `minCount` 个 Pod 找到了有效的调度位置，
   则允许这些 Pod 全部绑定到所分配的节点上。
   如果在固定的 5 分钟超时时间内无法为整个 Pod 组找到调度位置，则不会调度任何 Pod。
   相反，这些 Pod 会被移入不可调度的队列，等待集群资源释放，同时允许其他工作负载被调度。

## {{% heading "whatsnext" %}}

<!--
* Learn about the [Workload API](/docs/concepts/workloads/workload-api/).
* See how to [reference a Workload](/docs/concepts/workloads/pods/workload-reference/) in a Pod.
-->
* 了解 [Workload API](/zh-cn/docs/concepts/workloads/workload-api/)。
* 查看如何在 Pod 中[引用 Workload](/zh-cn/docs/concepts/workloads/pods/workload-reference/)。
