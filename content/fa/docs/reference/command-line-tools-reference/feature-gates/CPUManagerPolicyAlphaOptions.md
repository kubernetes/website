---
title: CPUManagerPolicyAlphaOptions
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.23"
---
این امکان تنظیم دقیق سیاست‌های CPUManager،
آزمایشی، گزینه‌های با کیفیت آلفا
این دروازه ویژگی از *group* از گزینه‌های CPUManager که سطح کیفیت آنها آلفا است، محافظت می‌کند.
این دروازه ویژگی هرگز به مرحله بتا یا پایدار ارتقا پیدا نمی‌کند.