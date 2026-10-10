---
title: JobTrackingWithFinalizers
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.22"
    toVersion: "1.22"
  - stage: beta
    defaultValue: false
    fromVersion: "1.23"  
    toVersion: "1.24" 
  - stage: beta
    defaultValue: true
    fromVersion: "1.25"  
    toVersion: "1.25" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.26"
    toVersion: "1.28"     

removed: true
---

<!--
Enables tracking [Job](/docs/concepts/workloads/controllers/job)
completions without relying on Pods remaining in the cluster indefinitely.
The Job controller uses Pod finalizers and a field in the Job status to keep
track of the finished Pods to count towards completion.
-->
启用跟踪 [Job](/zh-cn/docs/concepts/workloads/controllers/job/)
完成情况，而非总是从集群剩余 Pod 获取信息来判断完成情况。
Job 控制器使用 Pod 终结器（finalizers）和 Job 状态中的一个字段
来跟踪已完成的 Pod 以计算完成度。
