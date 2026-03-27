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
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"
---
Enable the `allocatedResourcesStatus` field within the `.status` for a Pod. The field
reports additional details for each container in the Pod,
with the health information for each device assigned to the Pod.

Starting in v1.36 (beta), the health report includes an optional `message` field that
provides additional human-readable context about the health status, such as error details
or failure reasons.

This feature applies to devices managed by both [Device Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-and-unhealthy-devices) and [Dynamic Resource Allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-health-monitoring). See [Device plugin and unhealthy devices](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-and-unhealthy-devices) for more details.