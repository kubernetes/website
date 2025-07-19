---
title: KMSv2KDF
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.28"  
    toVersion: "1.28"
  - stage: stable
    defaultValue: true
    fromVersion: "1.29"
    toVersion: "1.31"

removed: true
---
KMS نسخه ۲ را قادر می‌سازد تا کلیدهای رمزگذاری داده یکبار مصرف تولید کند.
برای جزئیات بیشتر به [Using a KMS Provider for data encryption](/docs/tasks/administer-cluster/kms-provider) مراجعه کنید.
اگر دروازه ویژگی `KMSv2` در خوشه شما فعال نباشد، مقدار دروازه ویژگی `KMSv2KDF` هیچ تاثیری ندارد.