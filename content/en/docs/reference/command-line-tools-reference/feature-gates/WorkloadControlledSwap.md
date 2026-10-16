---
title: WorkloadControlledSwap
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.38"
---
Enables configuring pod-level and container-level swap limits through `resources.limits.swap`.
