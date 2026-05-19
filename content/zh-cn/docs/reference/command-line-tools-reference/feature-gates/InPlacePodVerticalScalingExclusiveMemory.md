---
title: InPlacePodVerticalScalingExclusiveMemory
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.34"
---

<!--
Allow resource resize for containers in Guaranteed Pods when the memory manager policy is set to `"Static"`.
Applies only to nodes with `InPlacePodVerticalScaling` and memory manager features enabled.
-->
允许在内存管理器策略设置为 `"Static"` 时在 Guaranteed Pod 中调整容器资源大小。  
仅适用于启用了 `InPlacePodVerticalScaling` 和内存管理器特性的节点。
