---
title: ProcMountType
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.12"
    toVersion: "1.30"
  - stage: beta
    defaultValue: false
    fromVersion: "1.31"
---
Enables control over the type proc mounts for containers
by setting the `procMount` field of a Pod's `securityContext`.
