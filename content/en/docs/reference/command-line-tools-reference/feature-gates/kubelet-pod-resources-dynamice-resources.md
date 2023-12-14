---
title: KubeletPodResourcesDynamicResources
content_type: feature_gate
_build:
  list: never
  render: false
---
Extend the kubelet's pod resources gRPC endpoint to
to include resources allocated in `ResourceClaims` via `DynamicResourceAllocation` API.
See [resource allocation reporting](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources) for more details.
with informations about the allocatable resources, enabling clients to properly
track the free compute resources on a node.
