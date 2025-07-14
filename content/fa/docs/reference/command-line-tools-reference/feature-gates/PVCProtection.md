---
# Removed from Kubernetes
title: PVCProtection
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.9"
    toVersion: "1.9"
  - stage: deprecated
    fromVersion: "1.10"
    toVersion: "1.10"

removed: true
---
فعال کردن جلوگیری از حذف PersistentVolumeClaim (PVC) زمانی که هنوز توسط هر Pod استفاده می‌شود.