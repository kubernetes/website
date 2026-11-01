---
title: OpportunisticBatching
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.35"
---

<!--
Enable reusing of scheduling results from the previous scheduling cycle for equivalent pods.
-->
允许为等效的 Pod 复用上一次调度周期的调度结果。
