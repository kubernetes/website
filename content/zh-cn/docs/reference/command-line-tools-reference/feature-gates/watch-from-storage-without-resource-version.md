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
---

<!--
Enables watches without `resourceVersion` to be served from storage.
-->
允许在没有 `resourceVersion` 的情况下基于存储提供监视服务。
