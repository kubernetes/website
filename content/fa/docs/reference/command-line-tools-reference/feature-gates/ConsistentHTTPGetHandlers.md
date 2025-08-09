---
title: ConsistentHTTPGetHandlers
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: stable
    defaultValue: true
    fromVersion: "1.25"  
    toVersion: "1.30"

removed: true
---
ارسال HTTP get URL و Header را برای کنترل‌کننده‌های چرخه عمر با کاوشگرها عادی‌سازی کنید.

