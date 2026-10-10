---
title: InPlacePodVerticalScalingExclusiveMemory
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.34"
---
Allow resource resize for containers in Guaranteed Pods when the memory manager policy is set to `"Static"`.
Applies only to nodes with `InPlacePodVerticalScaling` and memory manager features enabled.

