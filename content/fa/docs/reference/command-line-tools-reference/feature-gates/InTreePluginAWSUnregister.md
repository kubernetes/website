---
title: InTreePluginAWSUnregister
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
ثبت افزونه‌ی درون‌برنامه‌ای aws-ebs را در kubelet و volume controllersا متوقف می‌کند.