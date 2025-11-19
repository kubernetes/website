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
根據節點上的污點和 Pod 上的容忍度啓用從節點驅逐 Pod 的特性。
更多細節參見[污點和容忍度](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)。
