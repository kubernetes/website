---
title: DRAAdminAccess
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
---
Enables support for requesting [admin access](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#admin-access)
in a ResourceClaim. A ResourceClaim
with admin access grants access to devices which are in use and may enable
additional access permissions when making the device available in a container.

This feature gate has no effect unless you also enable the `DynamicResourceAllocation` feature gate.
