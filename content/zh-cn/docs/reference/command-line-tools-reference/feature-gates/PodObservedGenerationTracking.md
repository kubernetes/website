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
    toVersion: "1.33"
  - stage: beta
    defaultValue: true
    fromVersion: "1.34"
    toVersion: "1.34"
  - stage: stable
    locked: true
    defaultValue: true
    fromVersion: "1.35"
---

<!--
Enables the kubelet to set `observedGeneration` in the Pod `.status`, and enables other components to set `observedGeneration` in pod conditions.
This feature allows reflecting the `.metadata.generation` of the Pod at the time that the overall status, or some specific condition, was being recorded.
Storing it helps avoid risks associated with _lost updates_.
-->
允许 kubelet 在 Pod 的 `.status` 中设置 `observedGeneration`，并允许其他组件在 Pod 状况中设置
`observedGeneration`。此特性允许反映在记录总体状态或某些特定状况时 Pod 的 `metadata.generation`。
存储 `observedGeneration` 有助于回避与**丢失更新**关联的风险。
