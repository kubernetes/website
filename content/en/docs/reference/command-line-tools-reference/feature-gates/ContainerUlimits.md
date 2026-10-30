---
title: ContainerUlimits
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.38"
---
Enables configuring per-container POSIX resource limits (ulimits) for Linux
containers through the `ulimits` field in the container's `securityContext`.
