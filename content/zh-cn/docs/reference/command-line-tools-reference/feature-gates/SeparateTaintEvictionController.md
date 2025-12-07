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
允许运行**基于污点驱逐**的控制器，该控制器作为独立的控制器（独立于**节点生命周期**控制器）
执行[基于污点的驱逐](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/#taint-based-evictions)。
