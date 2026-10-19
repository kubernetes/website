---
title: PersistentVolumeClaimUnusedSinceTime
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
---

<!--
When enabled, the PVC protection controller adds an `Unused` condition to
PersistentVolumeClaims that tracks whether the PVC is currently referenced by
any non-terminal Pod. The condition's `lastTransitionTime` records when the PVC
last transitioned between being in use and being unused.
-->
启用后，PVC 保护控制器会向 PersistentVolumeClaim 添加 `Unused` 状况，
跟踪 PVC 当前是否被任何非终端 Pod 引用。
该状况的 `lastTransitionTime` 记录 PVC 最后一次在使用中和未使用状态之间转换的时间。

