---
title: UserNamespacesStatelessPodsSupport
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.25"
    toVersion: "1.27"

removed: true
---

<!--
Enable user namespace support for stateless Pods. This feature gate was superseded
by the `UserNamespacesSupport` feature gate in the Kubernetes v1.28 release.
-->
为无状态 Pod 启用用户命名空间支持。此特性在 Kubernetes v1.28 版本中被 `UserNamespacesSupport` 特性取代。
