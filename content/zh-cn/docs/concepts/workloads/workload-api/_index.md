---
title: 工作负载 API
weight: 20
simple_list: true
---

<!--
title: "Workload API"
weight: 20
simple_list: true
-->

<!-- overview -->

{{< feature-state feature_gate_name="GenericWorkload" >}}

<!--
The `Workload` API resource defines the scheduling requirements and structure of a multi-Pod
application. While workload controllers such as [Job](/docs/concepts/workloads/controllers/job/)
manage the application's runtime state, the `Workload` specifies how groups of `Pods`
should be scheduled.
-->
`Workload` API 资源定义了多 Pod 应用的调度要求和结构。
虽然工作负载控制器（例如 [Job](/zh-cn/docs/concepts/workloads/controllers/job/)
管理应用程序的运行时状态，但 `Workload` 指定了应该如何调度 `Pod` 组。

<!--
The Job controller is the only built-in controller that creates
[PodGroup](/docs/concepts/workloads/podgroup-api/) objects from the `Workload`'s
`PodGroupTemplates` at runtime.
-->
Job 控制器是唯一的内置控制器，它会在运行时根据 `Workload` 的 `PodGroupTemplates`
创建 [PodGroup](/zh-cn/docs/concepts/workloads/podgroup-api/) 对象。

<!-- body -->

<!--
## What is a Workload?
-->
## 什么是工作负载？   {#what-is-a-workload}

<!--
The Workload API resource is part of the `scheduling.k8s.io/v1alpha2`
{{< glossary_tooltip text="API group" term_id="api-group" >}}
and your cluster must have that API group enabled, as well as the `GenericWorkload`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/),
before you can use this API.
-->
Workload API 资源是 `scheduling.k8s.io/v1alpha2`
{{< glossary_tooltip text="API 组" term_id="api-group" >}}的一部分，
在使用此 API 之前，你的集群必须启用该 API 组以及 `GenericWorkload`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。

<!--
A `Workload` is a static, long-lived policy template. It defines what scheduling
policies should be applied to groups of Pods, but does not track runtime state itself.
-->
`Workload` 是一个静态、长期存在的策略模板。它定义了应该应用于 Pod 组的调度策略，
但本身不跟踪运行时状态。

<!--
Runtime scheduling state is maintained by [PodGroup](/docs/concepts/workloads/podgroup-api/)
objects, which controllers create from the `Workload`'s `PodGroupTemplates`.
-->
运行时调度状态由 [PodGroup](/zh-cn/docs/concepts/workloads/podgroup-api/)
对象维护，这些对象由控制器从 `Workload` 的 `PodGroupTemplates` 创建。

<!--
## API structure
-->
## API 结构   {#api-structure}

<!--
A `Workload` consists of two fields: a list of `PodGroupTemplates` and an optional controller
reference. The entire `Workload` spec is immutable after creation: you cannot modify
existing templates, add new templates, or remove templates from `podGroupTemplates`.
-->
`Workload` 由两个字段组成：`PodGroupTemplates` 列表和可选的控制器引用。
创建后，整个 `Workload` 规约是不可变的：你不能修改现有模板、添加新模板或从 `podGroupTemplates` 中删除模板。

<!--
### PodGroupTemplates
-->
### PodGroupTemplates   {#podgrouptemplates}

<!--
The `spec.podGroupTemplates` list defines the distinct components of your workload.
For example, a machine learning job might have a `driver` template and a `worker` template.
-->
`spec.podGroupTemplates` 列表定义了工作负载的不同组件。
例如，机器学习任务可能有 `driver` 模板和 `worker` 模板。

<!--
Each entry in `podGroupTemplates` must have:
1. A unique `name` that will be used to reference the template in the `PodGroup`'s `spec.podGroupTemplateRef`.
2. A [scheduling policy](/docs/concepts/workloads/workload-api/policies/) (`basic` or `gang`).
-->
`podGroupTemplates` 中的每个条目必须包含：
1. 唯一的 `name`，用于在 `PodGroup` 的 `spec.podGroupTemplateRef` 中引用模板。
2. [调度策略](/zh-cn/docs/concepts/workloads/workload-api/policies/)（`basic` 或 `gang`）。

