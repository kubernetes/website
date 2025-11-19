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
    toVersion: "1.31"

removed: true
---

<!--
Enables support for resources with custom parameters and a lifecycle
that is independent of a Pod. Allocation of resources is handled
by a resource driver's control plane controller.
-->
允許資源使用自定義參數，具有獨立於 Pod 的生命週期。
資源的分配由資源驅動的控制平面控制器處理。
