---
title: DynamicResourceAllocation
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.30"
---
Enables support for resources with custom parameters and a lifecycle
that is independent of a Pod. Allocation of resources is handled
by the Kubernetes scheduler based on "structured parameters".
