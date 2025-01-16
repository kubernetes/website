---
title: PodHasNetworkCondition
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.25"
    toVersion: "1.27"

removed: true
---
Дозволити kubelet позначати стан [PodHasNetwork](/docs/concepts/workloads/pods/pod-lifecycle/#pod-has-network) для контейнерів. Його було перейменовано на `PodReadyToStartContainersCondition` у версії 1.28.
