---
title: "Workload API"
weight: 20
simple_list: true
---

<!-- overview -->
{{< feature-state feature_gate_name="GenericWorkload" >}}

<!--
The Workload API resource allows you to describe the scheduling requirements and structure of a multi-Pod application.
While workload controllers provide runtime behavior for the workloads,
the Workload API is supposed to provide scheduling constraints for the "true" workloads, such as Job and others.
-->
Workload API 资源允许你描述一个多 Pod 应用的调度需求和结构。
虽然工作负载控制器提供了运行时行为，但 Workload API 旨在为“真实”的工作负载（例如 Job 等）提供调度约束。

<!-- body -->

<!--
## What is a Workload?

The Workload API resource is part of the `scheduling.k8s.io/v1alpha1`
{{< glossary_tooltip text="API group" term_id="api-group" >}}
(and your cluster must have that API group enabled, as well as the `GenericWorkload`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/),
before you can benefit from this API).
This resource acts as a structured, machine-readable definition of the scheduling requirements
of a multi-Pod application. While user-facing workloads like [Jobs](/docs/concepts/workloads/controllers/job/)
define what to run, the Workload resource determines how a group of Pods should be scheduled
and how its placement should be managed throughout its lifecycle.
-->
## 什么是 Workload？  {#what-is-a-workload}

Workload API 资源属于 `scheduling.k8s.io/v1alpha1`
{{< glossary_tooltip text="API 组" term_id="api-group" >}}
（在使用此 API 之前，你的集群必须启用该 API 组以及 `GenericWorkload`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)）。
此资源作为一种结构化、机器可读的定义，用于描述多 Pod 应用的调度需求。
面向用户的工作负载（例如 [Job](/zh-cn/docs/concepts/workloads/controllers/job/)）定义“运行什么”，
而 Workload 资源则决定一组 Pod 应该如何被调度，以及在其整个生命周期中如何管理其调度位置。

<!--
## API structure

A Workload allows you to define a group of Pods and apply a scheduling policy to them.
It consists of two sections: a list of pod groups and a reference to a controller.

### Pod groups

The `podGroups` list defines the distinct components of your workload.
For example, a machine learning job might have a `driver` group and a `worker` group.
-->
## API 结构  {#api-structure}

Workload 允许你定义一组 Pod，并为其应用调度策略。
Workload 由两个部分组成：Pod 分组列表和到某个控制器的引用。

### Pod 分组  {#pod-groups}

`podGroups` 列表定义了工作负载中的不同组件。
例如，一个机器学习任务可能包含一个 `driver` 分组和一个 `worker` 分组。

<!--
Each entry in `podGroups` must have:
1. A unique `name` that can be used in the Pod's [Workload reference](/docs/concepts/workloads/pods/workload-reference/).
2. A [scheduling policy](/docs/concepts/workloads/workload-api/policies/) (`basic` or `gang`).
-->
`podGroups` 中的每一项必须包含：

1. 一个唯一的 `name`，可在 Pod 的
   [Workload 引用](/zh-cn/docs/concepts/workloads/pods/workload-reference/)中使用。
2. 一个[调度策略](/zh-cn/docs/concepts/workloads/workload-api/policies/)（`basic` 或 `gang`）。

<!--
The gang is schedulable only if 4 pods can run at once
-->
```yaml
apiVersion: scheduling.k8s.io/v1alpha1
kind: Workload
metadata:
  name: training-job-workload
  namespace: some-ns
spec:
  controllerRef:
    apiGroup: batch
    kind: Job
    name: training-job
  podGroups:
  - name: workers
    policy:
      gang:
        # 只有当可以同时运行 4 个 Pod 时，此 gang 才可调度
        minCount: 4
```

<!--
### Referencing a workload controlling object

The `controllerRef` field links the Workload back to the specific high-level object defining the application,
such as a [Job](/docs/concepts/workloads/controllers/job/) or a custom CRD. This is useful for observability and tooling.
This data is not used to schedule or manage the Workload.
-->
### 引用工作负载控制对象

`controllerRef` 字段用于将 Workload 关联回定义此应用的具体高层对象，
例如 [Job](/zh-cn/docs/concepts/workloads/controllers/job/) 或定制 CRD。
这对于可观测性和工具链非常有用。此数据不会用于 Workload 的调度或管理。

## {{% heading "whatsnext" %}}

<!--
* See how to [reference a Workload](/docs/concepts/workloads/pods/workload-reference/) in a Pod.
* Learn about [pod group policies](/docs/concepts/workloads/workload-api/policies/).
* Read about [gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/) algorithm.
-->
* 查看如何在 Pod 中[引用 Workload](/zh-cn/docs/concepts/workloads/pods/workload-reference/)。
* 了解 [Pod 分组策略](/zh-cn/docs/concepts/workloads/workload-api/policies/)。
* 阅读 [Gang 调度](/zh-cn/docs/concepts/scheduling-eviction/gang-scheduling/) 算法。
