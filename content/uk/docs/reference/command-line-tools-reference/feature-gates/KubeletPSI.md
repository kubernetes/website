---
title: KubeletPSI
content_type: feature_gate
build:
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
    toVersion: "1.35"
  - stage: stable
    defaultValue: true
    fromVersion: "1.36"
    locked: true
---

Вмикає метрики kubelet для виведення інформації Pressure Stall Information (PSI) у Summary API та метриках Prometheus.
