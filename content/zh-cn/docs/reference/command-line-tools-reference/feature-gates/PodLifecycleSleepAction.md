---
title: PodLifecycleSleepAction
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.29"
    toVersion: "1.29"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.30"
    toVersion: "1.33"
  - stage: stable
    locked: true
    defaultValue: true
    fromVersion: "1.34"
---

<!--
Enables the `sleep` action in Container lifecycle hooks (`preStop` and `postStart`).
-->
在 Container 生命周期回调（`preStop` 和 `postStart`）中启用 `sleep` 操作。
