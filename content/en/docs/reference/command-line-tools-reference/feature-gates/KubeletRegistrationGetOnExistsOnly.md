---
title: KubeletRegistrationGetOnExistsOnly
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
---
<!-- TODO: Add description for KubeletRegistrationGetOnExistsOnly feature gate -->
