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
如果 CSI 驅動程序支持，則通過 NodeStageVolume
和 NodePublishVolume CSI 調用傳遞 `fsGroup`，
委託驅動來應用 Pod 的 `securityContext` 中的 `fsGroup`。
