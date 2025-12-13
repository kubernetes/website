---
title: SeparateCacheWatchRPC
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.28"
    toVersion: "1.32"
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.33"
---

<!--
Allows the API server watch cache to create a watch on a dedicated RPC.
This prevents watch cache from being starved by other watches.
-->
允許 API 伺服器的監視緩存在專用的 RPC 上創建 watch。
這防止了監視緩存被其他 watch 所佔用。
