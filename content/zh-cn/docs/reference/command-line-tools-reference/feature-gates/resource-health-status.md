---
title: ResourceHealthStatus
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.31"
---

<!--
Enable the `allocatedResourcesStatus` field within the `.status` for a Pod. The field
reports additional details for each container in the Pod,
with the health information for each device assigned to the Pod.
See [Device plugin and unhealthy devices](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-and-unhealthy-devices) for more details.
-->
在 Pod 的 `.status` 中启用 `allocatedResourcesStatus` 字段。
此字段报告 Pod 中每个容器的额外细节，包括分配给 Pod 的每个设备的健康信息。有关更多细节，
请参见[设备插件与不健康设备](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-and-unhealthy-devices)。
