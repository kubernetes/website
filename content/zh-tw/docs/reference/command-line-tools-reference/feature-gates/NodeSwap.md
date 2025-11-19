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
    toVersion: "1.33"
  - stage: stable
    defaultValue: true
    locked: true
    fromVersion: "1.34"
---

<!--
Enable the kubelet to allocate swap memory for Kubernetes workloads on a node.
Must be used with `KubeletConfiguration.failSwapOn` set to false.
For more details, please see [swap memory](/docs/concepts/architecture/nodes/#swap-memory)
-->
允許 kubelet 爲節點上的 Kubernetes 工作負載分配交換內存。
必須將 `KubeletConfiguration.failSwapOn` 設置爲 false 才能使用此能力。
更多細節請參見[交換內存](/zh-cn/docs/concepts/architecture/nodes/#swap-memory)。
