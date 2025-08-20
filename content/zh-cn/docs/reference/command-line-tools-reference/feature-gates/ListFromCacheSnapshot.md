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
---

<!--
Enables the API server to generate snapshots for the watch cache store and using them to serve LIST requests.
-->
允许 API 服务器为 watch 缓存存储生成快照，并使用这些快照来处理 LIST 请求。
