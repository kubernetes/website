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
Enable resource resizing for containers in Guaranteed pods with integer CPU requests.
It applies only in nodes with `InPlacePodVerticalScaling` and `CPUManager` features enabled,
and the CPUManager policy set to `static`.
