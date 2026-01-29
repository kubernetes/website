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
    toVersion: "1.35"
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"
---
Enables post-start-hook for watchcache initialization to be part of readyz (with timeout).
