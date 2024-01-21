---
# Removed from Kubernetes
title: CSIMigrationGCEComplete
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
Stops registering the GCE-PD in-tree plugin in
kubelet and volume controllers and enables shims and translation logic to
route volume operations from the GCE-PD in-tree plugin to PD CSI plugin.
Requires CSIMigration and CSIMigrationGCE feature flags enabled and PD CSI
plugin installed and configured on all nodes in the cluster. This flag has
been deprecated in favor of the `InTreePluginGCEUnregister` feature flag which
prevents the registration of in-tree GCE PD plugin.
-->
停止在 kubelet 和卷控制器中注册 GCE-PD 内嵌插件，
并启用封装和转换逻辑，将卷操作从 GCE-PD 内嵌插件路由到 PD CSI 插件。
这需要启用 CSIMigration 和 CSIMigrationGCE 特性标志，并在集群中的所有节点上安装和配置
PD CSI 插件。该特性标志已被废弃，取而代之的是能防止注册内嵌 GCE PD 插件的
`InTreePluginGCEUnregister` 特性标志。

