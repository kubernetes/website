---
# Removed from Kubernetes
title: SelectorIndex
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.18"
    toVersion: "1.18"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.19"
    toVersion: "1.19"
  - stage: stable
    defaultValue: true
    fromVersion: "1.20"
    toVersion: "1.25"

removed: true  
---

<!--
Allows label and field based indexes in API server watch cache to accelerate
list operations.
-->
允許使用 API 服務器的 watch 緩存中基於標籤和字段的索引來加速 list 操作。
