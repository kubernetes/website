---
title: NodeInclusionPolicyInPodTopologySpread
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
Enable using `nodeAffinityPolicy` and `nodeTaintsPolicy` in
[Pod topology spread constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
when calculating pod topology spread skew.
-->
在计算 Pod 拓扑分布偏差时允许在
[Pod 拓扑分布约束](/zh-cn/docs/concepts/scheduling-eviction/topology-spread-constraints/)中使用
`nodeAffinityPolicy` 和 `nodeTaintsPolicy`。
