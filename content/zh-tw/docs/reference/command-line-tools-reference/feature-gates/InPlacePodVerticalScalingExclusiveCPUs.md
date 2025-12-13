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
在 CPU 請求數爲整數的 Guaranteed Pod 中啓用容器的資源調整特性。
此特性門控僅適用於啓用 `InPlacePodVerticalScaling` 和 `CPUManager`
特性且 CPUManager 策略設置爲 `static` 的節點。
