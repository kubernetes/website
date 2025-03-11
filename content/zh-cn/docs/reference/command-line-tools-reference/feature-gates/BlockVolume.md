---
# Removed from Kubernetes
title: BlockVolume
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.9"
    toVersion: "1.12"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.13"
    toVersion: "1.17"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.18"
    toVersion: "1.21"    

removed: true
---

<!--
Enable the definition and consumption of raw block devices in Pods.
See [Raw Block Volume Support](/docs/concepts/storage/persistent-volumes/#raw-block-volume-support)
for more details.
-->
启用在 Pod 中定义和使用原始块设备。
更多详情请参见[原始块卷支持](/zh-cn/docs/concepts/storage/persistent-volumes/#raw-block-volume-support)。
