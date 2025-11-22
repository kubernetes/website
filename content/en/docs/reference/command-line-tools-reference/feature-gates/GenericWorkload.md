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

Enables the scheduling.k8s.io/v1alpha1 Workload API to express scheduling requirements
at the workload level. Pods can now reference a specific Workload PodGroup using the spec.workloadRef field.