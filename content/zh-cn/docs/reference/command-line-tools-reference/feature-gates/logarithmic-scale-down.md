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
---

<!--
Enable semi-random selection of pods to evict on controller scaledown
based on logarithmic bucketing of pod timestamps.
-->
启用 Pod 的半随机选择，控制器将根据 Pod 时间戳的对数桶按比例缩小来驱逐 Pod。
