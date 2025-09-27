---
title: CrossNamespaceVolumeDataSource
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.26"
---
فعال کردن استفاده از فضای نام متقاطع برای منبع داده حجم
به شما امکان می‌دهد یک فضای نام منبع را در فیلد `dataSourceRef` از یک `PersistentVolumeClaim` مشخص کنید.
