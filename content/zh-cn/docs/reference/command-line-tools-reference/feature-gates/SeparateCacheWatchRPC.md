---
title: SeparateCacheWatchRPC
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.20"
---

<!--
Allows the API server watch cache to create a watch on a dedicated RPC.
This prevents watch cache from being starved by other watches.
-->
允许 API 服务器的监视缓存在专用的 RPC 上创建 watch。
这防止了监视缓存被其他 watch 所占用。
