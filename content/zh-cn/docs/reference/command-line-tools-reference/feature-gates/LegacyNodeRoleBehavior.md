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
禁用此门控时，服务负载均衡器中和节点干扰中的原先行为会忽略
`node-role.kubernetes.io/master` 标签，将使用 `NodeDisruptionExclusion` 和
`ServiceNodeExclusion` 对应特性所提供的标签。
