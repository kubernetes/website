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
---
Вмикає метрики kubelet для виведення інформації Pressure Stall Information (PSI) у Summary API та метриках Prometheus.
