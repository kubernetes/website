---
title: WinDSR
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.14"
    toVersion: "1.32"
  - stage: beta
    defaultValue: true
    fromVersion: "1.33"

---
به kube-proxy اجازه می‌دهد تا متعادل‌کننده‌های بار DSR را برای ویندوز ایجاد کند.