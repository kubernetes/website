---
title: DynamicResourceAllocation
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.30"
---
<!--
Enables support for resources with custom parameters and a lifecycle
that is independent of a Pod. Allocation of resources is handled
by the Kubernetes scheduler based on "structured parameters".
-->
启用对具有自定义参数和独立于 Pod 生命周期的资源的支持。
资源的分配由 Kubernetes 调度器根据“结构化参数”进行处理。
