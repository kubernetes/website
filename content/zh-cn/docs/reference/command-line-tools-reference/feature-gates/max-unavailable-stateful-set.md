---
title: MaxUnavailableStatefulSet
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.24"
---

<!--
Enables setting the `maxUnavailable` field for the
[rolling update strategy](/docs/concepts/workloads/controllers/statefulset/#rolling-updates)
of a StatefulSet. The field specifies the maximum number of Pods
that can be unavailable during the update.
-->
允许为 StatefulSet 的[滚动更新策略](/zh-cn/docs/concepts/workloads/controllers/statefulset/#rolling-updates)设置
`maxUnavailable` 字段。此字段指定更新过程中不可用 Pod 个数的上限。
