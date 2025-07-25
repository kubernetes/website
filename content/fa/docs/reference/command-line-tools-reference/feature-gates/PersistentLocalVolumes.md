---
# Removed from Kubernetes
title: PersistentLocalVolumes
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.7"
    toVersion: "1.9"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.10"
    toVersion: "1.13"
  - stage: stable
    defaultValue: true
    fromVersion: "1.14"
    toVersion: "1.16"

removed: true
---
فعال کردن استفاده از نوع volume 'local' در Pods. در صورت درخواست volume 'local'، باید وابستگی Pod مشخص شود.
