---
title: DevicePluginCDIDevices
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.28"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.29"
---
<!--
Enable support to CDI device IDs in the
[Device Plugin](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/) API.
-->
启用[设备插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
API 对 CDI 设备 ID 的支持。
