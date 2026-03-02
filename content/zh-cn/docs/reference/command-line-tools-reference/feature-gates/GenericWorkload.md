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
---

<!--
Enables the support for [Workload API](/docs/concepts/workloads/workload-api/) to express scheduling requirements at the workload level.

When enabled Pods can reference a specific pod group and use this to influence
the way that they are scheduled.
-->
启用对 [Workload API](/zh-cn/docs/concepts/workloads/workload-api/)
的支持，以在工作负载级别表达调度要求。

启用此特性门控后，Pod 可以引用特定的 Pod 组，并使用这个组来影响 Pod 的调度方式。
