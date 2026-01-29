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
允許叢集操作員使用 **list** 操作來辨別受損的資源，
引入一個 `ignoreStoreReadErrorWithClusterBreakingPotential` 選項，
叢集操作員可以設置此選項並使用 Kubernetes API 對受損的資源執行不安全的強制 **delete** 操作。
