---
title: SeparateTaintEvictionController
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.29"
    toVersion: "1.33"
  - stage: stable
    locked: true
    defaultValue: true
    fromVersion: "1.34"
---

<!--
Enables running the _taint based eviction_ controller,
that performs [Taint-based Evictions](/docs/concepts/scheduling-eviction/taint-and-toleration/#taint-based-evictions),
as a standalone controller (separate from the _node lifecycle_ controller).
-->
允許運行**基於污點驅逐**的控制器，該控制器作爲獨立的控制器（獨立於**節點生命週期**控制器）
執行[基於污點的驅逐](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/#taint-based-evictions)。
