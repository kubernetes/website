---
title: UserNamespacesSupport
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.29"
  - stage: beta
    defaultValue: false
    fromVersion: "1.30"
---

<!--
Enable user namespace support for Pods.
-->
为 Pod 启用用户命名空间支持。
