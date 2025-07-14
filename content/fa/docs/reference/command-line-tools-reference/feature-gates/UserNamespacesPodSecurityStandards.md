---
title: UserNamespacesPodSecurityStandards
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.29"
---
فعال کردن سیاست‌های استانداردهای امنیتی پاد برای پادهایی که با فضاهای نام اجرا می‌شوند. شما باید مقدار این دروازه ویژگی را به طور مداوم در تمام گره‌های خوشه خود تنظیم کنید، و همچنین باید `UserNamespacesSupport` را برای استفاده از این ویژگی فعال کنید.
