---
title: UserNamespacesStatelessPodsSupport
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.25"
    toVersion: "1.27"

removed: true
---
پشتیبانی از فضای نام کاربر را برای پادهای بدون وضعیت فعال کنید. این ویژگی در نسخه Kubernetes نسخه ۱.۲۸ با ویژگی `UserNamespacesSupport` جایگزین شد.