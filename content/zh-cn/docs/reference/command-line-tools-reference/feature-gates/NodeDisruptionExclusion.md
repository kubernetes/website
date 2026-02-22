---
# Removed from Kubernetes
title: NodeDisruptionExclusion
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
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.22"

removed: true
---

<!--
Enable use of the Node label `node.kubernetes.io/exclude-disruption`
which prevents nodes from being evacuated during zone failures.
-->
启用节点标签 `node.kubernetes.io/exclude-disruption`，
以防止在可用区发生故障期间驱逐节点。
