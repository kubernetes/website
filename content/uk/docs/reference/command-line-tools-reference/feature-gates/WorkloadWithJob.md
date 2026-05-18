---
title: WorkloadWithJob
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
---

Дозволяє контролеру Job автоматично створювати обʼєкти [Workload](/docs/concepts/workloads/workload-api/) та [PodGroup](/docs/reference/kubernetes-api/workload-resources/workload-v1alpha1/) для [кваліфікованих Job](/docs/concepts/workloads/controllers/job#qualifying-criteria). Див. [Інтеграція з Workload API](/docs/concepts/workloads/controllers/job#integrate-with-workload-apis) для деталей.
