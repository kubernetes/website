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
---

<!--
Enables the Job controller and StatefulSet controller to add the pod index as a label when creating new pods. See [Job completion mode docs](/docs/concepts/workloads/controllers/job#completion-mode) and [StatefulSet pod index label docs](/docs/concepts/workloads/controllers/statefulset/#pod-index-label) for more details.
-->
在创建新的 Pod 时允许 Job 控制器和 StatefulSet 控制器将 Pod 索引添加为标签。
详情参见 [Job 完成模式文档](/zh-cn/docs/concepts/workloads/controllers/job#completion-mode)和
[StatefulSet Pod 索引标签文档](/zh-cn/docs/concepts/workloads/controllers/statefulset/#pod-index-label)。
