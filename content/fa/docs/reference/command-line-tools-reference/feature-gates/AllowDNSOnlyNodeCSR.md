---
title: AllowDNSOnlyNodeCSR
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: depricated
    defaultValue: false
    fromVersion: "1.31"
---
Allow kubelet to request a certificate without any Node IP available, only with DNS names.
به kubelet اجازه دهید بدون هیچ IP گره‌ای، فقط با نام‌های DNS، درخواست گواهی کند.

