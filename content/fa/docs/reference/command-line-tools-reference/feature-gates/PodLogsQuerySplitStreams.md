---
title: PodLogsQuerySplitStreams
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
---
با استفاده از Pod API، دریافت جریان‌های لاگ خاص (چه stdout و چه stderr) از جریان‌های لاگ یک کانتینر را فعال کنید.
