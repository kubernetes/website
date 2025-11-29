---
title: ChangeContainerStatusOnKubeletRestart
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: stable
    defaultValue: true
    fromVersion: "1.0"
    toVersion: "1.34"
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.35"
---
<!-- TODO: Add description for ChangeContainerStatusOnKubeletRestart feature gate -->
