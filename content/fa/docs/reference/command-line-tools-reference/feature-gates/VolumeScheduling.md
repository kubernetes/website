---
# Removed from Kubernetes
title: VolumeScheduling
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.9"
    toVersion: "1.9"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.10"
    toVersion: "1.12"
  - stage: stable
    defaultValue: true
    fromVersion: "1.13"
    toVersion: "1.16"

removed: true
---
زمان‌بندی آگاه از توپولوژی حجم را فعال کنید و اتصال PersistentVolumeClaim
(PVC) را از تصمیمات زمان‌بندی آگاه کنید. همچنین استفاده از نوع حجم [`local`](/docs/concepts/storage/volumes/#local) را هنگام استفاده همراه با دروازه ویژگی `PersistentLocalVolumes` امکان‌پذیر می‌سازد.