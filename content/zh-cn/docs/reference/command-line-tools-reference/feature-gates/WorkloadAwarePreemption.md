---
title: WorkloadAwarePreemption
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
---

<!--
Enables the support for [Workload-aware preemption](/docs/concepts/scheduling-eviction/workload-aware-preemption/).

When enabled, if a PodGroup fails to schedule, the scheduler will use a workload-aware preemption
algorithm to select victims to preempt instead of the default pod preemption algorithm.
-->
启用对[工作负载感知抢占](/zh-cn/docs/concepts/scheduling-eviction/workload-aware-preemption/)的支持。

启用后，如果 PodGroup 调度失败，调度器将使用工作负载感知抢占算法来选择要抢占的牺牲品，而不是默认的 Pod 抢占算法。
