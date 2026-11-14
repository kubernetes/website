---
title: HonorPVReclaimPolicy
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.23"
    toVersion: "1.30"
  - stage: beta
    defaultValue: true
    fromVersion: "1.31"
    toVersion: "1.32"
  - stage: stable
    defaultValue: true
    locked: true
    fromVersion: "1.33"
    toVersion: "1.35"

removed: true
---
Дотримуватися політики відновлення постійного тому, коли вона має значення `Delete`, незалежно від впорядкування видалення PV-PVC. Докладніші відомості наведено у документації [Завершувач захисту PersistentVolume від видалення](/docs/concepts/storage/persistent-volumes/#persistentvolume-deletion-protection-finalizer).
