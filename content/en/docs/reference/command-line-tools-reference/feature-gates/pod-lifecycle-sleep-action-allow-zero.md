---
title: PodLifecycleSleepActionAllowZero
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.32"
    toVersion: "1.32"
---
Enables setting zero value for the `sleep` action in Container lifecycle hooks.
