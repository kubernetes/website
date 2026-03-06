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
-->
在使用动态资源分配来管理设备时，
启用[为设备添加污点并选择性容忍这些污点](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-taints-and-tolerations)的支持。
