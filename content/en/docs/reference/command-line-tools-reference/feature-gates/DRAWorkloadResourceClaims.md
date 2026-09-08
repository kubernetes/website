---
title: DRAWorkloadResourceClaims
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
  - stage: beta
    defaultValue: false
    fromVersion: "1.37"
---

Enables PodGroup resources from the
[Workload API](/docs/concepts/workloads/workload-api/) to make requests for
devices through
[Dynamic Resource Allocation](/docs/concepts/resource-management/dynamic-resource-allocation/)
that can be shared by their member Pods.
