---
title: InTreePluginRBDUnregister
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.23"
    toVersion: "1.27"
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.30"

removed: true
---
ثبت افزونه درون درختی RBD را در kubelet و volume controllers می‌کند.
