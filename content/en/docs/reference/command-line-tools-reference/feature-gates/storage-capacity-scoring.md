---
title: StorageCapacityScoring
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.33"
---
Enable the feature that scores nodes based on available
storage capacity. This only applies when not using
static provisioning (dynamic provisioning only).
