---
title: DRAConsumableCapacity
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.34"
---
Enables device sharing across multiple ResourceClaims or requests.

Additionally, if a device supports sharing, its resource (capacity) can be managed through a defined sharing policy.
