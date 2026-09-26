---
title: StaleControllerConsistencyStatefulSet
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"
---
Enables behavior within the StatefulSet controller to ensure that prior writes to
the API server are observed before proceeding with additional reconciliation for the same StatefulSet.
This is to prevent stale cache from causing incorrect or spurious updates to the StatefulSet.