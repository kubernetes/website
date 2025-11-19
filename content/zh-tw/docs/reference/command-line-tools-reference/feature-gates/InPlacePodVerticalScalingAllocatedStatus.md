---
title: InPlacePodVerticalScalingAllocatedStatus
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
    toVersion: "1.32"
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.33"
---

<!--
Enables the `allocatedResources` field in the container status.
This feature requires the `InPlacePodVerticalScaling` gate be enabled as well.
-->
啓用容器狀態中的 `allocatedResources` 字段。
此特性還需要啓用 `InPlacePodVerticalScaling` 門控。
