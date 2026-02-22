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
Enables numeric comparison operators (`Lt` and `Gt`) for
[tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/).
