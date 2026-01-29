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
允許 APF（API 優先級和公平性）使用對象的大小來評估請求的開銷。
