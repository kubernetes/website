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
停止在 kubelet 和卷控制器中註冊 vSphere 內嵌插件，
並啓用封裝和轉換邏輯，將卷操作從 vSphere 內嵌插件路由到 vSphere CSI 插件。
這需要啓用 CSIMigration 和 CSIMigrationvSphere 特性標誌，
並在叢集中的所有節點上安裝和設定 vSphere CSI 插件。
該特性標誌已被廢棄，取而代之的是能防止註冊內嵌 vSphere 插件的
`InTreePluginvSphereUnregister` 特性標誌。