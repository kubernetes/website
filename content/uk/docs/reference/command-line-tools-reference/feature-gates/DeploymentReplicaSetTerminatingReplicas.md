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
Увімкнення нового поля стану `.status.terminatingReplicas` у Deployments і ReplicaSets для відстежування завершених podʼів.
