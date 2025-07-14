---
title: JobSuccessPolicy
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.30"
    toVersion: "1.30"
  - stage: beta
    defaultValue: true
    fromVersion: "1.31"
    toVersion: "1.32"
  - stage: stable
    defaultValue: true
    locked: true
    fromVersion: "1.33"
---
به کاربران اجازه دهید مشخص کنند که چه زمانی یک کار می‌تواند بر اساس مجموعه پادهای موفق، به عنوان موفق اعلام شود.