---
title: PodInfoAPI
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.35"
---
Вмикає kubelet Pod Info gRPC API. Див. [Kubelet Pod Info gRPC API](/docs/reference/node/kubelet-pod-info-grpc-api/) для отримання додаткової інформації.
