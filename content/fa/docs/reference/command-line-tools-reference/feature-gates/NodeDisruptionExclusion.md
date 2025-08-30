---
# Removed from Kubernetes
title: NodeDisruptionExclusion
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
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.22"

removed: true
---
فعال کردن استفاده از برچسب گره `node.kubernetes.io/exclude-disruption`
که از تخلیه گره‌ها در هنگام خرابی منطقه جلوگیری می‌کند.
