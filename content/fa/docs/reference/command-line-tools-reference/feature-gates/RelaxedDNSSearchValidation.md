---
title: RelaxedDNSSearchValidation
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
    toVersion: "1.32"
  - stage: beta
    defaultValue: true
    fromVersion: "1.33"

---
اعتبارسنجی سمت سرور را برای رشته جستجوی DNS (`.spec.dnsConfig.searches`) برای کانتینرها، آسان‌تر کنید. برای مثال، با فعال بودن این گیت، اشکالی ندارد که کاراکتر `_` را در رشته جستجوی نام DNS وارد کنید.