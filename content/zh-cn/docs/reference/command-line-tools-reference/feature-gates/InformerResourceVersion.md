---
title: InformerResourceVersion
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.30"
    toVersion: "1.34"
  - stage: stable 
    defaultValue: true
    fromVersion: "1.35"
---

<!--
Allow clients to use the `LastSyncResourceVersion()` call on informers, enabling
them to perform actions based on the current resource version. When disabled,
`LastSyncResourceVersion()` succeeds but returns an empty string. Used by
kube-controller-manager for StorageVersionMigration.
-->
允许客户端在 Informer 上使用 `LastSyncResourceVersion()` 调用，
使其能够根据当前资源版本执行操作。
禁用此特性时，`LastSyncResourceVersion()` 调用会成功，但返回空字符串。
kube-controller-manager 会使用此特性进行 StorageVersionMigration。