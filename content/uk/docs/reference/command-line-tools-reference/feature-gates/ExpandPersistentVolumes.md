---
# Removed from Kubernetes
title: ExpandPersistentVolumes
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.8"
    toVersion: "1.10"
  - stage: beta
    defaultValue: true
    fromVersion: "1.11"
    toVersion: "1.23"
  - stage: stable
    defaultValue: true
    fromVersion: "1.24"
    toVersion: "1.26"

removed: true
---
Дозволяє розширювати постійні томи. Див. статтю ["Розширення Persistent Volumes Claims"](/docs/concepts/storage/persistent-volumes/#expanding-persistent-volume-claims).
