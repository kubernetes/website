---
title: DisableAllocatorDualWrite
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.31"
---

<!--
You can enable the `MultiCIDRServiceAllocator` feature gate. The API server supports migration
from the old bitmap ClusterIP allocators to the new IPAddress allocators.

The API server performs a dual-write on both allocators. This feature gate disables the dual write
on the new Cluster IP allocators; you can enable this feature gate if you have completed the
relevant stage of the migration.
-->
你可以启用 `MultiCIDRServiceAllocator` 特性门控。API 服务器支持从旧的位图
ClusterIP 分配器迁移到新的 IPAddress 分配器。

API 服务器会在两个分配器上执行双重写入。此特性门控用于禁用对 ClusterIP
分配器的多余写入；如果你已经完成了机制迁移的重要阶段，可以启用此特性门控。
