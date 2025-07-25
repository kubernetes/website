---
title: InTreePluginAzureDiskUnregister
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.21"
    toVersion: "1.30"

removed: true
---
ثبت افزونه‌ی درون‌برنامه‌ای azuredisk را در kubelet و volume controllers متوقف می‌کند.