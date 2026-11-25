---
title: PodGroupPreemptionPolicy
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---

<!--
Enables the support for `PreemptionPolicy` field in [PodGroup API](/docs/concepts/workloads/podgroup-api/) and [Workload API](/docs/concepts/workloads/workload-api/).

When enabled, if a PodGroup has `PreemptionPolicy: Never` it will not perform workload aware preemption.
-->
在 [PodGroup API](/zh-cn/docs/concepts/workloads/podgroup-api/) 和
[Workload API](/zh-cn/docs/concepts/workloads/workload-api/) 中
启用对 `PreemptionPolicy` 字段的支持。

启用后，如果某个 PodGroup 的 `PreemptionPolicy` 为 `Never`，
则该 PodGroup 不会执行工作负载感知抢占。
