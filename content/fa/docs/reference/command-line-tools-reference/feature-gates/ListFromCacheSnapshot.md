---
title: ListFromCacheSnapshot
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.33"

--- 
سرور API را قادر می‌سازد تا اسنپ‌شات‌هایی برای حافظه پنهان watch ایجاد کند و از آنها برای ارائه درخواست‌های LIST استفاده کند.

