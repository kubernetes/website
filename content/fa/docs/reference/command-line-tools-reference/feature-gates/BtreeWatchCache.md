---
title: BtreeWatchCache
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta 
    defaultValue: true
    fromVersion: "1.32"
    toVersion: "1.32"
  - stage: stable
    defaultValue: true
    locked: true
    fromVersion: "1.33"

---
وقتی این گزینه فعال شود، سرور API، کش watch قدیمی مبتنی بر HashMap را با پیاده‌سازی مبتنی بر BTree جایگزین خواهد کرد. این جایگزینی ممکن است بهبودهایی در عملکرد ایجاد کند.


