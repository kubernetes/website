---
title: WorkloadWithDeployment
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.38"
---

Enables the Deployment and ReplicaSet controllers to create Workload and PodGroup
objects from a Deployment's `.spec.scheduling` configuration.
When `.spec.scheduling` is omitted, no Workload or PodGroup objects are created.
See [Integrate with Workload APIs](/docs/concepts/workloads/controllers/deployment/#integrate-with-workload-apis)
for details.
