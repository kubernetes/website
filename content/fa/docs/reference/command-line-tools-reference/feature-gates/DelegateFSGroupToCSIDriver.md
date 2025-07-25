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
در صورت پشتیبانی توسط درایور CSI، نقش اعمال `fsGroup` از `securityContext` یک Pod را با عبور `fsGroup` از طریق NodeStageVolume و NodePublishVolume CSI c به درایور واگذار می‌کند.alls.
