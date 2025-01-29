---
title: InPlacePodVerticalScalingAllocatedStatus
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
---
Enables the `allocatedResources` field in the container status.
This feature requires the `InPlacePodVerticalScaling` gate be enabled as well.

