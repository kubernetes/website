---
title: NominatedNodeNameForExpectation
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.34"
    toVersion: "1.34"
  - stage: beta
    defaultValue: true
    fromVersion: "1.35"
---

<!--
When enabled, kube-scheduler uses `.status.nominatedNodeName` to express where a
Pod is going to be bound. The `.status.nominatedNodeName` field is set when kube-scheduler
triggers preemption of pods, or anticipates that WaitOnPermit or PreBinding phase will take
relatively long.
Other components may read and use `.status.nominatedNodeName`, but should not set it.

When disabled, kube-scheduler will only set `.status.nominatedNodeName` before triggering preemption.
-->
启用此特性门控后，kube-scheduler 使用 `.status.nominatedNodeName`
来表示 Pod 将要被绑定到哪个节点。
当 kube-scheduler 触发 Pod 抢占，或预计 WaitOnPermit 或 PreBinding
阶段耗时较长时，会设置 `.status.nominatedNodeName` 字段。

其他组件可以读取和使用 `.status.nominatedNodeName`，但不应设置它。

