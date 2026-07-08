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

<!--
Enables post-start-hook for watchcache initialization to be part of readyz (with timeout).
-->
启用监视缓存（WatchCache）初始化的 post-start-hook，使之成为就绪态端点（readyz）的考察条件（带超时）。
