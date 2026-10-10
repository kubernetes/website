---
title: 调度组
content_type: concept
weight: 90
---

<!--
title: Scheduling Group
content_type: concept
weight: 90
-->

<!-- overview -->

{{< feature-state feature_gate_name="GenericWorkload" >}}

<!--
You can link a `Pod` to a [PodGroup](/docs/concepts/workloads/podgroup-api/) to indicate
that the `Pod` belongs to a group of `Pods` scheduled together. This enables the scheduler
to apply group-level policies such as gang scheduling rather than treating each `Pod` independently.
-->
你可以将 Pod 链接到 [PodGroup](/zh-cn/docs/concepts/workloads/podgroup-api/)，
以表明该 Pod 属于一组一起调度的 Pod。
这使得调度器能够应用组级策略（如 gang 调度），而不是将每个 Pod 独立对待。

<!-- body -->

<!--
## Specifying a scheduling group
-->
## 指定调度组   {#specifying-a-scheduling-group}

<!--
When the [`GenericWorkload`](/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload)
feature gate is enabled,
you can set the `spec.schedulingGroup` field in your `Pod` manifest. This field establishes a link to a specific `PodGroup` object in the same namespace by name.
-->
当启用 [`GenericWorkload`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload)
特性门控时，
你可以在 Pod 清单中设置 `spec.schedulingGroup` 字段。
此字段通过名称建立到同一名字空间中特定 PodGroup 对象的链接。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: worker-0
  namespace: some-ns
spec:
  schedulingGroup:
    podGroupName: training-worker-0
  containers:
  - name: ml-worker
    image: training:v1
```

<!--
The `schedulingGroup` field is immutable. Once set, a `Pod` cannot be moved to a
different `PodGroup`.
-->
`schedulingGroup` 字段是不可变的。设置后，`Pod` 无法移动到不同的 `PodGroup`。

<!--
## Behavior
-->
## 行为   {#behavior}

<!--
When you set `spec.schedulingGroup`, the scheduler looks up the referenced
[PodGroup](/docs/concepts/workloads/podgroup-api/) and applies the
[scheduling policy](/docs/concepts/workloads/workload-api/policies/) defined in it:
-->
当你设置 `spec.schedulingGroup` 时，调度器会查找引用的
[PodGroup](/zh-cn/docs/concepts/workloads/podgroup-api/) 并应用其中定义的
[调度策略](/zh-cn/docs/concepts/workloads/workload-api/policies/)：

<!--
* If the `PodGroup` uses the `basic` policy, each `Pod` is scheduled independently using
  standard Kubernetes behavior. The grouping is used as group-level label.
-->
* 如果 PodGroup 使用 `basic` 策略，则每个 `Pod` 使用标准的 Kubernetes 行为独立调度。
  分组用作组级标签。

<!--
* If the `PodGroup` uses the `gang` policy, the `Pod` enters an "all-or-nothing" scheduling
  lifecycle. The scheduler tries to place at least `minCount` `Pods` in the group
  simultaneously; none of them bind to nodes unless the minimum is met.
-->
* 如果 PodGroup 使用 `gang` 策略，则 Pod 进入"全有或全无"调度生命周期。
  调度器尝试同时放置组中至少 `minCount` 个 Pod；
  除非达到最小值，否则它们都不会绑定到节点。

<!--
## Missing PodGroup reference
-->
## 缺少 PodGroup 引用   {#missing-podgroup-reference}

<!--
If a `Pod` references a `PodGroup` that does not yet exist, the `Pod` remains pending.
The scheduler automatically reconsiders the `Pod` once the `PodGroup` is created.
-->
如果 Pod 引用了不存在的 PodGroup，则该 Pod 保持 Pending 状态。
一旦创建了 PodGroup，调度器会自动重新考虑该 Pod。

<!--
This applies regardless of whether the eventual policy is `basic` or `gang`,
because the scheduler requires the `PodGroup` to determine the policy.
-->
无论最终策略是 `basic` 还是 `gang`，这都适用，
因为调度器需要 PodGroup 来确定策略。

## {{% heading "whatsnext" %}}

<!--
* Learn about the [PodGroup API](/docs/concepts/workloads/podgroup-api/) and its lifecycle.
* Read about [PodGroup scheduling policies](/docs/concepts/workloads/workload-api/policies/).
* Understand the [gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/) algorithm.
-->
* 了解 [PodGroup API](/zh-cn/docs/concepts/workloads/podgroup-api/) 及其生命周期。
* 阅读 [PodGroup 调度策略](/zh-cn/docs/concepts/workloads/workload-api/policies/)。
* 理解 [Gang 调度](/zh-cn/docs/concepts/scheduling-eviction/gang-scheduling/)算法。
