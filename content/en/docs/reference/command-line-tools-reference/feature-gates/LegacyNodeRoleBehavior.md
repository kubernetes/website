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
When disabled, legacy behavior in service load balancers and
node disruption will ignore the `node-role.kubernetes.io/master` label in favor of the
feature-specific labels provided by `NodeDisruptionExclusion` and `ServiceNodeExclusion`.
