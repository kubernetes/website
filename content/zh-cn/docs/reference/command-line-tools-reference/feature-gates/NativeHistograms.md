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

<!--
Enables Kubernetes components to expose metrics in Prometheus Native Histogram format
for improved efficiency and finer bucket resolution.
See [Native Histograms](/docs/reference/instrumentation/native-histograms/)
for more information.
-->
启用 Kubernetes 组件以 Prometheus 原生直方图格式暴露指标，
以提高效率和更精细的桶分辨率。
有关更多信息，请参阅
[原生直方图](/zh-cn/docs/reference/instrumentation/native-histograms/)。

