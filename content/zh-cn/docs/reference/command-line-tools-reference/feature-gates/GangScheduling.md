---
title: GangScheduling
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
Enables the GangScheduling plugin in kube-scheduler, which implements "all-or-nothing"
scheduling algorithm. The [Workload API](/docs/concepts/workloads/workload-api/) is used
to express the requirements.
-->
在 kube-scheduler 中启用 GangScheduling 插件，此插件实现**全有或全无（all-or-nothing）**的调度算法。
其中会使用 [Workload API](/zh-cn/docs/concepts/workloads/workload-api/) 来表达调度要求。
