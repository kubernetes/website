---
title: EnableWorkloadWithJob
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
---

Enables the integration of Workload API with Jobs. When this feature gate is enabled,
the Job controller will create a Workload and a PodGroup objects for each Job that 
matches the criteria. The [Workload API](/docs/concepts/workloads/workload-api/) is 
used to express the requirements, while the [PodGroup API](/docs/reference/kubernetes-api/workload-resources/workload-v1alpha1/) is the runtime object that is used to schedule the group of Pods.