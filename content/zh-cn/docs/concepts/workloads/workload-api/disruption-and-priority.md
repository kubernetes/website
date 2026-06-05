---
title: Pod 组干扰和优先级
content_type: concept
weight: 10
---

<!--
title: Pod Group Disruption and Priority
content_type: concept
weight: 10
-->

<!-- overview -->

{{< feature-state feature_gate_name="WorkloadAwarePreemption" >}}

<!--
PodGroup can declare a disruption mode. This mode dictates how
the scheduler can disrupt a running PodGroup, for example to accommodate
a higher priority PodGroup. A PodGroup also has a priority,
which overrides the priority of the individual pods from the group
for [workload-aware preemption](/docs/concepts/scheduling-eviction/workload-aware-preemption/) events.
-->
PodGroup 可以声明一个干扰模式。此模式规定了调度器如何干扰运行中的 PodGroup，
例如为了容纳更高优先级的 PodGroup。PodGroup 还具有优先级，
该优先级会在[工作负载感知抢占](/zh-cn/docs/concepts/scheduling-eviction/workload-aware-preemption/)
事件中覆盖来自该组的单个 Pod 的优先级。

<!-- body -->

<!--
## Disruption mode types
-->
## 干扰模式类型   {#disruption-mode-types}

{{< note >}}
<!--
As of 1.36, the `priority` or `disruptionMode` fields of the PodGroup are only respected
by [workload-aware preemption](/docs/concepts/scheduling-eviction/workload-aware-preemption/).
During the pod scheduling phase, the scheduler does not take into account
the `priority` or `disruptionMode` fields of the PodGroup.
-->
截至 1.36 版本，PodGroup 的 `priority` 或 `disruptionMode`
字段仅被[工作负载感知抢占](/zh-cn/docs/concepts/scheduling-eviction/workload-aware-preemption/)所尊重。
在 Pod 调度阶段，调度器不考虑 PodGroup 的 `priority` 或 `disruptionMode` 字段。
{{< /note >}}

<!--
The API supports two disruption modes: `Pod` and `PodGroup`.
The default one is `Pod`.
-->
API 支持两种干扰模式：`Pod` 和 `PodGroup`。默认模式是 `Pod`。

### Pod

<!--
The `Pod` mode instructs the scheduler to treat all Pods in the group as separate entities,
allowing independent disruption of a single pod from a PodGroup.
-->
`Pod` 模式指示调度器将组中的所有 Pod 视为单独的实体，
允许从 PodGroup 中独立干扰单个 Pod。

### PodGroup

<!--
The `PodGroup` mode emphasizes "all-or-nothing" semantics for disruption.
It instructs the scheduler that all pods from the PodGroup have to be disrupted together.
-->
`PodGroup` 模式强调干扰的 "全有或全无" 语义。
它指示调度器必须同时干扰 PodGroup 中的所有 Pod。

<!--
## Pod group priority
-->
## Pod 组优先级   {#pod-group-priority}

<!--
PodGroup uses the same concept of [PriorityClass](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass) as single Pods.
Once you have created one or more PriorityClasses,
you can create a PodGroup that specifies one of those PriorityClass names in its specification.
The priority admission controller uses the `priorityClassName` field and populates the integer value of the priority.
If the priority class is not found, the PodGroup is rejected.
When `priorityClassName` is not set for a PodGroup, Kubernetes looks for a default (a PriorityClass with `globalDefault` set true)
If there is no PriorityClass with `globalDefault` set true, a PodGroup with no `priorityClassName` has priority zero.
-->
PodGroup 使用与单个 Pod 相同的 [PriorityClass](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass) 概念。
创建一个或多个 PriorityClass 后，你可以创建一个 PodGroup，
并在其规约中指定这些 PriorityClass 名称之一。
优先级准入控制器使用 `priorityClassName` 字段并填充优先级的整数值。
如果未找到优先级类，则 PodGroup 会被拒绝。
当 PodGroup 未设置 `priorityClassName` 时，Kubernetes 会寻找默认值（`globalDefault` 设置为 true 的 PriorityClass）。
如果没有 `globalDefault` 设置为 true 的 PriorityClass，
则没有 `priorityClassName` 的 PodGroup 优先级为零。

<!--
The priority of the PodGroup is an authorative priority for all pods in the group during [workload-aware preemption](/docs/concepts/scheduling-eviction/workload-aware-preemption/) events, even when priorities of individual pods forming this PodGroup differ.
-->
PodGroup 的优先级是该组中所有 Pod 在
[工作负载感知抢占](/zh-cn/docs/concepts/scheduling-eviction/workload-aware-preemption/)
事件中的权威优先级，
即使组成该 PodGroup 的各个 Pod 的优先级不同也是如此。

<!--
The following YAML is an example of a PodGroup configuration that uses the `high-priority` PriorityClass,
which maps to the integer priority value of 1000000.
The priority admission controller checks the specification and resolves the priority of the PodGroup to 1000000.
-->
以下 YAML 是使用 `high-priority` PriorityClass 的 PodGroup 配置示例，
该 PriorityClass 映射到整数值 1000000 的优先级。
优先级准入控制器检查规约并将 PodGroup 的优先级解析为 1000000。

```yaml
apiVersion: scheduling.k8s.io/v1alpha2
kind: PodGroup
metadata:
  namespace: ns-1
  name: job-1
spec:
  priorityClassName: high-priority
```

## {{% heading "whatsnext" %}}

<!--
* Read about [Workload-Aware Preemption](/docs/concepts/scheduling-eviction/workload-aware-preemption/) algorithm.
* Learn about the [Workload API](/docs/concepts/workloads/workload-api/).
-->
* 阅读有关[工作负载感知抢占](/zh-cn/docs/concepts/scheduling-eviction/workload-aware-preemption/)算法的信息。
* 了解[工作负载 API](/zh-cn/docs/concepts/workloads/workload-api/)。
