---
title: BtreeWatchCache
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta 
    defaultValue: true
    fromVersion: "1.32"
---

<!--
When enabled, the API server will replace the legacy HashMap-based _watch cache_
with a BTree-based implementation. This replacement may bring performance improvements.
-->
启用后，API 服务器将把传统的基于 HashMap 的 **监视缓存（watch cache）** 替换为基于 BTree 的实现。
这种替换可能会带来性能提升。
