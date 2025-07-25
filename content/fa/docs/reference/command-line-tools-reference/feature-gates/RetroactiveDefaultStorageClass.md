---
title: RetroactiveDefaultStorageClass
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.25"
    toVersion: "1.25"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.26"
    toVersion: "1.27"
  - stage: stable
    defaultValue: true
    fromVersion: "1.28"
    toVersion: "1.28"

removed: true
---
اجازه دهید StorageClass به PVC های بدون اتصال به صورت عطف به ماسبق اختصاص داده شود.
ejazeh dehid Storag
