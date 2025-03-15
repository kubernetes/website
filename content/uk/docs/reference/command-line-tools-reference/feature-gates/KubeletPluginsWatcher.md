---
# Removed from Kubernetes
title: KubeletPluginsWatcher
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.11"
    toVersion: "1.11"
  - stage: beta
    defaultValue: true
    fromVersion: "1.12"
    toVersion: "1.12"
  - stage: stable
    defaultValue: true
    fromVersion: "1.13"
    toVersion: "1.16"

removed: true
---
Вмикає утиліту для відстеження втулків на основі проб, щоб дозволити kubelet виявляти втулки, такі як [драйвери томів CSI](/docs/concepts/storage/volumes/#csi).
