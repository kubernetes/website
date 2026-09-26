---
title: CloudControllerManagerWatchBasedRoutesReconciliation
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
Enables a watch-based route reconciliation mechanism (rather than reconciling at a fixed interval)
within the cloud-controller-manager library.
-->
在 cloud-controller-manager 库中启用基于 watch 的路由协调机制（而不是以固定时间间隔进行协调）。
