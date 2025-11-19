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
    toVersion: "1.30"
  - stage: stable
    defaultValue: true
    fromVersion: "1.31"
    toVersion: "1.32"

removed: true
---

<!--
Adds a new field to PersistentVolume
which holds a timestamp of when the volume last transitioned its phase.
-->
爲 PersistentVolume 添加一個新字段，用於保存捲上一次轉換階段的時間戳。
