---
title: CPUManager
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.8"
    toVersion: "1.9"
  - stage: beta
    defaultValue: true
    fromVersion: "1.10"  
    toVersion: "1.25" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.26"  
    toVersion: "1.32"

removed: true
---
<!--
Enable container level CPU affinity support, see
[CPU Management Policies](/docs/tasks/administer-cluster/cpu-management-policies/).
-->
啓用容器級別的 CPU 親和性支持，有關更多詳細資訊，請參見
[CPU 管理策略](/zh-cn/docs/tasks/administer-cluster/cpu-management-policies/)。
