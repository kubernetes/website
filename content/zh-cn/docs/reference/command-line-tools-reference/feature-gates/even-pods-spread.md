---
# Removed from Kubernetes
title: EvenPodsSpread
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
    toVersion: "1.18"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.19"
    toVersion: "1.21"    

removed: true  
---
<!--
Enable pods to be scheduled evenly across topology domains. See
[Pod Topology Spread Constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/).
-->
使 Pod 能够在拓扑域之间平衡调度。请参阅
[Pod 拓扑扩展约束](/zh-cn/docs/concepts/scheduling-eviction/topology-spread-constraints/)。
