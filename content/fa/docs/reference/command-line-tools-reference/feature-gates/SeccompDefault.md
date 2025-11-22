---
title: SeccompDefault
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.22"
    toVersion: "1.24"
  - stage: beta
    defaultValue: true
    fromVersion: "1.25"  
    toVersion: "1.26" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.27"
    toVersion: "1.28"     

removed: true
---
استفاده از `RuntimeDefault` را به عنوان پروفایل seccomp پیش‌فرض برای همه بارهای کاری فعال می‌کند. پروفایل seccomp در `securityContext` یک Pod و/یا یک Container مشخص می‌شود.
