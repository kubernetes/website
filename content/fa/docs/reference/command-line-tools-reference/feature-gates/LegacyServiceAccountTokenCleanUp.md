---
title: LegacyServiceAccountTokenCleanUp
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.28"
  - stage: beta
    defaultValue: true
    fromVersion: "1.29"
    toVersion: "1.29"
  - stage: stable
    defaultValue: true
    fromVersion: "1.30"
    toVersion: "1.31"

removed: true
---
فعال کردن پاکسازی توکن‌های حساب کاربری مبتنی بر راز [service account tokens](/docs/concepts/security/service-accounts/#get-a-token)
زمانی که در یک زمان مشخص (پیش‌فرض یک سال) استفاده نمی‌شوند.