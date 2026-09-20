---
title: GenericWorkload
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.35"
    toVersion: "1.36"
  - stage: beta
    defaultValue: false
    fromVersion: "1.37"
---

<!--
Enables support for the [Workload API](/docs/concepts/workloads/workload-api/) and [PodGroup API](/docs/concepts/workloads/podgroup-api/) to express scheduling requirements at the workload level.

When enabled, Pods can reference a specific PodGroup to influence the way that they are scheduled. Starting in Kubernetes v1.37, this feature gate also encompasses [gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/), and [workload-aware preemption](/docs/concepts/scheduling-eviction/workload-aware-preemption/).
-->
启用对 [Workload API](/zh-cn/docs/concepts/workloads/workload-api/)
和 [PodGroup API](/zh-cn/docs/concepts/workloads/podgroup-api/)
的支持，以便在工作负载层面表达调度需求。

启用后，Pod 可以引用特定的 PodGroup，以影响其被调度的方式。
从 Kubernetes v1.37 起，此特性门控还涵盖
[Gang 调度](/zh-cn/docs/concepts/scheduling-eviction/gang-scheduling/)
和[工作负载感知抢占](/zh-cn/docs/concepts/scheduling-eviction/workload-aware-preemption/)。
