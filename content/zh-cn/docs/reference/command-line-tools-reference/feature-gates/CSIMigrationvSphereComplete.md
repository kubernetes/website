---
# Removed from Kubernetes
title: CSIMigrationvSphereComplete
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta 
    defaultValue: false
    fromVersion: "1.19"
    toVersion: "1.21"
  - stage: deprecated
    fromVersion: "1.22"
    toVersion: "1.22"

removed: true  
---
<!--
Stops registering the vSphere in-tree plugin in kubelet
and volume controllers and enables shims and translation logic to route volume operations
from the vSphere in-tree plugin to vSphere CSI plugin. Requires CSIMigration and
CSIMigrationvSphere feature flags enabled and vSphere CSI plugin installed and
configured on all nodes in the cluster. This flag has been deprecated in favor
of the `InTreePluginvSphereUnregister` feature flag which prevents the
registration of in-tree vsphere plugin.
-->
停止在 kubelet 和卷控制器中注册 vSphere 内嵌插件，
并启用封装和转换逻辑，将卷操作从 vSphere 内嵌插件路由到 vSphere CSI 插件。
这需要启用 CSIMigration 和 CSIMigrationvSphere 特性标志，
并在集群中的所有节点上安装和配置 vSphere CSI 插件。
该特性标志已被废弃，取而代之的是能防止注册内嵌 vSphere 插件的
`InTreePluginvSphereUnregister` 特性标志。