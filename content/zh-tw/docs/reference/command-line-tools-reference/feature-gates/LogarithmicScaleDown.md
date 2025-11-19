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

<!--
Enable semi-random selection of pods to evict on controller scaledown
based on logarithmic bucketing of pod timestamps.
-->
啓用 Pod 的半隨機選擇，控制器將根據 Pod 時間戳的對數桶按比例縮小來驅逐 Pod。
