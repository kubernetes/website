---
title: ImageMaximumGCAge
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
---
فیلد پیکربندی kubelet با نام `imageMaximumGCAge` را فعال می‌کند و به مدیر سیستم اجازه می‌دهد تا سنی را که پس از آن یک تصویر جمع‌آوری زباله می‌شود، مشخص کند.
