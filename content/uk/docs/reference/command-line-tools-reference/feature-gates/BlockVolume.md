---
# Removed from Kubernetes
title: BlockVolume
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.9"
    toVersion: "1.12"
  - stage: beta
    defaultValue: true
    fromVersion: "1.13"
    toVersion: "1.17"
  - stage: stable
    defaultValue: true
    fromVersion: "1.18"
    toVersion: "1.21"

removed: true
---
Увімкніть визначення та споживання необроблених блокових пристроїв у Podʼах. Див. статтю [Підтримка необроблених блокових томів](/docs/concepts/storage/persistent-volumes/#raw-block-volume-support) для більш детальної інформації.
