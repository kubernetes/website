---
title: JobBackoffLimitPerIndex
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.28"
  - stage: beta
    defaultValue: true
    fromVersion: "1.29"
    toVersion: "1.32"
  - stage: stable
    defaultValue: true
    locked: true
    fromVersion: "1.33"
---
امکان تعیین حداکثر تعداد تلاش‌های مجدد پاد به ازای هر شاخص در کارهای شاخص‌گذاری شده را فراهم می‌کند.
