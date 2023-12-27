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
---
<!--
Enables shims and translation logic to route volume operations
from the Portworx in-tree plugin to Portworx CSI plugin.
Requires Portworx CSI driver to be installed and configured in the cluster.
-->
启用封装和转换逻辑，将卷操作从 Portworx 内嵌插件路由到
Portworx CSI 插件。需要在集群中安装并配置 Portworx CSI 插件.
