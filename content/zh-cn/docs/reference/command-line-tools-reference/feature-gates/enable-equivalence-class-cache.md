---
# Removed from Kubernetes
title: EnableEquivalenceClassCache
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.8"
    toVersion: "1.12"
  - stage: deprecated
    fromVersion: "1.13"
    toVersion: "1.23"    

removed: true  
---
<!--
Enable the scheduler to cache equivalence of
nodes when scheduling Pods.
-->
调度 Pod 时，使调度器缓存节点的等效项。
