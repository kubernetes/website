---
title: SeparateCacheWatchRPC
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    locked: false
    fromVersion: "1.28"
    toVersion: "1.32"
  - stage: deprecated
    defaultValue: false
    locked: false
    fromVersion: "1.33"
    toVersion: "1.35"
  - stage: deprecated
    defaultValue: false
    locked: true
    fromVersion: "1.36"
---

Allows the API server watch cache to create a watch on a dedicated RPC.
This prevents watch cache from being starved by other watches.
