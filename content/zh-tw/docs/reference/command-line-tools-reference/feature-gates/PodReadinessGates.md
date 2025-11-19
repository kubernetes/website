---
# Removed from Kubernetes
title: PodReadinessGates
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.11"
    toVersion: "1.11"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.12"
    toVersion: "1.13"
  - stage: stable
    defaultValue: true
    fromVersion: "1.14"
    toVersion: "1.16"

removed: true
---

<!--
Enable the setting of `PodReadinessGate` field for extending
Pod readiness evaluation. See [Pod readiness gate](/docs/concepts/workloads/pods/pod-lifecycle/#pod-readiness-gate)
for more details.
-->
允許設置 `podReadinessGate` 字段以擴展 Pod 就緒狀態評估。更多細節請參見
[Pod 就緒狀態判別](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-readiness-gate)。
