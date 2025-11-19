---
# Removed from Kubernetes
title: CSIBlockVolume
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.11"
    toVersion: "1.13"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.14"
    toVersion: "1.17"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.18"
    toVersion: "1.21"    

removed: true
---
<!--
Enable external CSI volume drivers to support block storage.
See [`csi` raw block volume support](/docs/concepts/storage/volumes/#csi-raw-block-volume-support)
for more details.
-->
啓用外部 CSI 卷驅動程序用於支持塊存儲。有關更多詳細信息，請參見
[`csi` 原始塊卷支持](/zh-cn/docs/concepts/storage/volumes/#csi-raw-block-volume-support)。
