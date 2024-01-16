---
title: CSIMigrationvSphere
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.18"
    toVersion: "1.18"
  - stage: beta
    defaultValue: false
    fromVersion: "1.19"  
    toVersion: "1.24" 
  - stage: beta
    defaultValue: true
    fromVersion: "1.25"  
    toVersion: "1.25" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.26"  
    toVersion: "1.28"     

removed: true
---
<!--
Enables shims and translation logic to route volume operations
from the vSphere in-tree plugin to vSphere CSI plugin. Supports falling back
to in-tree vSphere plugin for mount operations to nodes that have the feature
disabled or that do not have vSphere CSI plugin installed and configured.
Does not support falling back for provision operations, for those the CSI
plugin must be installed and configured. Requires CSIMigration feature flag
enabled.
-->
启用封装和转换逻辑，将卷操作从 vSphere 内嵌插件路由到 vSphere CSI 插件。
如果节点禁用了此特性门控或者未安装和配置 vSphere CSI 插件，
则支持回退到 vSphere 内嵌插件来执行挂载操作。
不支持回退到内嵌插件来执行制备操作，因为对应的 CSI 插件必须已安装且正确配置。
这需要启用 CSIMigration 特性标志。
