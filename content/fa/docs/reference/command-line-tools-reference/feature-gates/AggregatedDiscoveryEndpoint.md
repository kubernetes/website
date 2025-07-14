---
title: Aggregate Discovery Endpoint
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpgha
    defaultValue: false
    fromVersion: "1.26"
    toVersion: "1.26"
  - stage: beta
    defaultValue: true
    fromVersion: "1.27"
    toVersion: "1.29"
  - stage: stable
    defaultValue: true
    fromVersion: "1.30"
    toVersion: "1.32"

removed: true
---


یک نقطه پایانی HTTP واحد `/discovery/<version>` را فعال کنید که از ذخیره‌سازی HTTP بومی با ETag هایی که شامل تمام APIResource های شناخته شده برای سرور API هستند، پشتیبانی می‌کند.
