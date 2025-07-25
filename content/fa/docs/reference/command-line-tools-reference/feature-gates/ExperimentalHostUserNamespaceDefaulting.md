---
title: ExperimentalHostUserNamespaceDefaulting
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.5"  
    toVersion: "1.27" 
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.28"  
    toVersion: "1.29" 
removed: true
---
فعال کردن فضای نام کاربری پیش‌فرض برای میزبانی. این برای کانتینرهایی است که از فضاهای نام میزبان، مانت‌های میزبان یا کانتینرهایی که دارای امتیاز هستند یا از قابلیت‌های خاص بدون فضای نام (مانند `MKNODE`، `SYS_MODULE` و غیره) استفاده می‌کنند، استفاده می‌کنند. این فقط در صورتی باید فعال شود که نگاشت مجدد فضای نام کاربر در سرویس داکر فعال باشد.