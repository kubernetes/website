---
title: DevicePlugins
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.8"
    toVersion: "1.9"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.10"
    toVersion: "1.25"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.26"
    toVersion: "1.27"    

removed: true
---
<!--
Enable the [device-plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
based resource provisioning on nodes.
-->
在节点上启用基于[设备插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)的资源制备。
