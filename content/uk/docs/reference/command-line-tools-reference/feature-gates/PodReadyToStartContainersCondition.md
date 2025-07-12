---
title: PodReadyToStartContainersCondition
former_titles:
  - PodHasNetworkCondition
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.28"
  - stage: beta
    defaultValue: true
    fromVersion: "1.29"
---
Дозволяє kubelet позначати стан [PodReadyToStartContainers](/docs/concepts/workloads/pods/pod-lifecycle/#pod-has-network) для контейнерів Podʼів.

Раніше ця функціональна можливість була відома як `PodHasNetworkCondition`, а повʼязана з нею умова називалася `PodHasNetwork`.
