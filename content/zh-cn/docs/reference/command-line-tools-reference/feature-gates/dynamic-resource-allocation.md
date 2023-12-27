---
title: DynamicResourceAllocation
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.26"
---
<!--
Enables support for resources with custom parameters and a lifecycle
that is independent of a Pod.
-->
启用对具有自定义参数和独立于 Pod 生命周期的资源的支持。
