---
# Removed from Kubernetes
title: LegacyNodeRoleBehavior
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.16"
    toVersion: "1.18"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.19"
    toVersion: "1.20"
  - stage: stable
    defaultValue: false
    fromVersion: "1.21"
    toVersion: "1.22"

removed: true
---
در صورت غیرفعال بودن، رفتار قدیمی در متعادل‌کننده‌های بار سرویس و اختلال گره، برچسب `node-role.kubernetes.io/master` را به نفع برچسب‌های خاص ویژگی ارائه شده توسط `NodeDisruptionExclusion` و `ServiceNodeExclusion` نادیده می‌گیرد.
