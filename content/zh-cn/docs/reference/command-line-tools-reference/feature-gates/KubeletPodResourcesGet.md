---
title: KubeletPodResourcesGet
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
Enable the `Get` gRPC endpoint on kubelet's for Pod resources.
This API augments the [resource allocation reporting](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources).
-->
在 kubelet 上为 Pod 资源启用 `Get` gRPC 端点。
此 API 增强了[资源分配报告](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources)。
