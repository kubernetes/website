---
title: LogarithmicScaleDown
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.21"
    toVersion: "1.21"
  - stage: beta
    defaultValue: true
    fromVersion: "1.22"
    toVersion: "1.30"
  - stage: stable
    defaultValue: true
    fromVersion: "1.31"
---
Enable semi-random selection of pods to evict on controller scaledown
based on logarithmic bucketing of pod timestamps.
