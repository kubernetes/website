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
停止在 kubelet 和卷控制器中注册 EBS 内嵌插件，
并启用封装和转换逻辑，将卷操作从 AWS-EBS 内嵌插件路由到 EBS CSI 插件。
这需要启用 CSIMigration 和 CSIMigrationAWS 特性标志，并在集群中的所有节点上安装和配置
EBS CSI 插件。该特性标志已被废弃，取而代之的是 `InTreePluginAWSUnregister`，
后者会阻止注册 EBS 内嵌插件。
