---
title: WatchFromStorageWithoutResourceVersion
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.30"
    toVersion: "1.32"
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.33"
---

<!--
Enables watches without `resourceVersion` to be served from storage.
-->
允許在沒有 `resourceVersion` 的情況下基於存儲提供監視服務。
