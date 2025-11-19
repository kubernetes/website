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
    toVersion: "1.32"
  - stage: beta
    defaultValue: false
    fromVersion: "1.33"
    toVersion: "1.33"
  - stage: stable
    defaultValue: true
    fromVersion: "1.34"
---

<!--
You can enable the `MultiCIDRServiceAllocator` feature gate. The API server supports migration
from the old bitmap ClusterIP allocators to the new IPAddress allocators.

The API server performs a dual-write on both allocators. This feature gate disables the dual write
on the new Cluster IP allocators; you can enable this feature gate if you have completed the
relevant stage of the migration.
-->
你可以啓用 `MultiCIDRServiceAllocator` 特性門控。API 伺服器支持從舊的位圖
ClusterIP 分配器遷移到新的 IPAddress 分配器。

API 伺服器會在兩個分配器上執行雙重寫入。此特性門控用於禁用對 ClusterIP
分配器的多餘寫入；如果你已經完成了機制遷移的重要階段，可以啓用此特性門控。
