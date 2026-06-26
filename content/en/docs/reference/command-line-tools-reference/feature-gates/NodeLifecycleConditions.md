---
title: NodeLifecycleConditions
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---
Enables well-known Node conditions that report drain, maintenance, and
Graceful Node Shutdown lifecycle state. See
[Node lifecycle conditions](/docs/reference/node/node-lifecycle-conditions-docs.md).
