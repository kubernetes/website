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
啓用封裝和轉換邏輯，將卷操作從 vSphere 內嵌插件路由到 vSphere CSI 插件。
如果節點禁用了此特性門控或者未安裝和設定 vSphere CSI 插件，
則支持回退到 vSphere 內嵌插件來執行掛載操作。
不支持回退到內嵌插件來執行製備操作，因爲對應的 CSI 插件必須已安裝且正確設定。
這需要啓用 CSIMigration 特性標誌。
