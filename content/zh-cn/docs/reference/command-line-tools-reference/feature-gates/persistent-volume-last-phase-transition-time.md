---
title: PersistentVolumeLastPhaseTransitionTime
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.28"
  - stage: beta
    defaultValue: true
    fromVersion: "1.29"
---

<!--
Adds a new field to PersistentVolume
which holds a timestamp of when the volume last transitioned its phase.
-->
为 PersistentVolume 添加一个新字段，用于保存卷上一次转换阶段的时间戳。
