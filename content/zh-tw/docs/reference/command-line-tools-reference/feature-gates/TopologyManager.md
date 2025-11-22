---
title: TopologyManager
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.16"
    toVersion: "1.17"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.18"
    toVersion: "1.26"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.27"
    toVersion: "1.28"    

removed: true
---

<!--
Enable a mechanism to coordinate fine-grained hardware resource
assignments for different components in Kubernetes. See
[Control Topology Management Policies on a node](/docs/tasks/administer-cluster/topology-manager/).
-->
啓用一種機制來協調 Kubernetes 不同組件的細粒度硬件資源分配。
詳見[控制節點上的拓撲管理策略](/zh-cn/docs/tasks/administer-cluster/topology-manager/)。
