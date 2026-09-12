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
    toVersion: "1.35"
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"
    toVersion: "1.36"
  - stage: stable
    locked: true
    defaultValue: true
    fromVersion: "1.37"

---
Вмикає post-start-hook для ініціалізації watchcache як частину readyz (з таймаутом).
