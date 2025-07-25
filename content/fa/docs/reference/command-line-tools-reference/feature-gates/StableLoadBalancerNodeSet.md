---
title: StableLoadBalancerNodeSet
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.27"
    toVersion: "1.29"
  - stage: stable
    defaultValue: true
    fromVersion: "1.30"
    toVersion: "1.31"

removed: true
---
امکان پیکربندی مجدد متعادل‌کننده بار کمتر توسط کنترل‌کننده سرویس (KCCM) را به عنوان تأثیری از تغییر وضعیت گره فراهم می‌کند.
