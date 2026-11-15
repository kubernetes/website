---
title: InPlacePodVerticalScalingMemoryBackedVolumes
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---

<!--
Enables in-place vertical scaling for memory-backed `emptyDir` volume size limits.
-->
为内存支持的 `emptyDir` 卷的大小限制启用就地垂直扩缩。
