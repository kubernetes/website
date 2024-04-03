---
title: CSIMigrationRBD
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.23"
    toVersion: "1.27"
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.28"  
---
<!--
Enables shims and translation logic to route volume
operations from the RBD in-tree plugin to Ceph RBD CSI plugin. Requires
CSIMigration and csiMigrationRBD feature flags enabled and Ceph CSI plugin
installed and configured in the cluster. This flag has been deprecated in
favor of the `InTreePluginRBDUnregister` feature flag which prevents the registration of
in-tree RBD plugin.
-->
启用封装和转换逻辑，将卷操作从 RBD 的内嵌插件路由到 Ceph RBD CSI 插件。
此特性要求 CSIMigration 和 csiMigrationRBD 特性标志均被启用，
且集群中安装并配置了 Ceph CSI 插件。
此标志已被弃用，以鼓励使用 `InTreePluginRBDUnregister` 特性标志。
后者会禁止注册内嵌的 RBD 插件。
