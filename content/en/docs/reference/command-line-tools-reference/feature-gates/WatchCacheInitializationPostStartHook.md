---
title: WatchCacheInitializationPostStartHook
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta 
    defaultValue: false
    fromVersion: "1.31"

---
Enables post-start-hook for watchcache initialization to be part of readyz (with timeout).
