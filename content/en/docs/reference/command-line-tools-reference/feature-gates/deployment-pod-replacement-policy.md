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
Enables a new status field `.status.terminatingReplicas` in Deployments and ReplicaSets to allow tracking of terminating pods.
