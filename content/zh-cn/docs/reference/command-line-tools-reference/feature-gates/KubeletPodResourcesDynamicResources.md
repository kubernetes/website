---
title: KubeletPodResourcesDynamicResources
content_type: feature_gate
_build:
  list: never
  render: false
  
stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.27"  
---

<!--
Extend the kubelet's pod resources gRPC endpoint to
to include resources allocated in `ResourceClaims` via `DynamicResourceAllocation` API.
See [resource allocation reporting](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources) for more details.
with information about the allocatable resources, enabling clients to properly
track the free compute resources on a node.
-->
扩展 kubelet 的 Pod 资源 gRPC 端点以包括通过
`DynamicResourceAllocation` API 在 `ResourceClaims` 中分配的资源。
详情参见[资源分配报告](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources)。
包含有关可分配资源的信息，使客户端能够正确跟踪节点上的可用计算资源。
