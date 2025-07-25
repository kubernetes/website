---
title: InTreePluginvSphereUnregister
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
ثبت افزونه vSphere in-tree را در kubelet و volume controllers متوقف می‌کند.
