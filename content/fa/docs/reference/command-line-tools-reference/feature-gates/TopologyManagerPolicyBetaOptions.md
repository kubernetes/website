---
title: TopologyManagerPolicyBetaOptions
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.26"
    toVersion: "1.27"
  - stage: beta
    defaultValue: true
    fromVersion: "1.28"
---
امکان تنظیم دقیق سیاست‌های مدیریت توپولوژی،
آزمایشی، گزینه‌های با کیفیت بتا.
این دروازه ویژگی از *گروهی* از گزینه‌های مدیریت توپولوژی که سطح کیفیت آنها بتا است، محافظت می‌کند.
این دروازه ویژگی هرگز به حالت پایدار ارتقا پیدا نمی‌کند.
