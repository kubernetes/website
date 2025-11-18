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

Enables the support for [Workload API](/docs/concepts/workloads/workload-api/) to express scheduling requirements
at the workload level. Pods can now reference a specific Workload PodGroup using the spec.workloadRef field.
scheduling.k8s.io/v1alpha1 {{< glossary_tooltip text="API group" term_id="api-group" >}}
has to be enabled to make the Workload API available.
