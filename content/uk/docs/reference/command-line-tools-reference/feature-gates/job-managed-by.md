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
---
Дозволяє делегувати узгодження обʼєкта Job зовнішньому контролеру.
