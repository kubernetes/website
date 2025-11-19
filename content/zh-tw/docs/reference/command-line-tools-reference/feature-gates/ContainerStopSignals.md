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
允許使用容器的 StopSignal 生命期，可用於設定自定義停止信號，藉此控制容器的停止方式。
