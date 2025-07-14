---
title: NodeLogQuery
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.27"
    toVersion: "1.29"
  - stage: beta
    defaultValue: false
    fromVersion: "1.30"
---
امکان پرس‌وجو از گزارش‌های سرویس‌های گره با استفاده از نقطه پایانی `/logs` را فراهم می‌کند.

