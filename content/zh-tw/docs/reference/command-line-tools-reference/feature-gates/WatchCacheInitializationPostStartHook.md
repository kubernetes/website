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
啓用監視緩存（WatchCache）初始化的 post-start-hook，使之成爲就緒態端點（readyz）的考察條件（帶超時）。
