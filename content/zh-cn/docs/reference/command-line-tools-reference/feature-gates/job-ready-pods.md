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
---

<!--
Enables tracking the number of Pods that have a `Ready`
[condition](/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions).
The count of `Ready` pods is recorded in the
[status](/docs/reference/kubernetes-api/workload-resources/job-v1/#JobStatus)
of a [Job](/docs/concepts/workloads/controllers/job) status.
-->
允许跟踪[状况](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions)为
`Ready` 的 Pod 的个数。`Ready` 的 Pod 记录在
[Job](/zh-cn/docs/concepts/workloads/controllers/job/) 对象的
[status](/zh-cn/docs/reference/kubernetes-api/workload-resources/job-v1/#JobStatus) 字段中。
