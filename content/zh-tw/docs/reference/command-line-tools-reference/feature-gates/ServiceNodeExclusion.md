---
# Removed from Kubernetes
title: ServiceNodeExclusion
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.8"
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
Enable the exclusion of nodes from load balancers created by a cloud provider.
A node is eligible for exclusion if labelled with "`node.kubernetes.io/exclude-from-external-load-balancers`".
-->
允許從雲提供商創建的負載均衡器中排除節點。
如果節點標記有 `node.kubernetes.io/exclude-from-external-load-balancers` 標籤，
則可以排除該節點。
