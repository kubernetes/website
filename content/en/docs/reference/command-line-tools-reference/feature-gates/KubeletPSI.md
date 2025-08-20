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
Enable kubelet to surface Pressure Stall Information (PSI) metrics in the Summary API and Prometheus metrics.
