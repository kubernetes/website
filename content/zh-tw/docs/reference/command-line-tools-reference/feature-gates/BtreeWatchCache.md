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
    toVersion: "1.32"
  - stage: stable
    defaultValue: true
    locked: true
    fromVersion: "1.33"
---

<!--
When enabled, the API server will replace the legacy HashMap-based _watch cache_
with a BTree-based implementation. This replacement may bring performance improvements.
-->
啓用後，API 伺服器將把傳統的基於 HashMap 的 **監視緩存（watch cache）** 替換爲基於 BTree 的實現。
這種替換可能會帶來性能提升。
