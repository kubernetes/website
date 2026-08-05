---
title: KubeletPSI
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.33"
    toVersion: "1.33"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.34"
---

<!--
Enable kubelet to surface Pressure Stall Information (PSI) metrics in the Summary API and Prometheus metrics.
-->
允许 kubelet 在 Summary API 和 Prometheus 指标中使用压力阻塞信息（PSI）指标。
