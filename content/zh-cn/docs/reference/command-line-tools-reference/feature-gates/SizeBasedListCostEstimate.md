---
title: SizeBasedListCostEstimate
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.24"
---

<!--
Enables APF to use size of objects for estimating request cost.
-->
允许 APF（API 优先级和公平性）使用对象的大小来评估请求的开销。
