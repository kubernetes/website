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
    toVersion: "1.37"

removed: true
---

Enables support for the `preemptionPolicy` field in the [PodGroup API](/docs/concepts/workloads/podgroup-api/),
[CompositePodGroup API](/docs/concepts/workloads/compositepodgroup-api/), and
[Workload API](/docs/concepts/workloads/workload-api/).
This feature gate was removed in v1.38 and merged into the
[`GenericWorkload`](/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload)
feature gate (and [`CompositePodGroup`](/docs/reference/command-line-tools-reference/feature-gates/#CompositePodGroup)
for CompositePodGroups).

When enabled, if a PodGroup has `preemptionPolicy: Never`, it does not perform workload-aware preemption.
