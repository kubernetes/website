---
title: WinOverlay
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.14"
    toVersion: "1.19"
  - stage: beta
    defaultValue: true
    fromVersion: "1.20"
---
به kube-proxy اجازه می‌دهد تا در حالت همپوشانی برای ویندوز اجرا شود.