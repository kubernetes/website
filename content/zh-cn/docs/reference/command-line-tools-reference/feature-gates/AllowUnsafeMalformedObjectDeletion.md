---
title: AllowUnsafeMalformedObjectDeletion
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
---

<!--
Enables the cluster operator to identify corrupt resource(s) using the **list**
operation, and introduces an option `ignoreStoreReadErrorWithClusterBreakingPotential`
that the operator can set to perform unsafe and force **delete** operation of
such corrupt resource(s) using the Kubernetes API.
-->
允许集群操作员使用 **list** 操作来辨别受损的资源，
引入一个 `ignoreStoreReadErrorWithClusterBreakingPotential` 选项，
集群操作员可以设置此选项并使用 Kubernetes API 对受损的资源执行不安全的强制 **delete** 操作。