<!--
If the [`WorkloadAwarePreemption`](/docs/reference/command-line-tools-reference/feature-gates/#WorkloadAwarePreemption) [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is enabled each entry in `podGroups` can also have [priority and disruption mode](/docs/concepts/workloads/workload-api/disruption-and-priority/).
-->
如果启用了 [`WorkloadAwarePreemption`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#WorkloadAwarePreemption)
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
`podGroups` 中的每个条目还可以具有[优先级和干扰模式](/zh-cn/docs/concepts/workloads/workload-api/disruption-and-priority/)。

<!--
The maximum number of PodGroupTemplates in a single Workload is 8.
-->
单个 Workload 中 PodGroupTemplates 的最大数量为 8。

<!---->
```yaml
apiVersion: scheduling.k8s.io/v1alpha2
kind: Workload
metadata:
  name: training-job-workload
  namespace: some-ns
spec:
  controllerRef:
    apiGroup: batch
    kind: Job
    name: training-job
  podGroupTemplates:
  - name: workers
    schedulingPolicy:
      gang:
        # The gang is schedulable only if 4 pods can run at once
        minCount: 4
    priorityClassName: high-priority # Only applicable with WorkloadAwarePreemption feature gate
    disruptionMode: PodGroup # Only applicable with WorkloadAwarePreemption feature gate
```
-->
```yaml
apiVersion: scheduling.k8s.io/v1alpha2
kind: Workload
metadata:
  name: training-job-workload
  namespace: some-ns
spec:
  controllerRef:
    apiGroup: batch
    kind: Job
    name: training-job
  podGroupTemplates:
  - name: workers
    schedulingPolicy:
      gang:
        # 只有在同时运行 4 个 Pod 时，gang Pod 才调度可运行
        minCount: 4
    priorityClassName: high-priority # 仅在启用了 WorkloadAwarePreemption 特性门控时才适用
    disruptionMode: PodGroup # 仅在启用了 WorkloadAwarePreemption 特性门控时才适用
```

<!--
When a workload controller creates a `PodGroup` from one of these templates, it copies the
`schedulingPolicy` into the `PodGroup`'s own spec. Changes to the `Workload` only affect
newly created `PodGroups`, not existing ones.
-->
当工作负载控制器从这些模板之一创建 `PodGroup` 时，它会将 `schedulingPolicy` 复制到 `PodGroup` 自己的规约中。
对 `Workload` 的更改仅影响新创建的 `PodGroup`，而不影响现有的 `PodGroup`。

<!--
### Referencing a workload controlling object
-->
### 引用工作负载控制对象   {#referencing-a-workload-controlling-object}

<!--
The `controllerRef` field links the Workload back to the specific high-level object defining the application,
such as a [Job](/docs/concepts/workloads/controllers/job/) or a custom CRD. This is useful for observability and tooling.
This data is not used to schedule or manage the Workload.
-->
`controllerRef` 字段将 Workload 链接回定义应用的特定高级对象，
例如 [Job](/zh-cn/docs/concepts/workloads/controllers/job/) 或自定义 CRD。
这对于可观测性和工具非常有用。这些数据不用于调度或管理 Workload。

<!--
## Gang scheduling with Jobs
-->
## 与 Job 一起使用 gang 调度   {#gang-scheduling-with-jobs}

{{< feature-state feature_gate_name="EnableWorkloadWithJob" >}}

<!--
When the
[`EnableWorkloadWithJob`](/docs/reference/command-line-tools-reference/feature-gates/)
feature gate is enabled, the
[Job](/docs/concepts/workloads/controllers/job/) controller automatically
creates Workload and PodGroup objects for parallel indexed Jobs where
`.spec.parallelism` equals `.spec.completions`.
-->
当启用
[`EnableWorkloadWithJob`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
特性门控时，
[Job](/zh-cn/docs/concepts/workloads/controllers/job/) 控制器会自动为
`.spec.parallelism` 等于 `.spec.completions` 的并行索引 Job 创建 Workload 和 PodGroup 对象。

<!--
The gang policy's `minCount`
is set to the Job's parallelism, so all Pods must be schedulable together
before any of them are bound to nodes.
-->
Gang 策略的 `minCount` 设置为 Job 的并行度，
因此所有 Pod 必须能够一起调度，然后才能将它们绑定到节点。

<!--
This is the built-in path for using gang scheduling with Jobs.
You do not need to create Workload or PodGroup objects yourself as the Job
controller handles it automatically.
-->
这是与 Job 一起使用 Gang 调度的内置路径。
你不需要自己创建 Workload 或 PodGroup 对象，因为 Job 控制器会自动处理。

<!--
Other workload controllers (such as
JobSet) may manage their own Workload and PodGroup objects independently.
-->
其他工作负载控制器（如 JobSet）可能会独立管理自己的 Workload 和 PodGroup 对象。

## {{% heading "whatsnext" %}}

<!--
* Learn about [PodGroup scheduling policies](/docs/concepts/workloads/workload-api/policies/).
* See how PodGroups are created from Workloads in the [PodGroup API](/docs/concepts/workloads/podgroup-api/) overview.
* Read about how Pods reference their PodGroup via the [scheduling group](/docs/concepts/workloads/pods/scheduling-group/) field.
* Learn about [Topology-aware workload scheduling](/docs/concepts/workloads/workload-api/topology-aware-scheduling/).
* Understand the [gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/) algorithm.
-->
* 了解 [PodGroup 调度策略](/zh-cn/docs/concepts/workloads/workload-api/policies/)。
* 查看如何在 [PodGroup API](/zh-cn/docs/concepts/workloads/podgroup-api/) 概览中从 Workload 创建 PodGroup。
* 阅读 Pod 如何通过[调度组](/zh-cn/docs/concepts/workloads/pods/scheduling-group/)字段引用其 PodGroup。
* 了解[拓扑感知工作负载调度](/zh-cn/docs/concepts/workloads/workload-api/topology-aware-scheduling/)。
* 理解 [Gang 调度](/zh-cn/docs/concepts/scheduling-eviction/gang-scheduling/)算法。
