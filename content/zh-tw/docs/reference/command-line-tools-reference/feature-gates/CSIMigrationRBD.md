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
    toVersion: "1.30"

removed: true
---

<!--
Enables shims and translation logic to route volume
operations from the RBD in-tree plugin to Ceph RBD CSI plugin. Requires
CSIMigration and csiMigrationRBD feature flags enabled and Ceph CSI plugin
installed and configured in the cluster.

This feature gate was deprecated in favor of the `InTreePluginRBDUnregister` feature gate,
which prevents the registration of in-tree RBD plugin.
-->
啓用封裝和轉換邏輯，將卷操作從 RBD 的內嵌插件路由到 Ceph RBD CSI 插件。
此特性要求 CSIMigration 和 csiMigrationRBD 特性標誌均被啓用，
且集羣中安裝並配置了 Ceph CSI 插件。

此特性門控已被棄用，以鼓勵使用 `InTreePluginRBDUnregister` 特性門控。
後者會禁止註冊內嵌的 RBD 插件。
