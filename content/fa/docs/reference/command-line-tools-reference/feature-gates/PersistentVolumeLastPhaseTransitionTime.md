---
title: PersistentVolumeLastPhaseTransitionTime
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.28"
  - stage: beta
    defaultValue: true
    fromVersion: "1.29"
    toVersion: "1.30"
  - stage: stable
    defaultValue: true
    fromVersion: "1.31"
    toVersion: "1.32"

removed: true
---
یک فیلد جدید به PersistentVolume اضافه می‌کند که یک مهر زمانی از آخرین باری که volume فاز خود را تغییر داده است، در خود نگه می‌دارد.
