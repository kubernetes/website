---
title: ContainerStopSignals
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.33"
---

<!--
Enables usage of the StopSignal lifecycle for containers for configuring custom stop signals using which the containers would be stopped.
-->
允许使用容器的 StopSignal 生命期，可用于配置自定义停止信号，借此控制容器的停止方式。
