---
title: DelegateFSGroupToCSIDriver
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.22"
    toVersion: "1.22"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.23"
    toVersion: "1.25"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.26"
    toVersion: "1.27"    

removed: true 
---
<!--
If supported by the CSI driver, delegates the
role of applying `fsGroup` from a Pod's `securityContext` to the driver by
passing `fsGroup` through the NodeStageVolume and NodePublishVolume CSI calls.
-->
如果 CSI 驱动程序支持，则通过 NodeStageVolume
和 NodePublishVolume CSI 调用传递 `fsGroup`，
委托驱动来应用 Pod 的 `securityContext` 中的 `fsGroup`。
