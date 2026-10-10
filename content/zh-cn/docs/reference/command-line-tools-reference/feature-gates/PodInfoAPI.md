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

<!--
Enables the kubelet Pod Info gRPC API.
See [Kubelet Pod Info gRPC API](/docs/reference/node/kubelet-pod-info-grpc-api/) for more details.
-->
启用 kubelet Pod Info gRPC API。
有关详细信息，请参阅
[kubelet Pod Info gRPC API](/zh-cn/docs/reference/node/kubelet-pod-info-grpc-api/)。
