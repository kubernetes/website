---
title: JobManagedBy
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.30"
    toVersion: "1.31"
  - stage: beta
    defaultValue: true
    fromVersion: "1.32"
---
اجازه می‌دهد تا تطبیق یک شیء Job را به یک کنترل‌کننده خارجی واگذار کنید.
