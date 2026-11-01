---
title: TaintTolerationComparisonOperators
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.35"
---

<!--
Enables numeric comparison operators (`Lt` and `Gt`) for
[tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/).
-->
启用[容忍度](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)的数值比较运算符（`Lt` 和 `Gt`）。

