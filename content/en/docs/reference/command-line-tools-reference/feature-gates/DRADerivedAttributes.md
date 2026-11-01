---
title: DRADerivedAttributes
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---
Enables `derivedAttributes` in Dynamic Resource Allocation (DRA), letting
ResourceClaim and ResourceClaimTemplate authors compute virtual device
attributes with per-device CEL expressions, for use in `matchAttribute` and
`distinctAttribute` constraints.

For more information, see
[Derived attributes](/docs/concepts/resource-management/dynamic-resource-allocation/dra-api/#derived-attributes)
in the DRA API Objects documentation.
