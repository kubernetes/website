---
title: GracefulNodeShutdownBasedOnPodPriority
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.23"
    toVersion: "1.23"
  - stage: beta
    defaultValue: true
    fromVersion: "1.24"
---
به kubelet این امکان را می‌دهد که هنگام خاموش کردن صحیح یک گره، اولویت‌های Pod را بررسی کند.
