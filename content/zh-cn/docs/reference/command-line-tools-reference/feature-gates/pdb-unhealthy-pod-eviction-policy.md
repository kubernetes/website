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
---

<!--
Enables the `unhealthyPodEvictionPolicy` field of a `PodDisruptionBudget`. This specifies
when unhealthy pods should be considered for eviction. Please see [Unhealthy Pod Eviction Policy](/docs/tasks/run-application/configure-pdb/#unhealthy-pod-eviction-policy)
for more details.
-->
启用 `PodDisruptionBudget` 的 `unhealthyPodEvictionPolicy` 字段。
此字段指定何时应考虑驱逐不健康的 Pod。
更多细节请参阅[不健康 Pod 驱逐策略](/zh-cn/docs/tasks/run-application/configure-pdb/#unhealthy-pod-eviction-policy)。
