---
title: PodIndexLabel
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.28"
    toVersion: "1.31"
  - stage: stable
    defaultValue: true
    fromVersion: "1.32"
---

<!--
Enables the Job controller and StatefulSet controller to add the pod index as a label when creating new pods. See [Job completion mode docs](/docs/concepts/workloads/controllers/job#completion-mode) and [StatefulSet pod index label docs](/docs/concepts/workloads/controllers/statefulset/#pod-index-label) for more details.
-->
在創建新的 Pod 時允許 Job 控制器和 StatefulSet 控制器將 Pod 索引添加爲標籤。
詳情參見 [Job 完成模式文檔](/zh-cn/docs/concepts/workloads/controllers/job#completion-mode)和
[StatefulSet Pod 索引標籤文檔](/zh-cn/docs/concepts/workloads/controllers/statefulset/#pod-index-label)。
