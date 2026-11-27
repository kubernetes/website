---
title: DRAFractionalCapacityRange
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.37"
    toVersion: "1.37"
  - stage: stable
    defaultValue: true
    fromVersion: "1.38"
---

Enables fractional milli-values (for example `100m`) in the valid range and
default value of a device's consumable capacity request policy. This extends the
[DRAConsumableCapacity](/docs/reference/command-line-tools-reference/feature-gates/#DRAConsumableCapacity)
feature, which must also be enabled.

In 1.37, the feature gate is enabled by default if the minimum compatibility version is 1.37 or later.

For more information, see
[Fractional capacity range](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#fractional-capacity-range).
