---
title: DRAResourceClaimGranularStatusAuthorization
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"
---

Enables support for granular authorization of ResourceClaim status updates.
This feature requires additional fine-grained access permissions when modifying
specific fields within ResourceClaim status objects.
