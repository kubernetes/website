---
title: MutableSchedulingDirectivesForSuspendedJobs 
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.35"
removed: false
---

<!--
Enable the ability to patch pod templates for suspended Jobs, in order to change the pod scheduling directives.
-->
启用为已挂起的 Job 修补 Pod 模板的能力，以便更改 Pod 的调度指令。
