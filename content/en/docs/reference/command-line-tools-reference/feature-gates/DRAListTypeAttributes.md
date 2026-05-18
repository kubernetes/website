---
title: DRAListTypeAttributes
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
---
Enables list-type attribute fields (`bools`, `ints`, `strings`, `versions`) for devices
in `ResourceSlice`, allowing a device to advertise multiple values for a single attribute.

When enabled, `matchAttribute` uses set-intersection semantics (the sets of attribute
values across all selected devices must have a non-empty intersection), and
`distinctAttribute` uses pairwise-disjoint semantics (the sets must share no values).
Scalar attributes remain backward-compatible, treated as singleton sets.

Also adds the `includes()` helper function to CEL device selector expressions, which
works on both scalar and list-type attributes.

For more information, see
[List type attributes](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#list-type-attributes)
in the Dynamic Resource Allocation documentation.
