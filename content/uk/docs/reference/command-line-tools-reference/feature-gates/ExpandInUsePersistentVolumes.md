---
# Removed from Kubernetes
title: ExpandInUsePersistentVolumes
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.11"
    toVersion: "1.14"
  - stage: beta
    defaultValue: true
    fromVersion: "1.15"
    toVersion: "1.23"
  - stage: stable
    defaultValue: true
    fromVersion: "1.24"
    toVersion: "1.26"

removed: true
---
Дозволяє розширювати використовувані постійні томи. Див. статтю [Зміна розміру PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/#resizing-an-in-use-persistentvolumeclaim).
