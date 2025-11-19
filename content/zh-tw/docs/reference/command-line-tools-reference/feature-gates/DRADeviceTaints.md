---
title: DRADeviceTaints
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
Enables support for
[tainting devices and selectively tolerating those taints](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-taints-and-tolerations)
when using dynamic resource allocation to manage devices.

This feature gate has no effect unless you also enable the `DynamicResourceAllocation` feature gate.
-->
在使用動態資源分配來管理設備時，
啓用[爲設備添加污點並選擇性容忍這些污點](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-taints-and-tolerations)的支持。

想要此特性門控生效，你還需啓用 `DynamicResourceAllocation` 特性門控。
