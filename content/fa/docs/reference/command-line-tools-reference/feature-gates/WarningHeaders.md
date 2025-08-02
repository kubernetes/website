---
# Removed from Kubernetes
title: WarningHeaders
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta 
    defaultValue: true
    fromVersion: "1.19"
    toVersion: "1.21"
  - stage: stable
    defaultValue: true
    fromVersion: "1.22"
    toVersion: "1.24"

removed: true
---
اجازه ارسال هدرهای هشدار در پاسخ‌های API.