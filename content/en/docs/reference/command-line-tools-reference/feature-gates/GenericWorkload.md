---
title: GenericWorkload
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.35"
    toVersion: "1.36"
  - stage: beta
    defaultValue: false
    fromVersion: "1.37"
---

Enables support for the [Workload API](/docs/concepts/workloads/workload-api/) and [PodGroup API](/docs/concepts/workloads/podgroup-api/) to express scheduling requirements at the workload level.

When enabled, Pods can reference a specific PodGroup to influence the way that they are scheduled. Starting in Kubernetes v1.37, this feature gate also encompasses [gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/), and [workload-aware preemption](/docs/concepts/scheduling-eviction/workload-aware-preemption/).
