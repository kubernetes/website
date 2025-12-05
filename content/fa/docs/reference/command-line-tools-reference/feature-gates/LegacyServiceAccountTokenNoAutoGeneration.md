---
title: LegacyServiceAccountTokenNoAutoGeneration
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta 
    defaultValue: true
    fromVersion: "1.24"
    toVersion: "1.25"
  - stage: stable
    defaultValue: true
    fromVersion: "1.26"
    toVersion: "1.28"

removed: true
---
توقف تولید خودکار توکن‌های حساب کاربری مبتنی بر رمز عبور [service account tokens](/docs/concepts/security/service-accounts/#get-a-token).