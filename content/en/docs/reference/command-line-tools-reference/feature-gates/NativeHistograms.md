---
title: NativeHistograms
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.36"
---
Enables Kubernetes components to expose metrics in Prometheus Native Histogram format for improved efficiency and finer bucket resolution.
See [Native Histograms](/docs/reference/instrumentation/native-histograms/) for more information.
