---
title: ListFromCacheSnapshot
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.33"
    toVersion: "1.33"
  - stage: beta
    defaultValue: true
    fromVersion: "1.34"
---

<!--
Enables the API server to generate snapshots for the watch cache store and using them to serve LIST requests.
-->
允許 API 伺服器爲 watch 緩存存儲生成快照，並使用這些快照來處理 LIST 請求。
