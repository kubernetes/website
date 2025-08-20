---
title: InformerResourceVersion
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.30"
---

<!--
Enables the check over the last synced resource version using the informer.
-->
允许使用 Informer（通知组件）检查上次同步的资源版本。
