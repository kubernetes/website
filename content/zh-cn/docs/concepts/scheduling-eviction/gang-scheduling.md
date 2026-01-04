---
title: Gang 调度
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
-->
Gang 调度确保一组 Pod 以“全有或全无”的方式被调度。
如果集群无法容纳整个组（或某个已定义的最小 Pod 数量），
则不会有任何 Pod 绑定到节点上。

<!--
This feature depends on the [Workload API](/docs/concepts/workloads/workload-api/).
Ensure the [`GenericWorkload`](/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload)
feature gate and the `scheduling.k8s.io/v1alpha1`
{{< glossary_tooltip text="API group" term_id="api-group" >}} are enabled in the cluster.
-->
此特性依赖 [Workload API](/docs/concepts/workloads/workload-api/)。
确保在集群中启用 [`GenericWorkload`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload)
特性门控，并启用 `scheduling.k8s.io/v1alpha1` {{< glossary_tooltip text="API 组" term_id="api-group" >}}。

<!-- body -->

## 工作原理

<!--
When the `GangScheduling` plugin is enabled, the scheduler alters the lifecycle for Pods belonging
to a `gang` [pod group policy](/docs/concepts/workloads/workload-api/policies/) within
a [Workload](/docs/concepts/workloads/workload-api/).
The process follows these steps independently for each pod group and its replica key:
-->
当启用 `GangScheduling` 插件时，调度器会调整属于某个 [Workload](/docs/concepts/workloads/workload-api/)
中的 `gang` [Pod 组策略](/docs/concepts/workloads/workload-api/policies/)的 Pod 的生命周期。
对于每个 Pod 组及其副本键（replica key），此过程会独立执行以下步骤：

<!--
1. The scheduler holds Pods in the `PreEnqueue` phase until:
   * The referenced Workload object is created.
   * The referenced pod group exists in a Workload.
   * The number of Pods that have been created for the specific group
     is at least equal to the `minCount`.

   Pods do not enter the active scheduling queue until all of these conditions are met.
-->
1. 调度器会将 Pod 保持在 `PreEnqueue` 阶段，直到：
   * 所引用的 Workload 对象已创建。
   * 所引用的 Pod 组已存在于某个 Workload 中。
   * 为特定组所创建的 Pod 数量
     至少等于 `minCount`。

   在满足所有这些条件之前，Pod 不会进入活跃调度队列。

<!--
2. Once the quorum is met, the scheduler attempts to find placements for all Pods in the group.
   All assigned Pods wait at the `WaitOnPermit` gate during this process.
   Note that in the Alpha phase of this feature, finding a placement is based on pod-by-pod scheduling,
   rather than a single-cycle approach.
-->
2. 一旦满足法定数量（quorum），调度器就会尝试为组内所有 Pod 寻找可放置的位置。
   在此过程中，所有已分配的 Pod 都会在 `WaitOnPermit` 门控处等待。
   注意，在此特性的 Alpha 阶段，寻找放置位置是基于逐个 Pod 的调度，
   而不是单次调度周期的方式。

<!--
3. If the scheduler finds valid placements for at least `minCount` Pods,
   it allows all of them to be bound to their assigned nodes. If it cannot find placements for the entire group
   within a fixed timeout of 5 minutes, none of the Pods are scheduled.
   Instead, they are moved to the unschedulable queue to wait for cluster resources to free up,
   allowing other workloads to be scheduled in the meantime.
-->
3. 如果调度器为至少 `minCount` 个 Pod 找到了有效的放置位置，
   它会允许这些 Pod 全部绑定到其所分配的节点上。
   如果在固定的 5 分钟超时时间内无法为整个组找到放置位置，则不会调度任何 Pod。
   相反，这些 Pod 会被移动到不可调度队列，等待集群资源释放，
   从而允许其他工作负载在此期间被调度。

## {{% heading "whatsnext" %}}

<!--
* Learn about the [Workload API](/docs/concepts/workloads/workload-api/).
* See how to [reference a Workload](/docs/concepts/workloads/pods/workload-reference/) in a Pod.
-->
* 了解 [Workload API](/docs/concepts/workloads/workload-api/)。
* 了解如何在 Pod 中[引用 Workload](/docs/concepts/workloads/pods/workload-reference/)。
