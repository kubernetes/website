---
title: AllowUnsafeMalformedObjectDeletion
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
---


به اپراتور کلاستر این امکان را می‌دهد که با استفاده از عملیات **list** منابع خراب را شناسایی کند و گزینه‌ای با عنوان `ignoreStoreReadErrorWithClusterBreakingPotential` را معرفی می‌کند که اپراتور می‌تواند آن را برای انجام عملیات ناامن و حذف اجباری چنین منابع خراب با استفاده از Kubernetes API تنظیم کند.