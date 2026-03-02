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
    toVersion: "1.34"
  - stage: beta
    defaultValue: true
    fromVersion: "1.35"
---
Увімкнення нового поля стану `.status.terminatingReplicas` у Deployments і ReplicaSets для відстежування завершених podʼів.
