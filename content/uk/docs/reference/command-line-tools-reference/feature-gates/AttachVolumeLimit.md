---
# Removed from Kubernetes
title: AttachVolumeLimit
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
    toVersion: "1.16"
  - stage: stable
    defaultValue: true
    fromVersion: "1.17"
    toVersion: "1.21"

removed: true
---
Вмикає втулки томів, щоб повідомляти про обмеження на кількість томів які може бути приєднано до вузла. Див. розділ [динамічні обмеження тому](/docs/concepts/storage/storage-limits/#dynamic-volume-limits) для детальнішої інформації.
