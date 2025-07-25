---
# Removed from Kubernetes
title: DynamicAuditing
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.13"
    toVersion: "1.18"
  - stage: deprecated
    fromVersion: "1.19"
    toVersion: "1.19"

removed: true  
---
برای فعال کردن حسابرسی پویا قبل از نسخه ۱.۱۹ استفاده می‌شد.
