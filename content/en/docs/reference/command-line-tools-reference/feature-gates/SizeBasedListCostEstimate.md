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
Enables APF to use size of objects for estimating request cost.
