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
When enabled, the API server will replace the legacy HashMap-based _watch cache_
with a BTree-based implementation. This replacement may bring performance improvements.

