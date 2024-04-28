---
title: JobManagedBy
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.30"
---

<!--
Allows to delegate reconciliation of a Job object to an external controller.
-->
允许将 Job 对象的调和委托给外部控制器。
