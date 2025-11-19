---
title: PodDeletionCost
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.21"
    toVersion: "1.21"
  - stage: beta
    defaultValue: true
    fromVersion: "1.22"
---

<!--
Enable the [Pod Deletion Cost](/docs/concepts/workloads/controllers/replicaset/#pod-deletion-cost)
feature which allows users to influence ReplicaSet downscaling order.
-->
啓用 [Pod 刪除開銷](/zh-cn/docs/concepts/workloads/controllers/replicaset/#pod-deletion-cost)特性，
允許用戶影響 ReplicaSet 的縮容順序。
