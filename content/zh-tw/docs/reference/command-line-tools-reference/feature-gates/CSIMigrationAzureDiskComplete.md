---
# Removed from Kubernetes
title: CSIMigrationAzureDiskComplete
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.17"
    toVersion: "1.20"
  - stage: deprecated
    fromVersion: "1.21"
    toVersion: "1.21"

removed: true
---
<!--
Stops registering the Azure-Disk in-tree
plugin in kubelet and volume controllers and enables shims and translation
logic to route volume operations from the Azure-Disk in-tree plugin to
AzureDisk CSI plugin. Requires CSIMigration and CSIMigrationAzureDisk feature
flags enabled and AzureDisk CSI plugin installed and configured on all nodes
in the cluster. This flag has been deprecated in favor of the
`InTreePluginAzureDiskUnregister` feature flag which prevents the registration
of in-tree AzureDisk plugin.
-->
停止在 kubelet 和卷控制器中註冊 Azure 磁盤內嵌插件，
並啓用封裝和轉換邏輯，將卷操作從 Azure 磁盤內嵌插件路由到 AzureDisk CSI 插件。
這需要啓用 CSIMigration 和 CSIMigrationAzureDisk 特性標誌，
並在叢集中的所有節點上安裝和設定 AzureDisk CSI 插件。該特性標誌已被廢棄，
取而代之的是能防止註冊內嵌 AzureDisk 插件的 `InTreePluginAzureDiskUnregister` 特性標誌。
