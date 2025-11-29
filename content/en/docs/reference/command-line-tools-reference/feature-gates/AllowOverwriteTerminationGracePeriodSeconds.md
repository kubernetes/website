---
title: AllowOverwriteTerminationGracePeriodSeconds
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: stable
    defaultValue: true
    fromVersion: "1.0"
    toVersion: "1.31"
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.32"
    toVersion: "1.34"
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.35"
    locked: true
---
<!-- TODO: Add description for AllowOverwriteTerminationGracePeriodSeconds feature gate -->
