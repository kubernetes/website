---
title: ServiceAccountTokenPodNodeInfo
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.29"
    toVersion: "1.29"
  - stage: beta
    defaultValue: true
    fromVersion: "1.30"
    toVersion: "1.31"
  - stage: stable
    defaultValue: true
    fromVersion: "1.32"
---
کنترل می‌کند که آیا apiserver هنگام صدور توکن‌های حساب سرویس متصل به اشیاء Pod، نام گره و شناسه کاربری (uid) گره مرتبط را در خود جای می‌دهد یا خیر.
