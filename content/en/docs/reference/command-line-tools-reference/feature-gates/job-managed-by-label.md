---
title: JobManagedByLabel
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.30"
---
Allows to delegate reconciliation of a Job object to an external controller.
