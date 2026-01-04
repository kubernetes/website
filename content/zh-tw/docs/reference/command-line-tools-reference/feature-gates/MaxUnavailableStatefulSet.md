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
允許爲 StatefulSet 的[滾動更新策略](/zh-cn/docs/concepts/workloads/controllers/statefulset/#rolling-updates)設置
`maxUnavailable` 字段。此字段指定更新過程中不可用 Pod 個數的上限。
