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
یک فیلد وضعیت جدید به نام `.status.terminatingReplicas` را در Deployments و ReplicaSets فعال می‌کند تا امکان ردیابی پادهای در حال خاتمه فراهم شود.