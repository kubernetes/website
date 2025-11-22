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
調度 Pod 時，使調度器緩存節點的等效項。
