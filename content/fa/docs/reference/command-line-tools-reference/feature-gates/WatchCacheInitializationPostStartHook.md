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
فعال کردن post-start-hook برای مقداردهی اولیه watchcache به عنوان بخشی از readyz (با timeout).