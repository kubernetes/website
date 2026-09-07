---
title: PodsAPI
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
    toVersion: "1.36"
  - stage: beta
    defaultValue: true
    fromVersion: "1.37"
---
Enables the kubelet Pods API gRPC service.
See [Kubelet Pods API](/docs/reference/node/kubelet-pods-api/) for more details.
