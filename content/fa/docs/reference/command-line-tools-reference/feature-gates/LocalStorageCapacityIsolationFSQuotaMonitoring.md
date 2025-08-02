---
title: LocalStorageCapacityIsolationFSQuotaMonitoring
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.15"
    toVersion: "1.30"
  - stage: beta 
    defaultValue: false
    fromVersion: "1.31"
---
وقتی `LocalStorageCapacityIsolation` برای [local ephemeral storage](/docs/concepts/configuration/manage-resources-containers/),  فعال باشد، سیستم فایل پشتیبان برای  [emptyDir volumes](/docs/concepts/storage/volumes/#emptydir) از سهمیه‌بندی پروژه پشتیبانی می‌کند، و `UserNamespacesSupport` فعال باشد، سهمیه‌بندی پروژه برای نظارت بر مصرف فضای ذخیره‌سازی `emptyDir` به جای استفاده از پیمایش سیستم فایل استفاده می‌شود و عملکرد و دقت بهتری را تضمین می‌کند.