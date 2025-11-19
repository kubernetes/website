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

This feature applies to devices managed by both [Device Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-and-unhealthy-devices) and [Dynamic Resource Allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-health-monitoring). See [Device plugin and unhealthy devices](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-and-unhealthy-devices) for more details.
-->
在 Pod 的 `.status` 中啓用 `allocatedResourcesStatus` 字段。
此字段報告 Pod 中每個容器的額外細節，包括分配給 Pod 的每個設備的健康信息。

此特性適用於同時由[設備插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-and-unhealthy-devices)和[動態資源分配（DRA）](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-health-monitoring)
所管理的設備。有關更多細節，
請參見[設備插件與不健康設備](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-and-unhealthy-devices)。
