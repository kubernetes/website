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
啓用跟蹤 [Job](/zh-cn/docs/concepts/workloads/controllers/job/)
完成情況，而非總是從叢集剩餘 Pod 獲取資訊來判斷完成情況。
Job 控制器使用 Pod 終結器（finalizers）和 Job 狀態中的一個字段
來跟蹤已完成的 Pod 以計算完成度。
