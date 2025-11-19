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
無論 PV 和 PVC 的刪除順序如何，當持久捲回收策略爲 `Delete`
時都要遵守該策略。更多細節參閱
[PersistentVolume 刪除保護終結器](/zh-cn/docs/concepts/storage/persistent-volumes/#persistentvolume-deletion-protection-finalizer)文檔。
