---
title: ConcurrentWatchObjectDecode
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.31"

---
فعال کردن رمزگشایی همزمان شیء watch. این کار برای جلوگیری از خالی شدن کش watch سرور API هنگام نصب webhook تبدیل است.