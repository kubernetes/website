---
title: InPlacePodVerticalScalingMemoryBackedVolumes
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
    toVersion: "1.37"
  - stage: beta
    defaultValue: true
    fromVersion: "1.38"
---
Enables in-place vertical scaling for memory-backed `emptyDir` volume size limits.
For details, see [Resizing memory-backed emptyDir volumes](/docs/tasks/configure-pod-container/resize-container-resources/#resizing-memory-backed-emptydir-volumes).
