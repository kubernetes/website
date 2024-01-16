---
title: NodeOutOfServiceVolumeDetach
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.24"
    toVersion: "1.25"
  - stage: beta
    defaultValue: true
    fromVersion: "1.26"  
    toVersion: "1.27" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.28"  
---

<!--
When a Node is marked out-of-service using the
`node.kubernetes.io/out-of-service` taint, Pods on the node will be forcefully deleted
if they can not tolerate this taint, and the volume detach operations for Pods terminating
on the node will happen immediately. The deleted Pods can recover quickly on different nodes.
-->
当使用 `node.kubernetes.io/out-of-service`
污点将节点标记为无法提供服务时，节点上不能容忍这个污点的 Pod 将被强制删除，
并且针对此节点上被终止的 Pod 将立即执行解除卷挂接操作。
被删除的 Pod 可以很快在不同的节点上恢复。
