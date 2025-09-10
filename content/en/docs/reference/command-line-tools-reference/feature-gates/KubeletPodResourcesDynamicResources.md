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
    toVersion: "1.33"
  - stage: beta
    defaultValue: true
    fromVersion: "1.34"
---
Extend the kubelet's
[pod resources monitoring gRPC API](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins.md)
endpoints List and Get to include resources allocated in ResourceClaims
via [Dynamic Resource Allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/).
