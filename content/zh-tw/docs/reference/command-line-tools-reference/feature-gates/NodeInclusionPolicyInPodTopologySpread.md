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
    toVersion: "1.32"
  - stage: stable
    defaultValue: true
    locked: true
    fromVersion: "1.33"
---

<!--
Enable using `nodeAffinityPolicy` and `nodeTaintsPolicy` in
[Pod topology spread constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
when calculating pod topology spread skew.
-->
在計算 Pod 拓撲分佈偏差時允許在
[Pod 拓撲分佈約束](/zh-cn/docs/concepts/scheduling-eviction/topology-spread-constraints/)中使用
`nodeAffinityPolicy` 和 `nodeTaintsPolicy`。
