---
# Removed from Kubernetes
title: IndexedJob
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.21"
    toVersion: "1.21"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.22"
    toVersion: "1.23"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.24"
    toVersion: "1.25"    

removed: true
---

<!--
Allows the [Job](/docs/concepts/workloads/controllers/job/)
controller to manage Pod completions per completion index.
-->
允许 [Job](/zh-cn/docs/concepts/workloads/controllers/job/)
控制器根据完成索引来管理 Pod 完成。
