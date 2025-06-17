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
---

<!--
Honor persistent volume reclaim policy when it is `Delete` irrespective of PV-PVC deletion ordering.
For more details, check the
[PersistentVolume deletion protection finalizer](/docs/concepts/storage/persistent-volumes/#persistentvolume-deletion-protection-finalizer)
documentation.
-->
无论 PV 和 PVC 的删除顺序如何，当持久卷回收策略为 `Delete`
时都要遵守该策略。更多细节参阅
[PersistentVolume 删除保护终结器](/zh-cn/docs/concepts/storage/persistent-volumes/#persistentvolume-deletion-protection-finalizer)文档。
