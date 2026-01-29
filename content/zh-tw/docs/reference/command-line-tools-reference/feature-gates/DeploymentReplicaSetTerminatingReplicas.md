---
title: DeploymentReplicaSetTerminatingReplicas
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.33"
---

<!--
Enables a new status field `.status.terminatingReplicas` in Deployments and ReplicaSets to allow tracking of terminating pods.
-->
在 Deployment 和 ReplicaSet 中啓用新的狀態字段 `.status.terminatingReplicas`，
允許跟蹤正在終止的 Pod。
