---
title: GangScheduling
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.35"
    toVersion: "1.36"

removed: true
---

Enables the GangScheduling plugin in kube-scheduler, which implements "all-or-nothing"
scheduling algorithm. The [Workload API](/docs/concepts/workloads/workload-api/) is used
to express the requirements.

This feature gate was removed in 1.37 and merged together with the `GenericWorkload` feature gate.