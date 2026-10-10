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
  - stage: beta
    defaultValue: true
    fromVersion: "1.33"
    toVersion: "1.33"
  - stage: stable
    locked: true
    defaultValue: true
    fromVersion: "1.34"
---
Enables setting zero value for the `sleep` action in
[container lifecycle hooks](/docs/concepts/containers/container-lifecycle-hooks/).
