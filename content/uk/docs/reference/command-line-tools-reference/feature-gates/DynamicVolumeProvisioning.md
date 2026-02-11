---
# Removed from Kubernetes
title: DynamicVolumeProvisioning
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: true
    fromVersion: "1.3"
    toVersion: "1.7"
  - stage: stable
    defaultValue: true
    fromVersion: "1.8"
    toVersion: "1.12"

removed: true
---
Вмикає [динамічне виділення](/docs/concepts/storage/dynamic-provisioning/) постійних томів для Podʼів.
