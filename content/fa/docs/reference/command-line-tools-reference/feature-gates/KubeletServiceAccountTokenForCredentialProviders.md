---
title: KubeletServiceAccountTokenForCredentialProviders
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.33"
---
kubelet را فعال کنید تا توکن حساب سرویس متصل به پادی که تصویر برای آن دریافت می‌شود را به افزونه ارائه‌دهنده اعتبارنامه ارسال کند.