---
title: CSIMigrationPortworx
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.23"
    toVersion: "1.24"
  - stage: beta
    defaultValue: false
    fromVersion: "1.25"
    toVersion: "1.30"
  - stage: beta
    defaultValue: true
    fromVersion: "1.31"
    toVersion: "1.32"
  - stage: stable
    defaultValue: true
    fromVersion: "1.33"
---

<!--
Enables shims and translation logic to route volume operations
from the Portworx in-tree plugin to Portworx CSI plugin.
Requires Portworx CSI driver to be installed and configured in the cluster.
-->
啓用封裝和轉換邏輯，將卷操作從 Portworx 內嵌插件路由到
Portworx CSI 插件。需要在叢集中安裝並設定 Portworx CSI 插件.
