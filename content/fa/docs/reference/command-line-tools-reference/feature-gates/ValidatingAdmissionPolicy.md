---
title: ValidatingAdmissionPolicy
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.26"
    toVersion: "1.27"
  - stage: beta
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.29"
  - stage: stable
    defaultValue: true
    fromVersion: "1.30"
    toVersion: "1.31"

removed: true
---
پشتیبانی از اعتبارسنجی‌های CEL که در کنترل پذیرش استفاده می‌شوند را در [ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/) فعال کنید.