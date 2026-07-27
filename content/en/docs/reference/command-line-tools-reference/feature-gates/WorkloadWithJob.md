---
title: WorkloadWithJob
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
---

Enables the Job controller to automatically create [Workload](/docs/concepts/workloads/workload-api/) and [PodGroup](/docs/concepts/workloads/podgroup-api/) objects
for [qualifying Jobs](/docs/concepts/workloads/controllers/job#qualifying-criteria). See [Integrate with Workload APIs](/docs/concepts/workloads/controllers/job#integrate-with-workload-apis)
for details.