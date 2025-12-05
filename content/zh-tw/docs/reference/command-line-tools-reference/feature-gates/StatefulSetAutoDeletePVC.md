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

<!--
Allows the use of the optional `.spec.persistentVolumeClaimRetentionPolicy` field, 
providing control over the deletion of PVCs in a StatefulSet's lifecycle.
See
[PersistentVolumeClaim retention](/docs/concepts/workloads/controllers/statefulset/#persistentvolumeclaim-retention)
for more details.
-->
允許使用可選字段 `.spec.persistentVolumeClaimRetentionPolicy`，
以便根據 StatefulSet 的生命週期來控制 PVC 的刪除。
詳情參見 [PersistentVolumeClaim 保留](/zh-cn/docs/concepts/workloads/controllers/statefulset/#persistentvolumeclaim-retention)。
