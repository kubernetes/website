---
title: WatchCacheInitializationPostStartHook
content_type: feature_gate

build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.31"

---
Вмикає post-start-hook для ініціалізації watchcache як частину readyz (з таймаутом).
