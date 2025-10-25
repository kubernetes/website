---
title: RecoverVolumeExpansionFailure
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.23"
    toVersion: "1.31"
  - stage: beta
    defaultValue: true
    fromVersion: "1.32"
---
استفاده از حالت دسترسی PersistentVolume در `ReadWriteOncePod` را فعال می‌کند.
