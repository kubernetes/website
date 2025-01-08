---
title: DRAControlPlaneController
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
that is independent of a Pod. Allocation of resources is handled
by a resource driver's control plane controller.
-->
允许资源使用自定义参数，具有独立于 Pod 的生命周期。
资源的分配由资源驱动的控制平面控制器处理。
