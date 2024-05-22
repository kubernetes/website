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
Extend the kubelet's pod resources gRPC endpoint to
include resources allocated in `ResourceClaims` via `DynamicResourceAllocation` API.
See [how to monitor resources provided by device plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources)
for more details. With information about the allocatable resources, enabling clients to properly
track the free compute resources on a node.
