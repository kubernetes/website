---
title: WorkloadAwarePreemption
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
---

Enables the support for [Workload-aware preemption](/docs/concepts/scheduling-eviction/workload-aware-preemption/).

When enabled, if a PodGroup fails to schedule, the scheduler will use a workload-aware preemption
algorithm to select victims to preempt instead of the default pod preemption algorithm.
