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

This feature depends on the [PodGroup API](/docs/concepts/workloads/podgroup-api/).
Ensure the [`GenericWorkload`](/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload)
feature gate and the `scheduling.k8s.io/v1alpha2`
{{< glossary_tooltip text="API group" term_id="api-group" >}} are enabled in the cluster.
-->
编组调度（Gang Scheduling）确保一组 Pod 以 **全有或全无（all-or-nothing）** 的方式进行调度。
如果集群无法容纳整个组（或某确定的最小 Pod 数量），则不会将任何 Pod 绑定到节点上。

此特性依赖于 [PodGroup API](/zh-cn/docs/concepts/workloads/podgroup-api/)。确保在集群中启用
[`GenericWorkload`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload)
特性门控以及 `scheduling.k8s.io/v1alpha2`
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
   * The number of `Pods` created for the `PodGroup` is at least equal to `minCount`.

   `Pods` do not enter the active scheduling queue until both conditions are met.
-->
1. 调度器在 `PreEnqueue` 阶段暂存 Pod，直到满足以下条件：
   * 引用的 PodGroup 对象存在。
   * 为该 PodGroup 创建的 Pod 数量至少等于 minCount。

   只有同时满足这两个条件，Pod 才会进入 active 调度队列。

<!--
2. Once the quorum is met, the scheduler attempts to find placements for all Pods in the group.
   It utilizes the [PodGroup scheduling](/docs/concepts/scheduling-eviction/podgroup-scheduling/) cycle to make a single,
   atomic scheduling decision. `GangScheduling` plugin implements a `Permit` extension point that is evaluated for each
   schedulable Pod during the cycle. This is used to determine whether the `minCount` constraint is satisfied,
   by comparing the number of successfully placed pods against the `minCount` value.
-->
2. 当达到额定数量（quorum）后，调度器尝试为组中的所有 Pod 寻找可调度的节点。
   它利用了 [PodGroup 调度](/zh-cn/docs/concepts/scheduling-eviction/podgroup-scheduling/) 
   周期来做出单一的、原子性的调度决定。`GangScheduling` 插件实现了一个在每个调度周期中对每个可调度 
   Pod 进行评估的 `Permit` 扩展点。这用于通过将成功放置的 Pod 数量与 `minCount`
   值进行比较，来确定是否满足 `minCount` 约束。

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

## {{% heading "whatsnext" %}}

<!--
* Learn about the [PodGroup API](/docs/concepts/workloads/podgroup-api/) and its [lifecycle](/docs/concepts/workloads/podgroup-api/lifecycle/).
* Read about [PodGroup scheduling policies](/docs/concepts/workloads/workload-api/policies/).
* Read about [PodGroup scheduling](/docs/concepts/scheduling-eviction/podgroup-scheduling/).
-->
* 了解 [PodGroup API](/zh-cn/docs/concepts/workloads/podgroup-api/)
  及其[生命周期](/zh-cn/docs/concepts/workloads/podgroup-api/lifecycle/)。
* 阅读关于 [PodGroup 调度策略](/zh-cn/docs/concepts/workloads/workload-api/policies/)的信息。
* 阅读关于 [PodGroup 调度](/zh-cn/docs/concepts/scheduling-eviction/podgroup-scheduling/)的信息。
