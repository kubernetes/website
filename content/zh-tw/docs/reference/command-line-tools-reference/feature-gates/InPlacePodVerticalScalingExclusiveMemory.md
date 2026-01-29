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
允許在內存管理器策略設置爲 `"Static"` 時在 Guaranteed Pod 中調整容器資源大小。  
僅適用於啓用了 `InPlacePodVerticalScaling` 和內存管理器特性的節點。
