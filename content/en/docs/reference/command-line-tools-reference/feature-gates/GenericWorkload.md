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
---

Enables the support for [Workload API](/docs/concepts/workloads/workload-api/) to express scheduling requirements at the workload level.

When enabled Pods can reference a specific pod group and use this to influence
the way that they are scheduled.
