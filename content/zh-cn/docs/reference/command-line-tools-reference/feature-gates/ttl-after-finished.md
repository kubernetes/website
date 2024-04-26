---
# Removed from Kubernetes
title: TTLAfterFinished
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.12"
    toVersion: "1.20"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.22"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.23"
    toVersion: "1.24"    

removed: true
---

<!--
Allow a [TTL controller](/docs/concepts/workloads/controllers/ttlafterfinished/)
to clean up resources after they finish execution.
-->
允许
[TTL 控制器](/zh-cn/docs/concepts/workloads/controllers/ttlafterfinished/)在资源执行完毕后清理资源。
