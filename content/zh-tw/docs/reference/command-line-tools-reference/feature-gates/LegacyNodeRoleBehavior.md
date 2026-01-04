---
# Removed from Kubernetes
title: LegacyNodeRoleBehavior
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.16"
    toVersion: "1.18"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.19"
    toVersion: "1.20"
  - stage: stable
    defaultValue: false
    fromVersion: "1.21"
    toVersion: "1.22"

removed: true
---

<!--
When disabled, legacy behavior in service load balancers and
node disruption will ignore the `node-role.kubernetes.io/master` label in favor of the
feature-specific labels provided by `NodeDisruptionExclusion` and `ServiceNodeExclusion`.
-->
禁用此門控時，服務負載均衡器中和節點干擾中的原先行爲會忽略
`node-role.kubernetes.io/master` 標籤，將使用 `NodeDisruptionExclusion` 和
`ServiceNodeExclusion` 對應特性所提供的標籤。
