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

<!--
Enables tracking the number of Pods that have a `Ready`
[condition](/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions).
The count of `Ready` pods is recorded in the
[status](/docs/reference/kubernetes-api/workload-resources/job-v1/#JobStatus)
of a [Job](/docs/concepts/workloads/controllers/job) status.
-->
允許跟蹤[狀況](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions)爲
`Ready` 的 Pod 的個數。`Ready` 的 Pod 記錄在
[Job](/zh-cn/docs/concepts/workloads/controllers/job/) 對象的
[status](/zh-cn/docs/reference/kubernetes-api/workload-resources/job-v1/#JobStatus) 字段中。
