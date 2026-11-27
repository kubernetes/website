---
title: InPlacePodVerticalScalingExclusiveCPUs
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
---
Enables in-place CPU resizing for containers in Guaranteed Pods that use
exclusive CPUs allocated by the static CPU manager policy.
Requires the static CPU manager policy on the node.
The feature is implemented starting with v1.38. Versions v1.32 to v1.37 have
this feature gate, but do not implement the feature.
