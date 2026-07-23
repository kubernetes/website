---
title: StatefulSetRecreateStrategy
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---
Enables the `Recreate` update strategy for StatefulSets, which deletes all of a
StatefulSet's Pods before creating new Pods that reflect modifications made to the
StatefulSet's `.spec.template`. See
[Recreate](/docs/concepts/workloads/controllers/statefulset/#recreate) for details.
