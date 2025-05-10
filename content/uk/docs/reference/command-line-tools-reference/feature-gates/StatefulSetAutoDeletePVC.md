---
title: StatefulSetAutoDeletePVC
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.23"
    toVersion: "1.26"
  - stage: beta
    defaultValue: true
    fromVersion: "1.27"
    toVersion: "1.31"
  - stage: stable
    defaultValue: true
    fromVersion: "1.32"
---

Дозволяє використовувати необовʼязкове поле `.spec.persistentVolumeClaimRetentionPolicy`, що забезпечує контроль над видаленням PVC у життєвому циклі StatefulSet. Дивіться [PersistentVolumeClaim retention](/docs/concepts/workloads/controllers/statefulset/#persistentvolumeclaim-retention) для більш детальної інформації.
