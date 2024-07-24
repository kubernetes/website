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
---
<!--
Allows the use of the optional `.spec.persistentVolumeClaimRetentionPolicy` field, 
providing control over the deletion of PVCs in a StatefulSet's lifecycle.
See
[PersistentVolumeClaim retention](/docs/concepts/workloads/controllers/statefulset/#persistentvolumeclaim-retention)
for more details.
-->
允许使用可选字段 `.spec.persistentVolumeClaimRetentionPolicy`，
以便根据 StatefulSet 的生命周期来控制 PVC 的删除。
详情参见 [PersistentVolumeClaim 保留](/zh-cn/docs/concepts/workloads/controllers/statefulset/#persistentvolumeclaim-retention)。
