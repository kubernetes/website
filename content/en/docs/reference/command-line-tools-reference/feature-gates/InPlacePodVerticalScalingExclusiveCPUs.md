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
Enable In-place cpu resource resizing of Pods with Guaranteed Quality of Service (QOS) class 
which make use of exclusive CPUs using the static CPU management policy.
