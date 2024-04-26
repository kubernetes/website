---
# Removed from Kubernetes
title: SuspendJob
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
Enable support to suspend and resume Jobs. For more details, see
 [the Jobs docs](/docs/concepts/workloads/controllers/job/).
-->
启用对挂起和恢复 Job 的支持。详情参见
[Job 文档](/zh-cn/docs/concepts/workloads/controllers/job/)。
