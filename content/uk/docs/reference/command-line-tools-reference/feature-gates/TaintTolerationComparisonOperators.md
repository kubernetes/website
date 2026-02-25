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
Дозволяє використовувати оператори числового порівняння (`Lt` та `Gt`) для [толерантності](/docs/concepts/scheduling-eviction/taint-and-toleration/).
