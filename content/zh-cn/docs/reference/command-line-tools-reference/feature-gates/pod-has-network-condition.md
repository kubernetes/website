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

<!--
Enable the kubelet to mark the [PodHasNetwork](/docs/concepts/workloads/pods/pod-lifecycle/#pod-has-network)
condition on pods. This was renamed to `PodReadyToStartContainersCondition` in 1.28.
-->
使得 kubelet 能够对 Pod 标记
[PodHasNetwork](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-has-network) 状况。
此特性在 1.28 中重命名为 `PodReadyToStartContainersCondition`。
