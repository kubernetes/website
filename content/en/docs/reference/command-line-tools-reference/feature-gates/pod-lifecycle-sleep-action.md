---
title: PodLifecycleSleepAction
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.29"
---
Enables the `sleep` action in Container lifecycle hooks.
