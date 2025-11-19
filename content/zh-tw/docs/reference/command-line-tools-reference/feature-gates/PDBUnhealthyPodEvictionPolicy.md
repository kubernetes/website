---
title: PDBUnhealthyPodEvictionPolicy
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.26"
    toVersion: "1.26"
  - stage: beta
    defaultValue: true
    fromVersion: "1.27"
    toVersion: "1.30"
  - stage: stable
    defaultValue: true
    fromVersion: "1.31"
    toVersion: "1.32"

removed: true
---

<!--
Enables the `unhealthyPodEvictionPolicy` field of a `PodDisruptionBudget`. This specifies
when unhealthy pods should be considered for eviction. Please see [Unhealthy Pod Eviction Policy](/docs/tasks/run-application/configure-pdb/#unhealthy-pod-eviction-policy)
for more details.
-->
啓用 `PodDisruptionBudget` 的 `unhealthyPodEvictionPolicy` 字段。
此字段指定何時應考慮驅逐不健康的 Pod。
更多細節請參閱[不健康 Pod 驅逐策略](/zh-cn/docs/tasks/run-application/configure-pdb/#unhealthy-pod-eviction-policy)。
