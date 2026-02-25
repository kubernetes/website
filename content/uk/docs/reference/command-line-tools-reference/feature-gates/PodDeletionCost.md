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
Вмикає функцію [Pod Deletion Cost](/docs/concepts/workloads/controllers/replicaset/#pod-deletion-cost), яка дозволяє користувачам впливати на порядок зменшення масштабу ReplicaSet.
