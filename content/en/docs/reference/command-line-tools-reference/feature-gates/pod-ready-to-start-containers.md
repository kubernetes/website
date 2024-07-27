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
Enable the kubelet to mark the [PodReadyToStartContainers](/docs/concepts/workloads/pods/pod-lifecycle/#pod-has-network) condition on pods.

This feature gate was previously known as `PodHasNetworkCondition`, and the associated condition was
named `PodHasNetwork`.
