---
title: DRADeviceTaintRules
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.35"
---

<!--
Enables support for
[tainting devices through DeviceTaintRule objects](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-taints-and-tolerations)
when using dynamic resource allocation to manage devices.

This feature gate has no effect unless you also enable the `DRADeviceTaint` feature gate.
-->
在使用动态资源分配来管理设备时，
允许[通过 DeviceTaintRule 对象为设备添加污点](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-taints-and-tolerations)。

除非你也启用了 `DRADeviceTaint` 特性门控，否则此特性门控不会生效。
