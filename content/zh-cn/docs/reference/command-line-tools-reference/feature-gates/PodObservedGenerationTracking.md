---
title: PodObservedGenerationTracking
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.33"
---

<!--
Enables the kubelet to set `observedGeneration` in the pod status and other components to set `observedGeneration`
in pod conditions to reflect the `metadata.generation` of the pod at the time that the status or condition is being recorded.
-->
允许 kubelet 在 Pod 状态中设置 `observedGeneration`，并允许其他组件在 Pod 状况中设置
`observedGeneration`，以反映在记录状态或状况时 Pod 的 `metadata.generation`。
