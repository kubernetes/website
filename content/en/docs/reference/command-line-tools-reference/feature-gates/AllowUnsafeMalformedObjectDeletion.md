---
title: AllowUnsafeMalformedObjectDeletion
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
---
Enables the cluster operator to identify corrupt resource(s) using the **list**
operation, and introduces an option `ignoreStoreReadErrorWithClusterBreakingPotential`
that the operator can set to perform unsafe and force **delete** operation of
such corrupt resource(s) using the Kubernetes API.
