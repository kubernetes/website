---
title: SeparateCacheWatchRPC
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.30"
---
Allow watch cache to create a watch on a dedicated RPC.
This prevents watch cache from being starved by other watches.
