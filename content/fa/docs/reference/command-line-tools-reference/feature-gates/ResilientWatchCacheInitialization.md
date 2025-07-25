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
فعال‌سازی مقداردهی اولیه کش ساعت (watchcache) به صورت انعطاف‌پذیر برای جلوگیری از بارگذاری بیش از حد صفحه کنترل.