---
title: InPlacePodVerticalScalingExclusiveCPUs
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
---

<!--
Enable resource resizing for containers in Guaranteed pods with integer CPU requests.
It applies only in nodes with `InPlacePodVerticalScaling` and `CPUManager` features enabled,
and the CPUManager policy set to `static`.
-->
在 CPU 请求数为整数的 Guaranteed Pod 中启用容器的资源调整特性。
此特性门控仅适用于启用 `InPlacePodVerticalScaling` 和 `CPUManager`
特性且 CPUManager 策略设置为 `static` 的节点。
