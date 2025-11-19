---
# Removed from Kubernetes
title: CSIMigrationAWSComplete
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
Stops registering the EBS in-tree plugin in
kubelet and volume controllers and enables shims and translation logic to
route volume operations from the AWS-EBS in-tree plugin to EBS CSI plugin.
Requires CSIMigration and CSIMigrationAWS feature flags enabled and EBS CSI
plugin installed and configured on all nodes in the cluster. This flag has
been deprecated in favor of the `InTreePluginAWSUnregister` feature flag
which prevents the registration of in-tree EBS plugin.
-->
停止在 kubelet 和卷控制器中註冊 EBS 內嵌插件，
並啓用封裝和轉換邏輯，將卷操作從 AWS-EBS 內嵌插件路由到 EBS CSI 插件。
這需要啓用 CSIMigration 和 CSIMigrationAWS 特性標誌，並在叢集中的所有節點上安裝和設定
EBS CSI 插件。該特性標誌已被廢棄，取而代之的是 `InTreePluginAWSUnregister`，
後者會阻止註冊 EBS 內嵌插件。
