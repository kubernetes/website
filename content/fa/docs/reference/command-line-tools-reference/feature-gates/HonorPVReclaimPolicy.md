---
title: HonorPVReclaimPolicy
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.23"
    toVersion: "1.30"
  - stage: beta
    defaultValue: true
    fromVersion: "1.31"
    toVersion: "1.32"
  - stage: stable
    defaultValue: true
    locked: true
    fromVersion: "1.33"
---
صرف نظر از ترتیب حذف PV-PVC، به سیاست بازیابی دائمی حجم، هنگامی که روی `Delete` است، احترام بگذارید.
برای جزئیات بیشتر، مستندات [PersistentVolume deletion protection finalizer](/docs/concepts/storage/persistent-volumes/#persistentvolume-deletion-protection-finalizer) را بررسی کنید.