---
# Removed from Kubernetes
title: CSIBlockVolume
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.11"
    toVersion: "1.13"
  - stage: beta
    defaultValue: true
    fromVersion: "1.14"
    toVersion: "1.17"
  - stage: stable
    defaultValue: true
    fromVersion: "1.18"
    toVersion: "1.21"

removed: true
---
Вмикає підтримку блочного сховища зовнішніми драйверами томів CSI. Див. статтю [Підтримка `CSI` для блочних томів](/docs/concepts/storage/volumes/#csi-raw-block-volume-support) для детальнішої інформації.
