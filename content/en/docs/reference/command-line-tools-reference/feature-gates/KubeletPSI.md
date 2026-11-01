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
    toVersion: "1.35"
  - stage: stable
    defaultValue: true
    fromVersion: "1.36"
    locked: true
---
Enable kubelet to surface Pressure Stall Information (PSI) metrics in the Summary API and Prometheus metrics.
