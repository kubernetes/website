---
title: CSIStorageCapacity
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.19"
    toVersion: "1.20"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.23"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.24"
    toVersion: "1.27"

removed: true  
---
<!--
Enables CSI drivers to publish storage capacity information
and the Kubernetes scheduler to use that information when scheduling pods. See
[Storage Capacity](/docs/concepts/storage/storage-capacity/).
Check the [`csi` volume type](/docs/concepts/storage/volumes/#csi) documentation for more details.
-->
啓用 CSI 驅動發佈儲存容量資訊，
以及 Kubernetes 調度器在調度 Pods 時使用該資訊。
詳情見[儲存容量](/zh-cn/docs/concepts/storage/storage-capacity/)。
更多詳情請參閱 [`csi` 卷類型](/zh-cn/docs/concepts/storage/volumes/#csi)文檔。

