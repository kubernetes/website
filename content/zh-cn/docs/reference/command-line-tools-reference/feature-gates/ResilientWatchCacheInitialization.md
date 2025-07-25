---
title: ResilientWatchCacheInitialization
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta 
    defaultValue: true
    fromVersion: "1.31"
---

<!--
Enables resilient watchcache initialization to avoid controlplane overload.
-->
启用弹性的监视缓存（WatchCache）初始化，以避免控制平面的过载。
