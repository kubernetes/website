---
title: CSIMigrationGCE
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.14"
    toVersion: "1.16"
  - stage: beta
    defaultValue: false
    fromVersion: "1.17"  
    toVersion: "1.22" 
  - stage: beta
    defaultValue: true
    fromVersion: "1.23"  
    toVersion: "1.24" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.25"
    toVersion: "1.27" 

removed: true
---
<!--
Enables shims and translation logic to route volume
operations from the GCE-PD in-tree plugin to PD CSI plugin. Supports falling
back to in-tree GCE plugin for mount operations to nodes that have the
feature disabled or that do not have PD CSI plugin installed and configured.
Does not support falling back for provision operations, for those the CSI
plugin must be installed and configured. Requires CSIMigration feature flag
enabled.
-->
启用封装和转换逻辑，将卷操作从 GCE-PD 内嵌插件路由到 PD CSI 插件。
对于禁用了此特性的节点或者没有安装并配置 PD CSI 插件的节点，
支持回退到内嵌GCE 插件来执行卷挂载操作。
不支持回退到内嵌插件来执行卷制备操作，因为对应的 CSI 插件必须已安装且正确配置。
此特性需要启用 CSIMigration 特性标志。
