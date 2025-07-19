---
title: ImageVolume
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.31"
    toVersion: "1.32"
  - stage: beta
    defaultValue: false
    fromVersion: "1.33"
---
اجازه استفاده از منبع والیوم [`image`](/docs/concepts/storage/volumes/) را در یک Pod بدهید.
این منبع والیوم به شما امکان می‌دهد یک ایمیج کانتینر را به عنوان یک والیوم فقط خواندنی مانت کنید.
