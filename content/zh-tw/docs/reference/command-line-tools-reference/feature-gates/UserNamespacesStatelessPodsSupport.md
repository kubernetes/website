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
爲無狀態 Pod 啓用用戶命名空間支持。此特性在 Kubernetes v1.28 版本中被 `UserNamespacesSupport` 特性取代。
