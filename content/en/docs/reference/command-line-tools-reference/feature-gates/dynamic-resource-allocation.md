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
    toVersion: "1.31"
  - stage: beta
    defaultValue: false
    fromVersion: "1.32"

# TODO: as soon as this is locked to "true" (= GA), comments about other DRA
# feature gate(s) like "unless you also enable the `DynamicResourceAllocation` feature gate"
# can be removed (for example, in dra-admin-access.md).

---
Enables support for resources with custom parameters and a lifecycle
that is independent of a Pod. Allocation of resources is handled
by the Kubernetes scheduler based on "structured parameters".
