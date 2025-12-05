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
    toVersion: "1.33"
  - stage: beta
    defaultValue: true
    fromVersion: "1.34"
---

<!--
Enable the `Get` gRPC endpoint on kubelet's for Pod resources.
This API augments the [resource allocation reporting](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources).
-->
在 kubelet 上爲 Pod 資源啓用 `Get` gRPC 端點。
此 API 增強了[資源分配報告](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources)。
