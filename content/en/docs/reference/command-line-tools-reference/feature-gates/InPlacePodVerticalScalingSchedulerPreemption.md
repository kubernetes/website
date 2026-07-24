---
title: InPlacePodVerticalScalingSchedulerPreemption
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---
Enables scheduler preemption of lower-priority pods to fulfill deferred in-place pod resize requests.
