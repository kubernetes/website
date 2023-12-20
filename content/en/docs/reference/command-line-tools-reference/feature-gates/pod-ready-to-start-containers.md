---
title: PodReadyToStartContainersCondition
former_titles:
  - PodHasNetworkCondition
content_type: feature_gate
_build:
  list: never
  render: false
---
Enable the kubelet to mark the [PodReadyToStartContainers](/docs/concepts/workloads/pods/pod-lifecycle/#pod-has-network) condition on pods.

This feature gate was previously known as `PodHasNetworkCondition`, and the associated condition was
named `PodHasNetwork`.
