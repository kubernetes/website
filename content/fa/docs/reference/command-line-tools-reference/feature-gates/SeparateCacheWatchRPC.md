---
title: SeparateCacheWatchRPC
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.28"
    toVersion: "1.32"
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.33"

---
به کش watch سرور API اجازه می‌دهد تا یک watch روی یک RPC اختصاصی ایجاد کند.
این کار از کمبود کش watch توسط watch های دیگر جلوگیری می‌کند.

