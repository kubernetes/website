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
    toVersion: "1.33"
  - stage: beta
    defaultValue: true
    fromVersion: "1.34"
---
Enables support for requesting [admin access](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#admin-access)
in a ResourceClaim or a ResourceClaimTemplate. Admin access grants access to
in-use devices and may enable additional permissions when making the device
available in a container. Starting with Kubernetes v1.33, only users authorized
to create ResourceClaim or ResourceClaimTemplate objects in namespaces labeled
with `resource.kubernetes.io/admin-access: "true"` (case-sensitive) can use the
`adminAccess` field. This ensures that non-admin users cannot misuse the
feature. Starting with Kubernetes v1.34, this label has been updated to `resource.kubernetes.io/admin-access: "true"`.

This feature gate has no effect unless you also enable the `DynamicResourceAllocation` feature gate.
