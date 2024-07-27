---
title: NodeSwap
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.22"
    toVersion: "1.27"
  - stage: beta
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.29"
  - stage: beta
    defaultValue: true
    fromVersion: "1.30"
---

<!--
Enable the kubelet to allocate swap memory for Kubernetes workloads on a node.
Must be used with `KubeletConfiguration.failSwapOn` set to false.
For more details, please see [swap memory](/docs/concepts/architecture/nodes/#swap-memory)
-->
允许 kubelet 为节点上的 Kubernetes 工作负载分配交换内存。
必须将 `KubeletConfiguration.failSwapOn` 设置为 false 才能使用此能力。
更多细节请参见[交换内存](/zh-cn/docs/concepts/architecture/nodes/#swap-memory)。
