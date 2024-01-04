---
# Removed from Kubernetes
title: PreferNominatedNode
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.21"
    toVersion: "1.21"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.22"
    toVersion: "1.23"
  - stage: stable
    defaultValue: true
    fromVersion: "1.24"
    toVersion: "1.25"

removed: true
---

<!--
This flag tells the scheduler whether the nominated
nodes will be checked first before looping through all the other nodes in
the cluster.
-->
这个标志告诉调度器在循环遍历集群中的所有其他节点之前是否先检查指定的节点。
