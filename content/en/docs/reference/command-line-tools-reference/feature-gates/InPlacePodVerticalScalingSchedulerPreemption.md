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
    toVersion: "1.37"
  - stage: beta
    defaultValue: true
    fromVersion: "1.38"
---
Enables scheduler preemption of lower-priority pods to fulfill deferred
in-place pod resize requests. For details, see
[Preemption for in-place Pod resize](/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption-for-in-place-pod-resize).
