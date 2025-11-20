---
title: PodAndContainerStatsFromCRI
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.23"
---

<!--
Configure the kubelet to gather container and pod stats from the CRI container runtime rather than gathering them from cAdvisor.
As of 1.26, this also includes gathering metrics from CRI and emitting them over `/metrics/cadvisor` (rather than having cAdvisor emit them directly).
-->
將 kubelet 設定爲從 CRI 容器運行時收集容器和 Pod 的統計資訊，而不是從 cAdvisor 收集統計資訊。
從 1.26 版本開始，這還包括從 CRI 收集指標並通過 `/metrics/cadvisor` 進行發佈（而不是直接由 cAdvisor 發佈）。
