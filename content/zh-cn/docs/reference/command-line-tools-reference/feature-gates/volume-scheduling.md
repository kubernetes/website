---
# Removed from Kubernetes
title: VolumeScheduling
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.9"
    toVersion: "1.9"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.10"
    toVersion: "1.12"
  - stage: stable
    defaultValue: true
    fromVersion: "1.13"
    toVersion: "1.16"

removed: true
---

<!--
Enable volume topology aware scheduling and make the PersistentVolumeClaim
(PVC) binding aware of scheduling decisions. It also enables the usage of
[`local`](/docs/concepts/storage/volumes/#local) volume type when used together with the
`PersistentLocalVolumes` feature gate.
-->
启用卷拓扑感知调度，并使 PersistentVolumeClaim（PVC）
绑定能够了解调度决策；当与 PersistentLocalVolumes 特性门控一起使用时，
还允许使用 [`local`](/zh-cn/docs/concepts/storage/volumes/#local) 卷类型。
