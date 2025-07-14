---
title: OrderedNamespaceDeletion
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.30"
    toVersion: "1.32"
  - stage: beta
    defaultValue: true
    fromVersion: "1.33"
---
فعال می‌کند که پادها قبل از بقیه منابع هنگام حذف فضای نام، حذف شوند.
