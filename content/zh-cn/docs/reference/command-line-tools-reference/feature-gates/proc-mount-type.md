---
title: ProcMountType
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.12"
    toVersion: "1.30"
  - stage: beta
    defaultValue: false
    fromVersion: "1.31"
---

<!--
Enables control over the type proc mounts for containers
by setting the `procMount` field of a Pod's `securityContext`.
-->
允许容器通过设置 Pod 的 `securityContext` 的 `procMount` 字段来控制对
proc 类型的挂载方式。
