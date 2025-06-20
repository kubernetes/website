---
title: JobMutableNodeSchedulingDirectives
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta 
    defaultValue: true
    fromVersion: "1.23"
    toVersion: "1.26"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.27"
    toVersion: "1.28"    

removed: true
---

<!--
Allows updating node scheduling directives in
the pod template of [Job](/docs/concepts/workloads/controllers/job).
-->
允许更新在 [Job](/zh-cn/docs/concepts/workloads/controllers/job/)
的 Pod 模板中的节点调度指令。
