---
title: WinOverlay
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.14"
    toVersion: "1.19"
  - stage: beta
    defaultValue: true
    fromVersion: "1.20"
---

<!--
Allows kube-proxy to run in overlay mode for Windows.
-->
允许 kube-proxy 以覆盖模式在 Windows 上运行。
