---
title: KubeletPodResourcesGetAllocatable
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.21"
    toVersion: "1.22"
  - stage: beta
    defaultValue: true
    fromVersion: "1.23"  
    toVersion: "1.27" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.28" 
    toVersion: "1.29" 
removed: true
---
Enable the kubelet's pod resources
`GetAllocatableResources` functionality. This API augments the
[resource allocation reporting](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources)
