---
title: PodInfoAPI
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.35"
---
Enables the kubelet Pod Info gRPC API.
See [Kubelet Pod Info gRPC API](/docs/reference/node/kubelet-pod-info-grpc-api/) for more details.
