---
title: PodHasNetworkCondition
content_type: feature_gate
_build:
  list: never
  render: false
---
Enable the kubelet to mark the [PodHasNetwork](/docs/concepts/workloads/pods/pod-lifecycle/#pod-has-network)
condition on pods. This was renamed to `PodReadyToStartContainersCondition` in 1.28.
