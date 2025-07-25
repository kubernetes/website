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
    toVersion: "1.31"
  - stage: beta
    defaultValue: true
    fromVersion: "1.32"
---

<!--
Allows to delegate reconciliation of a Job object to an external controller.
-->
允许将 Job 对象的调和委托给外部控制器。
