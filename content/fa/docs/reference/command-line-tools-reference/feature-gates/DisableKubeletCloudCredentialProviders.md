---
title: DisableKubeletCloudCredentialProviders
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.23"
    toVersion: "1.28"
  - stage: beta
    defaultValue: true
    fromVersion: "1.29"
    toVersion: "1.30"
  - stage: stable
    defaultValue: true
    fromVersion: "1.31"
    toVersion: "1.32"

removed: true
---
فعال کردن دروازه ویژگی، عملکرد درون‌شاخه‌ای قدیمی را در کوبلت غیرفعال کرد، که به کوبلت اجازه می‌داد برای دریافت تصاویر کانتینر، در رجیستری کانتینر ارائه‌دهنده ابری احراز هویت شود.
