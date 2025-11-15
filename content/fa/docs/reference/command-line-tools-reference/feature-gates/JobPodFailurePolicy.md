---
title: JobPodFailurePolicy
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.25"
    toVersion: "1.25"
  - stage: beta
    defaultValue: true
    fromVersion: "1.26"
    toVersion: "1.30"
  - stage: stable
    defaultValue: true
    fromVersion: "1.31"
    toVersion: "1.32"

removed: true
---
به کاربران اجازه دهید نحوه‌ی مدیریت خرابی‌های پاد را بر اساس کدهای خروج کانتینر و شرایط پاد مشخص کنند.
