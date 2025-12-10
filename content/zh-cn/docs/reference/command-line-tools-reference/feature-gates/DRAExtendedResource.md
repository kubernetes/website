---
title: DRAExtendedResource
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.34"
---

<!--
Enables support for the [Extended Resource allocation by DRA](/docs/concepts/configuration/manage-resources-containers/#extended-resources-allocation-by-dra) feature.
It makes it possible to specify an extended resource name in a DeviceClass.

This feature gate has no effect unless the `DynamicResourceAllocation` feature gate is enabled.
-->
启用对
[DRA 扩展资源分配](/zh-cn/docs/concepts/configuration/manage-resources-containers/#extended-resources-allocation-by-dra)特性的支持。  
这使得在 DeviceClass 中可以指定扩展的资源名称。

需要先启用 `DynamicResourceAllocation` 特性门控，此特性门控才会生效。
