---
title: CompositePodGroup
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
Enable hierarchical gang scheduling for [CompositePodGroups](/docs/concepts/workloads/compositepodgroup-api/) and PodGroups.

Enabling the `CompositePodGroup` feature gate requires that the `GenericWorkload` and `TopologyAwareWorkloadScheduling`
feature gates are enabled as well.
-->
为 [CompositePodGroup](/zh-cn/docs/concepts/workloads/compositepodgroup-api/)
和 PodGroup 启用层次化寡头调度。

启用 `CompositePodGroup` 特性门控需要同时启用 `GenericWorkload` 和
`TopologyAwareWorkloadScheduling` 特性门控。
