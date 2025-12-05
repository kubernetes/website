---
title: SELinuxMountReadWriteOncePod
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.25"
    toVersion: "1.26"
  - stage: beta
    defaultValue: false
    fromVersion: "1.27"
    toVersion: "1.27"
  - stage: beta
    defaultValue: true
    fromVersion: "1.28"
---
با اجازه دادن به kubelet برای نصب مستقیم volumeها برای یک Pod با برچسب صحیح SELinux به جای تغییر بازگشتی هر فایل روی volumeها، سرعت راه‌اندازی کانتینر را افزایش می‌دهد. پیاده‌سازی اولیه بر روی volumeهای ReadWriteOncePod متمرکز بود.
