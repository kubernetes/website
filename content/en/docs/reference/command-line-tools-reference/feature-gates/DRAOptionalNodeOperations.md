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
Enables support for optional node-local operations in Dynamic Resource
Allocation (DRA). This allows drivers to declare that specific node operations
(`NodePrepareResources` and/or `NodeUnprepareResources`) can be skipped for
their devices, enabling the `kubelet` to bypass unnecessary gRPC calls.

For more information, see
[Optional node operations](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#optional-node-operations)
in the Dynamic Resource Allocation documentation.
