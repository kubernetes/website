---
title: DynamicResourceAllocation
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.26"
    toVersion: "1.31"
  - stage: beta
    defaultValue: false
    fromVersion: "1.32"
    toVersion: "1.33"
  - stage: stable
    defaultValue: true
    fromVersion: "1.34"
    toVersion: "1.34"
  - stage: stable
    defaultValue: true
    fromVersion: "1.35"
    locked: true

# TODO: as soon as this is locked to "true" (= some time after GA, *not* yet in 1.34), comments about other DRA
# feature gate(s) like "unless you also enable the `DynamicResourceAllocation` feature gate"
# can be removed (for example, in dra-admin-access.md).
---
Enables support for resources with custom parameters and a lifecycle
that is independent of a Pod. Allocation of resources is handled
by the Kubernetes scheduler based on "structured parameters".
