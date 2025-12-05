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
啓用封裝和轉換邏輯，將卷操作從 AzureFile 內嵌插件路由到
AzureFile CSI 插件。對於禁用了此特性的節點或者沒有安裝並設定 AzureFile CSI
插件的節點，支持回退到內嵌（in-tree）AzureFile 插件來執行卷掛載操作。
不支持回退到內嵌插件來執行卷製備操作，因爲對應的 CSI 插件必須已安裝且正確設定。
此特性需要啓用 CSIMigration 特性標誌。
