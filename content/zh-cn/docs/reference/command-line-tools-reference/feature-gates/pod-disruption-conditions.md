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
---

<!--
Enables support for appending a dedicated pod condition indicating that the pod is being deleted due to a disruption.
-->
启用支持追加一个专用的 Pod 状况，以表示 Pod 由于某个干扰正在被删除。
