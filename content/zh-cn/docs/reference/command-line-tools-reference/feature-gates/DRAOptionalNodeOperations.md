---
title: DRAOptionalNodeOperations
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---

<!--
Enables support for optional node-local operations in Dynamic Resource
Allocation (DRA). This allows drivers to declare that specific node operations
(`NodePrepareResources` and/or `NodeUnprepareResources`) can be skipped for
their devices, enabling the `kubelet` to bypass unnecessary gRPC calls.
-->
在动态资源分配（DRA）中启用对可选的节点本地操作的支持。
这允许驱动声明可以为其设备跳过特定的节点操作
（`NodePrepareResources` 和/或 `NodeUnprepareResources`），
使 `kubelet` 能够绕过不必要的 gRPC 调用。

<!--
For more information, see
[Optional node operations](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#optional-node-operations)
in the Dynamic Resource Allocation documentation.
-->
更多信息，请参阅动态资源分配文档中的[可选节点操作](/zh-cn/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#optional-node-operations)。
