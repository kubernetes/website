---
title: ConsistentListFromCache
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.28"
---
<!--
Allow the API server to serve consistent lists from cache.
-->
允许 API 服务器从缓存中提供一致的 list 操作。
