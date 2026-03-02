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
Вмикає планування з урахуванням топології тома і робить привʼязку PersistentVolumeClaim (PVC) обізнаною з рішеннями щодо планування. Це також дозволяє використовувати тип тома [`local`](/docs/concepts/storage/volumes/#local) при використанні разом з функціональною можливістю `PersistentLocalVolumes`.
