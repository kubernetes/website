---
title: JobReadyPods
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.23"
    toVersion: "1.23"
  - stage: beta
    defaultValue: true
    fromVersion: "1.24"
    toVersion: "1.28"
  - stage: stable
    defaultValue: true
    fromVersion: "1.29"
    toVersion: "1.30"

removed: true
---
Дозволяє відстежувати кількість Podʼів, які мають [стан](/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions) `Ready`. Кількість `Ready` Podʼів записується у [status](/docs/reference/kubernetes-api/workload-resources/job-v1/#JobStatus) [Job](/docs/concepts/workloads/controllers/job).
