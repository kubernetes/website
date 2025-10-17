---
title: PodDisruptionConditions
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
---
پشتیبانی از افزودن یک وضعیت پاد اختصاصی را فعال می‌کند که نشان می‌دهد پاد به دلیل اختلال در حال حذف است.
