---
title: InPlacePodVerticalScalingExclusiveCPUs
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
---
تغییر اندازه منابع را برای کانتینرها در پادهای تضمین‌شده با درخواست‌های CPU عدد صحیح فعال کنید.
این فقط در گره‌هایی اعمال می‌شود که ویژگی‌های `InPlacePodVerticalScaling` و `CPUManager` فعال باشند و سیاست CPUManager روی `static` تنظیم شده باشد.