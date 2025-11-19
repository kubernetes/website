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
---

<!--
Enables the kubelet to set `observedGeneration` in the Pod `.status`, and enables other components to set `observedGeneration` in pod conditions.
This feature allows reflecting the `.metadata.generation` of the Pod at the time that the overall status, or some specific condition, was being recorded.
Storing it helps avoid risks associated with _lost updates_.
-->
允許 kubelet 在 Pod 的 `.status` 中設置 `observedGeneration`，並允許其他組件在 Pod 狀況中設置
`observedGeneration`。此特性允許反映在記錄總體狀態或某些特定狀況時 Pod 的 `metadata.generation`。
存儲 `observedGeneration` 有助於迴避與**丟失更新**關聯的風險。
