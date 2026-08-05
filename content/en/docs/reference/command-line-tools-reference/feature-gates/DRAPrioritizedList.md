---
title: DRAPrioritizedList
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.33"
    toVersion: "1.33"
  - stage: beta
    defaultValue: true
    fromVersion: "1.34"
---
Enables support for the [Prioritized List](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#prioritized-list)
feature. It makes it possible to specify a prioritized list of subrequests for requests in a ResourceClaim.
