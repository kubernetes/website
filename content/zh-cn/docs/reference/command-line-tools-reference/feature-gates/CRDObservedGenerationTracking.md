---
title: CRDObservedGenerationTracking
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.35"
---

<!--
Allows for the observed generation to be tracked in CRD conditions. Setting to
false will make it so CRD conditions will have the observed generation wiped.
-->
允许在 CRD 状况中跟踪观测到的世代数（`observedGeneration`）。将此特性门控设置为
false 将清除 CRD 状况中观测到的世代数（`observedGeneration`）。
