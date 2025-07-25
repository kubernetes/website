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
在 Deployment 和 ReplicaSet 中启用新的状态字段 `.status.terminatingReplicas`，
允许跟踪正在终止的 Pod。
