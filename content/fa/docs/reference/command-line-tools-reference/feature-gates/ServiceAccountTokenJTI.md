---
title: ServiceAccountTokenJTI
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.29"
    toVersion: "1.29"
  - stage: beta
    defaultValue: true
    fromVersion: "1.30"
    toVersion: "1.31"
  - stage: stable
    defaultValue: true
    fromVersion: "1.32"
---
کنترل می‌کند که آیا JTIها (UUIDها) در توکن‌های حساب سرویس تولید شده تعبیه شده‌اند یا خیر، و اینکه آیا این JTIها برای درخواست‌های آینده‌ی انجام شده توسط این توکن‌ها در گزارش حسابرسی Kubernetes ثبت می‌شوند یا خیر.
