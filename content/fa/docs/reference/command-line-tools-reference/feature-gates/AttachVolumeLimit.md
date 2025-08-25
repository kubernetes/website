---
# از Kubernetes حذف شد
title: AttachVolumeLimit
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.11"
    toVersion: "1.11"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.12"
    toVersion: "1.16"
  - stage: stable
    defaultValue: true
    fromVersion: "1.17"
    toVersion: "1.21"

removed: true
---
فزونه‌های حجم را برای گزارش محدودیت تعداد حجم‌هایی که می‌توانند به یک گره متصل شوند، فعال کنید.
برای جزئیات بیشتر به [dynamic volume limits](/docs/concepts/storage/storage-limits/#dynamic-volume-limits) مراجعه کنید.