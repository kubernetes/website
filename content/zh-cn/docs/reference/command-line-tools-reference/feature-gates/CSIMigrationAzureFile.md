---
title: CSIMigrationAzureFile
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.15"
    toVersion: "1.20"
  - stage: beta
    defaultValue: false
    fromVersion: "1.21"  
    toVersion: "1.23" 
  - stage: beta
    defaultValue: true
    fromVersion: "1.24"  
    toVersion: "1.25" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.26"  
    toVersion: "1.29" 
removed: true
---
<!--
Enables shims and translation logic to route volume
operations from the Azure-File in-tree plugin to AzureFile CSI plugin.
Supports falling back to in-tree AzureFile plugin for mount operations to
nodes that have the feature disabled or that do not have AzureFile CSI plugin
installed and configured. Does not support falling back for provision
operations, for those the CSI plugin must be installed and configured.
Requires CSIMigration feature flag enabled.
-->
启用封装和转换逻辑，将卷操作从 AzureFile 内嵌插件路由到
AzureFile CSI 插件。对于禁用了此特性的节点或者没有安装并配置 AzureFile CSI
插件的节点，支持回退到内嵌（in-tree）AzureFile 插件来执行卷挂载操作。
不支持回退到内嵌插件来执行卷制备操作，因为对应的 CSI 插件必须已安装且正确配置。
此特性需要启用 CSIMigration 特性标志。
