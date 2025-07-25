---
title: HPAScaleToZero
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.16"
---
تنظیم مقدار  `minReplicas` روی ۰ برای منابع `HorizontalPodAutoscaler` را هنگام استفاده از معیارهای سفارشی یا خارجی فعال می‌کند.