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
    toVersion: "1.31"

removed: true 
---

<!--
When a Node is marked out-of-service using the
`node.kubernetes.io/out-of-service` taint, Pods on the node will be forcefully deleted
if they can not tolerate this taint, and the volume detach operations for Pods terminating
on the node will happen immediately. The deleted Pods can recover quickly on different nodes.
-->
當使用 `node.kubernetes.io/out-of-service`
污點將節點標記爲無法提供服務時，節點上不能容忍這個污點的 Pod 將被強制刪除，
並且針對此節點上被終止的 Pod 將立即執行解除卷掛接操作。
被刪除的 Pod 可以很快在不同的節點上恢復。
