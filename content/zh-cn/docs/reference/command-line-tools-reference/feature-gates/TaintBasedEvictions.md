---
# Removed from Kubernetes
title: TaintBasedEvictions
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.6"
    toVersion: "1.12"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.13"
    toVersion: "1.17"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.18"
    toVersion: "1.20"    

removed: true
---

<!--
Enable evicting pods from nodes based on taints on Nodes and tolerations
on Pods.  See [taints and tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/)
for more details.
-->
根据节点上的污点和 Pod 上的容忍度启用从节点驱逐 Pod 的特性。
更多细节参见[污点和容忍度](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)。
