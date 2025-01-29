---
# Removed from Kubernetes
title: CSIMigrationOpenStackComplete
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
Stops registering the Cinder in-tree plugin in
kubelet and volume controllers and enables shims and translation logic to route
volume operations from the Cinder in-tree plugin to Cinder CSI plugin.
Requires CSIMigration and CSIMigrationOpenStack feature flags enabled and Cinder
CSI plugin installed and configured on all nodes in the cluster. This flag has
been deprecated in favor of the `InTreePluginOpenStackUnregister` feature flag
which prevents the registration of in-tree openstack cinder plugin.
-->
停止在 kubelet 和卷控制器中注册 Cinder 内嵌插件，
并启用封装和转换逻辑，将卷操作从 Cinder 内嵌插件路由到 Cinder CSI 插件。
这需要启用 CSIMigration 和 CSIMigrationOpenStack 特性标志，
并在集群中的所有节点上安装和配置 Cinder CSI 插件。
该特性标志已被弃用，取而代之的是能防止注册内嵌 OpenStack Cinder 插件的
`InTreePluginOpenStackUnregister` 特性标志。
