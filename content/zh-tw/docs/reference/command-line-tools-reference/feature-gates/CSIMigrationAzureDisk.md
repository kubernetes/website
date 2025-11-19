---
# Removed from Kubernetes
title: CSIMigrationAzureDisk
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.15"
    toVersion: "1.18"
  - stage: beta
    defaultValue: false
    fromVersion: "1.19"  
    toVersion: "1.22" 
  - stage: beta
    defaultValue: true
    fromVersion: "1.23"  
    toVersion: "1.23" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.24"
    toVersion: "1.26"     

removed: true
---
<!--
Enables shims and translation logic to route volume
operations from the Azure-Disk in-tree plugin to AzureDisk CSI plugin.
Supports falling back to in-tree AzureDisk plugin for mount operations to
nodes that have the feature disabled or that do not have AzureDisk CSI plugin
installed and configured. Does not support falling back for provision
operations, for those the CSI plugin must be installed and configured.
Requires CSIMigration feature flag enabled.
-->
啓用封裝和轉換邏輯，將卷操作從 AzureDisk 內嵌插件路由到 Azure 磁盤 CSI 插件。
對於禁用了此特性的節點或者沒有安裝並配置 AzureDisk CSI 插件的節點，
支持回退到內嵌（in-tree）AzureDisk 插件來執行磁盤掛載操作。
不支持回退到內嵌插件來執行磁盤製備操作，因爲對應的 CSI 插件必須已安裝且正確配置。
此特性需要啓用 CSIMigration 特性標誌。
