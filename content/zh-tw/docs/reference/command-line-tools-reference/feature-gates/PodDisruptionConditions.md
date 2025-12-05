---
title: PodDisruptionConditions
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.25"
    toVersion: "1.25"
  - stage: beta
    defaultValue: true
    fromVersion: "1.26"
    toVersion: "1.30"
  - stage: stable
    defaultValue: true
    fromVersion: "1.31"
    toVersion: "1.33"

removed: true
---

<!--
Enabled support for appending a dedicated pod condition indicating that the pod is being deleted due to a disruption.
-->
啓用支持追加一個專用的 Pod 狀況，以表示 Pod 由於某個干擾正在被刪除。
