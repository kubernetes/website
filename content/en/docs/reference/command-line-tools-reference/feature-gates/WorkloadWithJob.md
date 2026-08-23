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

Enables the Job controller to compile a Job's `.spec.scheduling` configuration into
[Workload](/docs/concepts/workloads/workload-api/) and [PodGroup](/docs/reference/kubernetes-api/scheduling/pod-group-v1alpha2/)
objects before it creates any Pods.
When `.spec.scheduling` is omitted, the Job defaults to the `Basic` scheduling policy. See
[Integrate with Workload APIs](/docs/concepts/workloads/controllers/job#integrate-with-workload-apis)
for details.