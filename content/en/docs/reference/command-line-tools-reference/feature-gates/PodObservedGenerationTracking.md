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
Enables the kubelet to set `observedGeneration` in the Pod status and
other components to set `observedGeneration` in Pod conditions
to reflect the `metadata.generation` of the Pod at the time
that the status or condition is being recorded.

