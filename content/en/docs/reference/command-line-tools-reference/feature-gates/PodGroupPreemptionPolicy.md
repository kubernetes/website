---
title: PodGroupPreemptionPolicy
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---

Enables the support for `PreemptionPolicy` field in [PodGroup API](/docs/concepts/workloads/podgroup-api/) and [Workload API](/docs/concepts/workloads/workload-api/).

When enabled, if a PodGroup has `PreemptionPolicy: Never` it will not perform workload aware preemption.
