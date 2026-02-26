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

Enables the support for [Gang preemption](/docs/concepts/scheduling-eviction/gang-preemption/).

When enabled the preemption victims chosen when scheduling a pod group will be chosen using a workload aware preemption algorithm instead of a default pod preemption algorithm. 