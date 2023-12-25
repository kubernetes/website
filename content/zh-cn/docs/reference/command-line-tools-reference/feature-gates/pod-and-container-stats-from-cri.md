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
将 kubelet 配置为从 CRI 容器运行时收集容器和 Pod 的统计信息，而不是从 cAdvisor 收集统计信息。
从 1.26 版本开始，这还包括从 CRI 收集指标并通过 `/metrics/cadvisor` 进行发布（而不是直接由 cAdvisor 发布）。
