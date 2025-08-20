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
Enables the kubelet to set `observedGeneration` in the pod status and other components to set `observedGeneration` in pod conditions to reflect the `metadata.generation` of the pod at the time that the status or condition is being recorded.
