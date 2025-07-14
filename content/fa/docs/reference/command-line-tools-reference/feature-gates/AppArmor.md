---
title: AppArmor
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.4"
    toVersion: "1.30"
  - stage: stable
    defaultValue: true
    fromVersion: "1.31"
    toVersion: "1.32"

removed: true
---
فعال کردن کنترل دسترسی اجباری AppArmor برای Podهایی که روی گره‌های لینوکس اجرا می‌شوند. برای جزئیات بیشتر به [AppArmor Tutorial](/docs/tutorials/security/apparmor/) مراجعه کنید.